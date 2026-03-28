import { json, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_PATH = '/root/assaon';
const UPLOADS_DIR = join(REPO_PATH, 'public', 'uploads');
const DATA_DIR = join(REPO_PATH, 'data', 'admin');

type SaveType = 'setting' | 'branding' | 'legal';

interface SaveRequest {
  key: string;
  value: string;
  type: SaveType;
  /** Base64 data URI for file uploads (branding only) */
  fileData?: string;
  /** 'logo' | 'favicon' */
  fileTarget?: 'logo' | 'favicon';
}

interface SaveResponse {
  success: boolean;
  commit?: string;
  error?: string;
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function runGit(message: string): string {
  execSync('git add -A', { cwd: REPO_PATH, encoding: 'utf8' });
  execSync(`git commit -m "${message.replace(/"/g, "'")}"`, {
    cwd: REPO_PATH,
    encoding: 'utf8',
  });

  let commitHash = 'unknown';

  try {
    commitHash = execSync('git rev-parse --short HEAD', {
      cwd: REPO_PATH,
      encoding: 'utf8',
    }).trim();
  } catch {
    // ignore
  }

  try {
    execSync('git push origin main', { cwd: REPO_PATH, encoding: 'utf8' });
  } catch (pushErr) {
    // Push failure is non-fatal — commit still succeeded
    console.warn('[admin/save] git push failed:', pushErr);
  }

  return commitHash;
}

function saveJson(filePath: string, key: string, value: string) {
  let existing: Record<string, string> = {};

  if (existsSync(filePath)) {
    try {
      existing = JSON.parse(require('fs').readFileSync(filePath, 'utf8'));
    } catch {
      // corrupt file — reset
    }
  }

  existing[key] = value;
  writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');
}

function saveFileFromBase64(dataUri: string, target: 'logo' | 'favicon') {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error('Invalid base64 data URI');
  }

  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = target === 'logo' ? 'logo.png' : 'favicon.ico';

  ensureDir(UPLOADS_DIR);
  writeFileSync(join(UPLOADS_DIR, fileName), buffer);
}

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, { status: 405 });
  }

  let body: SaveRequest;

  try {
    body = (await request.json()) as SaveRequest;
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { key, value, type, fileData, fileTarget } = body;

  if (!key || !type) {
    return json({ success: false, error: 'Missing key or type' }, { status: 400 });
  }

  try {
    ensureDir(DATA_DIR);

    // Save data to the appropriate file
    const filePath = join(DATA_DIR, `${type}.json`);
    saveJson(filePath, key, value);

    // Handle file upload (branding logo/favicon)
    if (fileData && fileTarget) {
      saveFileFromBase64(fileData, fileTarget);
    }

    // Git commit + push
    const commitMessage = `Admin: updated ${key}`;
    const commitHash = runGit(commitMessage);

    const response: SaveResponse = { success: true, commit: commitHash };
    return json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[admin/save] error:', message);
    return json({ success: false, error: message } satisfies SaveResponse, { status: 500 });
  }
}

// Loader returns 405 — this endpoint is POST only
export async function loader() {
  return json({ error: 'Use POST' }, { status: 405 });
}
