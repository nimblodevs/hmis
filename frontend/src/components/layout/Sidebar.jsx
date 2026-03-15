import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Users, Calendar, Stethoscope, Droplets, Image as ImageIcon, Pill, CreditCard, ShieldCheck, Box, ShoppingCart, DollarSign, UserCog, BarChart, Settings, Ticket } from 'lucide-react';

const navItems = [
  { name: 'Command Center', path: '/', icon: Activity },
  { name: 'Patient Management', path: '/patients', icon: Users },
  { name: 'EMR Hub', path: '/emr', icon: Stethoscope },
  { name: 'Bed Management', path: '/beds', icon: Box },
  { name: 'Queue System', path: '/queues', icon: Users },
  { name: 'Issue Token', path: '/queues/token', icon: Ticket },
  { name: 'Doctor Schedule', path: '/schedule', icon: Calendar },
  { name: 'Surgery Theatre', path: '/surgery', icon: Activity },
  { name: 'Laboratory', path: '/lab', icon: Droplets },
  { name: 'Radiology', path: '/radiology', icon: ImageIcon },
  { name: 'Pharmacy', path: '/pharmacy', icon: Pill },
  { name: 'Billing', path: '/billing', icon: CreditCard },
  { name: 'Insurance', path: '/insurance', icon: ShieldCheck },
  { name: 'Inventory', path: '/inventory', icon: Box },
  { name: 'Procurement', path: '/procurement', icon: ShoppingCart },
  { name: 'Finance', path: '/finance', icon: DollarSign },
  { name: 'HR & Payroll', path: '/hr', icon: UserCog },
  { name: 'Analytics', path: '/analytics', icon: BarChart },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-primary-dark text-white flex flex-col shadow-lg z-20 transition-all duration-300">
      <div className="h-16 flex items-center px-6 bg-primary-dark border-b border-primary/20 bg-opacity-90 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white font-bold text-xl">H</div>
          <span className="font-bold text-lg tracking-wide uppercase">EpicHMS</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110`} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-primary/20">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">System Admin</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
