// =============================================================================
// Admin API Helper — calls POST /api/admin/save for all persistent operations
// =============================================================================

export interface AdminSaveResponse {
  success: boolean;
  commit?: string;
  error?: string;
}

type SaveType = 'setting' | 'branding' | 'legal';

/**
 * Central save function — POSTs to /api/admin/save.
 * Backend writes to disk, runs git add/commit/push, returns the short commit hash.
 */
export async function adminSave(
  type: SaveType,
  key: string,
  value: string,
  filePayload?: { fileData: string; fileTarget: 'logo' | 'favicon' },
): Promise<AdminSaveResponse> {
  const body: Record<string, string> = { type, key, value };

  if (filePayload) {
    body.fileData = filePayload.fileData;
    body.fileTarget = filePayload.fileTarget;
  }

  const res = await fetch('/api/admin/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as AdminSaveResponse;
  return data;
}

// ---------------------------------------------------------------------------
// File uploads — read file as base64, preview in browser, send to backend
// ---------------------------------------------------------------------------

/** Read a File object as a base64 data URI (for preview + API upload) */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Cache preview URL in localStorage so it survives page reloads */
export function cachePreview(type: 'logo' | 'favicon', dataUrl: string): void {
  localStorage.setItem(`admin_preview_${type}`, dataUrl);
}

/** Load cached preview from localStorage */
export function loadPreview(type: 'logo' | 'favicon'): string | null {
  return localStorage.getItem(`admin_preview_${type}`);
}

// ---------------------------------------------------------------------------
// Settings / Legal persistence (localStorage fallback for instant UI)
// ---------------------------------------------------------------------------

export function persistLocal(key: string, value: unknown): void {
  localStorage.setItem(`admin_${key}`, JSON.stringify(value));
}

export function loadLocal<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(`admin_${key}`);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
