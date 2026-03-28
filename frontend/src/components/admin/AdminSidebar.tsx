import type { AdminTab } from '~/hooks/useAdmin';

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  open?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: { id: AdminTab; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'settings',  icon: '⚙️',  label: 'Settings'  },
  { id: 'branding',  icon: '🎨',  label: 'Branding'  },
  { id: 'legal',     icon: '📄',  label: 'Legal'     },
];

export default function AdminSidebar({ activeTab, onTabChange, open, onClose }: Props) {
  const handleNav = (tab: AdminTab) => {
    onTabChange(tab);
    onClose?.();
  };

  return (
    <aside className={`admin-sidebar${open ? ' open' : ''}`}>
      <div className="admin-sidebar__logo">
        <div className="logo-text">assaon</div>
        <div className="logo-sub">Admin Panel</div>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`admin-sidebar__item${activeTab === item.id ? ' active' : ''}`}
            onClick={() => handleNav(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button
          className="admin-sidebar__logout"
          onClick={() => window.location.href = '/'}
        >
          ← Zurück zur App
        </button>
      </div>
    </aside>
  );
}
