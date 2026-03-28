import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { saveToken } from '../lib/auth';
import './Auth.scss';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.auth.login({ email, password });
      saveToken(token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a href="/" className="auth-logo">
          <span className="auth-logo-mark">a</span>
          <span>assaon</span>
        </a>

        <h1>Willkommen zurück</h1>
        <p className="auth-sub">Melde dich an und mach weiter</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="du@example.com"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Anmelden...' : 'Anmelden →'}
          </button>
        </form>

        <p className="auth-switch">
          Noch kein Account? <Link to="/signup">Kostenlos registrieren</Link>
        </p>
      </div>
    </div>
  );
}
