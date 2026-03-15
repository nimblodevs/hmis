import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import PatientForm from './PatientForm';

const PatientList = () => {
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial view, reflecting the new MRN system
  useEffect(() => {
    setTimeout(() => {
      setPatients([
        { mrn: 'MRN-442891', name: 'John Doe', age: 45, gender: 'Male', contact: '+254700000001', status: 'Active', lastVisit: '2023-10-24', billing: 'Insurance - Britam' },
        { mrn: 'MRN-105224', name: 'Jane Smith', age: 32, gender: 'Female', contact: '+254700000002', status: 'Active', lastVisit: '2023-10-25', billing: 'Cash' },
        { mrn: 'MRN-994321', name: 'Michael Johnson', age: 67, gender: 'Male', contact: '+254700000003', status: 'Active', lastVisit: '2023-10-20', billing: 'Corporate - KPA' },
        { mrn: 'MRN-331245', name: 'Sarah Williams', age: 28, gender: 'Female', contact: '+254700000004', status: 'Active', lastVisit: '2023-10-26', billing: 'SHA - Gold' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getBillingBadge = (method) => {
    if (method === 'Cash' || method.includes('Mobile')) return 'bg-green-100 text-green-800 border-green-200';
    if (method.includes('Insurance')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (method.includes('Corporate')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (method.includes('SHA')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-silver-200 text-clay-700 border-silver-300';
  };

  const columns = [
    { header: 'MRN', accessor: 'mrn', render: (row) => <span className="font-mono text-primary font-bold cursor-pointer hover:underline">{row.mrn}</span> },
    { header: 'Patient Name', accessor: 'name', render: (row) => <span className="font-medium text-slate-800">{row.name}</span> },
    { header: 'Age/Gender', render: (row) => `${row.age} yrs / ${row.gender}` },
    { header: 'Contact', accessor: 'contact' },
    { header: 'Financial Profile', render: (row) => <span className={`px-2 py-1 rounded text-[11px] border font-bold uppercase tracking-wider ${getBillingBadge(row.billing || 'Cash')}`}>{row.billing || 'Cash'}</span> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status === 'Active' ? 'Outpatient' : row.status} /> },
    { 
      header: 'Actions', 
      render: () => (
        <div className="flex gap-2">
          <button className="p-1.5 text-clay-500 hover:text-primary transition-colors bg-clay-50 rounded"><FileText className="w-4 h-4" /></button>
        </div>
      ) 
    },
  ];

  if (showForm) {
    return <PatientForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-silver-500 text-sm">Search, register, and manage patient profiles</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Register Patient
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-clay-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by Patient ID, Name, Phone Number, or National ID..." 
              className="w-full pl-10 pr-4 py-2 border border-clay-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
            />
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table columns={columns} data={patients} keyField="mrn" />
        )}
      </Card>
    </div>
  );
};

export default PatientList;
