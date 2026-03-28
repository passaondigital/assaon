import React, { useState } from 'react';
import type { Invoice } from '../../hooks/useBilling';

interface Props {
  invoices: Invoice[];
  allInvoices: Invoice[];
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export default function InvoiceHistory({ invoices, allInvoices, page, totalPages, pageSize, onPageChange }: Props) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  function downloadMock(inv: Invoice) {
    const content = `INVOICE\n${inv.invoiceNumber}\nDate: ${inv.date}\nAmount: €${inv.amount.toFixed(2)}\nTax: €${inv.tax.toFixed(2)}\nTotal: €${(inv.amount + inv.tax).toFixed(2)}\nStatus: ${inv.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, allInvoices.length);

  return (
    <div className="bl-section">
      <div className="bl-section__header">
        <h3>Invoice History</h3>
        <span className="bl-count">{allInvoices.length} invoices</span>
      </div>

      <div className="bl-table-wrap">
        <table className="bl-table">
          <thead><tr><th>Date</th><th>Invoice #</th><th>Amount</th><th>Tax</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td className="bl-table__dim">{inv.date}</td>
                <td><code className="bl-code">{inv.invoiceNumber}</code></td>
                <td>€{inv.amount.toFixed(2)}</td>
                <td className="bl-table__dim">€{inv.tax.toFixed(2)}</td>
                <td className="bl-table__bold">€{(inv.amount + inv.tax).toFixed(2)}</td>
                <td><span className={`bl-badge bl-badge--${inv.status === 'paid' ? 'ok' : inv.status === 'pending' ? 'warn' : 'err'}`}>{inv.status}</span></td>
                <td>
                  <div className="bl-table__actions">
                    <button className="action-btn-sm" onClick={() => setSelectedInvoice(inv)}>View</button>
                    <button className="action-btn-sm" onClick={() => downloadMock(inv)}>📥 PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bl-pagination">
        <span className="bl-pagination__info">Showing {start}–{end} of {allInvoices.length}</span>
        <div className="bl-pagination__controls">
          <button className="bl-page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`bl-page-btn ${page === p ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
          ))}
          <button className="bl-page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next →</button>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="bl-modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal__header">
              <div>
                <h3>{selectedInvoice.invoiceNumber}</h3>
                <span className="bl-modal__sub">{selectedInvoice.date}</span>
              </div>
              <button className="bl-modal__close" onClick={() => setSelectedInvoice(null)}>✕</button>
            </div>
            <div className="bl-modal__body">
              <div className="inv-detail-grid">
                <div><label>Status</label><span className={`bl-badge bl-badge--${selectedInvoice.status === 'paid' ? 'ok' : 'warn'}`}>{selectedInvoice.status}</span></div>
                <div><label>Due Date</label><span>{selectedInvoice.date}</span></div>
                <div><label>Payment</label><span>Visa •••• 4242</span></div>
              </div>
              <table className="bl-table" style={{ marginBottom: 12 }}>
                <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
                <tbody>
                  {selectedInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>€{item.unitPrice.toFixed(2)}</td>
                      <td>€{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="inv-totals">
                <div className="inv-total-row"><span>Subtotal</span><span>€{selectedInvoice.amount.toFixed(2)}</span></div>
                <div className="inv-total-row"><span>Tax (DE 19%)</span><span>€{selectedInvoice.tax.toFixed(2)}</span></div>
                <div className="inv-total-row inv-total-row--total"><span>Total</span><span>€{(selectedInvoice.amount + selectedInvoice.tax).toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bl-modal__footer">
              <button className="btn btn--secondary btn--sm" onClick={() => downloadMock(selectedInvoice)}>📥 Download PDF</button>
              <button className="btn btn--secondary btn--sm" onClick={() => window.print()}>🖨️ Print</button>
              <button className="btn btn--primary btn--sm" onClick={() => setSelectedInvoice(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
