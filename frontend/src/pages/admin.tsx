import { useCallback, useEffect } from 'react';
import { useAdmin } from '~/hooks/useAdmin';
import AdminSidebar from '~/components/admin/AdminSidebar';
import AdminDashboard from '~/components/admin/AdminDashboard';
import AdminSettings from '~/components/admin/AdminSettings';
import AdminBrandingTab from '~/components/admin/AdminBranding';
import AdminLegal from '~/components/admin/AdminLegal';
import '~/styles/admin.scss';

export default function AdminPage() {
  const {
    activeTab, setActiveTab,
    sidebarOpen, setSidebarOpen,
    toasts,
    saving,
    settings, setSettings, saveSettings,
    branding, setBranding, saveBranding,
    legal, setLegal, saveLegal,
  } = useAdmin();

  // Close sidebar on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSidebarOpen]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'settings':
        return (
          <AdminSettings
            settings={settings}
            onChange={setSettings}
            onSave={saveSettings}
            saving={saving}
          />
        );
      case 'branding':
        return (
          <AdminBrandingTab
            branding={branding}
            onChange={setBranding}
            onSave={saveBranding}
            saving={saving}
          />
        );
      case 'legal':
        return (
          <AdminLegal
            legal={legal}
            onChange={setLegal}
            onSave={saveLegal}
            saving={saving}
          />
        );
    }
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <button
          className="admin-btn admin-btn--ghost"
          style={{ display: 'none', fontSize: '1rem', padding: '0.4rem 0.75rem' }}
          id="sidebar-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <a href="/" className="admin-header__brand">
          assaon <span>Admin</span>
        </a>
        <div className="admin-header__spacer" />
        <span className="admin-header__badge">Phase 2</span>
      </header>

      <div className="admin-body">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(0,0,0,0.5)',
              display: 'none',
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="admin-main">
          {renderTab()}
        </main>
      </div>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <div key={toast.id} className={`admin-toast ${toast.type}`}>
          <span className="toast-icon">✓</span>
          {toast.message}
        </div>
      ))}

      {/* Mobile sidebar toggle button via CSS */}
      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .admin-sidebar { display: flex; }
          .admin-header__brand { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}
