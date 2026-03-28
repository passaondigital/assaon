const BASE = '/api/mission';

export async function fetchUsers(page: number, pageSize: number, filters: Record<string, string>) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), ...filters });
  const res = await fetch(`${BASE}/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function deleteUser(userId: string) {
  const res = await fetch(`${BASE}/users/${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

export async function banUser(userId: string) {
  const res = await fetch(`${BASE}/users/${userId}/ban`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to ban user');
  return res.json();
}

export async function deleteUserGDPR(userId: string) {
  const res = await fetch(`${BASE}/gdpr/delete/${userId}`, { method: 'POST' });
  if (!res.ok) throw new Error('GDPR delete failed');
  return res.json();
}

export async function exportUserGDPR(userId: string) {
  const res = await fetch(`${BASE}/gdpr/export/${userId}`);
  if (!res.ok) throw new Error('GDPR export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user_${userId}_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportUsersCSV(users: Array<Record<string, unknown>>) {
  const headers = ['ID', 'Email', 'Name', 'Registered', 'Status', 'Industry', 'Projects', 'MRR'];
  const rows = users.map(u => [u.id, u.email, u.name, u.registeredAt, u.status, u.industry, u.projects, u.mrr].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `assaon_users_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function updateComplianceItem(id: string, completed: boolean) {
  // localStorage persistence (real API later)
  const key = `compliance_${id}`;
  localStorage.setItem(key, JSON.stringify({ completed, updatedAt: new Date().toISOString() }));
  return { success: true };
}

export async function runRetentionCheck() {
  const res = await fetch(`${BASE}/gdpr/retention-check`, { method: 'POST' });
  if (!res.ok) throw new Error('Retention check failed');
  return res.json();
}
