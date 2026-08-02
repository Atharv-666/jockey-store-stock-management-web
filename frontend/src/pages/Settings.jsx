import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Shield, Store, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          <span>Store & Account Settings</span>
        </h2>
        <p className="text-sm text-slate-400">Manage apparel store information and active user profile</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{user?.name || 'Store Admin'}</h3>
            <p className="text-xs text-slate-400">{user?.email || 'admin@clothingstore.com'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Role: {user?.role || 'Store Manager'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-400" />
            <span>Clothing Store Location</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Store Name</label>
              <input
                type="text"
                readOnly
                value="StitchFlow Flagship Boutique"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Currency</label>
              <input
                type="text"
                readOnly
                value="USD ($)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-emerald-400 flex items-center space-x-1.5 font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>MERN System connected to MongoDB database & Cloudinary storage</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
