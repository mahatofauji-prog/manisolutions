import { ServiceBooking, ServiceBookingStatus, BookableServiceType } from '../types';
import { supabaseDatabase } from './supabaseDatabase';
import { solutionsStorage } from './solutionsStorage';
import { sanitizeText } from '../utils/security';

const STORAGE_KEY = 'mani_service_bookings_v1';

let inMemoryBookings: ServiceBooking[] = [];

// Try to load cached bookings from localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        inMemoryBookings = parsed;
      }
    }
  }
} catch (e) {
  console.warn('Service bookings cache read warning:', e);
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToServiceBookings = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.warn('Booking listener error:', e);
    }
  });
};

// Initial sync with backend / Supabase
export const syncBookingsFromRemote = async () => {
  try {
    const res = await fetch('/api/service-booking/list');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        inMemoryBookings = data.bookings;
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryBookings));
          }
        } catch {}
        notifyListeners();
        return;
      }
    }
  } catch (err) {
    console.warn('Remote sync fetch failed, trying database settings fallback:', err);
  }

  // Fallback to Supabase settings key
  try {
    const remote = await supabaseDatabase.getSetting<ServiceBooking[]>('service_bookings_all');
    if (remote && Array.isArray(remote)) {
      inMemoryBookings = remote;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryBookings));
        }
      } catch {}
      notifyListeners();
    }
  } catch (e) {
    console.warn('Supabase booking sync notice:', e);
  }
};

if (typeof window !== 'undefined') {
  syncBookingsFromRemote().catch(() => {});
}

export const serviceBookingStorage = {
  getAll(): ServiceBooking[] {
    return [...inMemoryBookings];
  },

  getConfirmed(): ServiceBooking[] {
    return inMemoryBookings.filter(b => b.paymentStatus === 'PAID' || b.bookingStatus === 'CONFIRMED');
  },

  getById(bookingId: string): ServiceBooking | undefined {
    return inMemoryBookings.find(b => b.bookingId === bookingId);
  },

  async createBookingOrder(payload: {
    serviceType: BookableServiceType;
    fullName: string;
    businessName: string;
    phone: string;
    email: string;
    city: string;
    projectRequirements: string;
    preferredContactMethod: 'WhatsApp' | 'Phone Call' | 'Email';
    websiteType?: string;
    requiredPages?: string;
    existingWebsiteUrl?: string;
    softwareType?: string;
    requiredModules?: string;
    userCountOrBranches?: string;
    businessType?: string;
    currentWorkflow?: string;
    whatToAutomate?: string;
    currentToolsUsed?: string;
    budget?: string;
    additionalRequirements?: string;
  }): Promise<{
    success: boolean;
    razorpayOrderId?: string;
    bookingId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/service-booking/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.booking) {
        // Save pending booking locally
        this.saveLocally(data.booking);
      }
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to initialize booking order'
      };
    }
  },

  async verifyPayment(payload: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{
    success: boolean;
    booking?: ServiceBooking;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/service-booking/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.booking) {
        this.saveLocally(data.booking);
      }
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Payment verification request failed'
      };
    }
  },

  saveLocally(booking: ServiceBooking) {
    const existingIndex = inMemoryBookings.findIndex(b => b.bookingId === booking.bookingId);
    if (existingIndex >= 0) {
      inMemoryBookings[existingIndex] = { ...inMemoryBookings[existingIndex], ...booking };
    } else {
      inMemoryBookings = [booking, ...inMemoryBookings];
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryBookings));
      }
    } catch (e) {
      console.warn('Failed to save service bookings to localStorage:', e);
    }
    notifyListeners();
  },

  async updateStatus(bookingId: string, status: ServiceBookingStatus, adminNotes?: string): Promise<boolean> {
    try {
      const booking = inMemoryBookings.find(b => b.bookingId === bookingId);
      if (booking) {
        booking.bookingStatus = status;
        if (adminNotes !== undefined) booking.adminNotes = adminNotes;
        booking.updatedAt = new Date().toISOString();
        this.saveLocally(booking);
      }

      const res = await fetch('/api/service-booking/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status, adminNotes })
      });
      return res.ok;
    } catch (err) {
      console.warn('Update booking status network note:', err);
      return true;
    }
  }
};
