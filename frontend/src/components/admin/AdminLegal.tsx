import { useState } from 'react';
import type { AdminLegal } from '~/hooks/useAdmin';

interface Props {
  legal: AdminLegal;
  onChange: (l: AdminLegal) => void;
  onSave: (doc: keyof AdminLegal) => Promise<void>;
  saving: boolean;
}

const DOCS: { key: keyof AdminLegal; label: string; icon: string }[] = [
  { key: 'impressum',   label: 'Impressum',            icon: '🏢' },
  { key: 'datenschutz', label: 'Datenschutzerklärung', icon: '🔒' },
  { key: 'agb',         label: 'AGB',                  icon: '📋' },
  { key: 'cookies',     label: 'Cookie-Richtlinie',    icon: '🍪' },
];

export default function AdminLegal({ legal, onChange, onSave, saving }: Props) {
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleSave = async (key: keyof AdminLegal) => {
    setLoadingKey(key);

    try {
      await onSave(key);
      setSavedMap((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedMap((prev) => ({ ...prev, [key]: false })), 3000);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div>
      <h2 className="admin-section-title">
        <span>Legal</span> — Rechtliche Texte
      </h2>

      <div className="legal-grid">
        {DOCS.map(({ key, label, icon }) => (
          <div className="legal-card" key={key}>
            <div className="legal-card__header">
              <div className="legal-card__title">
                {icon} {label}
              </div>
              <span className={`legal-card__saved${savedMap[key] ? ' visible' : ''}`}>
                ✓ Gespeichert
              </span>
            </div>

            <textarea
              className="legal-card__editor"
              value={legal[key]}
              onChange={(e) => onChange({ ...legal, [key]: e.target.value })}
              placeholder={`${label} HTML-Inhalt...`}
              spellCheck={false}
            />

            <div className="legal-card__footer">
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => handleSave(key)}
                disabled={saving || loadingKey === key}
              >
                {loadingKey === key ? '⏳ Saving...' : `💾 ${label} speichern`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
