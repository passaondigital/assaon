import { useState } from 'react';

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lp-nav" role="banner">
      <div className="lp-nav-inner container">

        <a href="/" className="lp-logo" aria-label="assaon Startseite">
          <div className="lp-logo-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#F5970A" />
              <text x="16" y="22" textAnchor="middle" fill="#0a0700" fontSize="18" fontWeight="700" fontFamily="Poppins, sans-serif">a</text>
            </svg>
          </div>
          <span className="lp-logo-name">assaon</span>
        </a>

        <nav className="lp-nav-menu" role="navigation" aria-label="Hauptnavigation">
          <a href="#solutions">Produkt</a>
          <a href="#solutions">Für Profis</a>
          <a href="#pricing">Preise</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="lp-nav-actions">
          <a href="/login" className="btn-secondary">Anmelden</a>
          <a href="/signup" className="btn-primary">Kostenlos Starten</a>
        </div>

        <button
          className={`lp-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="lp-mobile-menu" role="navigation" aria-label="Mobile Navigation">
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Produkt</a>
          <a href="#solutions" onClick={() => setMenuOpen(false)}>Für Profis</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Preise</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <div className="lp-mobile-ctas">
            <a href="/login" className="btn-secondary">Anmelden</a>
            <a href="/signup" className="btn-primary">Kostenlos Starten</a>
          </div>
        </div>
      )}
    </header>
  );
}
