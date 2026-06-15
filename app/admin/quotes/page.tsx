'use client';

import { useState, useEffect } from 'react';
import { getQuotes, getQuoteById, updateQuoteStatus, sendQuoteToCustomer } from '@/app/actions/admin/quotes';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-warning-background text-warning-foreground' },
  { value: 'quoted', label: 'Quoted', color: 'bg-info-background text-info-foreground' },
  { value: 'converted', label: 'Converted', color: 'bg-success-background text-success-foreground' },
  { value: 'expired', label: 'Expired', color: 'bg-error-background text-error-foreground' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'converted', label: 'Converted' },
  { value: 'expired', label: 'Expired' },
];

export default function AdminQuotesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [modalStatus, setModalStatus] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quotesData, setQuotesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sendingQuote, setSendingQuote] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const data = await getQuotes({ status: statusFilter !== 'all' ? statusFilter : undefined, page, search: search || undefined });
      setQuotesData(data);
    } catch (e) {
      console.error('Failed to load quotes:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadQuotes();
  };

  useEffect(() => { loadQuotes(); }, [page, statusFilter]);

  const handleStatusChange = async (quoteId: number, newStatus: string) => {
    await updateQuoteStatus(quoteId, { status: newStatus });
    loadQuotes();
    setSuccessMessage(`Status updated to ${newStatus}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewDetails = async (quoteId: number) => {
    const quote = await getQuoteById(quoteId);
    setSelectedQuote(quote);
    setModalStatus(quote.status);
    setFinalPrice(quote.finalPrice || '');
    setAdminNotes(quote.adminNotes || '');
    setShowModal(true);
  };

  const handleSaveDetails = async () => {
    if (selectedQuote) {
      await updateQuoteStatus(selectedQuote.id, {
        finalPrice: finalPrice || undefined,
        adminNotes: adminNotes || undefined,
        status: modalStatus,
      });
      setSuccessMessage('Quote details updated');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadQuotes();
      setShowModal(false);
    }
  };

  const handleSendQuote = async (quoteId: number) => {
    setSendingQuote(quoteId);
    try {
      await sendQuoteToCustomer(quoteId);
      setSuccessMessage('Quote sent to customer');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadQuotes();
      setShowModal(false);
    } catch (e) {
      console.error('Failed to send quote:', e);
    } finally {
      setSendingQuote(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quote Requests</h1>
            <p className="text-muted-foreground">Manage and respond to customer quote requests</p>
          </div>
          <button
            onClick={loadQuotes}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg transition-colors font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-success/20 border border-border rounded-lg text-success">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, quote number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 bg-muted border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => { setStatusFilter(filter.value); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading...</div>
          ) : !quotesData?.quotes?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              <svg className="w-16 h-16 mx-auto mb-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No quote requests found</p>
              <p className="text-sm mt-1">Quotes will appear here when customers submit requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Quote #</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Interest</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Qty</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Budget</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotesData.quotes.map((quote: any) => {
                    const statusColor = STATUS_OPTIONS.find(s => s.value === quote.status)?.color || '';
                    return (
                      <tr key={quote.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-mono text-sm text-primary">{quote.quoteNumber}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-foreground text-sm">{quote.firstName} {quote.lastName}</div>
                          <div className="text-xs text-muted-foreground">{quote.email}</div>
                          {quote.company && <div className="text-xs text-muted-foreground">{quote.company}</div>}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground capitalize">{quote.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground truncate max-w-[150px] block">{quote.specificInterest || '—'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{quote.quantity}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{quote.budgetRange || '—'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={quote.status}
                            onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusColor}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">{new Date(quote.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(quote.id)}
                              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-primary-foreground rounded text-xs font-medium transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {quotesData?.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, quotesData.total)} of {quotesData.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, quotesData.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (quotesData.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= quotesData.totalPages - 2) {
                    pageNum = quotesData.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(quotesData.totalPages, p + 1))}
                  disabled={page === quotesData.totalPages}
                  className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Quote Details</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedQuote.quoteNumber}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Name</span>
                    <p className="text-foreground font-medium">{selectedQuote.firstName} {selectedQuote.lastName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="text-foreground font-medium">{selectedQuote.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <p className="text-foreground font-medium">{selectedQuote.phone || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Company</span>
                    <p className="text-foreground font-medium">{selectedQuote.company || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Quote Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Category</span>
                    <p className="text-foreground font-medium capitalize">{selectedQuote.category}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Quantity</span>
                    <p className="text-foreground font-medium">{selectedQuote.quantity}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground">Specific Interest</span>
                    <p className="text-foreground font-medium">{selectedQuote.specificInterest || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Budget Range</span>
                    <p className="text-foreground font-medium">{selectedQuote.budgetRange || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <p className="text-foreground font-medium capitalize">{selectedQuote.status}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground">Customer Message</span>
                    <p className="text-foreground whitespace-pre-wrap">{selectedQuote.message || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Admin Fields */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Admin Response</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Final Price (₱)</label>
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      placeholder="Enter final price"
                      className="w-full px-3 py-2 bg-background border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes..."
                      rows={3}
                      className="w-full px-3 py-2 bg-background border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <div className="flex gap-2">
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="px-3 py-2 bg-muted border-border rounded-lg text-foreground text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => handleSendQuote(selectedQuote.id)}
                  disabled={sendingQuote === selectedQuote.id}
                  className="px-4 py-2 bg-success hover:bg-success/90 text-primary-foreground rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {sendingQuote === selectedQuote.id ? 'Sending...' : 'Send Quote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}