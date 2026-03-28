const PLANS = [
  {
    name: 'Starter',
    price: 'Kostenlos',
    period: '',
    desc: 'Perfekt zum Einstieg',
    featured: false,
    items: [
      '1 Projekt',
      'Mistral Free',
      'Groq API',
      'Community Support',
    ],
    cta: 'Jetzt Starten',
    href: '/signup',
  },
  {
    name: 'Professional',
    price: '€29',
    period: '/Monat',
    desc: 'Für wachsende Teams',
    featured: true,
    items: [
      '5 Projekte',
      'Alle Free Models',
      'Claude (Anthropic)',
      'Priority Support',
    ],
    cta: 'Kostenlos Testen',
    href: '/signup',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Für große Organisationen',
    featured: false,
    items: [
      'Unbegrenzte Projekte',
      'Alle AI Models',
      'Dedicated Manager',
      '24/7 Support',
    ],
    cta: 'Kontakt aufnehmen',
    href: '#',
  },
];

export default function LandingPricing() {
  return (
    <section className="lp-section lp-section-alt" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <div className="section-header">
          <h2 id="pricing-title">Transparent. Fair. Einfach.</h2>
          <p>Keine versteckten Kosten. Keine Überraschungen.</p>
        </div>
        <div className="lp-pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`lp-pricing-card ${plan.featured ? 'featured' : ''}`}
              aria-label={`${plan.name} Plan`}
            >
              {plan.featured && (
                <div className="lp-pricing-badge" aria-label="Empfohlen">EMPFOHLEN</div>
              )}
              <h3>{plan.name}</h3>
              <div className="lp-price">
                <span className="lp-price-amount">{plan.price}</span>
                {plan.period && <span className="lp-price-period">{plan.period}</span>}
              </div>
              <p className="lp-price-desc">{plan.desc}</p>
              <ul className="lp-price-items">
                {plan.items.map((item) => (
                  <li key={item}>
                    <span className="lp-check" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={plan.featured ? 'btn-primary btn-full' : 'btn-secondary btn-full'}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
