import { useState, useCallback } from 'react';
import { adminSave, persistLocal, loadLocal } from '~/utils/adminApi';

export type AdminTab = 'dashboard' | 'settings' | 'branding' | 'legal';

export interface AdminSettings {
  platformName: string;
  supportEmail: string;
  supportLink: string;
  tagline: string;
}

export interface AdminBranding {
  primaryColor: string;
  darkColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

export interface AdminLegal {
  impressum: string;
  datenschutz: string;
  agb: string;
  cookies: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const DEFAULT_SETTINGS: AdminSettings = {
  platformName: 'assaon',
  supportEmail: 'support@assaon.com',
  supportLink: 'https://assaon.com/support',
  tagline: 'Die globale No-Code Plattform für Tier-Businesses',
};

const DEFAULT_BRANDING: AdminBranding = {
  primaryColor: '#F5970A',
  darkColor: '#0a0700',
  logoUrl: null,
  faviconUrl: null,
};

const DEFAULT_LEGAL: AdminLegal = {
  impressum:
    '<h2>Impressum</h2>\n<p>Angaben gemäß § 5 TMG</p>\n<p>Musterfirma GmbH<br/>Musterstraße 1<br/>12345 Musterstadt</p>',
  datenschutz:
    '<h2>Datenschutzerklärung</h2>\n<p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.</p>',
  agb: '<h2>Allgemeine Geschäftsbedingungen</h2>\n<p>Es gelten folgende AGB.</p>',
  cookies:
    '<h2>Cookie-Richtlinie</h2>\n<p>Diese Website verwendet Cookies, um Ihnen ein besseres Erlebnis zu bieten.</p>',
};

export function useAdmin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<AdminSettings>(
    () => loadLocal('settings', DEFAULT_SETTINGS),
  );
  const [branding, setBranding] = useState<AdminBranding>(
    () => loadLocal('branding', DEFAULT_BRANDING),
  );
  const [legal, setLegal] = useState<AdminLegal>(
    () => loadLocal('legal', DEFAULT_LEGAL),
  );

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    persistLocal('settings', settings);

    try {
      const results = await Promise.all(
        (Object.entries(settings) as [string, string][]).map(([key, value]) =>
          adminSave('setting', key, value),
        ),
      );
      const lastCommit = results.at(-1)?.commit;
      showToast(lastCommit ? `Settings gespeichert · ${lastCommit}` : 'Settings gespeichert ✓');
    } catch {
      showToast('Fehler beim Speichern', 'error');
    } finally {
      setSaving(false);
    }
  }, [settings, showToast]);

  const saveBranding = useCallback(
    async (filePayload?: { fileData: string; fileTarget: 'logo' | 'favicon' }) => {
      setSaving(true);
      persistLocal('branding', branding);

      try {
        const res = await adminSave(
          'branding',
          filePayload?.fileTarget ?? 'colors',
          JSON.stringify({ primaryColor: branding.primaryColor, darkColor: branding.darkColor }),
          filePayload,
        );
        showToast(
          res.success
            ? `Branding gespeichert · ${res.commit ?? '✓'}`
            : `Fehler: ${res.error}`,
          res.success ? 'success' : 'error',
        );
      } catch {
        showToast('Fehler beim Speichern', 'error');
      } finally {
        setSaving(false);
      }
    },
    [branding, showToast],
  );

  const saveLegal = useCallback(
    async (doc: keyof AdminLegal) => {
      setSaving(true);
      persistLocal('legal', legal);

      const labels: Record<keyof AdminLegal, string> = {
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        agb: 'AGB',
        cookies: 'Cookie-Policy',
      };

      try {
        const res = await adminSave('legal', doc, legal[doc]);
        showToast(
          res.success
            ? `${labels[doc]} gespeichert · ${res.commit ?? '✓'}`
            : `Fehler: ${res.error}`,
          res.success ? 'success' : 'error',
        );
      } catch {
        showToast('Fehler beim Speichern', 'error');
      } finally {
        setSaving(false);
      }
    },
    [legal, showToast],
  );

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen: (v: boolean | ((prev: boolean) => boolean)) =>
      setSidebarOpen(typeof v === 'function' ? v(sidebarOpen) : v),
    toasts,
    saving,
    settings,
    setSettings,
    branding,
    setBranding,
    legal,
    setLegal,
    saveSettings,
    saveBranding,
    saveLegal,
  };
}
