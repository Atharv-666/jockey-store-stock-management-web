import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Tag,
  Award,
  ArrowUpDown,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products & Stock', path: '/products', icon: Shirt },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Brands', path: '/brands', icon: Award },
    { name: 'Stock Transactions', path: '/transactions', icon: ArrowUpDown },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-40">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Shirt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Stitch<span className="text-indigo-400">Flow</span>
            </h1>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Clothing Inventory</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800">
        <div className="glass-panel p-3.5 rounded-xl text-xs relative overflow-hidden">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Smart Inventory</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Auto-tracking sizes, colors, low stock thresholds & sales dynamics.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
