import { Enquiry, EnquiryStatus } from '../types';
import { supabaseDatabase } from './supabaseDatabase';

const STORAGE_KEY = 'mani_enquiries_v2';

let inMemoryEnquiries: Enquiry[] = [];

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) inMemoryEnquiries = parsed;
    }
  }
} catch (e) {
  console.warn('Enquiries cache load warning:', e);
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();
export const subscribeToEnquiries = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const notify = () => listeners.forEach(fn => { try { fn(); } catch {} });

// Initial load & sync from Supabase
if (typeof window !== 'undefined') {
  supabaseDatabase.getEnquiries().then(items => {
    if (items && items.length > 0) {
      inMemoryEnquiries = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries)); } catch {}
      notify();
    }
  }).catch(() => {});
}

export const enquiryStorage = {
  getAll(): Enquiry[] {
    return inMemoryEnquiries;
  },

  getAllRaw(): Enquiry[] {
    return inMemoryEnquiries;
  },

  create(data: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'internalNotes'> & { status?: EnquiryStatus; internalNotes?: string }): Enquiry {
    const id = `ENQ-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const newEnquiry: Enquiry = {
      id,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      service: data.service,
      projectRequirements: data.projectRequirements,
      status: data.status || 'New',
      internalNotes: data.internalNotes || '',
      createdAt: new Date().toISOString()
    };

    inMemoryEnquiries = [newEnquiry, ...inMemoryEnquiries];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
      supabaseDatabase.saveEnquiry(newEnquiry).catch(err => {
        console.warn('Supabase create enquiry notice:', err);
      });
    } catch (e) {
      console.warn('Save enquiry cache notice:', e);
    }
    notify();
    return newEnquiry;
  },

  updateStatus(id: string, status: EnquiryStatus, notes?: string): void {
    const item = inMemoryEnquiries.find(e => e.id === id);
    if (!item) return;
    item.status = status;
    if (notes !== undefined) item.internalNotes = notes;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
      supabaseDatabase.saveEnquiry(item).catch(() => {});
    } catch {}
    notify();
  },

  delete(id: string): void {
    inMemoryEnquiries = inMemoryEnquiries.filter(e => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
      supabaseDatabase.deleteEnquiry(id).catch(() => {});
    } catch {}
    notify();
  }
};
