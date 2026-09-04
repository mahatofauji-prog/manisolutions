import { ReadySolutionItem, ReadySolutionRequest } from '../types';
import { INITIAL_READY_SOLUTIONS } from '../data/readySolutionsData';
import { enquiryStorage } from './enquiryStorage';
import { solutionsStorage } from './solutionsStorage';
import { 
  sanitizeText, 
  sanitizeStringArray, 
  sanitizeSlug, 
  checkRateLimit 
} from '../utils/security';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

const STORAGE_KEY = 'mani_ready_solutions_v1';
const REQUESTS_STORAGE_KEY = 'mani_ready_solution_requests_v1';

let inMemoryReadySolutions: ReadySolutionItem[] = [];
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
} catch (e) {
  console.warn('Initial ready solutions cache read warning:', e);
}

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
    } catch (e) {
      console.error('ReadySolutions listener callback error', e);
    }
  });
};

// Firestore Real-time Sync for Ready Solutions
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'ready_solutions'), async (snapshot) => {
      if (false) { // snapshot.empty logic removed to prevent auto-reseeding

        if (INITIAL_READY_SOLUTIONS.length > 0) {
          try {
            const batch = writeBatch(db);
            INITIAL_READY_SOLUTIONS.forEach(item => {
              batch.set(doc(db, 'ready_solutions', item.id), cleanForFirestore(item));
            });
            await batch.commit();
          } catch (e) {
            console.warn('Failed to seed ready_solutions in Firestore:', e);
          }
        }
        inMemoryReadySolutions = [...INITIAL_READY_SOLUTIONS];
        notifyListeners();
      } else {
        const items = snapshot.docs.map(d => d.data() as ReadySolutionItem);
        inMemoryReadySolutions = items;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
        notifyListeners();
      }
    }, (err) => console.warn('Firestore ready_solutions listener error:', err));

    onSnapshot(collection(db, 'ready_solution_requests'), (snapshot) => {
      const reqs = snapshot.docs.map(d => d.data() as ReadySolutionRequest);
      inMemoryRequests = reqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try {
        localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(inMemoryRequests));
      } catch {}
      notifyListeners();
    }, (err) => console.warn('Firestore ready_solution_requests listener error:', err));

  } catch (e) {
    console.warn('Failed to attach Firestore ready solutions listeners:', e);
  }
}

export const readySolutionsStorage = {
  // Retrieve all solutions (published + draft, for Admin CMS)
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

  // Retrieve all published solutions (for Public /ready-solutions page)
  getPublished(): ReadySolutionItem[] {
    const all = this.getAllRaw();
    return all.filter(item => item.status === 'published');
  },

  // Retrieve maximum 6 published solutions for Homepage
  // Sorted by featuredOnHomepage preference & newest createdAt
  getHomepageSolutions(limit = 6): ReadySolutionItem[] {
    const published = this.getPublished();

    // Sort: Featured on homepage first, then by priority/newest
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

  // Find by slug
  getBySlug(slug: string): ReadySolutionItem | undefined {
    const all = this.getAllRaw();
    const clean = (slug || '').toLowerCase().trim();
    return all.find(item => item.slug.toLowerCase() === clean || item.id.toLowerCase() === clean);
  },

  // Find by id
  getById(id: string): ReadySolutionItem | undefined {
    const all = this.getAllRaw();
    return all.find(item => item.id === id);
  },

  // Create new Ready Solution (Admin Protected)
  create(solution: Omit<ReadySolutionItem, 'id' | 'createdAt'>): ReadySolutionItem {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }

    const all = this.getAllRaw();
    
    // Generate readable ID: RS-2026-XXXX
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `RS-2026-${randomNum}`;

    const newSlug = sanitizeSlug(solution.slug || solution.title);

    const newItem: ReadySolutionItem = {
      ...solution,
      id,
      slug: newSlug || `solution-${id.toLowerCase()}`,
      title: sanitizeText(solution.title, 200),
      shortDescription: sanitizeText(solution.shortDescription, 500),
      fullDescription: sanitizeText(solution.fullDescription, 5000),
      category: sanitizeText(solution.category, 100),
      features: sanitizeStringArray(solution.features, 30, 200),
      benefits: solution.benefits ? sanitizeStringArray(solution.benefits, 30, 200) : undefined,
      technology: solution.technology ? sanitizeStringArray(solution.technology, 30, 200) : undefined,
      suitableFor: solution.suitableFor ? sanitizeStringArray(solution.suitableFor, 30, 200) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newItem, ...all];
    inMemoryReadySolutions = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded, storing trimmed payload', e);
    }

    setDoc(doc(db, 'ready_solutions', newItem.id), cleanForFirestore(newItem)).catch(err => {
      console.error('Firestore create ready solution error:', err);
    });

    notifyListeners();
    return newItem;
  },

  // Update an existing Ready Solution (Admin Protected)
  update(id: string, updates: Partial<ReadySolutionItem>): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }

    const all = this.getAllRaw();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      ...updates,
      title: updates.title !== undefined ? sanitizeText(updates.title, 200) : all[index].title,
      shortDescription: updates.shortDescription !== undefined ? sanitizeText(updates.shortDescription, 500) : all[index].shortDescription,
      fullDescription: updates.fullDescription !== undefined ? sanitizeText(updates.fullDescription, 5000) : all[index].fullDescription,
      slug: updates.slug !== undefined ? sanitizeSlug(updates.slug) : all[index].slug,
      features: updates.features !== undefined ? sanitizeStringArray(updates.features, 30, 200) : all[index].features,
      updatedAt: new Date().toISOString()
    };

    inMemoryReadySolutions = [...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Failed to update solution in localStorage', e);
    }

    setDoc(doc(db, 'ready_solutions', all[index].id), cleanForFirestore(all[index])).catch(err => {
      console.error('Firestore update ready solution error:', err);
    });

    notifyListeners();
    return true;
  },

  // Delete a Ready Solution (Admin Protected)
  delete(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const all = this.getAllRaw();
    const filtered = all.filter(item => item.id !== id);
    if (filtered.length === all.length) return false;

    inMemoryReadySolutions = filtered;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    deleteDoc(doc(db, 'ready_solutions', id)).catch(err => {
      console.error('Firestore delete ready solution error:', err);
    });

    notifyListeners();
    return true;
  },

  // Toggle publish/draft (Admin Protected)
  toggleStatus(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) return false;
    const all = this.getAllRaw();
    const item = all.find(i => i.id === id);
    if (!item) return false;

    const newStatus = item.status === 'published' ? 'draft' : 'published';
    return this.update(id, { status: newStatus });
  },

  // Toggle homepage visibility (Admin Protected)
  toggleHomepage(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) return false;
    const all = this.getAllRaw();
    const item = all.find(i => i.id === id);
    if (!item) return false;

    return this.update(id, { featuredOnHomepage: !item.featuredOnHomepage });
  },

  // Export JSON (Admin Protected)
  exportJSON(): string {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return JSON.stringify({ error: 'Unauthorized: Admin authentication required' });
    }
    return JSON.stringify(this.getAllRaw(), null, 2);
  },

  // Reset to default seed (Admin Protected)
  resetToDefault(): void {
    if (!solutionsStorage.isAdminAuthenticated()) return;
    inMemoryReadySolutions = [...INITIAL_READY_SOLUTIONS];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_READY_SOLUTIONS));

    try {
      const batch = writeBatch(db);
      INITIAL_READY_SOLUTIONS.forEach(item => {
        batch.set(doc(db, 'ready_solutions', item.id), cleanForFirestore(item));
      });
      batch.commit();
    } catch {}

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
    // Rate limit submission: max 5 requests per 10 minutes
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
    } catch (e) {
      console.warn('Failed to save ready solution request', e);
    }

    setDoc(doc(db, 'ready_solution_requests', newReq.id), cleanForFirestore(newReq)).catch(err => {
      console.error('Firestore save ready solution request error:', err);
    });

    // Also integrate with general enquiry storage so Admin Enquiries shows it
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
    } catch (e) {
      console.warn('Enquiry mirror warning', e);
    }

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

    setDoc(doc(db, 'ready_solution_requests', id), cleanForFirestore(inMemoryRequests[index])).catch(err => {
      console.error('Firestore update ready solution request status error:', err);
    });

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

    deleteDoc(doc(db, 'ready_solution_requests', id)).catch(err => {
      console.error('Firestore delete ready solution request error:', err);
    });

    notifyListeners();
    return true;
  }
};
