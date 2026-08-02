import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { Shirt, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const { user, setUser, setActiveTab, theme, formatCurrency } = useStock();

  const isLight = theme === 'light';
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Inventory Manager');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    if (!isLogin && !name) {
      toast.error('Please enter your full name');
      return;
    }

    const userInfo = {
      name: name || (isLogin ? 'Jockey Employee' : 'New Employee'),
      email,
      role,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUser(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    toast.success(
      isLogin
        ? `Welcome back, ${userInfo.name}!`
        : `Employee Account created for ${userInfo.name}!`
    );

    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out from Jockey Staff Portal');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl rounded-3xl border overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Left Side: Brand & Feature Showcase */}
        <div className={`p-8 md:p-10 flex flex-col justify-between relative overflow-hidden ${
          isLight
            ? 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white'
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border-r border-slate-800'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Shirt className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">JOCKEY</h1>
                <p className="text-xs text-indigo-200 font-semibold">Store Stock PRO Portal</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold leading-tight mb-4">
              {isLogin ? 'Official Employee Authentication Portal' : 'Register Store Staff Account'}
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed mb-6">
              Real-time stock synchronization, automatic low stock thresholds, and transaction reporting for Jockey retail outlets in INR (₹).
            </p>

            {/* Feature Bullet List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atomic database stock lock to prevent negative inventory</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant low-stock alerts & automated purchase order sheets</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dual theme support (Dark & Light) with INR (₹) formatting</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <Building2 className="w-4 h-4" /> Jockey Authorized Outlet
            </span>
            <span className="font-mono text-[11px] opacity-75">v2.4 Production</span>
          </div>

          {/* Decorative background blob */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Auth Form / Profile Card */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          {user ? (
            /* Logged In View */
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-indigo-500/30 uppercase">
                {user.name ? user.name.charAt(0) : 'J'}
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active Employee Session
                </span>
                <h3 className={`text-xl font-bold mt-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {user.name || 'Jockey Employee'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                <p className="text-xs font-semibold text-indigo-500 mt-1">{user.role || 'Inventory Manager'}</p>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  Go to Main Dashboard <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full py-3 rounded-2xl text-xs font-semibold border transition-all ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-rose-600 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border-slate-700'
                  }`}
                >
                  Logout from Staff Account
                </button>
              </div>
            </div>
          ) : (
            /* Login / Signup Form */
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className={`p-1 rounded-2xl border flex ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800/80 border-slate-700'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isLogin
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Staff Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    !isLogin
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register Staff
                </button>
              </div>

              <div>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isLogin ? 'Sign In to Jockey Portal' : 'Create New Employee Account'}
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isLogin
                    ? 'Enter your store employee credentials to access inventory controls.'
                    : 'Fill in details to register a new store employee account.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required={!isLogin}
                        placeholder="e.g. Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 ${
                          isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1">Store Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="employee@jockey.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Employee PIN / Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Store Role</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`w-full border rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      <option value="Inventory Manager">Inventory Manager</option>
                      <option value="Sales Associate">Sales Associate</option>
                      <option value="Store Manager">Store Manager</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all pt-3"
                >
                  <span>{isLogin ? 'Sign In to Staff Portal' : 'Register Employee Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
