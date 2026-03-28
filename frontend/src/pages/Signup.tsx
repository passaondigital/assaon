import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { saveToken } from '../lib/auth';
import './Auth.scss';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.auth.signup({ name, email, password });
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

        <h1>Kostenlos starten</h1>
        <p className="auth-sub">Keine Kreditkarte. Sofort loslegen.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Dein Name"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="du@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Konto erstellen...' : '🚀 Konto erstellen'}
          </button>

          <p className="auth-fine">
            Mit der Registrierung stimmst du unseren <a href="/terms">AGB</a> und
            der <a href="/privacy">Datenschutzerklärung</a> zu.
          </p>
        </form>

        <p className="auth-switch">
          Bereits registriert? <Link to="/login">Anmelden</Link>
        </p>
      </div>
    </div>
  );
}
