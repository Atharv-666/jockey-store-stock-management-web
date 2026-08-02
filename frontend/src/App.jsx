import React from 'react';
import { StockProvider, useStock } from './context/StockContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MainDashboard from './pages/MainDashboard';
import CategoryDashboard from './pages/CategoryDashboard';
import ProductsPage from './pages/ProductsPage';
import SaleHistoryPage from './pages/SaleHistoryPage';
import LowStockWarningPage from './pages/LowStockWarningPage';
import OutOfStockPage from './pages/OutOfStockPage';
import NewStockNeededPage from './pages/NewStockNeededPage';
import AuthPage from './pages/AuthPage';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { user, activeTab, theme } = useStock();

  // FIRST PAGE AUTHENTICATION GUARD: If user is not logged in, force AuthPage as the FIRST page
  if (!user) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100 font-sans'
      }`}>
        <AuthPage />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: theme === 'light' ? '#ffffff' : '#0f172a',
              color: theme === 'light' ? '#0f172a' : '#f8fafc',
              border: theme === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'category':
        return <CategoryDashboard />;
      case 'products':
        return <ProductsPage />;
      case 'sales':
      case 'sale-history':
        return <SaleHistoryPage />;
      case 'low-stock':
        return <LowStockWarningPage />;
      case 'out-of-stock':
        return <OutOfStockPage />;
      case 'reorder':
      case 'new-stock-needed':
        return <NewStockNeededPage />;
      case 'auth':
      case 'login':
      case 'signup':
        return <AuthPage />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100 font-sans'
    }`}>
      <Navbar />
      
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Main Content Area - Expands broadly */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'light' ? '#ffffff' : '#0f172a',
            color: theme === 'light' ? '#0f172a' : '#f8fafc',
            border: theme === 'light' ? '1px solid #e2e8f0' : '1px solid #1e293b',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <StockProvider>
      <AppContent />
    </StockProvider>
  );
}

export default App;
