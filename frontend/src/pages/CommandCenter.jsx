import React from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Table from '../components/ui/Table';
import { Users, Activity, PhoneCall, Bed, TrendingUp, AlertTriangle } from 'lucide-react';

const CommandCenter = () => {
  const summaryCards = [
    { title: "Patients Today", value: "248", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Available Beds", value: "42 / 315", change: "13%", icon: Bed, color: "text-green-600", bg: "bg-green-100" },
    { title: "Surgeries Scheduled", value: "18", change: "2 ongoing", icon: Activity, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Emergency Cases", value: "14", change: "+3 this hour", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
  ];

  const queueColumns = [
    { header: "Department", accessor: "dept" },
    { header: "Waiting", accessor: "waiting" },
    { header: "Avg Time", accessor: "time" },
    { header: "Status", render: (val) => <StatusBadge status={val.status} /> },
  ];

  const queueData = [
    { id: 1, dept: "Outpatient (OPD)", waiting: 45, time: "32 min", status: "High" },
    { id: 2, dept: "Pharmacy", waiting: 12, time: "8 min", status: "Normal" },
    { id: 3, dept: "Radiology", waiting: 8, time: "15 min", status: "Normal" },
    { id: 4, dept: "Laboratory", waiting: 23, time: "25 min", status: "Pending" },
  ];

  const bedColumns = [
    { header: "Ward", accessor: "ward" },
    { header: "Total Beds", accessor: "total" },
    { header: "Occupied", accessor: "occupied" },
    { header: "Available", render: (row) => <span className="font-bold text-green-600">{row.total - row.occupied}</span> },
  ];

  const bedData = [
    { ward: "ICU", total: 20, occupied: 18 },
    { ward: "Maternity", total: 40, occupied: 25 },
    { ward: "Pediatrics", total: 30, occupied: 28 },
    { ward: "General Ward", total: 100, occupied: 82 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Command Center</h1>
          <p className="text-silver-500 text-sm">Real-time overview of hospital operations</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Updates
          </span>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-silver-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`p-4 rounded-lg flex-shrink-0 ${card.bg}`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-silver-600 font-medium">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-800">{card.value}</h3>
              <p className="text-xs text-clay-500 mt-1 truncate">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Management */}
        <Card title="Live Queue Monitor" subtitle="Current waiting times across departments">
          <Table columns={queueColumns} data={queueData} keyField="id" />
        </Card>

        {/* Bed Management */}
        <Card title="Bed Occupancy" subtitle="Real-time capacity tracking by ward">
          <Table columns={bedColumns} data={bedData} keyField="ward" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Placeholder */}
        <Card title="Revenue Overview" subtitle="Today's collections" className="lg:col-span-2">
          <div className="h-48 flex items-center justify-center bg-silver-50 border border-dashed border-silver-300 rounded-lg">
            <div className="text-center text-clay-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Financial Chart Visualization Area</p>
            </div>
          </div>
        </Card>

        {/* Action Center */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-silver-50 hover:bg-silver-100 rounded border border-silver-200 text-sm font-medium text-slate-700 flex items-center gap-3 transition">
              <PhoneCall className="w-4 h-4 text-primary" /> Announce Code Blue
            </button>
            <button className="w-full text-left px-4 py-3 bg-silver-50 hover:bg-silver-100 rounded border border-silver-200 text-sm font-medium text-slate-700 flex items-center gap-3 transition">
              <Users className="w-4 h-4 text-primary" /> Register VIP Patient
            </button>
            <button className="w-full text-left px-4 py-3 bg-silver-50 hover:bg-silver-100 rounded border border-silver-200 text-sm font-medium text-slate-700 flex items-center gap-3 transition">
              <Bed className="w-4 h-4 text-primary" /> Allocate Emergency Bed
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommandCenter;
