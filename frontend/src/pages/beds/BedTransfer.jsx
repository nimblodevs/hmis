import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, ArrowRightLeft, AlertTriangle } from 'lucide-react';

const BedTransfer = () => {
  const [searchBed, setSearchBed] = useState('');
  const [transferState, setTransferState] = useState('search'); // 'search', 'select', 'confirm'
  const [patientToTransfer, setPatientToTransfer] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchBed.trim() !== '') {
      // Mock lookup: find patient currently in bed
      setPatientToTransfer({
        name: 'Michael Doe',
        id: 'PT-8821',
        currentBed: searchBed.toUpperCase(),
        ward: 'General Ward A',
        admittedOn: 'Oct 12, 2023',
        diagnosis: 'I10 - Essential (primary) hypertension'
      });
      setTransferState('select');
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    setTransferState('confirm');
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-silver-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Step 1: Search Current Bed */}
        <Card title="Locate Patient to Transfer">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-clay-700 mb-1">Enter Current Bed ID or Patient ID *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400" />
                <input 
                  type="text" 
                  value={searchBed}
                  onChange={(e) => setSearchBed(e.target.value)}
                  placeholder="e.g. ICU-04 or PT-8821"
                  className="w-full pl-10 pr-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
            <Button type="submit">Locate Patient</Button>
          </form>
        </Card>

        {/* Step 2: Select Target Bed */}
        {transferState === 'select' && patientToTransfer && (
          <form onSubmit={handleTransfer} className="space-y-6 animate-fade-in">
            <Card title="Current Admission Details" className="bg-primary/5 border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
                 <div>
                  <div className="text-xs text-clay-500">Patient</div>
                  <div className="font-bold text-primary">{patientToTransfer.name}</div>
                  <div className="text-xs text-slate-500">{patientToTransfer.id}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">Current Location</div>
                  <div className="font-bold text-slate-800">{patientToTransfer.currentBed}</div>
                  <div className="text-xs text-slate-500">{patientToTransfer.ward}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">Admitted On</div>
                  <div className="font-bold text-slate-800">{patientToTransfer.admittedOn}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">Primary Diagnosis</div>
                  <div className="font-bold text-slate-800 truncate" title={patientToTransfer.diagnosis}>{patientToTransfer.diagnosis}</div>
                </div>
              </div>
            </Card>

            <Card title="Transfer Destination">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Target Ward *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="">Select Ward</option>
                    <option value="icu">Intensive Care Unit (ICU)</option>
                    <option value="gen-a">General Ward A</option>
                    <option value="mat">Maternity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Target Bed *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="">Select Available Bed</option>
                    <option value="bed-1">ICU-01 (Available)</option>
                    <option value="bed-2">ICU-08 (Available)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Reason for Transfer *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="upgrade">Escalation of Care (e.g. to ICU)</option>
                    <option value="downgrade">Step-down (e.g. ICU to Gen)</option>
                    <option value="admin">Administrative / Bed Management</option>
                    <option value="isolation">Isolation Required</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3 text-sm text-yellow-800">
                <AlertTriangle className="shrink-0 w-5 h-5 text-yellow-600" />
                <p>Transferring this patient will immediately mark their current bed ({patientToTransfer.currentBed}) as <strong>Requires Cleaning</strong> for housekeeping.</p>
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-silver-300">
              <Button variant="ghost" type="button" onClick={() => {setTransferState('search'); setPatientToTransfer(null); setSearchBed('');}}>Cancel</Button>
              <Button type="submit" size="lg" className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" /> Execute Transfer
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {transferState === 'confirm' && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center animate-fade-in shadow-sm">
            <ArrowRightLeft className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Transfer Successful</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Patient <strong>{patientToTransfer.name}</strong> has been successfully transferred to <strong className="font-mono">ICU-01</strong>. Housekeeping has been notified to clean bed {patientToTransfer.currentBed}.
            </p>
            <div className="flex justify-center gap-4">
               <Button variant="secondary" onClick={() => {setTransferState('search'); setPatientToTransfer(null); setSearchBed('');}}>Transfer Another Patient</Button>
               <Button>Print Transfer Summary</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedTransfer;
