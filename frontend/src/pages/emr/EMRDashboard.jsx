import React, { useState } from 'react';
import { Search, History, Activity, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import PatientChart from './PatientChart';

const EMRDashboard = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Mock recent patients
  const recentRecords = [
    { id: 'PT-100234', name: 'John Doe', lastSeen: '2 hours ago', status: 'Admitted', ward: 'ICU-B', attending: 'Dr. Sarah Jenkins' },
    { id: 'PT-100237', name: 'Sarah Williams', lastSeen: '4 hours ago', status: 'Emergency', ward: 'ER-Trauma', attending: 'Dr. Alan Grant' },
    { id: 'PT-100211', name: 'Marcus Aurelius', lastSeen: '1 day ago', status: 'Outpatient', ward: 'Cardiology', attending: 'Dr. Emily Chen' },
    { id: 'PT-100198', name: 'Eleanor Roosevelt', lastSeen: '3 days ago', status: 'Discharged', ward: '-', attending: 'Dr. Sarah Jenkins' },
  ];

  if (selectedPatientId) {
    return <PatientChart patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div>
        <h1 className="text-2xl font-bold">Central EMR Hub</h1>
        <p className="text-silver-500 text-sm">Access, review, and update absolute patient clinical records</p>
      </div>

      <div className="bg-primary/5 rounded-xl border border-primary/20 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Find Patient Record</h2>
        <p className="text-silver-500 mb-6 max-w-md">Enter a Patient ID, National ID, or scan a clinical barcode to securely access the patient's electronic medical record.</p>
        
        <div className="relative w-full max-w-2xl flex shadow-sm rounded-lg overflow-hidden">
          <input 
            type="text" 
            placeholder="Search e.g. PT-100234..." 
            className="flex-1 px-4 py-3 outline-none border border-clay-300 rounded-l-lg border-r-0 focus:ring-2 focus:ring-primary focus:border-primary transition-all z-10 relative"
          />
          <button className="bg-primary hover:bg-primary-dark transition-colors px-6 text-white font-medium flex items-center gap-2">
            <Search className="w-4 h-4" /> Open EMR
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-clay-500" /> Recently Accessed Charts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentRecords.map(record => (
            <div 
              key={record.id} 
              onClick={() => setSelectedPatientId(record.id)}
              className="bg-white rounded-lg border border-silver-200 p-4 hover:shadow-md hover:border-primary/40 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-primary font-medium">{record.id}</span>
                <StatusBadge status={record.status} />
              </div>
              <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{record.name}</h4>
              <p className="text-xs text-silver-500 mb-3">Last seen: {record.lastSeen}</p>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-clay-600">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{record.ward}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-clay-600">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{record.attending}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EMRDashboard;
