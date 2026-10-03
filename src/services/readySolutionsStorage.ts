import { ReadySolutionItem, ReadySolutionRequest } from '../types';
import { INITIAL_READY_SOLUTIONS } from '../data/readySolutionsData';
import { enquiryStorage } from './enquiryStorage';
import { solutionsStorage } from './solutionsStorage';
import { supabaseDatabase } from './supabaseDatabase';
import { 
  sanitizeText, 
  sanitizeStringArray, 
  sanitizeSlug, 
  checkRateLimit 
} from '../utils/security';

const STORAGE_KEY = 'mani_ready_solutions_v1';
const REQUESTS_STORAGE_KEY = 'mani_ready_solution_requests_v1';

let inMemoryReadySolutions: ReadySolutionItem[] = [...INITIAL_READY_SOLUTIONS];
let inMemoryRequests: ReadySolutionRequest[] = [];

// Initial local cache read
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryReadySolutions = parsed;
      }
    }
    const storedReqs = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (storedReqs) {
      const parsedReqs = JSON.parse(storedReqs);
      if (Array.isArray(parsedReqs)) {
        inMemoryRequests = parsedReqs;
      }
    }
  }
} catch {}

type ReadySolutionListener = () => void;
const listeners: Set<ReadySolutionListener> = new Set();

export const subscribeToReadySolutions = (listener: ReadySolutionListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch {}
  });
};

// Async Supabase Sync on Mount
if (typeof window !== 'undefined') {
  setTimeout(() => {
    supabaseDatabase.getReadySolutions().then(remote => {
      if (remote && remote.length > 0) {
        inMemoryReadySolutions = remote;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        } catch {}
        notifyListeners();
      }
    }).catch(() => {});
  }, 100);
}

export const readySolutionsStorage = {
  getAll(): ReadySolutionItem[] {
    return this.getAllRaw();
  },

  getAllRaw(): ReadySolutionItem[] {
    return inMemoryReadySolutions.map(item => ({
      ...item,
      thumbnailUrl: (!item.thumbnailUrl || item.thumbnailUrl.trim() === '' || item.thumbnailUrl.startsWith('../')) 
        ? 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop'
        : item.thumbnailUrl
    }));
  },

  getPublished(): ReadySolutionItem[] {
    const all = this.getAllRaw();
    return all.filter(item => item.status === 'published');
  },

  getHomepageSolutions(limit = 6): ReadySolutionItem[] {
    const published = this.getPublished();
    const sorted = [...published].sort((a, b) => {
      if (a.featuredOnHomepage && !b.featuredOnHomepage) return -1;
      if (!a.featuredOnHomepage && b.featuredOnHomepage) return 1;

      if (a.homepagePriority && b.homepagePriority) {
        return a.homepagePriority - b.homepagePriority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted.slice(0, limit);
  },

  getById(id: string): ReadySolutionItem | undefined {
    return inMemoryReadySolutions.find(item => item.id === id);
  },

  getBySlug(slug: string): ReadySolutionItem | undefined {
    const clean = sanitizeSlug(slug);
    return inMemoryReadySolutions.find(item => sanitizeSlug(item.slug || item.id) === clean);
  },

  getCategories(): string[] {
    const cats = inMemoryReadySolutions.map(item => item.category);
    return Array.from(new Set(cats));
  },

  create(data: Omit<ReadySolutionItem, 'id' | 'createdAt' | 'updatedAt'>): ReadySolutionItem {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const title = sanitizeText(data.title, 150);
    const id = `ready-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = data.slug ? sanitizeSlug(data.slug) : sanitizeSlug(title);

    const newItem: ReadySolutionItem = {
      ...data,
      id,
      slug: slug || id,
      title: title || 'Untitled Solution',
      category: sanitizeText(data.category, 80) || 'General',
      shortDescription: sanitizeText(data.shortDescription, 300) || '',
      fullDescription: sanitizeText(data.fullDescription, 5000) || '',
      price: sanitizeText(data.price, 50) || '',
      priceType: data.priceType || 'Contact for Quotation',
      thumbnailUrl: data.thumbnailUrl || '',
      features: sanitizeStringArray(data.features, 20, 150),
      suitableFor: sanitizeStringArray(data.suitableFor, 15, 100),
      status: data.status || 'published',
      featuredOnHomepage: Boolean(data.featuredOnHomepage),
      homepagePriority: data.homepagePriority || 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryReadySolutions = [newItem, ...inMemoryReadySolutions];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryReadySolutions));
    } catch {}

    supabaseDatabase.saveReadySolution(newItem).catch(() => {});
    notifyListeners();
    return newItem;
  },

  update(id: string, updates: Partial<Omit<ReadySolutionItem, 'id' | 'createdAt'>>): ReadySolutionItem | null {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const index = inMemoryReadySolutions.findIndex(item => item.id === id);
    if (index === -1) return null;

    const existing = inMemoryReadySolutions[index];
    const updated: ReadySolutionItem = {
      ...existing,
      ...updates,
      title: updates.title ? sanitizeText(updates.title, 150) : existing.title,
      slug: updates.slug ? sanitizeSlug(updates.slug) : existing.slug,
      category: updates.category ? sanitizeText(updates.category, 80) : existing.category,
      shortDescription: updates.shortDescription !== undefined ? sanitizeText(updates.shortDescription, 300) : existing.shortDescription,
      fullDescription: updates.fullDescription !== undefined ? sanitizeText(updates.fullDescription, 5000) : existing.fullDescription,
      price: updates.price !== undefined ? sanitizeText(updates.price, 50) : existing.price,
      features: updates.features ? sanitizeStringArray(updates.features, 20, 150) : existing.features,
      suitableFor: updates.suitableFor ? sanitizeStringArray(updates.suitableFor, 15, 100) : existing.suitableFor,
      status: updates.status || existing.status,
      featuredOnHomepage: updates.featuredOnHomepage !== undefined ? Boolean(updates.featuredOnHomepage) : existing.featuredOnHomepage,
      homepagePriority: updates.homepagePriority !== undefined ? updates.homepagePriority : existing.homepagePriority,
      updatedAt: new Date().toISOString()
    };

    inMemoryReadySolutions[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryReadySolutions));
    } catch {}

    supabaseDatabase.saveReadySolution(updated).catch(() => {});
    notifyListeners();
    return updated;
  },

  delete(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const filtered = inMemoryReadySolutions.filter(item => item.id !== id);
    if (filtered.length === inMemoryReadySolutions.length) return false;

    inMemoryReadySolutions = filtered;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryReadySolutions));
    } catch {}

    supabaseDatabase.deleteReadySolution(id).catch(() => {});
    notifyListeners();
    return true;
  },

  toggleStatus(id: string): boolean {
    const item = inMemoryReadySolutions.find(s => s.id === id);
    if (!item) return false;
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    return !!this.update(id, { status: newStatus });
  },

  toggleHomepage(id: string): boolean {
    const item = inMemoryReadySolutions.find(s => s.id === id);
    if (!item) return false;
    return !!this.update(id, { featuredOnHomepage: !item.featuredOnHomepage });
  },

  resetToDefault(): void {
    if (!solutionsStorage.isAdminAuthenticated()) return;
    inMemoryReadySolutions = [...INITIAL_READY_SOLUTIONS];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_READY_SOLUTIONS));
    } catch {}
    for (const sol of INITIAL_READY_SOLUTIONS) {
      supabaseDatabase.saveReadySolution(sol).catch(() => {});
    }
    notifyListeners();
  },

  // ==========================================
  // READY SOLUTION PURCHASE / ENQUIRY REQUESTS
  // ==========================================
  getAllRequests(): ReadySolutionRequest[] {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return [];
    }
    return [...inMemoryRequests];
  },

  createRequest(data: Omit<ReadySolutionRequest, 'id' | 'createdAt' | 'status'>): ReadySolutionRequest {
    const rateCheck = checkRateLimit('ready_sol_request_submit', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Submission limit reached. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before submitting again.`);
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `RS-REQ-2026-${randomNum}`;

    const newReq: ReadySolutionRequest = {
      ...data,
      id: newId,
      fullName: sanitizeText(data.fullName, 120) || 'Client',
      mobileNumber: sanitizeText(data.mobileNumber, 25),
      whatsappNumber: sanitizeText(data.whatsappNumber, 25),
      email: sanitizeText(data.email, 120),
      businessName: sanitizeText(data.businessName, 150),
      city: sanitizeText(data.city, 100),
      state: sanitizeText(data.state, 100),
      fullAddress: sanitizeText(data.fullAddress, 300),
      solutionTitle: sanitizeText(data.solutionTitle, 200),
      solutionCategory: sanitizeText(data.solutionCategory, 100),
      additionalRequirements: sanitizeText(data.additionalRequirements, 3000),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    inMemoryRequests = [newReq, ...inMemoryRequests];
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(inMemoryRequests));
    } catch {}

    try {
      enquiryStorage.create({
        fullName: newReq.fullName,
        phone: newReq.mobileNumber,
        email: newReq.email,
        service: `Ready Solution: ${newReq.solutionTitle}`,
        projectRequirements: `Ready Solution Request for "${newReq.solutionTitle}" (${newReq.solutionCategory || 'General'}).
Business/Org: ${newReq.businessName || 'N/A'}
WhatsApp: ${newReq.whatsappNumber || newReq.mobileNumber}
Location: ${newReq.city || ''}, ${newReq.state || ''}
Address: ${newReq.fullAddress || 'N/A'}
Additional Requirements: ${newReq.additionalRequirements || 'Standard deployment requested.'}`
      });
    } catch {}

    notifyListeners();
    return newReq;
  },

  updateRequestStatus(id: string, status: 'New' | 'Contacted' | 'In Progress' | 'Closed'): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const index = inMemoryRequests.findIndex(r => r.id === id);
    if (index === -1) return false;

    inMemoryRequests[index].status = status;
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(inMemoryRequests));
    } catch {}

    notifyListeners();
    return true;
  },

  deleteRequest(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const filtered = inMemoryRequests.filter(r => r.id !== id);
    if (filtered.length === inMemoryRequests.length) return false;

    inMemoryRequests = filtered;
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(inMemoryRequests));
    } catch {}

    notifyListeners();
    return true;
  }
};
