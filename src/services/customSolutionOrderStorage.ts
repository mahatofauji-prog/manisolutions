import { CustomSolutionOrder, CustomSolutionOrderStatus } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { 
  sanitizeText, 
  validateSafeUrl, 
  checkRateLimit 
} from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';

const STORAGE_KEY = 'mani_custom_solution_orders_v1';

let inMemoryCustomOrders: CustomSolutionOrder[] = [];

type CustomOrderListener = () => void;
const listeners: Set<CustomOrderListener> = new Set();

export const subscribeToCustomOrders = (listener: CustomOrderListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('CustomOrder listener error', e);
    }
  });
};

const INITIAL_SAMPLE_ORDERS: CustomSolutionOrder[] = [
  {
    id: 'CSO-2026-0001',
    fullName: 'Dr. Rameshwar Sharma',
    mobileNumber: '+91 98351 23456',
    whatsappNumber: '+91 98351 23456',
    email: 'contact@sharmaclinic.in',
    businessName: 'Sharma Super-Speciality Eye Hospital',
    businessCategory: 'Healthcare & Clinics',
    locationCity: 'Ranchi, Jharkhand',
    requiredSolution: 'Hospital Management System',
    projectRequirements: 'We need an integrated OPD patient queue token system, doctor EMR prescription generator with local language print support, automated WhatsApp appointment reminders, and billing & inventory management module.',
    budget: '₹50,000–₹1,00,000',
    expectedTimeline: '2 to 4 Weeks',
    referenceUrl: 'https://practo.com',
    additionalNotes: 'Need offline synchronization capability in case of clinic broadband failure.',
    status: 'In Discussion',
    adminNotes: 'Spoke with Dr. Sharma on 22nd Aug. Prepared preliminary architecture proposal.',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'CSO-2026-0002',
    fullName: 'Ananya Singhania',
    mobileNumber: '+91 91234 87650',
    whatsappNumber: '+91 91234 87650',
    email: 'ananya@vintagetrends.co',
    businessName: 'Vintage Trends Apparel',
    businessCategory: 'Retail & E-commerce',
    locationCity: 'Kolkata, West Bengal',
    requiredSolution: 'E-commerce',
    projectRequirements: 'Custom Shopify/Next.js apparel boutique storefront with Razorpay/PhonePe UPI checkout, Instagram catalog sync, live inventory management across 2 retail stores, and custom gift card engine.',
    budget: '₹50,000–₹1,00,000',
    expectedTimeline: '1 to 2 Months',
    referenceUrl: 'https://nykaafashion.com',
    additionalNotes: 'Fast mobile loading speed is our top priority.',
    status: 'New',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

// Initial cache read
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryCustomOrders = parsed;
      } else {
        inMemoryCustomOrders = [...INITIAL_SAMPLE_ORDERS];
      }
    } else {
      inMemoryCustomOrders = [...INITIAL_SAMPLE_ORDERS];
    }
  }
} catch (e) {
  inMemoryCustomOrders = [...INITIAL_SAMPLE_ORDERS];
}

// Supabase sync for Custom Orders
if (typeof window !== 'undefined') {
  supabaseDatabase.getCustomOrders().then(items => {
    if (items && items.length > 0) {
      inMemoryCustomOrders = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCustomOrders));
      } catch {}
      notifyListeners();
    }
  }).catch(() => {});
}

export const customSolutionOrderStorage = {
  getAll(): CustomSolutionOrder[] {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return [];
    }
    return this.getAllRaw();
  },

  getAllRaw(): CustomSolutionOrder[] {
    return [...inMemoryCustomOrders];
  },

  getById(id: string): CustomSolutionOrder | undefined {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return undefined;
    }
    const orders = this.getAllRaw();
    return orders.find(o => o.id === id);
  },

  create(orderData: Omit<CustomSolutionOrder, 'id' | 'createdAt' | 'status'>): CustomSolutionOrder {
    // Rate limit submission: max 5 orders per 10 minutes
    const rateCheck = checkRateLimit('custom_order_submit', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Submission limit reached. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before submitting again.`);
    }

    const orders = this.getAllRaw();
    const sequenceNum = (orders.length + 1).toString().padStart(4, '0');
    const newId = `CSO-2026-${sequenceNum}`;

    const sanitizedRefUrl = orderData.referenceUrl && validateSafeUrl(orderData.referenceUrl) 
      ? sanitizeText(orderData.referenceUrl, 500) 
      : undefined;

    const newOrder: CustomSolutionOrder = {
      ...orderData,
      id: newId,
      fullName: sanitizeText(orderData.fullName, 120) || 'Client',
      mobileNumber: sanitizeText(orderData.mobileNumber, 25),
      whatsappNumber: sanitizeText(orderData.whatsappNumber, 25),
      email: sanitizeText(orderData.email, 120),
      businessName: sanitizeText(orderData.businessName, 150),
      businessCategory: sanitizeText(orderData.businessCategory, 100),
      locationCity: sanitizeText(orderData.locationCity, 100),
      requiredSolution: sanitizeText(orderData.requiredSolution, 100),
      projectRequirements: sanitizeText(orderData.projectRequirements, 4000),
      budget: orderData.budget ? sanitizeText(orderData.budget, 80) : undefined,
      expectedTimeline: orderData.expectedTimeline ? sanitizeText(orderData.expectedTimeline, 80) : undefined,
      referenceUrl: sanitizedRefUrl,
      additionalNotes: orderData.additionalNotes ? sanitizeText(orderData.additionalNotes, 2000) : undefined,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    inMemoryCustomOrders = [newOrder, ...orders];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCustomOrders));
    } catch (err) {
      console.warn('Failed to save custom solution order cache:', err);
    }

    supabaseDatabase.saveCustomOrder(newOrder).catch(err => {
      console.warn('Supabase create custom solution order notice:', err);
    });

    notifyListeners();
    return newOrder;
  },

  updateStatus(id: string, status: CustomSolutionOrderStatus, adminNotes?: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const index = inMemoryCustomOrders.findIndex(o => o.id === id);
    if (index === -1) return false;

    inMemoryCustomOrders[index] = {
      ...inMemoryCustomOrders[index],
      status,
      adminNotes: adminNotes !== undefined ? sanitizeText(adminNotes, 2000) : inMemoryCustomOrders[index].adminNotes,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCustomOrders));
      supabaseDatabase.saveCustomOrder(inMemoryCustomOrders[index]).catch(() => {});
    } catch {}

    notifyListeners();
    return true;
  },

  updateNotes(id: string, adminNotes: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const index = inMemoryCustomOrders.findIndex(o => o.id === id);
    if (index === -1) return false;

    inMemoryCustomOrders[index] = {
      ...inMemoryCustomOrders[index],
      adminNotes: sanitizeText(adminNotes, 2000),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCustomOrders));
      supabaseDatabase.saveCustomOrder(inMemoryCustomOrders[index]).catch(() => {});
    } catch {}

    notifyListeners();
    return true;
  },

  delete(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const filtered = inMemoryCustomOrders.filter(o => o.id !== id);
    if (filtered.length === inMemoryCustomOrders.length) return false;

    inMemoryCustomOrders = filtered;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCustomOrders));
      supabaseDatabase.deleteCustomOrder(id).catch(() => {});
    } catch {}

    notifyListeners();
    return true;
  },

  getStats() {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return { total: 0, new: 0, inDiscussion: 0, confirmed: 0 };
    }
    const orders = this.getAllRaw();
    return {
      total: orders.length,
      new: orders.filter(o => o.status === 'New').length,
      inDiscussion: orders.filter(o => o.status === 'In Discussion' || o.status === 'Proposal Sent' || o.status === 'Contacted').length,
      confirmed: orders.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length
    };
  }
};
