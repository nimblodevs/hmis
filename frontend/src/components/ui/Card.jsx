import React from 'react';

const Card = ({ children, title, subtitle, className = '', headerAction }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-silver-200 overflow-hidden flex flex-col ${className}`}>
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-silver-100 flex items-center justify-between bg-white/50">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-silver-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5 flex-1">
        {children}
      </div>
    </div>
  );
};

export default Card;
