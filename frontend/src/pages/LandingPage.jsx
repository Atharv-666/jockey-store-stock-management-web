import React from 'react';
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Shirt,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const LandingPage = ({ onOpenAuthModal }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Blur Gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            ATTIRE<span className="text-indigo-400">FLOW</span>
          </span>
        </div>
        <button
          onClick={onOpenAuthModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
        >
          Sign In to Portal
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Smart Apparel & Retail Inventory Engine 2026
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Precision <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Size-Wise Stock</span> & Sales Intelligence for Apparel
        </h1>

        <p className="mt-6 text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          Eliminate stockouts, automate supplier reorders without spreadsheets, and track size-wise inventory levels (`S`, `M`, `L`, `XL`, `XXL`) in real-time.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <button
            onClick={onOpenAuthModal}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Shirt className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Size-Wise Breakdown</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Track garment stock per size pill (`S`, `M`, `L`, `XL`, `XXL`) with automated threshold health badges.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Embedded Quick Sales</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Log sales directly from product cards using quick `-1`, `-5`, `-10` buttons with real-time chart synchronization.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1-Click Supplier Reorder</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Generate supplier shopping lists automatically based on current deficits and monthly sales velocity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 z-10">
        © 2026 Clothing Store Stock & Inventory Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
