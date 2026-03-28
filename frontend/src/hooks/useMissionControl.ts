import { useState, useMemo } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  registeredAt: string;
  status: 'active' | 'inactive' | 'banned';
  industry: string;
  projects: number;
  mrr: number;
}

export interface ComplianceItem {
  id: string;
  category: 'gdpr' | 'eu_ai_act';
  title: string;
  description: string;
  completed: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface FilterParams {
  search: string;
  status: string;
  industry: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INDUSTRIES = ['Veterinary', 'Equine', 'Dog Training', 'Wildlife', 'Farm', 'Breeding', 'Other'];
const STATUSES: Array<'active' | 'inactive' | 'banned'> = ['active', 'active', 'active', 'inactive', 'banned'];

function generateUsers(count: number): User[] {
  const names = ['Emma Schmidt', 'Luca Bauer', 'Sophie Müller', 'Noah Wagner', 'Mia Fischer',
    'Elias Schneider', 'Hannah Weber', 'Leon Hoffmann', 'Laura Meyer', 'Felix Koch'];
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    name: names[i % names.length],
    registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600 * 1000).toISOString(),
    status: STATUSES[i % STATUSES.length],
    industry: INDUSTRIES[i % INDUSTRIES.length],
    projects: Math.floor(Math.random() * 8) + 1,
    mrr: Math.round(Math.random() * 500 * 100) / 100,
  }));
}

const MOCK_USERS = generateUsers(124);

const GDPR_ITEMS: ComplianceItem[] = [
  { id: 'gdpr-1', category: 'gdpr', title: 'Data Retention Policy', description: 'Automatically delete user data after retention period expires.', completed: true, lastUpdated: '2026-03-20', updatedBy: 'admin@assaon.com' },
  { id: 'gdpr-2', category: 'gdpr', title: 'Right to be Forgotten', description: 'DELETE /api/mission/gdpr/delete/:userId — soft-delete with 30-day undo.', completed: true, lastUpdated: '2026-03-22', updatedBy: 'admin@assaon.com' },
  { id: 'gdpr-3', category: 'gdpr', title: 'Data Portability', description: 'EXPORT /api/mission/gdpr/export/:userId — JSON download of all user data.', completed: false, lastUpdated: '2026-03-15', updatedBy: 'admin@assaon.com' },
  { id: 'gdpr-4', category: 'gdpr', title: 'Cookie Consent Banner', description: 'GDPR-compliant cookie consent displayed on first visit.', completed: true, lastUpdated: '2026-03-10', updatedBy: 'admin@assaon.com' },
  { id: 'gdpr-5', category: 'gdpr', title: 'Audit Log', description: 'All admin actions are logged with timestamp, admin ID, and resource.', completed: false, lastUpdated: '2026-03-01', updatedBy: 'admin@assaon.com' },
];

const EU_AI_ITEMS: ComplianceItem[] = [
  { id: 'ai-1', category: 'eu_ai_act', title: 'Model Transparency', description: 'Document all AI models used: provider, version, purpose, risk level.', completed: true, lastUpdated: '2026-03-25', updatedBy: 'admin@assaon.com' },
  { id: 'ai-2', category: 'eu_ai_act', title: 'Risk Assessment Documentation', description: 'Formal risk assessment uploaded and reviewed by legal.', completed: false, lastUpdated: '2026-03-18', updatedBy: 'admin@assaon.com' },
  { id: 'ai-3', category: 'eu_ai_act', title: 'Risk Classification', description: 'System classified under EU AI Act risk categories.', completed: true, lastUpdated: '2026-03-20', updatedBy: 'admin@assaon.com' },
  { id: 'ai-4', category: 'eu_ai_act', title: 'Human Oversight', description: 'Critical AI decisions require human approval before execution.', completed: false, lastUpdated: '2026-03-12', updatedBy: 'admin@assaon.com' },
  { id: 'ai-5', category: 'eu_ai_act', title: 'Automated Decision Monitoring', description: 'All AI-driven decisions are logged with confidence scores.', completed: true, lastUpdated: '2026-03-22', updatedBy: 'admin@assaon.com' },
  { id: 'ai-6', category: 'eu_ai_act', title: 'Incident Reporting System', description: 'Track and report AI system failures within 72 hours per regulation.', completed: false, lastUpdated: '2026-03-05', updatedBy: 'admin@assaon.com' },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMissionControl() {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'compliance'>('users');
  const [filters, setFilters] = useState<FilterParams>({ search: '', status: '', industry: '', sortBy: 'registeredAt', sortDir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [gdprItems, setGdprItems] = useState<ComplianceItem[]>(GDPR_ITEMS);
  const [euAiItems, setEuAiItems] = useState<ComplianceItem[]>(EU_AI_ITEMS);

  const PAGE_SIZE = 20;

  const filteredUsers = useMemo(() => {
    let result = [...MOCK_USERS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(u => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter(u => u.status === filters.status);
    if (filters.industry) result = result.filter(u => u.industry === filters.industry);

    result.sort((a, b) => {
      let av: string | number = a[filters.sortBy as keyof User] as string | number;
      let bv: string | number = b[filters.sortBy as keyof User] as string | number;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [filters]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const analytics = {
    totalUsers: MOCK_USERS.length,
    activeUsers: MOCK_USERS.filter(u => u.status === 'active').length,
    totalMrr: Math.round(MOCK_USERS.reduce((s, u) => s + u.mrr, 0)),
    churnRate: 2.3,
  };

  function updateFilter(key: keyof FilterParams, value: string) {
    setFilters(f => ({ ...f, [key]: value }));
    setCurrentPage(1);
  }

  function toggleSort(col: string) {
    setFilters(f => ({ ...f, sortBy: col, sortDir: f.sortBy === col && f.sortDir === 'asc' ? 'desc' : 'asc' }));
  }

  function toggleCompliance(id: string) {
    const update = (items: ComplianceItem[]) =>
      items.map(i => i.id === id ? { ...i, completed: !i.completed, lastUpdated: new Date().toISOString().split('T')[0] } : i);
    if (id.startsWith('gdpr')) setGdprItems(update);
    else setEuAiItems(update);
  }

  return {
    activeTab, setActiveTab,
    filters, updateFilter, toggleSort,
    pagedUsers, filteredUsers, totalPages, currentPage, setCurrentPage, PAGE_SIZE,
    selectedUser, setSelectedUser,
    gdprItems, euAiItems, toggleCompliance,
    analytics,
    INDUSTRIES,
  };
}
