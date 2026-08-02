import React from 'react';
import { useStock } from '../context/StockContext';
import {
  Shirt,
  User,
  LogOut,
  BellRing,
  Layers,
  Sun,
  Moon,
  LogIn
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    reports,
    user,
    setUser,
    theme,
    toggleTheme
  } = useStock();

  const categories = ["Men's", "Women's", "Kids", "Accessories"];

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('category');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out from Jockey Staff Portal');
  };

  const alertCount = (reports.lowStockList?.length || 0) + (reports.outOfStockList?.length || 0);

  return (
    <header className={`border-b sticky top-0 z-40 shadow-xl backdrop-blur-md transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
        : 'bg-slate-900/95 border-slate-800 text-white'
    }`}>
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-xl tracking-tight flex items-center gap-2 ${
              theme === 'light' ? 'text-slate-900' : 'bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent'
            }`}>
              JOCKEY <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 font-semibold border border-indigo-500/30">Stock PRO</span>
            </h1>
            <p className={`text-xs font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Official Store Inventory System (INR ₹)</p>
          </div>
        </div>

        {/* Category Shortcuts Navigation */}
        <div className={`hidden md:flex items-center space-x-1 p-1 rounded-xl border ${
          theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700/50'
        }`}>
          {categories.map((cat) => {
            const isSelected = activeTab === 'category' && selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* User Section, Dark/Light Mode Toggle & Quick Alerts */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* DARK / LIGHT MODE TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-slate-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline text-slate-700">Dark</span>
              </>
            )}
          </button>

          {/* Low Stock Alert Indicator */}
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`relative p-2.5 rounded-xl border transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 border-slate-700/50'
            }`}
            title="Stock Warnings"
          >
            <BellRing className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* Dedicated Full Page Auth Trigger */}
          {user ? (
            <div className={`flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 border-slate-300'
                : 'bg-slate-800/90 border-slate-700/60'
            }`}>
              <div className="flex items-center gap-2" onClick={() => setActiveTab('auth')}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-inner">
                  {user.name ? user.name.charAt(0) : 'J'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-xs font-semibold leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>{user.name || 'Jockey Employee'}</p>
                  <p className="text-[10px] text-indigo-500 font-medium">{user.role || 'Inventory Manager'}</p>
                </div>
              </div>
              <div className={`h-4 w-px mx-1 ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-700'}`}></div>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('auth')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Staff Portal / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
