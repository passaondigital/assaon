const COLS = [
  {
    title: 'Produkt',
    links: ['Features', 'Preise', 'Sicherheit', 'API'],
  },
  {
    title: 'Resources',
    links: ['Docs', 'Blog', 'Community', 'Support'],
  },
  {
    title: 'Legal',
    links: ['Datenschutz', 'AGB', 'Impressum', 'Cookies'],
  },
];

export default function LandingFooter() {
  return (
    <footer className="lp-footer" role="contentinfo">
      <div className="container lp-footer-inner">

        <div className="lp-footer-brand">
          <a href="/" className="lp-logo" aria-label="assaon Startseite">
            <div className="lp-logo-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#F5970A" />
                <text x="16" y="22" textAnchor="middle" fill="#0a0700" fontSize="18" fontWeight="700" fontFamily="Poppins, sans-serif">a</text>
              </svg>
            </div>
            <span className="lp-logo-name">assaon</span>
          </a>
          <p className="lp-footer-tagline">Hilft dem Tier. Hilft Dir.</p>
          <div className="lp-footer-badges" aria-label="Zertifizierungen">
            <span className="badge">GDPR</span>
            <span className="badge">ISO 27001</span>
            <span className="badge">EU AI Act</span>
          </div>
        </div>

        <div className="lp-footer-cols">
          {COLS.map((col) => (
            <div key={col.title} className="lp-footer-col">
              <h4>{col.title}</h4>
              {col.links.map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          ))}
        </div>

      </div>

      <div className="lp-footer-bottom">
        <div className="container lp-footer-bottom-inner">
          <p>© 2026 assaon. Enterprise No-Code für die Tierwelt.</p>
        </div>
      </div>
    </footer>
  );
}
