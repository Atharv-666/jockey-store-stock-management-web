import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState({ lowStockList: [], outOfStockList: [], reorderList: [] });
  const [loading, setLoading] = useState(true);

  // Active view navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState("Men's");
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');

  // Dark / Light Theme Toggle State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Auth / User state - Defaults to NULL to force Login/Signup as the FIRST PAGE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  // Currency Formatter Helper (INR ₹)
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const prodRes = await axiosClient.get('/products');
      if (prodRes.data && prodRes.data.success) {
        setProducts(prodRes.data.data);
      }

      const salesRes = await axiosClient.get('/sales');
      if (salesRes.data && salesRes.data.success) {
        setSalesHistory(salesRes.data.data);
      }

      const analyticsRes = await axiosClient.get('/sales/analytics/dashboard');
      if (analyticsRes.data && analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

      const reportsRes = await axiosClient.get('/sales/reports');
      if (reportsRes.data && reportsRes.data.success) {
        setReports(reportsRes.data.data);
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
      toast.error('Failed to sync live stock data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // ACTION: Seed Sample Data
  const seedSampleData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.post('/products/seed');
      if (data.success) {
        toast.success('⚡ Sample Jockey Inventory & Sales Data Loaded Successfully!');
        await fetchAllData();
      }
    } catch (error) {
      toast.error('Failed to seed sample data');
    } finally {
      setLoading(false);
    }
  };

  // ACTION: Record Sale
  const recordSale = async ({ productId, color, size, quantity }) => {
    try {
      const { data } = await axiosClient.post('/products/sale', {
        productId,
        color,
        size,
        quantity: Number(quantity),
      });

      if (data.success) {
        toast.success(data.message || 'Sale recorded successfully!');
        await fetchAllData();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to record sale';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // ACTION: Restock Product
  const restockProduct = async ({ productId, color, size, quantity }) => {
    try {
      const { data } = await axiosClient.post('/products/restock', {
        productId,
        color,
        size,
        quantity: Number(quantity),
      });

      if (data.success) {
        toast.success(data.message || 'Stock updated successfully!');
        await fetchAllData();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to restock';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // ACTION: Add Product
  const addProduct = async (productData) => {
    try {
      const { data } = await axiosClient.post('/products', productData);
      if (data.success) {
        toast.success(`Product "${productData.name}" added to inventory!`);
        await fetchAllData();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add product';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // ACTION: Delete Product
  const deleteProduct = async (id, name) => {
    try {
      const { data } = await axiosClient.delete(`/products/${id}`);
      if (data.success) {
        toast.success(`"${name || 'Product'}" removed from inventory`);
        await fetchAllData();
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to delete product');
      return { success: false };
    }
  };

  return (
    <StockContext.Provider
      value={{
        products,
        salesHistory,
        analytics,
        reports,
        loading,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        subCategoryFilter,
        setSubCategoryFilter,
        theme,
        toggleTheme,
        formatCurrency,
        user,
        setUser,
        fetchAllData,
        seedSampleData,
        recordSale,
        restockProduct,
        addProduct,
        deleteProduct,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
