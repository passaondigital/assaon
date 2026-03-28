import React from 'react';
import { useBilling } from '../hooks/useBilling';
import BillingSidebar from '../components/billing/BillingSidebar';
import BillingPortalTab from '../components/billing/BillingPortalTab';
import RevenueAnalyticsTab from '../components/billing/RevenueAnalyticsTab';
import CohortAnalysisTab from '../components/billing/CohortAnalysisTab';
import PredictiveAnalyticsTab from '../components/billing/PredictiveAnalyticsTab';
import UsageMetersTab from '../components/billing/UsageMetersTab';
import '../styles/billing.scss';

const TAB_TITLES = {
  portal:     'Billing Portal',
  revenue:    'Revenue Analytics',
  cohorts:    'Cohort Analysis',
  predictive: 'Predictive Analytics',
  usage:      'Usage Meters',
};

export default function Phase5Billing() {
  const bl = useBilling();

  return (
    <div className="bl-layout">
      <BillingSidebar activeTab={bl.activeTab} onTabChange={bl.setActiveTab} />

      <div className="bl-main">
        <header className="bl-header">
          <div className="bl-header__left">
            <h1 className="bl-header__title">{TAB_TITLES[bl.activeTab]}</h1>
            <span className="bl-header__sub">assaon.com · Phase 5</span>
          </div>
          <div className="bl-header__right">
            <span className="bl-header__mrr">MRR: <strong>€{bl.revenue.mrr.toLocaleString()}</strong></span>
            <span className="bl-header__badge">● Live</span>
          </div>
        </header>

        <div className="bl-content">
          {bl.activeTab === 'portal' && (
            <BillingPortalTab
              subscription={bl.subscription}
              plans={bl.PLANS}
              invoices={bl.invoices}
              allInvoices={bl.allInvoices}
              invoicePage={bl.invoicePage}
              totalInvoicePages={bl.totalInvoicePages}
              pageSize={bl.INVOICE_PAGE_SIZE}
              onPageChange={bl.setInvoicePage}
              paymentMethods={bl.paymentMethods}
              usageMeters={bl.usageMeters}
              onUpgrade={bl.upgradePlan}
              onCancel={bl.cancelSubscription}
              onPause={bl.pauseSubscription}
              onSetDefault={bl.setDefaultPayment}
              onRemovePayment={bl.removePayment}
            />
          )}
          {bl.activeTab === 'revenue' && <RevenueAnalyticsTab metrics={bl.revenue} />}
          {bl.activeTab === 'cohorts' && <CohortAnalysisTab cohortData={bl.cohortData} />}
          {bl.activeTab === 'predictive' && (
            <PredictiveAnalyticsTab
              metrics={bl.revenue}
              scenario={bl.forecastScenario}
              onScenarioChange={bl.setForecastScenario}
              getForecastData={bl.getForecastData}
            />
          )}
          {bl.activeTab === 'usage' && <UsageMetersTab meters={bl.usageMeters} />}
        </div>
      </div>
    </div>
  );
}
