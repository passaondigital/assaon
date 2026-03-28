import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, Project, User } from '../lib/api';
import { clearToken, getCurrentUser } from '../lib/auth';
import './Dashboard.scss';

const TYPE_OPTIONS = [
  { value: 'website', label: '🌐 Website' },
  { value: 'app', label: '📱 App' },
  { value: 'shop', label: '🛒 Shop' },
  { value: 'blog', label: '✍️ Blog' },
  { value: 'calendar', label: '📅 Kalender' },
  { value: 'community', label: '🗺️ Community' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('website');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (!u) { navigate('/login'); return; }
      setUser(u);
      const { projects } = await api.projects.list();
      setProjects(projects);
      setLoading(false);
    })();
  }, []);

  async function createProject() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const { project } = await api.projects.create({ name: newName, description: newDesc, type: newType });
      setProjects(prev => [project, ...prev]);
      setShowNew(false);
      setNewName(''); setNewDesc(''); setNewType('website');
    } finally {
      setCreating(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/');
  }

  if (loading) return <div className="dash-loading">Lädt...</div>;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <a href="/" className="dash-logo">
          <span className="dash-logo-mark">a</span>
          <span>assaon</span>
        </a>
        <div className="dash-header-right">
          <Link to="/studio" className="dash-cta">+ Neues Projekt</Link>
          <button className="dash-user-btn" onClick={handleLogout} title="Abmelden">
            {user?.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-welcome">
          <h1>Hallo, {user?.name.split(' ')[0]} 👋</h1>
          <p>Was möchtest du heute bauen?</p>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Deine Projekte</h2>
            <button className="dash-add-btn" onClick={() => setShowNew(true)}>+ Neu</button>
          </div>

          {projects.length === 0 && !showNew && (
            <div className="dash-empty">
              <div className="dash-empty-icon">🌱</div>
              <h3>Noch keine Projekte</h3>
              <p>Starte dein erstes Tier-Business Projekt</p>
              <button className="dash-empty-cta" onClick={() => setShowNew(true)}>
                🚀 Projekt erstellen
              </button>
            </div>
          )}

          {showNew && (
            <div className="dash-new-card">
              <h3>Neues Projekt</h3>
              <input
                type="text"
                placeholder="Projektname"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Kurze Beschreibung (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={2}
              />
              <select value={newType} onChange={e => setNewType(e.target.value)}>
                {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <div className="dash-new-actions">
                <button onClick={() => setShowNew(false)} className="btn-ghost">Abbrechen</button>
                <button onClick={createProject} disabled={creating || !newName.trim()} className="btn-primary">
                  {creating ? 'Erstellen...' : 'Erstellen'}
                </button>
              </div>
            </div>
          )}

          <div className="dash-projects-grid">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onDelete={id => setProjects(prev => prev.filter(x => x.id !== id))} />
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h2>Studio starten</h2>
          </div>
          <Link to="/studio" className="dash-studio-banner">
            <div>
              <h3>assaon Studio</h3>
              <p>Beschreibe was du bauen möchtest — die KI baut es für dich</p>
            </div>
            <span className="dash-studio-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm(`"${project.name}" löschen?`)) return;
    await api.projects.delete(project.id);
    onDelete(project.id);
  }

  const typeLabel = TYPE_OPTIONS.find(t => t.value === project.type)?.label || project.type;
  const statusColor = { draft: '#999', live: '#22c55e', paused: '#f59e0b' }[project.status] || '#999';

  return (
    <div className="project-card">
      <div className="project-card-top">
        <span className="project-type">{typeLabel}</span>
        <span className="project-status" style={{ color: statusColor }}>● {project.status}</span>
      </div>
      <h3>{project.name}</h3>
      {project.description && <p>{project.description}</p>}
      {project.subdomain && (
        <div className="project-domain">{project.subdomain}.assaon.com</div>
      )}
      <div className="project-card-actions">
        <Link to={`/studio?project=${project.id}`} className="btn-sm">Öffnen</Link>
        <button onClick={handleDelete} className="btn-sm btn-danger">Löschen</button>
      </div>
    </div>
  );
}
