import '../styles/landing.scss';
import LandingHeader from '../components/landing/LandingHeader';
import LandingHero from '../components/landing/LandingHero';
import LandingSolutions from '../components/landing/LandingSolutions';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingPricing from '../components/landing/LandingPricing';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="lp">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingSolutions />
        <LandingFeatures />
        <LandingPricing />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}

function FinalCta() {
  return (
    <section className="lp-section" style={{ textAlign: 'center', background: '#0a0700' }}>
      <div className="container" style={{ maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#ffffff',
          marginBottom: '1rem',
        }}>
          Bereit loszulegen?
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#b0b0b0',
          marginBottom: '2rem',
          lineHeight: 1.7,
        }}>
          Schließ dich 200+ Tier-Profis in 40 Ländern an.<br />
          Kostenlos starten — keine Kreditkarte nötig.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" className="btn-primary btn-large">
            🚀 Kostenlos Starten
          </a>
          <a href="#" className="btn-secondary btn-large">
            Demo Ansehen
          </a>
        </div>
        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#666666' }}>
          Keine Kreditkarte. Keine Einrichtungsgebühren. Jederzeit kündbar.
        </p>
      </div>
    </section>
  );
}
