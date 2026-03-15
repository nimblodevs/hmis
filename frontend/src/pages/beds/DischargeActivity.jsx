import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { FileDown, Calendar, CheckSquare, Search, Loader2 } from 'lucide-react';

const DischargeActivity = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockDischarges = [
    { id: 'DC-8891', patient: 'Robert Chen', ptId: 'PT-1033', bed: 'ICU-11', type: 'Clinical Discharge', date: 'Today, 09:14 AM', physician: 'Dr. Sarah Jenkins', status: 'Completed' },
    { id: 'DC-8890', patient: 'Martha Stewart', ptId: 'PT-4091', bed: 'GEN-A-12', type: 'Transfer to O/F', date: 'Today, 08:30 AM', physician: 'Dr. Alan Grant', status: 'Completed' },
    { id: 'DC-8889', patient: 'Kevin Bacon', ptId: 'PT-2210', bed: 'MAT-04', type: 'Clinical Discharge', date: 'Yesterday, 14:20 PM', physician: 'Dr. Emily Wong', status: 'Pending Billing' },
  ];

  const mockCleaningQueue = [
    { bed: 'ICU-11', ward: 'Intensive Care Unit', vacatedOn: 'Today, 09:14 AM', priority: 'High', status: 'In Progress' },
    { bed: 'GEN-A-12', ward: 'General Ward A', vacatedOn: 'Today, 08:30 AM', priority: 'Normal', status: 'Pending' },
    { bed: 'GEN-A-03', ward: 'General Ward A', vacatedOn: 'Yesterday, 22:15 PM', priority: 'Normal', status: 'Pending' },
  ];

  const filteredDischarges = mockDischarges.filter(d => 
    d.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-silver-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-800">Bed Turnover & Discharges</h2>
          <div className="flex gap-3">
             <Button variant="outline" className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Filter by Date</Button>
             <Button className="flex items-center gap-2"><FileDown className="w-4 h-4"/> Export Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Discharges Table */}
          <div className="lg:col-span-2 space-y-4">
            <Card title="Recent Discharges" className="h-full">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clay-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient name, ID, or bed..." 
                  className="w-full pl-10 pr-3 py-2 border border-clay-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-clay-500 uppercase bg-silver-50 border-y">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Bed</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDischarges.map((dc, idx) => (
                      <tr key={idx} className="border-b hover:bg-silver-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{dc.patient}</div>
                          <div className="text-xs text-clay-500">{dc.ptId}</div>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-primary">{dc.bed}</td>
                        <td className="px-4 py-3 text-slate-600">{dc.date}</td>
                        <td className="px-4 py-3">
                           <StatusBadge status={dc.status === 'Completed' ? 'Active' : 'Pending'} customText={dc.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" className="text-primary font-medium">View Summary</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Housekeeping Queue */}
          <div className="space-y-4">
            <Card title="Housekeeping Queue" className="h-full border-t-4 border-t-yellow-400">
               <div className="space-y-4">
                  {mockCleaningQueue.map((task, idx) => (
                    <div key={idx} className="p-3 border border-silver-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono font-bold text-yellow-700">{task.bed}</span>
                        {task.priority === 'High' && <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">High Priority</span>}
                      </div>
                      <div className="text-sm font-medium text-slate-800">{task.ward}</div>
                      <div className="text-xs text-clay-500 mt-1">Vacated: {task.vacatedOn}</div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs font-bold flex items-center gap-1 ${task.status === 'In Progress' ? 'text-blue-600' : 'text-slate-500'}`}>
                           {task.status === 'In Progress' ? <Loader2 className="w-3 h-3 animate-spin"/> : <CheckSquare className="w-3 h-3"/>}
                           {task.status}
                        </span>
                        <Button size="sm" variant="outline">Mark Clean</Button>
                      </div>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeActivity;
