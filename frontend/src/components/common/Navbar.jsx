import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Shirt,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Watch,
  Baby,
  FileSpreadsheet,
  LogOut,
  User,
  PlusCircle,
  BarChart3,
} from 'lucide-react';

const Navbar = ({ onOpenReorderModal, onOpenAddSaleModal, onOpenMonthlySalesReportModal, onOpenAuthModal }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const categories = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: "Men's Wear", path: "/category/Men's Wear", icon: Shirt },
    { name: "Women's Wear", path: "/category/Women's Wear", icon: Sparkles },
    { name: 'Accessories', path: '/category/Accessories', icon: Watch },
    { name: "Kid's Wear", path: "/category/Kid's Wear", icon: Baby },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || decodeURIComponent(location.pathname) === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Store Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                ATTIRE<span className="text-indigo-400 font-extrabold">FLOW</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold text-slate-400 ml-2 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                Clothing Inventory
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = isActive(cat.path);
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddSaleModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Add Sale
            </button>

            <button
              onClick={onOpenMonthlySalesReportModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Sales Report
            </button>

            <button
              onClick={onOpenReorderModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              Reorder Sheet
            </button>

            {/* Profile & Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
