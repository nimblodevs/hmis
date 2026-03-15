import React, { useState } from 'react';
import { Bed, UserPlus, ArrowRightLeft, Activity } from 'lucide-react';
import WardOverview from './WardOverview';
import AdmissionDesk from './AdmissionDesk';
import BedTransfer from './BedTransfer';
import DischargeActivity from './DischargeActivity';
import Button from '../../components/ui/Button';

const BedManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Ward & Bed Overview', icon: Bed },
    { id: 'admit', name: 'Admission Desk', icon: UserPlus },
    { id: 'transfer', name: 'Bed Transfers', icon: ArrowRightLeft },
    { id: 'activity', name: 'Discharge & Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold">Admission & Bed Management</h1>
        <p className="text-silver-500 text-sm">Monitor hospital capacity, allocate beds, and manage patient flow</p>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-silver-200 p-2 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-clay-600 hover:bg-silver-100'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-clay-500'}`} />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-silver-200 focus-within:ring-1 focus-within:ring-primary flex flex-col">
        {activeTab === 'overview' && <WardOverview />}
        {activeTab === 'admit' && <AdmissionDesk />}
        {activeTab === 'transfer' && <BedTransfer />}
        {activeTab === 'activity' && <DischargeActivity />}
      </div>
    </div>
  );
};

export default BedManagementDashboard;
