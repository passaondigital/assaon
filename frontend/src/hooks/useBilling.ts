import { useState } from 'react';

export interface Subscription {
  id: string;
  planId: string;
  planName: 'starter' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'paused' | 'past_due' | 'cancelled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  mrr: number;
  features: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  tax: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  brand: string;
}

export interface UsageMeter {
  id: string;
  name: string;
  unit: string;
  unitPrice: number;
  currentUsage: number;
  includedAmount: number;
  overageCharges: number;
  resetDate: string;
}

export interface RevenueMetrics {
  mrr: number; arr: number; cac: number; ltv: number;
  churnRate: number; nrr: number;
  activeCustomers: number; newCustomers: number; churnedCustomers: number;
}

export interface CohortRow {
  cohort: string;
  cohortSize: number;
  w1: number; w4: number; w8: number; w12: number; w24: number; w52: number | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PLANS = {
  starter:      { name: 'Starter',      mrr: 9,    features: ['1 Projekt', 'Free Models', 'Community Support', '1 GB Storage', 'Basic Analytics'] },
  professional: { name: 'Professional', mrr: 29,   features: ['5 Projekte', 'All Models (Claude, Mistral, Groq)', 'Webhooks & API Keys', 'Priority Support', 'Custom Branding', '10 GB Storage'] },
  enterprise:   { name: 'Enterprise',   mrr: 99,   features: ['Unlimited Projekte', 'All Models + Fine-tuning', 'Dedicated Support', 'SSO/SAML', 'SLA 99.9%', '100 GB Storage', 'Custom Domain'] },
  custom:       { name: 'Custom',       mrr: 499,  features: ['Everything in Enterprise', 'White-label', 'On-premise option', 'Custom Contracts', 'Dedicated CSM'] },
};

const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub_1234',
  planId: 'professional',
  planName: 'professional',
  status: 'active',
  currentPeriodStart: '2026-03-28T00:00:00Z',
  currentPeriodEnd: '2026-04-28T00:00:00Z',
  mrr: 29,
  features: PLANS.professional.features,
};

function genInvoices(count: number): Invoice[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date('2026-03-28');
    date.setMonth(date.getMonth() - i);
    const amount = 29;
    const tax = Math.round(amount * 0.19 * 100) / 100;
    return {
      id: `inv-${i + 1}`,
      invoiceNumber: `INV-2026-${String(i + 1).padStart(5, '0')}`,
      date: date.toISOString().split('T')[0],
      amount,
      tax,
      status: i === 2 ? 'pending' : 'paid',
      items: [{ description: `Professional Plan (${date.toLocaleDateString('de-DE', { month: '2-digit', day: '2-digit' })} - ${new Date(date.getTime() + 30 * 86400000).toLocaleDateString('de-DE', { month: '2-digit', day: '2-digit' })})`, quantity: 1, unitPrice: amount, amount }],
    };
  });
}

const MOCK_INVOICES = genInvoices(24);

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-1', type: 'card', last4: '4242', expiryMonth: 12, expiryYear: 2026, isDefault: true, brand: 'Visa' },
  { id: 'pm-2', type: 'card', last4: '5678', expiryMonth: 6,  expiryYear: 2027, isDefault: false, brand: 'Mastercard' },
];

const MOCK_METERS: UsageMeter[] = [
  { id: 'meter-api',     name: 'API Calls',     unit: 'calls',    unitPrice: 0.001, currentUsage: 12345, includedAmount: 100000, overageCharges: 0,    resetDate: '2026-04-28' },
  { id: 'meter-wh',      name: 'Webhooks',      unit: 'events',   unitPrice: 0.002, currentUsage: 234,   includedAmount: 1000,   overageCharges: 0,    resetDate: '2026-04-28' },
  { id: 'meter-storage', name: 'Data Storage',  unit: 'GB',       unitPrice: 0.10,  currentUsage: 2.3,   includedAmount: 10,     overageCharges: 0,    resetDate: '2026-04-28' },
];

export const MOCK_REVENUE: RevenueMetrics = {
  mrr: 32456, arr: 389472, cac: 45.23, ltv: 1456.78,
  churnRate: 2.3, nrr: 115,
  activeCustomers: 1234, newCustomers: 89, churnedCustomers: 28,
};

export const COHORT_DATA: CohortRow[] = [
  { cohort: 'Jan 2026', cohortSize: 234, w1: 100, w4: 92, w8: 85, w12: 78, w24: 68, w52: 45 },
  { cohort: 'Feb 2026', cohortSize: 267, w1: 100, w4: 91, w8: 84, w12: 77, w24: 65, w52: null },
  { cohort: 'Mar 2026', cohortSize: 289, w1: 100, w4: 93, w8: 87, w12: 80, w24: null, w52: null },
  { cohort: 'Apr 2026', cohortSize: 312, w1: 100, w4: 90, w8: 83, w12: null, w24: null, w52: null },
  { cohort: 'May 2026', cohortSize: 298, w1: 100, w4: 88, w8: null, w12: null, w24: null, w52: null },
  { cohort: 'Jun 2026', cohortSize: 321, w1: 100, w4: null, w8: null, w12: null, w24: null, w52: null },
];

export const MRR_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MRR_ACTUAL =     [25000, 27500, 29000, 30200, 31450, 32456, null, null, null, null, null, null];
export const MRR_PROJECTED =  [25000, 27500, 29000, 30200, 31450, 32456, 34000, 36200, 38500, 40800, 43100, 45234];
export const MRR_STARTER =    [2000,  2200,  2400,  2500,  2600,  2700,  2800,  2900,  3000,  3100,  3200,  3300];
export const MRR_PRO =        [15000, 16800, 18000, 18900, 19800, 20700, 21500, 22300, 23200, 24100, 25000, 25900];
export const MRR_ENT =        [8000,  8500,  8600,  8800,  9050,  9056,  9700,  11000, 12300, 13600, 14900, 16034];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBilling() {
  const [activeTab, setActiveTab] = useState<'portal' | 'revenue' | 'cohorts' | 'predictive' | 'usage'>('portal');
  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [usageMeters] = useState<UsageMeter[]>(MOCK_METERS);
  const [forecastScenario, setForecastScenario] = useState<'conservative' | 'base' | 'optimistic'>('base');
  const [invoicePage, setInvoicePage] = useState(1);
  const INVOICE_PAGE_SIZE = 10;

  const pagedInvoices = invoices.slice((invoicePage - 1) * INVOICE_PAGE_SIZE, invoicePage * INVOICE_PAGE_SIZE);
  const totalInvoicePages = Math.ceil(invoices.length / INVOICE_PAGE_SIZE);

  function upgradePlan(planId: 'starter' | 'professional' | 'enterprise' | 'custom') {
    const plan = { starter: 9, professional: 29, enterprise: 99, custom: 499 };
    setSubscription(s => ({ ...s, planId, planName: planId, mrr: plan[planId] }));
  }

  function cancelSubscription() {
    setSubscription(s => ({ ...s, status: 'cancelled', cancelledAt: new Date().toISOString() }));
  }

  function pauseSubscription() {
    setSubscription(s => ({ ...s, status: 'paused' }));
  }

  function setDefaultPayment(id: string) {
    setPaymentMethods(ms => ms.map(m => ({ ...m, isDefault: m.id === id })));
  }

  function removePayment(id: string) {
    setPaymentMethods(ms => ms.filter(m => m.id !== id));
  }

  function getForecastData() {
    const multiplier = forecastScenario === 'conservative' ? 0.85 : forecastScenario === 'optimistic' ? 1.18 : 1;
    return MRR_PROJECTED.map((v, i) => v === null ? null : i < 6 ? v : Math.round(v * multiplier));
  }

  return {
    activeTab, setActiveTab,
    subscription, upgradePlan, cancelSubscription, pauseSubscription,
    invoices: pagedInvoices, allInvoices: invoices, invoicePage, setInvoicePage, totalInvoicePages, INVOICE_PAGE_SIZE,
    paymentMethods, setDefaultPayment, removePayment,
    usageMeters,
    revenue: MOCK_REVENUE,
    cohortData: COHORT_DATA,
    forecastScenario, setForecastScenario, getForecastData,
    PLANS,
  };
}
