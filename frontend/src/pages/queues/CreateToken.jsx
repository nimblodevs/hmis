import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import {
  Search, Ticket, Printer, CheckCircle, CreditCard, Banknote,
  Stethoscope, Beaker, ScanLine, Pill, Heart, Activity,
  X, UserPlus, User, RefreshCw, ChevronRight, ChevronLeft,
  Building2, Scissors, Baby, Bone, Volume2, Sparkles, Droplet,
  Eye, Cpu, Dna
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import tokenApi from '../../api/tokenApi';

// ─── Config Data ─────────────────────────────────────────────────────────────

const PATIENT_TYPES = [
  {
    id: 'existing',
    label: 'Existing Patient',
    sub: 'Patient is registered and has a Hospital ID',
    icon: User,
    color: 'blue',
  },
  {
    id: 'new',
    label: 'New / Walk-in',
    sub: 'First-time visit — no Hospital ID yet',
    icon: UserPlus,
    color: 'green',
  },
  {
    id: 'review',
    label: 'Review / Follow-up',
    sub: 'Patient returning for a booked review or check-up',
    icon: RefreshCw,
    color: 'purple',
  },
];

const SERVICES = [
  { id: 'opd', label: 'General OPD', icon: Stethoscope, queue: 'OPD', prefix: 'OPD', sub: 'Walk-in general consultation' },
  { id: 'specialist', label: 'Specialist Clinic', icon: Building2, queue: 'OPD', prefix: 'SPC', sub: 'Choose a specialist department' },
  { id: 'lab', label: 'Laboratory', icon: Beaker, queue: 'Laboratory', prefix: 'LAB', sub: 'Blood tests, urinalysis, cultures' },
  { id: 'rad', label: 'Radiology / Imaging', icon: ScanLine, queue: 'Radiology', prefix: 'RAD', sub: 'X-Ray, CT, MRI, Ultrasound' },
  { id: 'rx', label: 'Pharmacy', icon: Pill, queue: 'Pharmacy', prefix: 'RX', sub: 'Collect prescribed medications' },
  { id: 'physio', label: 'Physiotherapy', icon: Activity, queue: 'OPD', prefix: 'PHY', sub: 'Rehabilitation and therapy' },
];

const SPECIALTIES = [
  { id: 'surgery', label: 'General Surgery', prefix: 'SRG', icon: Scissors },
  { id: 'internal', label: 'Internal Medicine', prefix: 'INT', icon: Activity },
  { id: 'cardiology', label: 'Cardiology', prefix: 'CRD', icon: Heart },
  { id: 'pediatrics', label: 'Paediatrics', prefix: 'PED', icon: Baby },
  { id: 'gynae', label: 'Gynaecology & Obstetrics', prefix: 'GYN', icon: User },
  { id: 'ortho', label: 'Orthopaedics', prefix: 'ORT', icon: Bone },
  { id: 'ent', label: 'ENT (Ear, Nose & Throat)', prefix: 'ENT', icon: Volume2 },
  { id: 'derma', label: 'Dermatology', prefix: 'DEM', icon: Sparkles },
  { id: 'urology', label: 'Urology', prefix: 'URO', icon: Droplet },
  { id: 'ophtha', label: 'Ophthalmology (Eye)', prefix: 'OPH', icon: Eye },
  { id: 'neuro', label: 'Neurology', prefix: 'NEU', icon: Cpu },
  { id: 'oncology', label: 'Oncology', prefix: 'ONC', icon: Dna },
];

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash / Out-of-Pocket', sub: 'Cash, Mobile Money (M-Pesa), or Cheque', icon: Banknote, color: 'green' },
  { id: 'credit', label: 'Insurance / Corporate', sub: 'SHA, Private Insurance, or Company Credit', icon: CreditCard, color: 'blue' },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEP_LABELS = ['Patient Type', 'Patient Details', 'Service', 'Payment'];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEP_LABELS.map((label, idx) => {
      const step = idx + 1;
      const isDone = step < currentStep;
      const isActive = step === currentStep;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
              isDone ? 'bg-primary border-primary text-white' :
              isActive ? 'bg-white border-primary text-primary shadow-md shadow-primary/20' :
              'bg-white border-silver-300 text-clay-400'
            }`}>
              {isDone ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-primary' : isDone ? 'text-primary/70' : 'text-clay-400'}`}>{label}</span>
          </div>
          {idx < STEP_LABELS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-5 mx-1 transition-all ${isDone ? 'bg-primary' : 'bg-silver-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Token Print View ─────────────────────────────────────────────────────────

const TokenPrintView = ({ token, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="bg-slate-800 text-white p-5 flex justify-between items-start">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Service Token</div>
          <div className="text-5xl font-mono font-black">{token.ticketId}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 mt-1"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-clay-500 uppercase font-medium">Patient</div>
            <div className="text-xs text-slate-500 font-mono">{token.patientId}</div>
          </div>
          <div>
            <div className="text-xs text-clay-500 uppercase font-medium">Type</div>
            <div className="font-bold text-slate-800">{token.visitType}</div>
          </div>
          <div>
            <div className="text-xs text-clay-500 uppercase font-medium">Service</div>
            <div className="font-bold text-slate-800">{token.service}</div>
            {token.specialty && (
              <div className="text-xs font-semibold text-primary mt-0.5">{token.specialty}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-clay-500 uppercase font-medium">Payment</div>
            <div className={`font-bold text-base ${token.paymentMethod === 'cash' ? 'text-green-700' : 'text-blue-700'}`}>
              {token.paymentMethod === 'cash' ? '💵 CASH' : '🏥 CREDIT'}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-clay-500 uppercase font-medium">Date & Time</div>
            <div className="font-bold text-slate-800">{token.date}</div>
          </div>
        </div>
        <div className="border-t border-dashed border-silver-300 pt-3 text-center text-xs text-clay-400">
          {(token.visitType === 'new' || token.patientId?.startsWith('WALK')) ? (
            <>Please proceed to the <strong>{token.queueDept}</strong> department and wait to be called.</>
          ) : (
            "Please wait to be called."
          )}
        </div>
      </div>
      <div className="px-5 pb-5 flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
        <Button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2">
          <Printer className="w-4 h-4" /> Print Token
        </Button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const CreateToken = () => {
  const { currentUser, ROLES } = useAuth();
  const [step, setStep] = useState(1);
  const [patientType, setPatientType] = useState('');
  const [patient, setPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', phone: '', gender: '' });
  const [reviewId, setReviewId] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [issuedToken, setIssuedToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const reset = () => {
    setStep(1); setPatientType(''); setPatient(null); setPatientSearch('');
    setNewPatient({ firstName: '', lastName: '', phone: '', gender: '' });
    setReviewId(''); setSelectedService(null); setSelectedSpecialty(null);
    setPaymentMethod(''); setIssuedToken(null);
    setLoading(false);
  };

  const handlePatientLookup = () => {
    if (patientSearch.trim().length < 3) return;
    setPatient({ name: 'Jane Smith', id: 'PT-100235', phone: '+254712345678', visitType: 'Existing Patient', isNew: false });
    next();
  };

  const handleNewPatient = async () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.phone) return;
    setLoading(true);
    try {
      const response = await tokenApi.registerWalkIn({
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        phone: newPatient.phone,
        gender: newPatient.gender
      });
      const data = response.data;
      setPatient({ 
        name: `${data.firstName} ${data.lastName}`, 
        id: data.patientId, 
        phone: data.phone, 
        visitType: 'New / Walk-in',
        isNew: true 
      });
      next();
    } catch (err) {
      console.error('Error registering walk-in:', err);
      // Fallback for demo if backend is not running
      const tempId = `WALK-${Math.floor(Math.random() * 9000) + 1000}`;
      setPatient({ name: `${newPatient.firstName} ${newPatient.lastName}`, id: tempId, phone: newPatient.phone, visitType: 'New / Walk-in', isNew: true });
      next();
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLookup = () => {
    if (reviewId.trim().length < 3) return;
    setPatient({ name: 'John Doe', id: reviewId.toUpperCase(), phone: '+254700000001', visitType: 'Review / Follow-up', reviewNote: 'Post-op check — Dr. Jenkins', isNew: false });
    next();
  };

  const handleIssueToken = async () => {
    if (!patient || !selectedService || !paymentMethod) return;
    setLoading(true);
    try {
      const service = SERVICES.find(s => s.id === selectedService);
      const specialtyObj = selectedService === 'specialist' ? SPECIALTIES.find(s => s.id === selectedSpecialty) : null;
      
      const response = await tokenApi.issueToken({
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        visitType: patientType,
        service: selectedService,
        specialty: specialtyObj ? specialtyObj.label : null,
        queueDept: service.queue,
        paymentMethod,
        ticketIdPrefix: specialtyObj ? specialtyObj.prefix : service.prefix
      });

      const tokenData = response.data;
      setIssuedToken({
        ...tokenData,
        date: new Date(tokenData.createdAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }),
      });
    } catch (err) {
      console.error('Error issuing token:', err);
      // Fallback for demo
      const now = new Date();
      const service = SERVICES.find(s => s.id === selectedService);
      const specialtyObj = selectedService === 'specialist' ? SPECIALTIES.find(s => s.id === selectedSpecialty) : null;
      const prefix = specialtyObj ? specialtyObj.prefix : service.prefix;
      const ticketNumber = Math.floor(Math.random() * 900) + 100;
      setIssuedToken({
        ticketId: `${prefix}-${ticketNumber}`,
        patientName: patient.name,
        patientId: patient.isNew ? `${patient.id} (Walk-in)` : patient.id,
        visitType: patient.visitType,
        service: selectedService === 'specialist' ? 'Specialist Clinic' : service.label,
        specialty: specialtyObj ? specialtyObj.label : null,
        queueDept: service.queue,
        paymentMethod,
        date: now.toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }),
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role !== ROLES.RECEPTIONIST && currentUser.role !== ROLES.ADMIN) {
    return (
      <div className="h-screen flex items-center justify-center flex-col text-clay-500 bg-silver-50">
        <div className="text-8xl mb-6 opacity-20">🛡️</div>
        <h2 className="text-3xl font-bold text-clay-700 mb-2">Access Restricted</h2>
        <p className="text-lg">Only the <b>Main Receptionist / Registrar</b> can issue new service tokens.</p>
        <Button className="mt-8 px-8" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-silver-50 p-6 md:p-12 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {issuedToken && <TokenPrintView token={issuedToken} onClose={reset} />}

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-4">
              <Ticket className="w-9 h-9 text-primary" /> MediCore HMS Intake
            </h1>
            <p className="text-silver-500 text-base mt-2">Generate patient queue tickets and register walk-ins for hospital services.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-silver-200 text-sm font-medium text-slate-600 flex items-center gap-2">
            <User className="w-4 h-4" /> {currentUser.name} (Receptionist)
          </div>
        </div>

        <StepIndicator currentStep={step} />

        <div className="bg-white rounded-3xl border border-silver-200 shadow-xl p-8 md:p-12 min-h-[500px] flex flex-col">

        {/* ── Step 1: Patient Type ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-1">What type of visit is this?</h2>
            <p className="text-clay-500 text-sm mb-6">Select the nature of this patient's visit to proceed.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PATIENT_TYPES.map(pt => (
                <button key={pt.id} type="button" onClick={() => { setPatientType(pt.id); setPatient(null); }}
                  className={`flex flex-col items-center justify-center gap-6 p-10 min-h-[240px] rounded-3xl border-2 transition-all text-center ${
                    patientType === pt.id
                      ? pt.color === 'blue' ? 'border-blue-500 bg-blue-50'
                        : pt.color === 'green' ? 'border-green-500 bg-green-50'
                        : 'border-purple-500 bg-purple-50'
                      : 'border-silver-200 hover:border-silver-400 bg-white shadow-sm'
                  }`}>
                  <div className={`p-5 rounded-2xl ${
                    patientType === pt.id
                      ? pt.color === 'blue' ? 'bg-blue-100 text-blue-700'
                        : pt.color === 'green' ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                      : 'bg-silver-100 text-clay-600'
                  }`}>
                    <pt.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <div className={`font-bold text-xl ${patientType === pt.id ? (pt.color === 'blue' ? 'text-blue-800' : pt.color === 'green' ? 'text-green-800' : 'text-purple-800') : 'text-slate-800'}`}>
                      {pt.label}
                    </div>
                    <div className="text-sm text-clay-500 max-w-[200px]">{pt.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <Button onClick={next} disabled={!patientType} className="flex items-center gap-2 disabled:opacity-50">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Patient Details ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              {patientType === 'existing' ? 'Find Patient' : patientType === 'new' ? 'Walk-in Registration' : 'Locate Review Appointment'}
            </h2>
            <p className="text-clay-500 text-sm mb-6">
              {patientType === 'existing' ? 'Search by Patient ID, National ID, or phone number.'
                : patientType === 'new' ? 'Enter basic details. Full registration done at Admissions Desk.'
                : 'Enter the patient\'s ID or appointment reference.'}
            </p>

            {patientType === 'existing' && (
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-clay-700 mb-1">Patient ID / National ID / Phone</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400" />
                    <input type="text" value={patientSearch} onChange={e => setPatientSearch(e.target.value)}
                      placeholder="e.g. PT-100235 or 0712345678"
                      className="w-full pl-10 pr-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </div>
                <Button type="button" onClick={handlePatientLookup}>Find Patient</Button>
              </div>
            )}

            {patientType === 'new' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-clay-700 mb-1">First Name *</label>
                    <input type="text" value={newPatient.firstName} onChange={e => setNewPatient({ ...newPatient, firstName: e.target.value })}
                      placeholder="First Name" className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-clay-700 mb-1">Last Name *</label>
                    <input type="text" value={newPatient.lastName} onChange={e => setNewPatient({ ...newPatient, lastName: e.target.value })}
                      placeholder="Last Name" className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-clay-700 mb-1">Phone *</label>
                    <input type="tel" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="+254..." className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-clay-700 mb-1">Gender</label>
                    <select value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded p-3">
                  ⚠️ A temporary Walk-in ID will be generated. Patient must complete full registration at the Admissions Desk.
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={handleNewPatient} disabled={!newPatient.firstName || !newPatient.lastName || !newPatient.phone}>
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {patientType === 'review' && (
              <div className="space-y-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-clay-700 mb-1">Patient ID / Appointment Ref</label>
                    <div className="relative">
                      <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400" />
                      <input type="text" value={reviewId} onChange={e => setReviewId(e.target.value)}
                        placeholder="e.g. PT-100234 or REV-2024-881"
                        className="w-full pl-10 pr-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none" />
                    </div>
                  </div>
                  <Button type="button" onClick={handleReviewLookup} disabled={reviewId.trim().length < 3}>Locate</Button>
                </div>
              </div>
            )}

            {/* Confirmed patient banner within step 2 */}
            {patient && step === 2 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-xs text-clay-500">Name</div><div className="font-bold">{patient.name}</div></div>
                  <div><div className="text-xs text-clay-500">ID</div><div className="font-mono font-bold text-primary">{patient.id}</div></div>
                  {patient.reviewNote && <div className="col-span-2"><div className="text-xs text-clay-500">Review Note</div><div className="font-medium text-purple-700 italic">{patient.reviewNote}</div></div>}
                </div>
              </div>
            )}

            {patientType !== 'new' && (
              <div className="flex justify-between mt-auto pt-6">
                <Button variant="ghost" onClick={back} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</Button>
                {patient && (
                  <Button onClick={next} className="flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></Button>
                )}
              </div>
            )}
            {patientType === 'new' && (
              <div className="flex justify-start mt-4">
                <Button variant="ghost" onClick={back} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Select Service</h2>
            <p className="text-clay-500 text-sm mb-1">Which department should {patient?.name} be queued for?</p>
            {patientType === 'new' && (
              <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-3 py-1.5 mb-4">⚠️ Walk-in patients can only access Diagnostic services. OPD visits require prior registration.</p>
            )}
            {patientType !== 'new' && (
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-1.5 mb-4">ℹ️ Select the appropriate clinic for consultation. Lab/Pharm/Physio queues are assigned during the visit.</p>
            )}
            <div className={`grid gap-4 ${patientType === 'new' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 max-w-lg mx-auto'}`}>
              {(() => {
                const visible = patientType === 'new'
                  ? SERVICES.filter(s => ['lab', 'rad', 'rx'].includes(s.id))
                  : SERVICES.filter(s => ['opd', 'specialist'].includes(s.id));
                return visible.map(svc => (
                  <button type="button" key={svc.id}
                    onClick={() => { setSelectedService(svc.id); setSelectedSpecialty(null); }}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center group ${
                      selectedService === svc.id 
                        ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' 
                        : 'border-silver-200 hover:border-silver-400 bg-white text-clay-600'
                    }`}>
                    <div className={`p-2 rounded-xl transition-colors ${selectedService === svc.id ? 'bg-primary text-white' : 'bg-silver-100 text-clay-500 group-hover:bg-silver-200'}`}>
                      <svc.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-base font-bold leading-tight block">{svc.label}</span>
                      <span className="text-[11px] font-medium opacity-70 block">{svc.sub}</span>
                    </div>
                  </button>
                ));
              })()}
            </div>

            {/* Specialty Picker — only shown when Specialist Clinic is selected */}
            {selectedService === 'specialist' && (
              <div className="mt-5 pt-4 border-t border-silver-200 animate-fade-in">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Choose Specialist Department
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {SPECIALTIES.map(sp => (
                    <button type="button" key={sp.id} onClick={() => setSelectedSpecialty(sp.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedSpecialty === sp.id
                          ? 'border-primary bg-primary/5 text-primary shadow-md shadow-primary/5'
                          : 'border-silver-200 hover:border-silver-300 bg-white text-slate-700'
                      }`}>
                      <div className={`p-1 rounded-lg ${selectedSpecialty === sp.id ? 'bg-primary text-white' : 'bg-silver-100 text-clay-500'}`}>
                        <sp.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{sp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-silver-100">
              <Button variant="ghost" onClick={back} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</Button>
              <Button
                onClick={next}
                disabled={!selectedService || (selectedService === 'specialist' && !selectedSpecialty)}
                className="flex items-center gap-2 disabled:opacity-50">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Payment Method ───────────────────────────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-1">Payment Method</h2>
            <p className="text-clay-500 text-sm mb-5">How will this visit be settled?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
              {PAYMENT_METHODS.map(pm => (
                <button type="button" key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === pm.id
                      ? pm.color === 'green' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                      : 'border-silver-200 hover:border-silver-400 bg-white'
                  }`}>
                  <div className={`p-3 rounded-xl ${
                    paymentMethod === pm.id
                      ? pm.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      : 'bg-silver-100 text-clay-600'
                  }`}>
                    <pm.icon className={`w-6 h-6 mb-2 ${paymentMethod === pm.id ? (pm.color === 'green' ? 'text-green-700' : 'text-blue-700') : 'text-clay-400'}`} />
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-bold leading-tight ${paymentMethod === pm.id ? (pm.color === 'green' ? 'text-green-800' : 'text-blue-800') : 'text-slate-800'}`}>{pm.label}</span>
                    <div className="text-xs text-clay-500 mt-0.5">{pm.sub}</div>
                  </div>
                  {paymentMethod === pm.id && <CheckCircle className={`w-6 h-6 shrink-0 ${pm.color === 'green' ? 'text-green-500' : 'text-blue-500'}`} />}
                </button>
              ))}
            </div>

            {/* Summary Review */}
            {paymentMethod && (
              <div className="mt-5 p-4 bg-silver-50 border border-silver-200 rounded-xl text-sm animate-fade-in">
                <div className="font-bold text-clay-700 mb-2 text-xs uppercase tracking-wide">Token Summary</div>
                <div className="grid grid-cols-3 gap-2">
                  <div><span className="text-clay-500">Patient:</span> <span className="font-bold text-slate-800">{patient?.name}</span></div>
                  <div><span className="text-clay-500">Visit:</span> <span className="font-bold text-slate-800">{patient?.visitType}</span></div>
                  <div><span className="text-clay-500">Service:</span> <span className="font-bold text-slate-800">
                    {selectedService === 'specialist'
                      ? `${SPECIALTIES.find(s => s.id === selectedSpecialty)?.label} Clinic`
                      : SERVICES.find(s => s.id === selectedService)?.label}
                  </span></div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-silver-100">
              <Button variant="ghost" onClick={back} className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back</Button>
              <Button onClick={handleIssueToken} disabled={!paymentMethod} size="lg" className="flex items-center gap-2 disabled:opacity-50">
                <Ticket className="w-5 h-5" /> Issue Token
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default CreateToken;
