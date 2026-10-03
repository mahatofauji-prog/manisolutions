import { supabaseDatabase } from './supabaseDatabase';
import { serviceBookingStorage } from './serviceBookingStorage';
import { digitalProductsStorage } from './digitalProductsStorage';

export type RevenueCategory = 
  | 'Website'
  | 'App'
  | 'Custom Software'
  | 'AI Automation'
  | 'ERP/CRM'
  | 'Digital Product'
  | 'Service Booking'
  | 'Other';

export interface ManualRevenueRecord {
  id: string; // e.g. "REV-MANUAL-XXXX"
  category: RevenueCategory;
  clientName: string;
  businessName: string;
  projectOrService: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer (NEFT/RTGS/IMPS)' | 'Cash' | 'Cheque' | 'Demand Draft' | 'Other';
  paymentReference: string;
  paymentDate: string; // YYYY-MM-DD
  notes?: string;
  source: 'MANUAL';
  createdAt: string;
}

export interface ExpenseRecord {
  id: string; // e.g. "EXP-XXXX"
  name: string;
  category: 
    | 'Hosting & Infrastructure'
    | 'APIs & AI Services'
    | 'Domain & SSL'
    | 'Software Licenses & Tools'
    | 'Marketing & Ads'
    | 'Contractors & Payroll'
    | 'Equipment & Hardware'
    | 'Office & Utilities'
    | 'Taxes & Compliance'
    | 'Miscellaneous';
  amount: number;
  paymentMethod: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Cheque' | 'Other';
  date: string; // YYYY-MM-DD
  vendor: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface UnifiedTransactionItem {
  id: string;
  transactionType: 'Service Booking' | 'Digital Product Sale' | 'Manual Payment';
  category: RevenueCategory;
  clientName: string;
  businessName?: string;
  description: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  date: string;
  source: 'RAZORPAY' | 'MANUAL';
  status: string;
}

const MANUAL_REV_KEY = 'mani_manual_revenue_records_v1';
const EXPENSES_KEY = 'mani_expense_records_v1';

let inMemoryManualRevenue: ManualRevenueRecord[] = [];
let inMemoryExpenses: ExpenseRecord[] = [];

// LocalStorage Hydration
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedRev = localStorage.getItem(MANUAL_REV_KEY);
    if (storedRev) {
      const parsed = JSON.parse(storedRev);
      if (Array.isArray(parsed)) inMemoryManualRevenue = parsed;
    }
    const storedExp = localStorage.getItem(EXPENSES_KEY);
    if (storedExp) {
      const parsed = JSON.parse(storedExp);
      if (Array.isArray(parsed)) inMemoryExpenses = parsed;
    }
  }
} catch (e) {
  console.warn('Financial cache load notice:', e);
}

type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeToFinancials = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const notify = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch {}
  });
};

// Async Supabase Sync on Mount
export const syncFinancialsFromRemote = async () => {
  try {
    const [remoteRev, remoteExp] = await Promise.all([
      supabaseDatabase.getSetting<ManualRevenueRecord[]>('financial_manual_revenue'),
      supabaseDatabase.getSetting<ExpenseRecord[]>('financial_expenses')
    ]);

    if (remoteRev && Array.isArray(remoteRev)) {
      inMemoryManualRevenue = remoteRev;
      try {
        localStorage.setItem(MANUAL_REV_KEY, JSON.stringify(remoteRev));
      } catch {}
    }

    if (remoteExp && Array.isArray(remoteExp)) {
      inMemoryExpenses = remoteExp;
      try {
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(remoteExp));
      } catch {}
    }

    notify();
  } catch (err) {
    console.warn('Financials sync notice:', err);
  }
};

if (typeof window !== 'undefined') {
  syncFinancialsFromRemote().catch(() => {});
}

export const financialStorage = {
  // Manual Revenue Queries & Mutations
  getManualRevenue(): ManualRevenueRecord[] {
    return [...inMemoryManualRevenue];
  },

  async addManualRevenue(data: Omit<ManualRevenueRecord, 'id' | 'source' | 'createdAt'>): Promise<ManualRevenueRecord> {
    const id = `REV-MANUAL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newRecord: ManualRevenueRecord = {
      ...data,
      id,
      source: 'MANUAL',
      createdAt: new Date().toISOString()
    };

    inMemoryManualRevenue = [newRecord, ...inMemoryManualRevenue];
    this.persistManualRevenue();
    notify();

    // Background push to Supabase
    supabaseDatabase.saveSetting('financial_manual_revenue', inMemoryManualRevenue).catch(() => {});
    return newRecord;
  },

  async deleteManualRevenue(id: string): Promise<boolean> {
    inMemoryManualRevenue = inMemoryManualRevenue.filter(r => r.id !== id);
    this.persistManualRevenue();
    notify();
    await supabaseDatabase.saveSetting('financial_manual_revenue', inMemoryManualRevenue);
    return true;
  },

  persistManualRevenue() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(MANUAL_REV_KEY, JSON.stringify(inMemoryManualRevenue));
      }
    } catch {}
  },

  // Expense Records Queries & Mutations
  getExpenses(): ExpenseRecord[] {
    return [...inMemoryExpenses];
  },

  async addExpense(data: Omit<ExpenseRecord, 'id' | 'createdAt'>): Promise<ExpenseRecord> {
    const id = `EXP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newRecord: ExpenseRecord = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };

    inMemoryExpenses = [newRecord, ...inMemoryExpenses];
    this.persistExpenses();
    notify();

    // Background push to Supabase
    supabaseDatabase.saveSetting('financial_expenses', inMemoryExpenses).catch(() => {});
    return newRecord;
  },

  async deleteExpense(id: string): Promise<boolean> {
    inMemoryExpenses = inMemoryExpenses.filter(e => e.id !== id);
    this.persistExpenses();
    notify();
    await supabaseDatabase.saveSetting('financial_expenses', inMemoryExpenses);
    return true;
  },

  persistExpenses() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(inMemoryExpenses));
      }
    } catch {}
  },

  // Unified Financial Analytics derived strictly from actual records
  getDashboardAnalytics() {
    // 1. Service Bookings (only verified PAID bookings count as actual revenue)
    const allBookings = serviceBookingStorage.getAll();
    const paidBookings = allBookings.filter(b => b.paymentStatus === 'PAID');
    const serviceBookingRevenue = paidBookings.reduce((sum, b) => sum + (Number(b.amount) || 199), 0);

    // 2. Digital Product Orders (only verified Paid orders count)
    const allDigitalOrders = digitalProductsStorage.getOrders();
    const paidDigitalOrders = allDigitalOrders.filter(o => o.paymentStatus === 'Paid');
    const digitalProductRevenue = paidDigitalOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    // 3. Manual Revenue categorized
    const manualRecords = this.getManualRevenue();
    let websiteRev = 0;
    let appRev = 0;
    let customSoftwareRev = 0;
    let aiAutomationRev = 0;
    let erpCrmRev = 0;
    let manualDigitalRev = 0;
    let manualBookingRev = 0;
    let otherRev = 0;

    manualRecords.forEach(r => {
      const amt = Number(r.amount) || 0;
      switch (r.category) {
        case 'Website':
          websiteRev += amt;
          break;
        case 'App':
          appRev += amt;
          break;
        case 'Custom Software':
          customSoftwareRev += amt;
          break;
        case 'AI Automation':
          aiAutomationRev += amt;
          break;
        case 'ERP/CRM':
          erpCrmRev += amt;
          break;
        case 'Digital Product':
          manualDigitalRev += amt;
          break;
        case 'Service Booking':
          manualBookingRev += amt;
          break;
        default:
          otherRev += amt;
          break;
      }
    });

    // Subtotals
    const totalDigitalRevenue = digitalProductRevenue + manualDigitalRev;
    const totalServiceBookingRevenue = serviceBookingRevenue + manualBookingRev;
    const totalRevenue = websiteRev + appRev + customSoftwareRev + aiAutomationRev + erpCrmRev + totalDigitalRevenue + totalServiceBookingRevenue + otherRev;

    // 4. Real Expenses
    const allExpenses = this.getExpenses();
    const totalExpenses = allExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    // 5. Net Profit
    const netRevenue = totalRevenue - totalExpenses;

    // 6. Total Sales Count (actual distinct transactions)
    const totalSalesCount = paidBookings.length + paidDigitalOrders.length + manualRecords.length;

    // 7. Aggregate Unified Transaction Feed for the ledger
    const transactions: UnifiedTransactionItem[] = [];

    // Map Paid Service Bookings
    paidBookings.forEach(b => {
      let cat: RevenueCategory = 'Service Booking';
      if (b.serviceType === 'website') cat = 'Website';
      else if (b.serviceType === 'custom_software') cat = 'Custom Software';
      else if (b.serviceType === 'ai_automation') cat = 'AI Automation';

      transactions.push({
        id: b.bookingId,
        transactionType: 'Service Booking',
        category: cat,
        clientName: b.fullName,
        businessName: b.businessName,
        description: `₹199 Consultation Booking: ${b.serviceName}`,
        amount: Number(b.amount) || 199,
        paymentMethod: 'Razorpay Online Gateway',
        paymentReference: b.razorpayPaymentId || b.razorpayOrderId || 'Verified Rzp Payment',
        date: b.paidAt || b.createdAt,
        source: 'RAZORPAY',
        status: b.bookingStatus
      });
    });

    // Map Paid Digital Orders
    paidDigitalOrders.forEach(o => {
      const prodNames = o.items.map(i => i.productName).join(', ') || 'Digital Product';
      transactions.push({
        id: o.id,
        transactionType: 'Digital Product Sale',
        category: 'Digital Product',
        clientName: o.customerName,
        description: `Digital Product: ${prodNames}`,
        amount: Number(o.totalAmount) || 0,
        paymentMethod: 'Razorpay Online Checkout',
        paymentReference: o.paymentId || o.razorpayOrderId || 'Verified Rzp Payment',
        date: o.createdAt,
        source: 'RAZORPAY',
        status: o.paymentStatus
      });
    });

    // Map Manual Revenues
    manualRecords.forEach(r => {
      transactions.push({
        id: r.id,
        transactionType: 'Manual Payment',
        category: r.category,
        clientName: r.clientName,
        businessName: r.businessName,
        description: `${r.category}: ${r.projectOrService}`,
        amount: Number(r.amount) || 0,
        paymentMethod: r.paymentMethod,
        paymentReference: r.paymentReference,
        date: r.paymentDate || r.createdAt,
        source: 'MANUAL',
        status: 'Confirmed'
      });
    });

    // Sort newest first
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      websiteRevenue: websiteRev,
      appRevenue: appRev,
      customSoftwareRevenue: customSoftwareRev,
      aiAutomationRevenue: aiAutomationRev,
      erpCrmRevenue: erpCrmRev,
      digitalProductRevenue: totalDigitalRevenue,
      serviceBookingRevenue: totalServiceBookingRevenue,
      otherRevenue: otherRev,
      totalRevenue,
      totalExpenses,
      netRevenue,
      totalSalesCount,
      transactions,
      hasRecords: totalSalesCount > 0 || allExpenses.length > 0
    };
  }
};
