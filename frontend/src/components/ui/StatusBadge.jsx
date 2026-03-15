import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    clay: 'bg-clay-100 text-clay-800 border-clay-200',
    default: 'bg-silver-100 text-silver-800 border-silver-200',
  };

  const getStatusType = (statusString) => {
    const s = statusString.toLowerCase();
    if (['active', 'completed', 'discharged', 'normal', 'paid', 'approved'].includes(s)) return 'success';
    if (['pending', 'waiting', 'in-progress', 'high'].includes(s)) return 'warning';
    if (['critical', 'emergency', 'cancelled', 'rejected'].includes(s)) return 'danger';
    if (['admitted', 'scheduled', 'submitted', 'in-theatre'].includes(s)) return 'info';
    return type;
  };

  const appliedStyle = styles[type !== 'default' ? type : getStatusType(status)];

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${appliedStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
