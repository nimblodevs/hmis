import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopNav = () => {
  const { currentUser, switchRole, ROLES } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-silver-300 flex items-center justify-between px-6 shadow-sm z-10 w-full">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-silver-500 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-silver-300 rounded-md leading-5 bg-silver-50 placeholder-silver-500 focus:outline-none focus:placeholder-silver-400 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white sm:text-sm transition-all shadow-inner"
            placeholder="Search patients, doctors, medical records, invoices..."
          />
        </div>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-6 ml-4">
        <button className="relative p-2 text-silver-500 hover:text-primary transition-colors rounded-full hover:bg-silver-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-clay-200 border border-clay-300 flex items-center justify-center text-clay-700 font-medium group-hover:ring-2 group-hover:ring-primary/20 transition-all">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden md:block text-sm">
            <div className="font-bold text-slate-800">{currentUser.name}</div>
            <select 
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value)}
              className="text-xs text-clay-500 bg-transparent outline-none cursor-pointer hover:text-primary mt-0.5 w-full"
            >
              {Object.values(ROLES).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
