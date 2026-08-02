import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo' }) => {
  const colorGradients = {
    indigo: 'from-indigo-500/20 to-purple-500/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20',
  };

  const iconBgs = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border border-white/5 ${iconBgs[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
