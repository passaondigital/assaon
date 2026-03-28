import type { AdminSettings } from '~/hooks/useAdmin';

interface Props {
  settings: AdminSettings;
  onChange: (s: AdminSettings) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export default function AdminSettings({ settings, onChange, onSave, saving }: Props) {
  const update = (key: keyof AdminSettings, value: string) =>
    onChange({ ...settings, [key]: value });

  return (
    <div>
      <h2 className="admin-section-title">
        <span>Settings</span> — Platform Configuration
      </h2>

      <div className="admin-form">
        <div className="admin-form__group">
          <label className="admin-form__label">Platform Name</label>
          <input
            className="admin-form__input"
            value={settings.platformName}
            onChange={(e) => update('platformName', e.target.value)}
            placeholder="assaon"
          />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Support Email</label>
          <input
            className="admin-form__input"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => update('supportEmail', e.target.value)}
            placeholder="support@assaon.com"
          />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Support Link</label>
          <input
            className="admin-form__input"
            type="url"
            value={settings.supportLink}
            onChange={(e) => update('supportLink', e.target.value)}
            placeholder="https://assaon.com/support"
          />
        </div>

        <div className="admin-form__group">
          <label className="admin-form__label">Landing Page Tagline</label>
          <textarea
            className="admin-form__textarea"
            value={settings.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            placeholder="Die globale No-Code Plattform für Tier-Businesses"
            rows={3}
          />
        </div>

        <button
          className="admin-btn admin-btn--primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? '⏳ Saving...' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  );
}
