import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-slate-200">
        <p className="font-bold text-indigo-400 mb-1">{label}</p>
        <p className="text-slate-300">
          Available Stock: <span className="font-bold text-emerald-400">{payload[0]?.value} units</span>
        </p>
        <p className="text-slate-300">
          Units Sold: <span className="font-bold text-indigo-400">{payload[1]?.value} units</span>
        </p>
      </div>
    );
  }
  return null;
};

const OverviewChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No sales vs stock analytics data available.
      </div>
    );
  }

  return (
    <div className="w-full h-80 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(value) => <span className="text-slate-300">{value}</span>}
          />
          <Bar dataKey="remainingStock" name="Remaining Stock" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="unitsSold" name="Units Sold" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewChart;
