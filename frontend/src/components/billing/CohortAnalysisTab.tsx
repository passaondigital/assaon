import React from 'react';
import type { CohortRow } from '../../hooks/useBilling';

interface Props { cohortData: CohortRow[] }

function retentionColor(v: number | null): string {
  if (v === null) return 'transparent';
  if (v >= 90) return 'rgba(34,197,94,0.6)';
  if (v >= 75) return 'rgba(34,197,94,0.35)';
  if (v >= 60) return 'rgba(245,158,11,0.4)';
  if (v >= 40) return 'rgba(245,158,11,0.25)';
  return 'rgba(239,68,68,0.35)';
}

function CohortCell({ value }: { value: number | null }) {
  if (value === null) return <td className="cohort-cell cohort-cell--empty">—</td>;
  return <td className="cohort-cell" style={{ background: retentionColor(value) }}>{value}%</td>;
}

export default function CohortAnalysisTab({ cohortData }: Props) {
  const EXPANSION = cohortData.map(c => ({
    ...c,
    w1: 5, w4: 15, w8: 28, w12: c.w12 ? 35 : null, w24: c.w24 ? 42 : null, w52: c.w52 ? 48 : null,
  }));

  return (
    <div className="cohort-tab">
      <div className="bl-section">
        <div className="bl-section__header">
          <h3>Retention Cohort Analysis</h3>
          <div className="cohort-legend">
            <span style={{ background: 'rgba(34,197,94,0.6)' }} />High (90%+)
            <span style={{ background: 'rgba(245,158,11,0.4)' }} />Med (60–89%)
            <span style={{ background: 'rgba(239,68,68,0.35)' }} />Low (&lt;60%)
          </div>
        </div>
        <div className="bl-table-wrap">
          <table className="bl-table cohort-table">
            <thead>
              <tr>
                <th>Cohort</th><th>Size</th><th>Week 1</th><th>Week 4</th><th>Week 8</th><th>Week 12</th><th>Week 24</th><th>Week 52</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map(row => (
                <tr key={row.cohort}>
                  <td className="cohort-label">{row.cohort}</td>
                  <td className="bl-table__dim">{row.cohortSize}</td>
                  <CohortCell value={row.w1} />
                  <CohortCell value={row.w4} />
                  <CohortCell value={row.w8} />
                  <CohortCell value={row.w12} />
                  <CohortCell value={row.w24} />
                  <CohortCell value={row.w52} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bl-section">
        <div className="bl-section__header">
          <h3>Expansion Revenue by Cohort</h3>
          <span className="bl-count">% of cohort that upgraded</span>
        </div>
        <div className="bl-table-wrap">
          <table className="bl-table cohort-table">
            <thead>
              <tr>
                <th>Cohort</th><th>Size</th><th>Week 1</th><th>Week 4</th><th>Week 8</th><th>Week 12</th><th>Week 24</th><th>Week 52</th>
              </tr>
            </thead>
            <tbody>
              {EXPANSION.map(row => (
                <tr key={row.cohort}>
                  <td className="cohort-label">{row.cohort}</td>
                  <td className="bl-table__dim">{row.cohortSize}</td>
                  <CohortCell value={row.w1} />
                  <CohortCell value={row.w4} />
                  <CohortCell value={row.w8} />
                  <CohortCell value={row.w12} />
                  <CohortCell value={row.w24} />
                  <CohortCell value={row.w52} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bl-section">
        <div className="bl-section__header"><h3>Cohort Insights</h3></div>
        <div className="cohort-insights">
          <div className="insight-card">
            <span className="insight-card__icon">📈</span>
            <div>
              <strong>Best Cohort</strong>
              <p>Mar 2026 shows highest Week 4 retention (93%). Consider analyzing what onboarding improvements drove this.</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-card__icon">⚠️</span>
            <div>
              <strong>Week 52 Retention Drop</strong>
              <p>Jan 2026 cohort shows 45% 1-year retention. Consider long-term engagement features to improve Year 2 retention.</p>
            </div>
          </div>
          <div className="insight-card">
            <span className="insight-card__icon">💡</span>
            <div>
              <strong>Expansion Opportunity</strong>
              <p>42% of Jan 2026 cohort upgraded by Week 24. Target similar activation milestones for newer cohorts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
