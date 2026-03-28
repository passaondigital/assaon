import { useEffect, useState } from 'react';
import type { AdminBranding } from '~/hooks/useAdmin';
import { readFileAsDataUrl, cachePreview, loadPreview } from '~/utils/adminApi';

interface Props {
  branding: AdminBranding;
  onChange: (b: AdminBranding) => void;
  onSave: (filePayload?: { fileData: string; fileTarget: 'logo' | 'favicon' }) => Promise<void>;
  saving: boolean;
}

export default function AdminBrandingTab({ branding, onChange, onSave, saving }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<{
    fileData: string;
    fileTarget: 'logo' | 'favicon';
  } | null>(null);

  useEffect(() => {
    setLogoPreview(loadPreview('logo'));
    setFaviconPreview(loadPreview('favicon'));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    cachePreview('logo', dataUrl);
    setLogoPreview(dataUrl);
    onChange({ ...branding, logoUrl: dataUrl });
    setPendingFile({ fileData: dataUrl, fileTarget: 'logo' });
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    cachePreview('favicon', dataUrl);
    setFaviconPreview(dataUrl);
    onChange({ ...branding, faviconUrl: dataUrl });
    setPendingFile({ fileData: dataUrl, fileTarget: 'favicon' });
  };

  const handleSave = async () => {
    await onSave(pendingFile ?? undefined);
    setPendingFile(null);
  };

  return (
    <div>
      <h2 className="admin-section-title">
        <span>Branding</span> — Logo, Favicon & Colors
      </h2>

      <div className="branding-grid">
        {/* Logo */}
        <div className="upload-card">
          <div className="upload-card__title">🖼️ Logo</div>
          <div className="upload-card__preview logo-preview">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" />
            ) : (
              <div className="preview-placeholder">
                Logo Preview
                <br />
                <small>400 × 100 px</small>
              </div>
            )}
          </div>
          <div className="upload-card__file-input">
            <input type="file" accept=".jpg,.jpeg,.png,.svg" onChange={handleLogoUpload} />
          </div>
          <div className="upload-card__hint">
            JPG, PNG, SVG · Max 5 MB · Saves to /public/uploads/logo.png
          </div>
        </div>

        {/* Favicon */}
        <div className="upload-card">
          <div className="upload-card__title">⭐ Favicon</div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
          >
            <div className="upload-card__preview favicon-preview">
              {faviconPreview ? (
                <img src={faviconPreview} alt="Favicon" style={{ width: 48, height: 48 }} />
              ) : (
                <div className="preview-placeholder" style={{ fontSize: '0.65rem' }}>
                  64×64
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b0b0b0' }}>
              Shown in browser tabs
              <br />
              and bookmarks
            </div>
          </div>
          <div className="upload-card__file-input">
            <input type="file" accept=".ico,.png" onChange={handleFaviconUpload} />
          </div>
          <div className="upload-card__hint">ICO, PNG · Saves to /public/uploads/favicon.ico</div>
        </div>

        {/* Color pickers */}
        <div className="color-card">
          <div className="color-card__title">🎨 Brand Colors</div>
          <div className="color-card__pickers">
            <div className="color-card__item">
              <label>Primary Orange</label>
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => onChange({ ...branding, primaryColor: e.target.value })}
              />
              <span className="color-hex">{branding.primaryColor}</span>
            </div>
            <div className="color-card__item">
              <label>Dark Black</label>
              <input
                type="color"
                value={branding.darkColor}
                onChange={(e) => onChange({ ...branding, darkColor: e.target.value })}
              />
              <span className="color-hex">{branding.darkColor}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Saving...' : '💾 Save Branding'}
        </button>
        {pendingFile && (
          <span style={{ fontSize: '0.75rem', color: '#F5970A' }}>
            ⚠ Unsaved file: {pendingFile.fileTarget}
          </span>
        )}
      </div>
    </div>
  );
}
