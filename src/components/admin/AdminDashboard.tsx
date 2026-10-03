import React, { useState, useEffect } from 'react';
import { 
  financialStorage, 
  subscribeToFinancials, 
  RevenueCategory, 
  ManualRevenueRecord, 
  ExpenseRecord,
  UnifiedTransactionItem 
} from '../../services/financialStorage';
import { 
  Plus, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  FileText, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  User, 
  CheckCircle2, 
  X, 
  Receipt, 
  TrendingUp, 
  Briefcase, 
  Smartphone, 
  Globe, 
  Cpu, 
  Sparkles, 
  Package, 
  Tag,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState(financialStorage.getDashboardAnalytics());
  const [activeTab, setActiveTab] = useState<'overview' | 'manual-revenue' | 'expenses' | 'transactions'>('overview');

  // Manual Revenue Modal
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [revCategory, setRevCategory] = useState<RevenueCategory>('Website');
  const [revClientName, setRevClientName] = useState('');
  const [revBusinessName, setRevBusinessName] = useState('');
  const [revProject, setRevProject] = useState('');
  const [revAmount, setRevAmount] = useState<number | ''>('');
  const [revPaymentMethod, setRevPaymentMethod] = useState<'UPI' | 'Bank Transfer (NEFT/RTGS/IMPS)' | 'Cash' | 'Cheque' | 'Demand Draft' | 'Other'>('UPI');
  const [revPaymentRef, setRevPaymentRef] = useState('');
  const [revPaymentDate, setRevPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [revNotes, setRevNotes] = useState('');

  // Expenses Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseRecord['category']>('Hosting & Infrastructure');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expPaymentMethod, setExpPaymentMethod] = useState<ExpenseRecord['paymentMethod']>('UPI');
  const [expDate, setExpDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expVendor, setExpVendor] = useState('');
  const [expReference, setExpReference] = useState('');
  const [expNotes, setExpNotes] = useState('');

  // Ledger Filters
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'RAZORPAY' | 'MANUAL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const refreshData = () => {
    setAnalytics(financialStorage.getDashboardAnalytics());
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToFinancials(refreshData);
    return () => unsub();
  }, []);

  const handleAddRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revClientName.trim() || !revProject.trim() || !revAmount || Number(revAmount) <= 0) {
      alert('Please fill in Client Name, Project/Service, and a valid Amount.');
      return;
    }

    await financialStorage.addManualRevenue({
      category: revCategory,
      clientName: revClientName.trim(),
      businessName: revBusinessName.trim() || 'N/A',
      projectOrService: revProject.trim(),
      amount: Number(revAmount),
      paymentMethod: revPaymentMethod,
      paymentReference: revPaymentRef.trim() || 'Manual Verified',
      paymentDate: revPaymentDate,
      notes: revNotes.trim()
    });

    // Reset Form
    setRevClientName('');
    setRevBusinessName('');
    setRevProject('');
    setRevAmount('');
    setRevPaymentRef('');
    setRevNotes('');
    setIsRevenueModalOpen(false);
    showToast('Manual revenue record logged successfully.');
  };

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim() || !expAmount || Number(expAmount) <= 0 || !expVendor.trim()) {
      alert('Please fill in Expense Name, Vendor, and a valid Amount.');
      return;
    }

    await financialStorage.addExpense({
      name: expName.trim(),
      category: expCategory,
      amount: Number(expAmount),
      paymentMethod: expPaymentMethod,
      date: expDate,
      vendor: expVendor.trim(),
      reference: expReference.trim(),
      notes: expNotes.trim()
    });

    // Reset Form
    setExpName('');
    setExpAmount('');
    setExpVendor('');
    setExpReference('');
    setExpNotes('');
    setIsExpenseModalOpen(false);
    showToast('Expense recorded successfully.');
  };

  const handleDeleteRevenue = async (id: string) => {
    if (window.confirm('Delete this manual revenue entry? This cannot be undone.')) {
      await financialStorage.deleteManualRevenue(id);
      showToast('Revenue entry removed.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Delete this expense entry? This cannot be undone.')) {
      await financialStorage.deleteExpense(id);
      showToast('Expense entry removed.');
    }
  };

  // Filtered transactions
  const filteredTransactions = analytics.transactions.filter(t => {
    const matchesSource = sourceFilter === 'ALL' || t.source === sourceFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      t.id.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      (t.businessName && t.businessName.toLowerCase().includes(q)) ||
      t.description.toLowerCase().includes(q) ||
      t.paymentReference.toLowerCase().includes(q);

    return matchesSource && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E1DA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              Financial Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              Real Records Only
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Audited, data-driven revenue, sales counts, and verified expense accounting. No simulated data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRevenueModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C79A22]" />
            <span>Add Revenue</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-[#E4E1DA] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-rose-500" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={refreshData}
            title="Refresh Ledger"
            className="p-2 rounded-xl bg-white border border-[#E4E1DA] text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards (Real Values Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626873] text-xs font-semibold">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C79A22] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#171A1F] tabular-nums">
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#626873]">
            {analytics.totalSalesCount > 0 ? (
              <span className="font-semibold text-emerald-700">{analytics.totalSalesCount} actual sales recorded</span>
            ) : (
              <span className="text-slate-400">0 Sales · No records yet</span>
            )}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626873] text-xs font-semibold">
            <span>Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 tabular-nums">
            ₹{analytics.totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#626873]">
            {financialStorage.getExpenses().length > 0 ? (
              <span>{financialStorage.getExpenses().length} expense items</span>
            ) : (
              <span className="text-slate-400">₹0 Expenses · No records yet</span>
            )}
          </div>
        </div>

        {/* Net Revenue / Profit */}
        <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626873] text-xs font-semibold">
            <span>Net Revenue / Profit</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              analytics.netRevenue >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tabular-nums ${
            analytics.netRevenue >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            ₹{analytics.netRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#626873]">
            {analytics.hasRecords ? (
              <span>Revenue minus all logged expenses</span>
            ) : (
              <span className="text-slate-400">₹0 Profit · No records yet</span>
            )}
          </div>
        </div>

        {/* Service Bookings Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626873] text-xs font-semibold">
            <span>Service Bookings (₹199)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2563EB] tabular-nums">
            ₹{analytics.serviceBookingRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#626873]">
            <span>Razorpay verified consultation bookings</span>
          </div>
        </div>
      </div>

      {/* Categorized Revenue Breakdown Grid */}
      <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#171A1F] uppercase tracking-wider">
            Revenue by Service Stream
          </h2>
          <span className="text-xs text-[#626873]">Calculated from verified receipts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Website Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Website</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.websiteRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          {/* App Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-purple-500" />
              <span>App</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.appRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Custom Software Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>Software</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.customSoftwareRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          {/* AI Automation Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>AI Automation</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.aiAutomationRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          {/* ERP/CRM Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>ERP & CRM</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.erpCrmRevenue.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Digital Product Revenue */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>Digital Products</span>
            </div>
            <div className="text-lg font-black text-[#171A1F] tabular-nums">
              ₹{analytics.digitalProductRevenue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Transactions Ledger / Manual Revenue / Expenses */}
      <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
          }`}
        >
          <Receipt className="w-4 h-4 text-[#C79A22]" />
          <span>All Revenue Ledger ({analytics.transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manual-revenue')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'manual-revenue'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-500" />
          <span>Manual Revenues ({financialStorage.getManualRevenue().length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-rose-500" />
          <span>Expenses ({financialStorage.getExpenses().length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: REVENUE LEDGER */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, business, ID, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-700"
              >
                <option value="ALL">All Payment Sources</option>
                <option value="RAZORPAY">Razorpay Gateway (Online)</option>
                <option value="MANUAL">Manual Offline Payment</option>
              </select>
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="Service Booking">Service Booking (₹199)</option>
                <option value="Digital Product">Digital Product</option>
                <option value="Website">Website</option>
                <option value="App">App</option>
                <option value="Custom Software">Custom Software</option>
                <option value="AI Automation">AI Automation</option>
                <option value="ERP/CRM">ERP/CRM</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No transactions recorded yet</h3>
              <p className="text-xs text-slate-400">
                Verified Razorpay service bookings, digital product sales, and manual revenue logs will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{tx.id}</span>
                      
                      {/* Source Badge: STRICTLY RAZORPAY vs MANUAL */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        tx.source === 'RAZORPAY'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {tx.source === 'RAZORPAY' ? '⚡ RAZORPAY' : '📝 MANUAL'}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {tx.category}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(tx.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{tx.clientName}</strong>
                        {tx.businessName && tx.businessName !== 'N/A' && (
                          <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {tx.businessName}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-xs">{tx.description}</p>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                        <span>Method: <strong>{tx.paymentMethod}</strong></span>
                        <span className="font-mono">Ref: {tx.paymentReference}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-emerald-600 tabular-nums">
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Verified Payment</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: MANUAL REVENUES */}
      {activeTab === 'manual-revenue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#626873]">
              Offline or direct payments (NEFT/RTGS, UPI, Cash) recorded with client details.
            </p>
            <button
              onClick={() => setIsRevenueModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Add Revenue</span>
            </button>
          </div>

          {financialStorage.getManualRevenue().length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No manual revenue records</h3>
              <p className="text-xs text-slate-400">
                Payments collected outside the Razorpay website gateway can be added here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
              {financialStorage.getManualRevenue().map((r) => (
                <div key={r.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{r.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                        MANUAL
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {r.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {r.paymentDate}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <strong className="text-slate-900">{r.clientName}</strong>
                      {r.businessName && r.businessName !== 'N/A' && (
                        <span className="text-slate-500 ml-2">({r.businessName})</span>
                      )}
                      <p className="text-slate-700">{r.projectOrService}</p>
                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-3 pt-0.5">
                        <span>Method: {r.paymentMethod}</span>
                        <span className="font-mono">Ref: {r.paymentReference}</span>
                        {r.notes && <span className="italic">Note: "{r.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-600 tabular-nums">
                        +₹{r.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRevenue(r.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#626873]">
              Actual operational overheads, hosting, APIs, tools, and contractor fees.
            </p>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-[#E4E1DA] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" />
              <span>Add Expense</span>
            </button>
          </div>

          {financialStorage.getExpenses().length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No expenses recorded yet</h3>
              <p className="text-xs text-slate-400">
                Log hosting invoices, API bills, contractor payouts, and domain renewals to calculate true net profit.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
              {financialStorage.getExpenses().map((e) => (
                <div key={e.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{e.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {e.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {e.date}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <strong className="text-slate-900 text-sm">{e.name}</strong>
                      <div className="text-slate-600 flex flex-wrap gap-3 pt-0.5 text-[11px]">
                        <span>Vendor: <strong>{e.vendor}</strong></span>
                        <span>Paid via: {e.paymentMethod}</span>
                        {e.reference && <span className="font-mono">Ref: {e.reference}</span>}
                        {e.notes && <span className="italic">"{e.notes}"</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-rose-600 tabular-nums">
                        -₹{e.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD MANUAL REVENUE */}
      {isRevenueModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsRevenueModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E4E1DA] shadow-2xl p-6 space-y-5 text-left my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">
                  Manual Accounting Entry
                </span>
                <h3 className="text-lg font-black text-[#171A1F]">Add Offline Revenue</h3>
              </div>
              <button
                onClick={() => setIsRevenueModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRevenueSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Revenue Category *</label>
                  <select
                    value={revCategory}
                    onChange={(e) => setRevCategory(e.target.value as RevenueCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Website">Website</option>
                    <option value="App">App</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="ERP/CRM">ERP/CRM</option>
                    <option value="Digital Product">Digital Product</option>
                    <option value="Service Booking">Service Booking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 25000"
                    value={revAmount}
                    onChange={(e) => setRevAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={revClientName}
                    onChange={(e) => setRevClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Logistics"
                    value={revBusinessName}
                    onChange={(e) => setRevBusinessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Project / Service Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Web Portal + CRM Backend"
                  value={revProject}
                  onChange={(e) => setRevProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={revPaymentMethod}
                    onChange={(e) => setRevPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer (NEFT/RTGS/IMPS)</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Demand Draft">Demand Draft</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Reference / UTR</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/123456789012"
                    value={revPaymentRef}
                    onChange={(e) => setRevPaymentRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Date</label>
                <input
                  type="date"
                  value={revPaymentDate}
                  onChange={(e) => setRevPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Scope Summary</label>
                <textarea
                  rows={2}
                  placeholder="Optional billing or milestone remarks"
                  value={revNotes}
                  onChange={(e) => setRevNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E4E1DA]">
                <button
                  type="button"
                  onClick={() => setIsRevenueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Manual Revenue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXPENSE */}
      {isExpenseModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsExpenseModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E4E1DA] shadow-2xl p-6 space-y-5 text-left my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                  Expense Management
                </span>
                <h3 className="text-lg font-black text-[#171A1F]">Record Business Expense</h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expense Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Server Hosting"
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 4500"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Hosting & Infrastructure">Hosting & Infrastructure</option>
                    <option value="APIs & AI Services">APIs & AI Services</option>
                    <option value="Domain & SSL">Domain & SSL</option>
                    <option value="Software Licenses & Tools">Software Licenses & Tools</option>
                    <option value="Marketing & Ads">Marketing & Ads</option>
                    <option value="Contractors & Payroll">Contractors & Payroll</option>
                    <option value="Equipment & Hardware">Equipment & Hardware</option>
                    <option value="Office & Utilities">Office & Utilities</option>
                    <option value="Taxes & Compliance">Taxes & Compliance</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vendor / Payee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS / Google Cloud"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={expPaymentMethod}
                    onChange={(e) => setExpPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reference / Bill / Receipt ID</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-9921"
                  value={expReference}
                  onChange={(e) => setExpReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional remarks regarding this expenditure"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E4E1DA]">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
