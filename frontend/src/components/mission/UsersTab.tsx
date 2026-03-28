import React from 'react';
import type { User, FilterParams } from '../../hooks/useMissionControl';
import { exportUsersCSV } from '../../utils/missionApi';

interface Props {
  users: User[];
  allUsers: User[];
  filters: FilterParams;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onFilterChange: (key: keyof FilterParams, value: string) => void;
  onSort: (col: string) => void;
  onPageChange: (p: number) => void;
  onSelectUser: (u: User) => void;
  industries: string[];
}

const STATUS_LABELS = ['', 'active', 'inactive', 'banned'];

function SortIcon({ col, filters }: { col: string; filters: FilterParams }) {
  if (filters.sortBy !== col) return <span className="sort-icon">↕</span>;
  return <span className="sort-icon active">{filters.sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function UsersTab({ users, allUsers, filters, totalPages, currentPage, pageSize, onFilterChange, onSort, onPageChange, onSelectUser, industries }: Props) {
  const totalCount = allUsers.length;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  const pageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="users-tab">
      {/* Toolbar */}
      <div className="users-toolbar">
        <input
          className="users-search"
          type="text"
          placeholder="Search by email or name…"
          value={filters.search}
          onChange={e => onFilterChange('search', e.target.value)}
        />
        <select className="users-filter" value={filters.status} onChange={e => onFilterChange('status', e.target.value)}>
          <option value="">All Status</option>
          {STATUS_LABELS.filter(Boolean).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className="users-filter" value={filters.industry} onChange={e => onFilterChange('industry', e.target.value)}>
          <option value="">All Industries</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <div className="users-toolbar__actions">
          <button className="btn btn--secondary btn--sm" onClick={() => exportUsersCSV(allUsers as unknown as Array<Record<string, unknown>>)}>
            ⬇ Export CSV
          </button>
          <button className="btn btn--secondary btn--sm" onClick={() => { onFilterChange('search', ''); onFilterChange('status', ''); onFilterChange('industry', ''); }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => onSort('email')}>Email <SortIcon col="email" filters={filters} /></th>
              <th onClick={() => onSort('name')}>Name <SortIcon col="name" filters={filters} /></th>
              <th onClick={() => onSort('registeredAt')}>Registriert <SortIcon col="registeredAt" filters={filters} /></th>
              <th onClick={() => onSort('status')}>Status <SortIcon col="status" filters={filters} /></th>
              <th onClick={() => onSort('industry')}>Industry <SortIcon col="industry" filters={filters} /></th>
              <th onClick={() => onSort('projects')}>Projekte <SortIcon col="projects" filters={filters} /></th>
              <th onClick={() => onSort('mrr')}>MRR <SortIcon col="mrr" filters={filters} /></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={8} className="users-table__empty">No users found.</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="users-table__row" onClick={() => onSelectUser(user)}>
                <td className="users-table__email">{user.email}</td>
                <td>{user.name}</td>
                <td>{new Date(user.registeredAt).toLocaleDateString('de-DE')}</td>
                <td><span className={`badge badge--${user.status}`}>{user.status}</span></td>
                <td>{user.industry}</td>
                <td>{user.projects}</td>
                <td className="users-table__mrr">€{user.mrr.toFixed(2)}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="users-table__actions">
                    <button className="action-btn" title="View" onClick={() => onSelectUser(user)}>👁</button>
                    <button className="action-btn action-btn--warn" title="Ban">🚫</button>
                    <button className="action-btn action-btn--danger" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span className="pagination__info">Showing {start}–{end} of {totalCount} users</span>
        <div className="pagination__controls">
          <button className="pagination__btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>← Prev</button>
          {pageNumbers().map((p, i) =>
            p === '...'
              ? <span key={`dots-${i}`} className="pagination__dots">…</span>
              : <button key={p} className={`pagination__btn ${currentPage === p ? 'active' : ''}`} onClick={() => onPageChange(p as number)}>{p}</button>
          )}
          <button className="pagination__btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next →</button>
        </div>
      </div>
    </div>
  );
}
