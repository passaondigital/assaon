import React from 'react';
import { useMissionControl } from '../hooks/useMissionControl';
import MissionSidebar from '../components/mission/MissionSidebar';
import UsersTab from '../components/mission/UsersTab';
import AnalyticsTab from '../components/mission/AnalyticsTab';
import ComplianceTab from '../components/mission/ComplianceTab';
import UserModal from '../components/mission/UserModal';
import '../styles/mission-control.scss';

const TAB_TITLES = {
  users: 'User Management',
  analytics: 'Analytics & Metrics',
  compliance: 'GDPR & EU AI Act Compliance',
};

export default function MissionControlPage() {
  const mc = useMissionControl();

  return (
    <div className="mission-layout">
      <MissionSidebar activeTab={mc.activeTab} onTabChange={mc.setActiveTab} />

      <div className="mission-main">
        <header className="mission-header">
          <div className="mission-header__left">
            <h1 className="mission-header__title">{TAB_TITLES[mc.activeTab]}</h1>
            <span className="mission-header__sub">assaon.com · Mission Control</span>
          </div>
          <div className="mission-header__right">
            <span className="mission-header__badge">● Live</span>
            <span className="mission-header__date">{new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>

        <div className="mission-content">
          {mc.activeTab === 'users' && (
            <UsersTab
              users={mc.pagedUsers}
              allUsers={mc.filteredUsers}
              filters={mc.filters}
              totalPages={mc.totalPages}
              currentPage={mc.currentPage}
              pageSize={mc.PAGE_SIZE}
              onFilterChange={mc.updateFilter}
              onSort={mc.toggleSort}
              onPageChange={mc.setCurrentPage}
              onSelectUser={mc.setSelectedUser}
              industries={mc.INDUSTRIES}
            />
          )}
          {mc.activeTab === 'analytics' && <AnalyticsTab analytics={mc.analytics} />}
          {mc.activeTab === 'compliance' && (
            <ComplianceTab
              gdprItems={mc.gdprItems}
              euAiItems={mc.euAiItems}
              onToggle={mc.toggleCompliance}
            />
          )}
        </div>
      </div>

      {mc.selectedUser && (
        <UserModal user={mc.selectedUser} onClose={() => mc.setSelectedUser(null)} />
      )}
    </div>
  );
}
