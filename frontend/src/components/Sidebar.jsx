import React from 'react';
import { useStock } from '../context/StockContext';
import {
  LayoutDashboard,
  Package,
  History,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  Boxes
} from 'lucide-react';

const Sidebar = () => {
  const { activeTab, setActiveTab, reports, theme } = useStock();

  const lowStockCount = reports.lowStockList?.length || 0;
  const outOfStockCount = reports.outOfStockList?.length || 0;
  const reorderCount = reports.reorderList?.length || 0;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products',
      label: 'Products Hub',
      icon: Package,
      badge: null,
    },
    {
      id: 'sales',
      label: 'Sale History',
      icon: History,
      badge: null,
    },
    {
      id: 'low-stock',
      label: 'Low Stock Warning',
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: theme === 'light' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'out-of-stock',
      label: 'Out of Stock',
      icon: XCircle,
      badge: outOfStockCount > 0 ? outOfStockCount : null,
      badgeColor: theme === 'light' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'reorder',
      label: 'New Stock Needed',
      icon: ShoppingCart,
      badge: reorderCount > 0 ? reorderCount : null,
      badgeColor: theme === 'light' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
  ];

  return (
    <aside className={`w-full rounded-2xl border p-4 transition-colors duration-200 ${
      theme === 'light' ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      <div className="space-y-6">
        <div>
          <p className={`px-3 text-[11px] font-bold uppercase tracking-wider mb-3 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Core Operations
          </p>
          <nav className="space-y-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'sales' && activeTab === 'sale-history');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className={`px-3 text-[11px] font-bold uppercase tracking-wider mb-3 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Inventory & Re-Order Reports
          </p>
          <nav className="space-y-1">
            {navItems.slice(3).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'reorder' && activeTab === 'new-stock-needed');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className={`rounded-2xl p-4 border text-left ${
            theme === 'light' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-800/50 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
              <Boxes className="w-4 h-4 text-indigo-500" />
              <span>Real-time Stock Engine</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Every sale logs directly to database, recalculates minimum thresholds, and updates low-stock lists automatically in INR (₹).
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
