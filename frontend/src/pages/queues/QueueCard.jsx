import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { Clock, ArrowRight, Play, CheckCircle, X, Navigation } from 'lucide-react';

const SERVICE_POINTS = [
  { id: 'lab', label: 'Laboratory', icon: '🔬', description: 'Blood tests, urinalysis, etc.' },
  { id: 'rad', label: 'Radiology', icon: '🩻', description: 'X-Ray, CT scan, Ultrasound, MRI' },
  { id: 'rx', label: 'Pharmacy', icon: '💊', description: 'Collect prescribed medications' },
  { id: 'nurse', label: 'Nursing Station', icon: '🩺', description: 'Vital signs, wound care, injections' },
  { id: 'cashier', label: 'Cashier / Billing', icon: '🧾', description: 'Payment and billing' },
  { id: 'admission', label: 'Admission Desk', icon: '🛏️', description: 'Patient to be admitted' },
  { id: 'discharge', label: 'Discharge', icon: '✅', description: 'Patient cleared to go home' },
];

const NextServiceModal = ({ ticket, onConfirm, onClose }) => {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Complete & Add to Queue</h2>
            <p className="text-white/80 text-sm mt-0.5">
              <span className="font-mono font-bold">{ticket.ticketId}</span> — {ticket.patientName}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Service Point Selection */}
        <div className="p-5">
          <p className="text-sm font-medium text-clay-600 mb-3">Select next queue for this patient:</p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {SERVICE_POINTS.map(sp => (
              <button
                key={sp.id}
                onClick={() => setSelected(sp)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                  selected?.id === sp.id
                    ? 'border-primary bg-primary/5'
                    : 'border-silver-200 hover:border-silver-400 bg-white'
                }`}
              >
                <span className="text-2xl w-8 shrink-0 text-center">{sp.icon}</span>
                <div className="min-w-0">
                  <div className={`font-bold text-sm ${selected?.id === sp.id ? 'text-primary' : 'text-slate-800'}`}>
                    {sp.label}
                  </div>
                  <div className="text-xs text-clay-500 truncate">{sp.description}</div>
                </div>
                {selected?.id === sp.id && (
                  <CheckCircle className="w-5 h-5 text-primary ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 pb-5 flex gap-3 justify-end border-t border-silver-100 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className={`flex items-center gap-2 ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Navigation className="w-4 h-4" />
            Add to {selected ? selected.label : '...'} Queue
          </Button>
        </div>
      </div>
    </div>
  );
};

const QueueCard = ({ ticket, onCall, onComplete, canInteract = true }) => {
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'Emergency':
        return 'border-red-500 bg-red-50 text-red-800 shadow-sm border-l-4';
      case 'High':
        return 'border-orange-400 bg-orange-50 text-orange-800 shadow-sm border-l-4';
      default:
        return 'border-silver-200 bg-white shadow-sm border-l-4 border-l-blue-400';
    }
  };

  const isWarning = ticket.waitMins >= 45;

  const handleQueue = async (servicePoint) => {
    setSubmitting(true);
    try {
      // 1. Mark as complete/transferred in backend
      await tokenApi.completeToken(ticket.id, servicePoint.id);
      
      // 2. Local TTS or routing notification
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(
          `Ticket ${ticket.ticketId.replace('-', ' ')}, please proceed to ${servicePoint.label}.`
        );
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
      }

      setShowRouteModal(false);
      if (onComplete) onComplete(ticket, servicePoint);
    } catch (err) {
      console.error('Error completing token:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showRouteModal && (
        <NextServiceModal
          ticket={ticket}
          onConfirm={handleQueue}
          onClose={() => setShowRouteModal(false)}
        />
      )}

      <div className={`rounded-xl overflow-hidden transition-all hover:shadow-md ${getPriorityStyles(ticket.priority)} ${submitting ? 'opacity-70 pointer-events-none' : ''}`}>
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-mono text-xl font-bold">{ticket.ticketId}</span>
              <div className={`text-xs uppercase font-bold tracking-wider mt-1 ${ticket.priority === 'Emergency' ? 'text-red-600' : ticket.priority === 'High' ? 'text-orange-600' : 'text-blue-600'}`}>
                ◆ {ticket.priority} Priority
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border font-medium text-sm shadow-sm ${isWarning ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' : 'bg-white text-slate-700 border-silver-300'}`}>
              <Clock className="w-4 h-4" />
              {ticket.waitMins} min
            </div>
          </div>

          {/* Patient Details */}
          <div className="mt-3 flex-1">
            <h4 className="font-bold text-slate-800">{ticket.patientName}</h4>
            <p className="text-sm text-slate-600 font-mono">{ticket.patientId}</p>
            {ticket.reason && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic border-l-2 border-silver-300 pl-2">{ticket.reason}</p>
            )}
          </div>

          {/* Actions */}
          {canInteract && (
            <div className="mt-5 pt-3 border-t border-black/5 flex justify-between items-center">
              <div className="flex gap-2">
                {ticket.status === 'Waiting' && (
                  <Button size="sm" onClick={onCall} disabled={submitting} className="flex items-center gap-1.5 px-3">
                    <Play className="w-3.5 h-3.5 fill-current" /> Call
                  </Button>
                )}
                {(ticket.status === 'In Progress' || ticket.status === 'Called') && (
                  <Button
                    size="sm"
                    onClick={() => setShowRouteModal(true)}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-3 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" /> Complete & Queue
                  </Button>
                )}
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-black/5 text-slate-700">
                {ticket.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QueueCard;
