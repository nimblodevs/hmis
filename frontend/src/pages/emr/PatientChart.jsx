import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Printer, Download, Clock, Heart, Activity, AlertCircle, FileText, Syringe, ClipboardList, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { icdApi } from '../../api/icdApi';

const PatientChart = ({ patientId, onBack }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  // Mock patient data
  const patient = {
    id: patientId,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    dob: '1979-05-12',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    admissionDate: '2023-10-24 09:30 AM',
    ward: 'ICU-B',
    physician: 'Dr. Sarah Jenkins',
    status: 'Admitted'
  };

  const tabs = [
    { id: 'timeline', name: 'Clinical Timeline', icon: Clock },
    { id: 'notes', name: 'Clinical Notes', icon: FileText },
    { id: 'vitals', name: 'Vital Signs', icon: Heart },
    { id: 'meds', name: 'Medications', icon: Syringe },
    { id: 'diagnoses', name: 'Diagnoses (ICD)', icon: Activity },
    { id: 'careplan', name: 'Care Plan', icon: ClipboardList },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col text-slate-800 animate-fade-in">
      {/* Chart Header */}
      <div className="bg-white rounded-xl shadow-sm border border-silver-200 p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-silver-100 text-clay-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-clay-100 rounded-full flex items-center justify-center text-clay-700">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <StatusBadge status={patient.status} />
              </div>
              <div className="flex gap-4 text-sm text-silver-600 mt-1">
                <span className="font-mono text-primary">{patient.id}</span>
                <span>•</span>
                <span>{patient.age} yrs ({patient.gender})</span>
                <span>•</span>
                <span>DOB: {patient.dob}</span>
                <span>•</span>
                <span className="font-semibold text-red-500">Blood: {patient.bloodType}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="hidden sm:flex"><Printer className="w-4 h-4 mr-2" /> Print Chart</Button>
            <Button variant="secondary" size="sm" className="hidden sm:flex"><Download className="w-4 h-4 mr-2" /> PDF Export</Button>
          </div>
        </div>

        {/* Critical Alerts Strip */}
        {patient.allergies.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Critical Alerts / Allergies</h4>
              <p className="text-sm text-red-700">{patient.allergies.join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-clay-600 border border-silver-200 hover:border-primary/50 hover:bg-silver-50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-clay-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-silver-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-silver-100 bg-silver-50">
            <h2 className="text-lg font-bold text-slate-800">{tabs.find(t => t.id === activeTab)?.name}</h2>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'timeline' && <TimelineView />}
            {activeTab === 'notes' && <NotesView />}
            {activeTab === 'vitals' && <VitalsView />}
            {activeTab === 'meds' && <MedsView />}
            {activeTab === 'diagnoses' && <DiagnosesView />}
            {activeTab === 'careplan' && <div className="text-clay-500 italic">No active care plans available.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for tabs
const TimelineView = () => (
  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-silver-300 before:to-transparent">
    {[
      { date: 'Today, 09:30 AM', title: 'Admitted to ICU-B', desc: 'Patient admitted due to severe respiratory distress.', author: 'Dr. Sarah Jenkins' },
      { date: 'Today, 08:15 AM', title: 'Emergency Room Triage', desc: 'Patient presented with shortness of breath. Vitals flagged critical.', author: 'Nurse E. Carter' },
      { date: 'Oct 10, 2023', title: 'Outpatient Consultation', desc: 'Complained of mild chest tightness. Prescribed inhaler.', author: 'Dr. Alan Grant' }
    ].map((event, i) => (
      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
          <Activity className="w-5 h-5" />
        </div>
        {/* Card */}
        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-silver-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold text-slate-800">{event.title}</div>
            <div className="text-xs text-clay-400 font-mono">{event.date}</div>
          </div>
          <p className="text-sm text-slate-600 mb-2">{event.desc}</p>
          <div className="text-xs text-clay-500 flex items-center gap-1">
            <User className="w-3 h-3" /> By {event.author}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotesView = () => (
  <div className="space-y-4">
    <div className="flex justify-end">
      <Button size="sm"><FileText className="w-4 h-4 mr-2" /> Add New Note</Button>
    </div>
    <Card title="Admission Note - Dr. Sarah Jenkins" subtitle="Today, 10:15 AM">
      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        Patient is a 45-year-old male presenting to the emergency department with acute onset of shortness of breath and chest tightness that began approximately 2 hours ago while resting. Patient denies palpitations, syncope, or recent travel. PMH is significant for mild intermittent asthma, previously controlled well on Albuterol PRN. 
        
        Assessment: Acute exacerbation of asthma vs. underlying pneumonia. Patient is tachycardic and hypoxic on room air. 
        
        Plan: 
        1. Admit to ICU for close monitoring 
        2. Continuous albuterol nebulization 
        3. IV Solu-Medrol 
        4. Obtain stat CXR and basic labs 
      </p>
    </Card>
  </div>
);

const VitalsView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border border-clay-200 p-4 rounded-lg bg-red-50">
        <div className="text-sm text-clay-600 mb-1">Heart Rate</div>
        <div className="text-2xl font-bold text-red-700 flex items-end gap-1">112 <span className="text-xs mb-1 text-red-500 font-normal">bpm &uarr;</span></div>
      </div>
      <div className="border border-clay-200 p-4 rounded-lg bg-orange-50">
        <div className="text-sm text-clay-600 mb-1">Blood Pressure</div>
        <div className="text-2xl font-bold text-orange-700 flex items-end gap-1">145/92 <span className="text-xs mb-1 text-orange-500 font-normal">mmHg &uarr;</span></div>
      </div>
      <div className="border border-clay-200 p-4 rounded-lg bg-blue-50">
        <div className="text-sm text-clay-600 mb-1">SpO2</div>
        <div className="text-2xl font-bold text-blue-700 flex items-end gap-1">88 <span className="text-xs mb-1 text-blue-500 font-normal">% &darr;</span></div>
      </div>
      <div className="border border-clay-200 p-4 rounded-lg bg-silver-50">
        <div className="text-sm text-clay-600 mb-1">Temperature</div>
        <div className="text-2xl font-bold text-slate-700 flex items-end gap-1">37.2 <span className="text-xs mb-1 text-clay-400 font-normal">&deg;C</span></div>
      </div>
    </div>
    <div className="h-64 border border-dashed border-silver-300 rounded-lg flex items-center justify-center text-clay-400 bg-silver-50/50">
      Visual Vitals Chart Component Placeholder
    </div>
  </div>
);

const MedsView = () => (
  <div className="space-y-4">
    <h3 className="font-bold text-slate-800 border-b pb-2">Active Medications</h3>
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-clay-500 uppercase bg-silver-50 border-y">
        <tr>
          <th className="px-4 py-3">Medication</th>
          <th className="px-4 py-3">Dose</th>
          <th className="px-4 py-3">Route</th>
          <th className="px-4 py-3">Frequency</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="px-4 py-3 font-medium text-primary">Solu-Medrol (Methylprednisolone)</td>
          <td className="px-4 py-3 text-slate-600">125 mg</td>
          <td className="px-4 py-3 text-slate-600">IV</td>
          <td className="px-4 py-3 text-slate-600">Q6H</td>
          <td className="px-4 py-3"><StatusBadge status="Active" /></td>
        </tr>
        <tr className="border-b">
          <td className="px-4 py-3 font-medium text-primary">Albuterol Sulfate</td>
          <td className="px-4 py-3 text-slate-600">2.5 mg / 3mL</td>
          <td className="px-4 py-3 text-slate-600">Nebulizer</td>
          <td className="px-4 py-3 text-slate-600">Continuous</td>
          <td className="px-4 py-3"><StatusBadge status="Active" /></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DiagnosesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredICD, setFilteredICD] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const fetchCodes = async () => {
      if (searchTerm.length < 2) {
        setFilteredICD([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const res = await icdApi.searchCodes(searchTerm);
        setFilteredICD(res.data || []);
      } catch (error) {
        console.error("Failed to fetch ICD codes", error);
        setFilteredICD([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchCodes, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const activeDiagnoses = [
    { code: 'J45.901', desc: 'Unspecified asthma with (acute) exacerbation', date: 'Today, 10:15 AM', author: 'Dr. Sarah Jenkins', status: 'Active' },
    { code: 'R06.02', desc: 'Shortness of breath', date: 'Today, 08:15 AM', author: 'Nurse E. Carter', status: 'Resolved' },
    { code: 'I10', desc: 'Essential (primary) hypertension', date: 'Jan 12, 2021', author: 'Dr. Alan Grant', status: 'Historical' }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Add ICD-10 */}
      <Card title="Add Diagnosis (ICD-10)">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ICD-10 code or condition (e.g. Asthma, J45)..." 
              className="w-full pl-4 pr-10 py-2 border border-clay-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-clay-400 animate-spin" />
              </div>
            )}
          </div>
          
          {filteredICD.length > 0 && (
            <div className="border border-silver-200 rounded-lg overflow-hidden bg-white shadow-sm mt-2">
              <ul className="divide-y divide-silver-100 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredICD.map((item, idx) => (
                  <li key={idx} className="p-3 hover:bg-silver-50 flex items-center justify-between group cursor-pointer transition-colors">
                    <div>
                      <span className="font-mono font-medium text-primary mr-3">{item.code}</span>
                      <span className="text-sm text-slate-700">{item.desc}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-primary">Add</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {!isSearching && searchTerm.length >= 2 && filteredICD.length === 0 && (
             <div className="p-4 text-sm text-clay-500 bg-silver-50 rounded-lg border border-silver-200">
               No matching ICD-10 codes found for "{searchTerm}".
             </div>
          )}
        </div>
      </Card>

      {/* Patient Problem List */}
      <h3 className="font-bold text-slate-800 border-b pb-2">Medical Problem List</h3>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-clay-500 uppercase bg-silver-50 border-y">
          <tr>
            <th className="px-4 py-3">ICD-10 Code</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Diagnosed On</th>
            <th className="px-4 py-3">Diagnosed By</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {activeDiagnoses.map((dx, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-3 font-mono font-medium text-primary">{dx.code}</td>
              <td className="px-4 py-3 text-slate-800">{dx.desc}</td>
              <td className="px-4 py-3 text-slate-600 text-xs">{dx.date}</td>
              <td className="px-4 py-3 text-slate-600 text-xs">{dx.author}</td>
              <td className="px-4 py-3"><StatusBadge status={dx.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientChart;
