import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { icdApi } from '../../api/icdApi';

const AdmissionDesk = () => {
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState(null);
  const [admissionComplete, setAdmissionComplete] = useState(false);
  
  // ICD-10 State
  const [icdQuery, setIcdQuery] = useState('');
  const [icdResults, setIcdResults] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [isSearchingIcd, setIsSearchingIcd] = useState(false);

  useEffect(() => {
    const fetchCodes = async () => {
      if (icdQuery.length < 2) {
        setIcdResults([]);
        return;
      }
      setIsSearchingIcd(true);
      try {
        const res = await icdApi.searchCodes(icdQuery);
        setIcdResults(res.data || []);
      } catch (error) {
        console.error("Failed to fetch ICD codes", error);
        setIcdResults([]);
      } finally {
        setIsSearchingIcd(false);
      }
    };

    const debounce = setTimeout(fetchCodes, 500);
    return () => clearTimeout(debounce);
  }, [icdQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (patientId.trim().length > 3) {
      // Mock patient lookup
      setPatient({
        id: patientId,
        name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        status: 'Outpatient'
      });
      setAdmissionComplete(false);
    }
  };

  const handleAdmit = (e) => {
    e.preventDefault();
    if (!selectedDiagnosis) {
      alert('Please select an ICD-10 Diagnosis.');
      return;
    }
    // Proceed with admission logic...
    setAdmissionComplete(true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-silver-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card title="Patient Lookup for Admission">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-clay-700 mb-1">Enter Patient ID or National ID *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400" />
                <input 
                  type="text" 
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PT-100234"
                  className="w-full pl-10 pr-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
            <Button type="submit">Lookup Patient</Button>
          </form>
        </Card>

        {patient && !admissionComplete && (
          <form onSubmit={handleAdmit} className="space-y-6 animate-fade-in">
            <Card title="Patient Details">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <div className="text-xs text-clay-500">Name</div>
                  <div className="font-bold text-primary">{patient.name}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">ID</div>
                  <div className="font-bold text-slate-700">{patient.id}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">Age/Gender</div>
                  <div className="font-bold text-slate-700">{patient.age} / {patient.gender}</div>
                </div>
                <div>
                  <div className="text-xs text-clay-500">Current Status</div>
                  <div className="font-bold text-slate-700">{patient.status}</div>
                </div>
              </div>
            </Card>

            <Card title="Admission Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Admitting Physician *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="">Select Physician</option>
                    <option value="dr-jenkins">Dr. Sarah Jenkins (Surgery)</option>
                    <option value="dr-grant">Dr. Alan Grant (Cardiology)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Admission Type *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="emergency">Emergency / Acute</option>
                    <option value="elective">Elective / Scheduled</option>
                    <option value="transfer">Inter-hospital Transfer</option>
                  </select>
                </div>
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-clay-700 mb-1">Primary Diagnosis (ICD-10) *</label>
                  
                  {selectedDiagnosis ? (
                    <div className="flex items-center justify-between p-3 border border-primary rounded-md bg-primary/5">
                      <div>
                        <span className="font-mono font-bold text-primary mr-2">{selectedDiagnosis.code}</span>
                        <span className="text-slate-700">{selectedDiagnosis.desc}</span>
                      </div>
                      <button type="button" onClick={() => setSelectedDiagnosis(null)} className="text-sm text-clay-500 hover:text-red-500 underline">Change</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={icdQuery}
                        onChange={(e) => setIcdQuery(e.target.value)}
                        placeholder="Search ICD-10 condition..." 
                        className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                      />
                      {isSearchingIcd && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-clay-400 animate-spin" />
                        </div>
                      )}
                      
                      {icdResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-silver-300 rounded-md shadow-lg max-h-48 overflow-auto">
                          <ul className="divide-y divide-silver-100">
                            {icdResults.map((item, idx) => (
                              <li key={idx} 
                                  onClick={() => { setSelectedDiagnosis(item); setIcdQuery(''); setIcdResults([]); }}
                                  className="p-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group">
                                <div>
                                  <span className="font-mono font-medium text-primary mr-2">{item.code}</span>
                                  <span className="text-sm text-slate-700">{item.desc}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card title="Bed Allocation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Target Ward / Unit *</label>
                  <select required className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="">Select Ward</option>
                    <option value="icu">Intensive Care Unit (ICU)</option>
                    <option value="gen-a">General Ward A</option>
                    <option value="mat">Maternity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">Allocate Specific Bed</label>
                  <select className="w-full px-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none">
                    <option value="">Auto-allocate next available</option>
                    <option value="bed-1">GEN-A-01 (Available)</option>
                    <option value="bed-2">GEN-A-04 (Available)</option>
                  </select>
                  <p className="text-xs text-clay-500 mt-1">Leave as auto-allocate unless specific bed is required.</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-silver-300">
              <Button variant="ghost" type="button" onClick={() => setPatient(null)}>Cancel</Button>
              <Button type="submit" size="lg" className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Confirm Admission
              </Button>
            </div>
          </form>
        )}

        {admissionComplete && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Admission Successful</h2>
            <p className="text-green-700 mb-6">
              Patient <strong>{patient.name}</strong> ({patient.id}) has been formally admitted and allocated to <strong className="font-mono">GEN-A-04</strong>.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => {setPatient(null); setAdmissionComplete(false); setPatientId('');}}>Admit Another Patient</Button>
              <Button>Print Identification Wristband</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionDesk;
