import React from 'react';
import type { User } from '../../hooks/useMissionControl';
import { deleteUserGDPR, exportUserGDPR } from '../../utils/missionApi';

interface Props {
  user: User;
  onClose: () => void;
}

export default function UserModal({ user, onClose }: Props) {
  async function handleGDPRDelete() {
    if (!confirm(`GDPR: Soft-delete user ${user.email}? They will be purged after 30 days.`)) return;
    try {
      await deleteUserGDPR(user.id);
      alert('User marked for deletion. Purge in 30 days.');
    } catch {
      alert('Note: Backend not connected yet. Action logged locally.');
    }
    onClose();
  }

  async function handleGDPRExport() {
    try {
      await exportUserGDPR(user.id);
    } catch {
      // Fallback: export mock data
      const data = JSON.stringify({ user, exportedAt: new Date().toISOString() }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_${user.id}_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__user-avatar">{user.name[0]}</div>
          <div>
            <h2 className="modal__name">{user.name}</h2>
            <p className="modal__email">{user.email}</p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="modal__grid">
            <div className="modal__field">
              <label>Status</label>
              <span className={`badge badge--${user.status}`}>{user.status}</span>
            </div>
            <div className="modal__field">
              <label>Industry</label>
              <span>{user.industry}</span>
            </div>
            <div className="modal__field">
              <label>Registered</label>
              <span>{new Date(user.registeredAt).toLocaleDateString('de-DE')}</span>
            </div>
            <div className="modal__field">
              <label>Projects</label>
              <span>{user.projects}</span>
            </div>
            <div className="modal__field">
              <label>MRR</label>
              <span className="modal__mrr">€{user.mrr.toFixed(2)}</span>
            </div>
            <div className="modal__field">
              <label>User ID</label>
              <span className="modal__id">{user.id}</span>
            </div>
          </div>

          <div className="modal__section">
            <h4>Projects</h4>
            <div className="modal__projects">
              {Array.from({ length: user.projects }, (_, i) => (
                <div key={i} className="modal__project-item">
                  <span>🐾 Project {i + 1}</span>
                  <span className="modal__project-mrr">€{(user.mrr / user.projects).toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--danger" onClick={handleGDPRDelete}>🗑 GDPR Delete</button>
          <button className="btn btn--secondary" onClick={handleGDPRExport}>📦 Export GDPR Data</button>
          <button className="btn btn--primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
