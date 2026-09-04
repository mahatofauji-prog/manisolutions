import { Enquiry, EnquiryStatus } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { 
  sanitizeText, 
  sanitizeStringArray, 
  validateEmail, 
  validatePhone, 
  checkRateLimit 
} from '../utils/security';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

const STORAGE_KEY = 'mani_solutions_enquiries_v1';

let inMemoryEnquiries: Enquiry[] = [];

// Initial cache read
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      inMemoryEnquiries = JSON.parse(stored);
    }
  }
} catch (e) {
  console.warn('Initial enquiries cache load warning:', e);
}

// Firestore Real-time Sync for Enquiries
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'enquiries'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as Enquiry);
      inMemoryEnquiries = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
      } catch {}
      enquiryStorage.notifySubscribers();
    }, (err) => console.warn('Firestore enquiries listener error:', err));
  } catch (e) {
    console.warn('Failed to attach Firestore enquiries listener:', e);
  }
}

export const enquiryStorage = {
  getAll(): Enquiry[] {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return [];
    }
    return [...inMemoryEnquiries];
  },

  create(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status' | 'internalNotes'>): Enquiry {
    // Rate limit public submissions: max 6 enquiries per 10 minutes
    const rateCheck = checkRateLimit('public_enquiry_submit', 6, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Please wait ${rateCheck.retryAfterSeconds || 60} seconds before submitting another enquiry.`);
    }

    const prefix = 'ENQ';
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit
    const timestamp = Date.now().toString().slice(-4);
    const newId = `${prefix}-${randomNum}-${timestamp}`;

    const newEnquiry: Enquiry = {
      ...enquiry,
      id: newId,
      fullName: sanitizeText(enquiry.fullName, 100) || 'Prospective Client',
      email: sanitizeText(enquiry.email, 120),
      phone: sanitizeText(enquiry.phone, 25),
      service: sanitizeText(enquiry.service, 120),
      projectRequirements: sanitizeText(enquiry.projectRequirements, 4000),
      status: 'New',
      internalNotes: '',
      createdAt: new Date().toISOString(),
    };

    inMemoryEnquiries.unshift(newEnquiry); // Add to top
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
    } catch (err) {
      console.error('Failed to save enquiry', err);
    }

    setDoc(doc(db, 'enquiries', newEnquiry.id), cleanForFirestore(newEnquiry)).catch(err => {
      console.error('Firestore create enquiry sync error:', err);
    });

    this.notifySubscribers();
    return newEnquiry;
  },

  getAllRaw(): Enquiry[] {
    return [...inMemoryEnquiries];
  },

  update(id: string, updates: Partial<Pick<Enquiry, 'status' | 'internalNotes'>>): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const index = inMemoryEnquiries.findIndex(e => e.id === id);
    if (index === -1) return false;

    inMemoryEnquiries[index] = { 
      ...inMemoryEnquiries[index], 
      ...updates,
      internalNotes: updates.internalNotes !== undefined ? sanitizeText(updates.internalNotes, 2000) : inMemoryEnquiries[index].internalNotes
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
    } catch {}

    setDoc(doc(db, 'enquiries', id), cleanForFirestore(inMemoryEnquiries[index])).catch(err => {
      console.error('Firestore update enquiry sync error:', err);
    });

    this.notifySubscribers();
    return true;
  },

  delete(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const filtered = inMemoryEnquiries.filter(e => e.id !== id);
    if (filtered.length === inMemoryEnquiries.length) return false;
    
    inMemoryEnquiries = filtered;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {}

    deleteDoc(doc(db, 'enquiries', id)).catch(err => {
      console.error('Firestore delete enquiry sync error:', err);
    });

    this.notifySubscribers();
    return true;
  },

  // Simple Pub/Sub for reactivity
  subscribers: [] as (() => void)[],
  
  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  },

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Enquiry subscriber error', err);
      }
    });
  }
};
