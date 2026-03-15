import React from 'react';

const Table = ({ columns, data, keyField }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-slate-700 border-collapse">
        <thead className="text-xs text-clay-700 uppercase bg-silver-50 border-b border-silver-200 sticky top-0">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3 font-semibold tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-silver-100 bg-white">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-silver-50/50 transition-colors duration-150">
              {columns.map((col, idx) => (
                <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-clay-500 italic">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
