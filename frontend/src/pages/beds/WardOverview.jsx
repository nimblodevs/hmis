import React, { useState } from 'react';
import { User, ShieldAlert, BadgeCheck, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';

const WardOverview = () => {
  const [selectedWard, setSelectedWard] = useState('all');

  // Mock structured ward and bed data
  const wards = [
    { id: 'icu', name: 'Intensive Care Unit (ICU)', total: 12, occupied: 10, cleaning: 1 },
    { id: 'mat', name: 'Maternity Ward', total: 24, occupied: 18, cleaning: 2 },
    { id: 'gen-a', name: 'General Ward A (Surgical)', total: 30, occupied: 15, cleaning: 5 },
    { id: 'ped', name: 'Pediatrics', total: 20, occupied: 18, cleaning: 1 },
  ];

  const generateBeds = (wardId, count, occ, cln) => {
    let beds = [];
    for(let i = 1; i <= count; i++) {
      let status = 'Available';
      let patient = null;
      if (i <= occ) {
        status = 'Occupied';
        patient = { name: `Patient ${Math.floor(Math.random() * 900) + 100}`, id: `PT-${Math.floor(Math.random() * 9000) + 1000}` };
      } else if (i <= occ + cln) {
        status = 'Cleaning';
      }
      beds.push({ id: `${wardId.toUpperCase()}-${i.toString().padStart(2, '0')}`, wardId, status, patient });
    }
    return beds;
  };

  const allBeds = [
    ...generateBeds('icu', 12, 10, 1),
    ...generateBeds('mat', 24, 18, 2),
    ...generateBeds('gen-a', 30, 15, 5),
    ...generateBeds('ped', 20, 18, 1),
  ];

  const filteredBeds = selectedWard === 'all' ? allBeds : allBeds.filter(b => b.wardId === selectedWard);

  const stats = {
    total: allBeds.length,
    occupied: allBeds.filter(b => b.status === 'Occupied').length,
    available: allBeds.filter(b => b.status === 'Available').length,
    cleaning: allBeds.filter(b => b.status === 'Cleaning').length,
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Wards List */}
      <div className="w-64 border-r border-silver-200 bg-silver-50 flex flex-col">
        <div className="p-4 border-b border-silver-200">
          <h3 className="font-bold text-slate-800">Hospital Wards</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          <button 
            onClick={() => setSelectedWard('all')}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedWard === 'all' ? 'bg-primary/10 text-primary font-bold' : 'text-slate-700 hover:bg-silver-200'}`}
          >
            All Wards ({stats.total})
          </button>
          
          {wards.map(ward => (
            <button 
              key={ward.id}
              onClick={() => setSelectedWard(ward.id)}
              className={`w-full text-left px-3 py-4 rounded text-sm transition-colors border ${selectedWard === ward.id ? 'bg-white border-primary shadow-sm text-primary font-bold' : 'bg-white border-transparent text-slate-700 hover:border-silver-300'}`}
            >
              <div className="truncate">{ward.name}</div>
              <div className="flex justify-between items-center mt-2 text-xs font-normal">
                <span className="text-clay-500">Occupancy</span>
                <span className={`${(ward.occupied / ward.total) > 0.85 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                  {Math.round((ward.occupied / ward.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-silver-200 h-1.5 rounded-full mt-1 overflow-hidden flex">
                <div style={{width: `${(ward.occupied / ward.total) * 100}%`}} className={`h-full ${(ward.occupied / ward.total) > 0.85 ? 'bg-red-500' : 'bg-primary'}`}></div>
                <div style={{width: `${(ward.cleaning / ward.total) * 100}%`}} className="h-full bg-yellow-400"></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Bed Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Metric Header */}
        <div className="p-4 border-b border-silver-200 flex items-center justify-between bg-white shrink-0">
          <div className="font-bold text-lg text-slate-800">
            {selectedWard === 'all' ? 'Hospital-Wide Occupancy' : wards.find(w => w.id === selectedWard)?.name}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm font-medium">{selectedWard === 'all' ? stats.available : wards.find(w => w.id === selectedWard)?.total - wards.find(w => w.id === selectedWard)?.occupied - wards.find(w => w.id === selectedWard)?.cleaning} Available</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm font-medium">{selectedWard === 'all' ? stats.occupied : wards.find(w => w.id === selectedWard)?.occupied} Occupied</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span className="text-sm font-medium">{selectedWard === 'all' ? stats.cleaning : wards.find(w => w.id === selectedWard)?.cleaning} Cleaning</span></div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-silver-50">
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBeds.map(bed => (
              <div 
                key={bed.id}
                className={`relative border rounded-lg p-4 flex flex-col h-32 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  bed.status === 'Available' ? 'bg-white border-green-200' : 
                  bed.status === 'Occupied' ? 'bg-red-50 border-red-200' : 
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-bold font-mono ${bed.status === 'Available' ? 'text-green-700' : bed.status === 'Occupied' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {bed.id}
                  </span>
                  {bed.status === 'Available' && <BadgeCheck className="w-5 h-5 text-green-500" />}
                  {bed.status === 'Cleaning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                </div>
                
                <div className="flex-1 flex flex-col justify-end mt-2">
                  {bed.status === 'Occupied' ? (
                    <>
                      <div className="text-sm font-bold text-slate-800 truncate">{bed.patient.name}</div>
                      <div className="text-xs font-mono text-clay-600 truncate">{bed.patient.id}</div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-clay-500">{bed.status}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardOverview;
