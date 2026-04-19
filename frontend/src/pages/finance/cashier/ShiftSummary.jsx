import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../../../context/PatientContext';
import HMSLayout from '../../../components/layout/HMSLayout';
import HMSTopBar from '../../../components/layout/HMSTopBar';
import { EmptyState } from '../../../components/common/HMSComponents';
import { T, HOSPITAL_INFO } from '../../../utils/hmsConstants';
import { fmtKES, printReceipt } from '../../../utils/hmsHelpers';
import { exportExcel, exportPDF } from './ExportReport';

// ─── Payment method config ────────────────────────────────────────────────────
const METHOD_CONFIG = {
  'Cash': { icon: '💵', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', bar: '#22c55e' },
  'M-Pesa': { icon: '📲', bg: '#f0fdf4', color: '#14532d', border: '#86efac', bar: '#16a34a' },
  'POS / Card': { icon: '💳', bg: '#eff6ff', color: '#1e3a8a', border: '#bfdbfe', bar: '#3b82f6' },
  'Cheque': { icon: '📋', bg: '#fffbeb', color: '#78350f', border: '#fde68a', bar: '#f59e0b' },
};
const ALL_METHODS = Object.keys(METHOD_CONFIG);

// ─── Shared style objects ─────────────────────────────────────────────────────
const S = {
  card: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,.05)',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#94a3b8',
    marginBottom: 16,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
  },
  ghostBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
    border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer',
  },
  greenBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
    border: 'none', background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', cursor: 'pointer',
  },
  smallGhostBtn: {
    padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 600,
    border: '1px solid #e2e8f0', background: '#fff', color: '#475569', cursor: 'pointer',
  },
  smallGreenBtn: {
    padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
    border: 'none', background: '#059669', color: '#fff', cursor: 'pointer',
  },
  input: {
    flex: 2, minWidth: 150,
    border: '1px solid #e2e8f0', borderRadius: 10,
    padding: '7px 12px', fontSize: 12, color: '#334155',
    outline: 'none', background: '#fff',
  },
  select: {
    flex: 1, minWidth: 130,
    border: '1px solid #e2e8f0', borderRadius: 10,
    padding: '7px 12px', fontSize: 12, fontWeight: 600, color: '#334155',
    outline: 'none', background: '#fff',
  },
  th: {
    padding: '11px 14px',
    fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#94a3b8', background: '#f8fafc',
    whiteSpace: 'nowrap', textAlign: 'left',
  },
  td: { padding: '11px 14px', fontSize: 12 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accentBg, accentBorder }) {
  return (
    <div style={{ ...S.card, background: accentBg || '#fff', borderColor: accentBorder || '#e2e8f0' }}>
      <div style={S.sectionLabel}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: T.navy, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function MethodBar({ label, amount, total }) {
  const cfg = METHOD_CONFIG[label] || { icon: '💰', bar: '#94a3b8' };
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{cfg.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>{label}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#1e293b' }}>{fmtKES(amount)}</span>
        </div>
        <div style={{ height: 7, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, background: cfg.bar, width: `${pct}%` }} />
        </div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{pct}% of total</div>
      </div>
    </div>
  );
}

function MethodBadge({ method }) {
  const cfg = METHOD_CONFIG[method] || { icon: '💰', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.icon} {method}
    </span>
  );
}

function InfoRow({ label, value, mono, valueStyle }) {
  return (
    <div style={S.infoRow}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#1e293b', fontFamily: mono ? "'DM Mono',monospace" : undefined, ...valueStyle }}>
        {value}
      </span>
    </div>
  );
}

// ─── Receipt Modal ─────────────────────────────────────────────────────────────

function ReceiptModal({ rec, onClose }) {
  if (!rec) return null;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(7,24,40,.65)', backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 420,
        boxShadow: '0 32px 80px rgba(0,0,0,.35)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071828 0%, #0d3259 100%)',
          padding: '28px 32px 24px', textAlign: 'center', color: '#fff',
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '.02em' }}>{HOSPITAL_INFO.name}</div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: .65, marginTop: 2 }}>{HOSPITAL_INFO.branch}</div>
          <div style={{ fontSize: 10, opacity: .45, marginTop: 4, lineHeight: 1.6 }}>
            {HOSPITAL_INFO.address} · {HOSPITAL_INFO.phone}
          </div>
          <div style={{ display: 'inline-block', marginTop: 14, background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '5px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Official Receipt</div>
          </div>
          <div style={{ fontSize: 10, opacity: .45, marginTop: 4, fontFamily: "'DM Mono',monospace" }}>
            {rec.id} · Shift: {rec.shiftId}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Patient */}
          <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InfoRow label="Patient ID" value={rec.patientId || '—'} mono />
            <InfoRow label="Patient" value={`${rec.patient}${rec.age ? ` (${rec.age} yrs)` : ''}`} />
            <InfoRow label="Bill No" value={rec.billNo || rec.invoiceNo || '—'} mono />
          </div>

          {/* Items */}
          {rec.items?.length > 0 && (
            <div>
              <div style={{ ...S.sectionLabel, marginBottom: 8 }}>Itemized Services</div>
              <div style={{ border: '1px solid #f1f5f9', borderRadius: 10, maxHeight: 140, overflowY: 'auto' }}>
                {rec.items.map((it, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 14px', fontSize: 12,
                    borderBottom: idx < rec.items.length - 1 ? '1px solid #f8fafc' : 'none',
                  }}>
                    <span style={{ color: '#334155', flex: 1 }}>{it.qty}× {it.name}</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{fmtKES(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Method</span>
              <MethodBadge method={rec.method} />
            </div>
            {rec.ref && <InfoRow label="Reference" value={rec.ref} mono />}
            {rec.discount > 0 && (
              <InfoRow label="Discount" value={`-${fmtKES(rec.discount)}`} valueStyle={{ color: '#dc2626', fontWeight: 800 }} />
            )}
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 14, padding: '14px 18px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>Total Paid</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#15803d' }}>{fmtKES(rec.amount)}</span>
          </div>

          <InfoRow label="Served By" value={rec.cashier || '—'} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 12, padding: '0 32px 28px' }}>
          <button onClick={onClose} style={{ ...S.ghostBtn, flex: 1, justifyContent: 'center' }}>Close</button>
          <button
            onClick={() => { printReceipt(rec, true); onClose(); }}
            style={{ ...S.greenBtn, flex: 2, justifyContent: 'center' }}
          >
            🖨 Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ShiftSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shifts } = usePatients();

  const [q, setQ] = useState('');
  const [method, setMethod] = useState('');
  const [viewRec, setViewRec] = useState(null);

  const shift = shifts.find(s => s.id === id);

  // All hooks declared before any conditional return ─────────────────────────
  const totals = useMemo(() => {
    if (!shift) return {};
    return ALL_METHODS.reduce((acc, m) => {
      acc[m] = shift.receipts.filter(r => r.method === m).reduce((s, r) => s + r.amount, 0);
      return acc;
    }, {});
  }, [shift]);

  const grandTotal = useMemo(() => Object.values(totals).reduce((a, b) => a + b, 0), [totals]);

  const filteredReceipts = useMemo(() => {
    if (!shift) return [];
    return shift.receipts.filter(r => {
      const ql = q.toLowerCase();
      const matchQ = !q
        || r.patient.toLowerCase().includes(ql)
        || r.id.toLowerCase().includes(ql)
        || (r.patientId && r.patientId.toLowerCase().includes(ql));
      const matchM = !method || r.method === method;
      return matchQ && matchM;
    });
  }, [shift, q, method]);

  const filteredTotal = useMemo(
    () => filteredReceipts.reduce((s, r) => s + r.amount, 0),
    [filteredReceipts]
  );

  // Not found ────────────────────────────────────────────────────────────────
  if (!shift) {
    return (
      <HMSLayout>
        <HMSTopBar
          title="Shift Not Found"
          action={<button onClick={() => navigate('/hms/cashier')} style={S.ghostBtn}>← Dashboard</button>}
        />
        <div style={{ padding: 40 }}>
          <EmptyState icon="❓" msg="The requested shift record could not be found." />
        </div>
      </HMSLayout>
    );
  }

  const isClosed = !!shift.closedAt;
  const duration = isClosed
    ? Math.round((new Date(shift.closedAt) - new Date(shift.openedAt)) / 60000)
    : null;

  return (
    <HMSLayout>
      <HMSTopBar
        title={`Shift Summary · ${shift.id}`}
        subtitle={`${shift.officer} · ${new Date(shift.openedAt).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
        action={<button onClick={() => navigate('/hms/cashier')} style={S.ghostBtn}>← Back to Dashboard</button>}
      />

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── KPI strip ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <KpiCard label="Opening Float" value={fmtKES(shift.float)} sub="Starting cash" />
          <KpiCard label="Total Collection" value={fmtKES(grandTotal)} sub={`${shift.receipts.length} transactions`} accentBg="#f0fdf4" accentBorder="#bbf7d0" />
          <KpiCard label="Net Expected" value={fmtKES(grandTotal + shift.float)} sub="Float + collections" accentBg="#eff6ff" accentBorder="#bfdbfe" />
          <KpiCard
            label="Shift Status"
            value={isClosed ? 'Closed' : '🟢 Running'}
            sub={isClosed && duration ? `${duration} min duration` : 'Ongoing'}
            accentBg={isClosed ? '#f8fafc' : '#fffbeb'}
            accentBorder={isClosed ? '#e2e8f0' : '#fde68a'}
          />
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Payment breakdown */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Payment Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ALL_METHODS.map(m => (
                  <MethodBar key={m} label={m} amount={totals[m] || 0} total={grandTotal} />
                ))}
                <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 900 }}>
                  <span style={{ color: '#475569' }}>Grand Total</span>
                  <span style={{ color: '#059669' }}>{fmtKES(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Shift details */}
            <div style={S.card}>
              <div style={S.sectionLabel}>Shift Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow label="Cashier" value={shift.officer} />
                <InfoRow label="Opened At" value={new Date(shift.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <InfoRow
                  label="Closed At"
                  value={isClosed ? new Date(shift.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Still Running'}
                  valueStyle={!isClosed ? { color: '#d97706' } : {}}
                />
                {duration !== null && <InfoRow label="Duration" value={`${duration} minutes`} />}
                <InfoRow label="Transactions" value={shift.receipts.length} />
              </div>
            </div>

          </div>

          {/* Transaction table */}
          <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>

            {/* Toolbar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              justifyContent: 'space-between', gap: 12,
              padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>🧾 Transaction Log</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  Showing {filteredReceipts.length} of {shift.receipts.length} transactions
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => exportExcel({ shift, filteredReceipts, totals, grandTotal })} style={S.ghostBtn}>
                  📊 Excel
                </button>
                <button onClick={() => exportPDF({ shift, filteredReceipts, totals, grandTotal })} style={S.greenBtn}>
                  📄 PDF
                </button>
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search patient or receipt…"
                style={S.input}
              />
              <select value={method} onChange={e => setMethod(e.target.value)} style={S.select}>
                <option value="">All Methods</option>
                {ALL_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Time</th>
                    <th style={S.th}>Receipt No</th>
                    <th style={S.th}>Bill No</th>
                    <th style={S.th}>Patient ID</th>
                    <th style={S.th}>Patient Name</th>
                    <th style={S.th}>Method</th>
                    <th style={S.th}>Ref</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Amount</th>
                    <th style={S.th}>Served By</th>
                    <th style={{ ...S.th, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                        No transactions match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((r, i) => (
                      <tr
                        key={r.id}
                        style={{ borderBottom: i < filteredReceipts.length - 1 ? '1px solid #f8fafc' : 'none', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0fdfa')}
                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfc')}
                      >
                        <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {new Date(r.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", fontWeight: 800, color: T.navy, fontSize: 11, whiteSpace: 'nowrap' }}>
                          {r.id}
                        </td>
                        <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#64748b', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {r.billNo || r.invoiceNo || '—'}
                        </td>
                        <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#64748b', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {r.patientId || '—'}
                        </td>
                        <td style={{ ...S.td, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>
                          {r.patient}
                        </td>
                        <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                          <MethodBadge method={r.method} />
                        </td>
                        <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#94a3b8', fontSize: 11 }}>
                          {r.ref || <span style={{ opacity: 0.3 }}>—</span>}
                        </td>
                        <td style={{ ...S.td, textAlign: 'right', fontWeight: 900, color: '#1e293b', whiteSpace: 'nowrap' }}>
                          {fmtKES(r.amount)}
                        </td>
                        <td style={{ ...S.td, color: '#64748b', whiteSpace: 'nowrap' }}>
                          {r.cashier || '—'}
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <button onClick={() => setViewRec(r)} style={S.smallGhostBtn}>👁 View</button>
                            <button onClick={() => printReceipt(r, true)} style={S.smallGreenBtn}>🖨 Print</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            {filteredReceipts.length > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10,
                padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc',
              }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                  {q || method ? 'Filtered' : 'Shift'} Total:
                </span>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#059669' }}>
                  {fmtKES(filteredTotal)}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal rec={viewRec} onClose={() => setViewRec(null)} />
    </HMSLayout>
  );
}