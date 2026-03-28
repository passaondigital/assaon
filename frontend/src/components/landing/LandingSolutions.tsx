const SOLUTIONS = [
  {
    icon: '🏥',
    title: 'Tierärzte',
    desc: 'Patienten, Termine, Abrechnungen, Befunde — alles in einer Plattform.',
  },
  {
    icon: '🐴',
    title: 'Equine Services',
    desc: 'Training, Breeding, Farrier Management und Owner Portal.',
  },
  {
    icon: '🐕',
    title: 'Hundeschulen',
    desc: 'Kundenportal, Buchungen, Fortschrittstracking und Zahlungsabwicklung.',
  },
  {
    icon: '🦁',
    title: 'Wildlife Conservation',
    desc: 'Tier-Tracking, Datenmanagement, Team-Koordination und Förderberichte.',
  },
  {
    icon: '🐄',
    title: 'Bauernhöfe',
    desc: 'Vieh-Management, Gesundheitsüberwachung und Logistik.',
  },
  {
    icon: '🦜',
    title: 'Züchter & Sanctuaries',
    desc: 'Genetik, Stammbäume, Gesundheitsrecords und Verkaufsmanagement.',
  },
];

export default function LandingSolutions() {
  return (
    <section className="lp-section lp-section-alt" id="solutions" aria-labelledby="solutions-title">
      <div className="container">
        <div className="section-header">
          <h2 id="solutions-title">Lösungen für jeden Tier-Profi</h2>
          <p>Maßgeschneidert für jede Branche der Tierwelt</p>
        </div>
        <div className="lp-cards-grid">
          {SOLUTIONS.map((s) => (
            <article key={s.title} className="lp-card">
              <div className="lp-card-icon" aria-hidden="true">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#" className="lp-card-link">Demo ansehen →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
