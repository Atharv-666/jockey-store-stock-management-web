import React from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Shirt, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const reportData = [
  { category: 'Shirts & Tops', sales: 14200, cost: 6800, profit: 7400 },
  { category: 'Jeans & Denim', sales: 18900, cost: 9200, profit: 9700 },
  { category: 'Dresses & Skirts', sales: 12400, cost: 5800, profit: 6600 },
  { category: 'Outerwear', sales: 15600, cost: 8100, profit: 7500 },
  { category: 'Activewear', sales: 9800, cost: 4200, profit: 5600 },
];

const Analytics = () => {
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Category,Sales Revenue,Inventory Cost,Net Profit\n' +
      reportData.map((e) => `${e.category},${e.sales},${e.cost},${e.profit}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clothing_inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Inventory Audit CSV Report exported!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Store Performance & Inventory Reports</span>
          </h2>
          <p className="text-sm text-slate-400">
            Financial stock valuation, gross profit margin, and category turnover audit
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Gross Sales Revenue" value="$70,900" icon={DollarSign} color="emerald" trend="up" trendValue="15.2%" />
        <StatCard title="Inventory Acquisition Cost" value="$34,100" icon={Shirt} color="indigo" />
        <StatCard title="Net Inventory Profit Margin" value="$36,800 (51.9%)" icon={TrendingUp} color="amber" trend="up" trendValue="6.4%" />
      </div>

      {/* Main Bar Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Category Profitability Breakdown</h3>
            <p className="text-xs text-slate-400">Revenue vs Stock acquisition cost per apparel category</p>
          </div>
          <Badge variant="emerald">Audit Ready</Badge>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="sales" name="Sales Revenue ($)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cost" name="Stock Cost ($)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Net Margin ($)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
