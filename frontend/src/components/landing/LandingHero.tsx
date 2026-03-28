export default function LandingHero() {
  return (
    <section className="lp-hero" aria-label="Hero">
      <div className="container lp-hero-inner">

        <div className="lp-hero-content">
          <div className="lp-hero-eyebrow">No-Code Plattform · Tierwelt</div>
          <h1 className="lp-hero-h1">
            Hilft dem Tier.<br />
            <span className="lp-hero-accent">Hilft Dir.</span>
          </h1>
          <p className="lp-hero-tagline">
            Die No-Code Plattform für die Tierwelt von morgen.
          </p>
          <p className="lp-hero-desc">
            Digital verbunden. Gemeinsam mehr tun als nur reden, wünschen und hoffen.
            Mit assaon kannst du endlich was bewegen.
          </p>
          <div className="lp-hero-cta">
            <a href="/signup" className="btn-primary btn-large">
              🚀 Kostenlos Starten
            </a>
            <a href="#" className="btn-secondary btn-large">
              Demo Ansehen
            </a>
          </div>
          <p className="lp-hero-proof">
            Vertraut von <strong>200+ Tier-Profis</strong> in 40 Ländern
          </p>
        </div>

        <div className="lp-hero-visual" aria-label="Logo Placeholder">
          <div className="lp-logo-placeholder">
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="assaon Logo Platzhalter — Orange Infinity mit Tier-Silhouetten"
              role="img"
            >
              {/* Outer ring */}
              <circle cx="160" cy="160" r="148" stroke="#F5970A" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="160" cy="160" r="120" stroke="#F5970A" strokeWidth="1" strokeOpacity="0.15" />

              {/* Infinity shape */}
              <path
                d="M80 160 C80 130 100 110 130 110 C160 110 160 160 160 160 C160 160 160 210 190 210 C220 210 240 190 240 160 C240 130 220 110 190 110 C160 110 160 160 160 160 C160 160 160 210 130 210 C100 210 80 190 80 160 Z"
                stroke="#F5970A"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />

              {/* Animal silhouettes around the ring */}
              {/* Dog paw */}
              <text x="155" y="42" fontSize="22" textAnchor="middle" opacity="0.7">🐾</text>
              {/* Horse */}
              <text x="268" y="100" fontSize="20" textAnchor="middle" opacity="0.7">🐴</text>
              {/* Bird */}
              <text x="290" y="175" fontSize="18" textAnchor="middle" opacity="0.7">🦜</text>
              {/* Cow */}
              <text x="240" y="258" fontSize="20" textAnchor="middle" opacity="0.7">🐄</text>
              {/* Lion */}
              <text x="145" y="296" fontSize="22" textAnchor="middle" opacity="0.7">🦁</text>
              {/* Cat */}
              <text x="50" y="258" fontSize="20" textAnchor="middle" opacity="0.7">🐕</text>
              {/* Fish */}
              <text x="18" y="175" fontSize="18" textAnchor="middle" opacity="0.7">🦆</text>
              {/* Stethoscope */}
              <text x="42" y="100" fontSize="20" textAnchor="middle" opacity="0.7">🏥</text>

              {/* Center text */}
              <text x="160" y="155" textAnchor="middle" fill="#F5970A" fontSize="28" fontWeight="700" fontFamily="Poppins, sans-serif" opacity="0.95">assaon</text>
              <text x="160" y="180" textAnchor="middle" fill="#b0b0b0" fontSize="11" fontFamily="Poppins, sans-serif" opacity="0.7">Hilft dem Tier. Hilft Dir.</text>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
