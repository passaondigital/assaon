const FEATURES = [
  {
    icon: '⚡',
    title: 'Blitzschnell',
    desc: 'Apps in Tagen, nicht Monaten. Kein Warten auf Entwickler-Kapazitäten.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'GDPR, HIPAA, ISO 27001. Enterprise-Sicherheit von Tag eins an.',
  },
  {
    icon: '🌍',
    title: 'Global Scale',
    desc: 'Multi-Sprache, Multi-Währung, Multi-Zeitzone. Weltweit einsetzbar.',
  },
  {
    icon: '🤖',
    title: 'Multi-Model AI',
    desc: 'Claude, GPT-4, Mistral, Groq, Ollama. Du wählst dein Modell.',
  },
  {
    icon: '💰',
    title: 'Kostenlos Anfangen',
    desc: 'Mistral & Groq kostenlos nutzen. Ollama lokal — komplett gratis.',
  },
  {
    icon: '🔌',
    title: 'API-First',
    desc: 'REST API, Webhooks, GitHub, Supabase. Verbinde alles was du kennst.',
  },
];

export default function LandingFeatures() {
  return (
    <section className="lp-section" id="features" aria-labelledby="features-title">
      <div className="container">
        <div className="section-header">
          <h2 id="features-title">Gebaut für Enterprise</h2>
          <p>Alles was du brauchst um professionell zu skalieren</p>
        </div>
        <div className="lp-cards-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="lp-card">
              <div className="lp-card-icon" aria-hidden="true">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
