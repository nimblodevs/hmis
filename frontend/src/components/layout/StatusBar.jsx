import React, { useState, useEffect } from 'react';
import { Wifi, Activity, Database, Clock } from 'lucide-react';

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-clay-800 text-silver-300 flex items-center justify-between px-4 text-xs select-none shadow-inner z-10 w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-clay-200">EPIC HMS</span>
          <span>v2.4.1</span>
        </div>
        <div className="flex items-center gap-2 border-l border-clay-600 pl-4">
          <Database className="w-3 h-3 text-green-400" />
          <span>DB: Connected</span>
        </div>
        <div className="flex items-center gap-2 border-l border-clay-600 pl-4">
          <Activity className="w-3 h-3 text-blue-400" />
          <span>API: 12ms ping</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-clay-400">Environment:</span>
          <span className="font-medium text-silver-200">Production (Tier-3)</span>
        </div>
        <div className="flex items-center gap-2 border-l border-clay-600 pl-4">
          <Clock className="w-3 h-3" />
          <span className="font-mono">{time.toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2 border-l border-clay-600 pl-4 text-green-400">
          <Wifi className="w-3 h-3" />
          <span>Online</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
