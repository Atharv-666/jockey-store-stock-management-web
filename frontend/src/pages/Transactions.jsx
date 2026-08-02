import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import Badge from '../components/common/Badge';
import POSModal from '../components/pos/POSModal';
import { ArrowUpDown, ShoppingBag, Plus, Search, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const defaultTransactions = [
  {
    _id: 'txn_1',
    referenceNo: 'TXN-849201-102',
    transactionType: 'SALE',
    totalAmount: 179.98,
    createdAt: '2026-08-01T14:22:00Z',
    items: [
      { title: 'Vintage Denim Trucker Jacket', size: 'M', color: 'Vintage Blue', quantity: 2, price: 89.99 },
    ],
    notes: 'POS Register Sale',
  },
  {
    _id: 'txn_2',
    referenceNo: 'TXN-739102-409',
    transactionType: 'RESTOCK',
    totalAmount: 840.0,
    createdAt: '2026-08-01T10:15:00Z',
    items: [
      { title: 'Pro-Flex DryFit Training Hoodie', size: 'L', color: 'Charcoal Black', quantity: 20, price: 42.0 },
    ],
    notes: 'Restock shipment batch #440',
  },
];

const defaultProductsForPOS = [
  {
    _id: 'prod_1',
    title: 'Vintage Denim Trucker Jacket',
    sku: 'APP-102948',
    variants: [
      { _id: 'v1', size: 'S', color: 'Vintage Blue', price: 89.99, stockQuantity: 8, sku: 'APP-102-S' },
      { _id: 'v2', size: 'M', color: 'Vintage Blue', price: 89.99, stockQuantity: 18, sku: 'APP-102-M' },
    ],
  },
  {
    _id: 'prod_2',
    title: 'Silk Evening Wrap Maxi Dress',
    sku: 'APP-304912',
    variants: [
      { _id: 'v4', size: 'S', color: 'Emerald Green', price: 149.99, stockQuantity: 2, sku: 'APP-304-S' },
    ],
  },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosClient.get('/transactions');
      if (data.success && data.data.length > 0) {
        setTransactions(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCompletePOS = async (transactionData) => {
    try {
      const { data } = await axiosClient.post('/transactions', transactionData);
      if (data.success) {
        setTransactions([data.data, ...transactions]);
        toast.success('Sale registered successfully');
      }
    } catch (e) {
      const newTxn = {
        _id: `txn_${Date.now()}`,
        referenceNo: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        transactionType: transactionData.transactionType,
        totalAmount: transactionData.items.reduce((acc, c) => acc + c.price * c.quantity, 0),
        createdAt: new Date().toISOString(),
        items: transactionData.items,
        notes: transactionData.notes,
      };
      setTransactions([newTxn, ...transactions]);
      toast.success('Sale recorded locally');
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || t.transactionType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-6 h-6 text-indigo-400" />
            <span>Stock Movement & Sales Log</span>
          </h2>
          <p className="text-sm text-slate-400">
            Real-time audit log of stock checkouts, restocks, and returns
          </p>
        </div>

        <button
          onClick={() => setIsPOSOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>New POS Register Sale</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search TXN reference or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['All', 'SALE', 'RESTOCK', 'RETURN', 'ADJUSTMENT'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Reference No</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Items Included</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTransactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-indigo-400">{txn.referenceNo}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      txn.transactionType === 'SALE'
                        ? 'emerald'
                        : txn.transactionType === 'RESTOCK'
                        ? 'indigo'
                        : txn.transactionType === 'RETURN'
                        ? 'amber'
                        : 'rose'
                    }
                  >
                    {txn.transactionType}
                  </Badge>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div className="text-xs text-slate-200 font-medium">
                    {txn.items?.map((i) => `${i.title} (${i.size}) x${i.quantity}`).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 font-extrabold text-slate-100">
                  ${txn.totalAmount ? txn.totalAmount.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedReceipt(txn)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POS Modal */}
      <POSModal
        isOpen={isPOSOpen}
        onClose={() => setIsPOSOpen(false)}
        products={defaultProductsForPOS}
        onCompleteTransaction={handleCompletePOS}
      />
    </div>
  );
};

export default Transactions;
