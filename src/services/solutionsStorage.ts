import { SolutionItem } from '../types';
import { INITIAL_SOLUTIONS } from '../data/solutionsData';
import { 
  constantTimeCompare, 
  generateSecureToken, 
  checkRateLimit, 
  resetRateLimit, 
  sanitizeText, 
  sanitizeStringArray,
  sanitizeSlug 
} from '../utils/security';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

const STORAGE_KEY = 'mani_solutions_cms_items_v3';
const ADMIN_SESSION_KEY = 'mani_admin_session_auth_v1';
const ADMIN_CREDENTIALS_KEY = 'mani_admin_custom_creds_v1';

// Default Admin credentials (can be customized via admin settings)
const DEFAULT_ADMIN_CONFIG = {
  email: 'hariomkdi@gmail.com',
  passwordHash: 'Hariom@011253', // Secure comparison key
  name: 'Mr. Hariom Mahato (Founder & Admin)'
};

let inMemorySolutions: SolutionItem[] = [];

// Initial load from localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemorySolutions = parsed;
      }
    }
  }
} catch (e) {
  console.warn('Initial solutions cache read warning:', e);
}

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToSolutions = (listener: StorageListener) => {
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
      console.error('Listener callback error', e);
    }
  });
};

// Firestore Real-time Listener
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'portfolio_solutions'), async (snapshot) => {
      if (false) { // snapshot.empty logic removed to prevent auto-reseeding

        if (INITIAL_SOLUTIONS.length > 0) {
          try {
            const batch = writeBatch(db);
            INITIAL_SOLUTIONS.forEach(item => {
              batch.set(doc(db, 'portfolio_solutions', item.id), cleanForFirestore(item));
            });
            await batch.commit();
          } catch (e) {
            console.warn('Failed to seed portfolio_solutions in Firestore:', e);
          }
        }
        inMemorySolutions = [...INITIAL_SOLUTIONS];
        notifyListeners();
      } else {
        const items = snapshot.docs.map(doc => doc.data() as SolutionItem);
        inMemorySolutions = items;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
        notifyListeners();
      }
    }, (err) => console.warn('Firestore portfolio_solutions listener error:', err));
  } catch (e) {
    console.warn('Failed to attach Firestore solutions listener:', e);
  }
}

export const solutionsStorage = {
  // Retrieve all items (both published and drafts for admin)
  getAll(): SolutionItem[] {
    return [...inMemorySolutions];
  },

  // Retrieve only published items (for public site visitors)
  getPublished(): SolutionItem[] {
    const all = this.getAll();
    return all.filter(item => item.status === 'published');
  },

  // Get featured solutions for hero or highlighted sections
  getFeatured(): SolutionItem[] {
    const published = this.getPublished();
    const featured = published.filter(item => item.isFeatured);
    if (featured.length > 0) return featured;
    // Fallback: return the first 2 published items
    return published.slice(0, 2);
  },

  // Get newest published items
  getRecent(limit: number = 6): SolutionItem[] {
    const published = this.getPublished();
    return [...published]
      .sort((a, b) => new Date(b.projectDate || b.createdAt).getTime() - new Date(a.projectDate || a.createdAt).getTime())
      .slice(0, limit);
  },

  // Find item by URL slug or ID or alias
  getBySlug(slug: string): SolutionItem | undefined {
    if (!slug) return undefined;
    const all = this.getAll();
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Exact match by slug or id
    let match = all.find(item => 
      item.slug.toLowerCase() === cleanSlug || 
      item.id.toLowerCase() === cleanSlug
    );
    if (match) return match;

    // 2. Alias Mappings
    const aliasMap: Record<string, string> = {
      'website': 'website-development',
      'websites': 'website-development',
      'website-development': 'website-development',
      'service-website': 'website-development',
      'app': 'gym-fitness-management-app',
      'apps': 'gym-fitness-management-app',
      'service-app': 'gym-fitness-management-app',
      'software': 'business-management-system',
      'service-software': 'business-management-system',
      'custom-software': 'custom-software',
      'business-management-system': 'business-management-system',
      'ai-video': 'ai-solutions',
      'service-ai-video': 'ai-solutions',
      'ai-automation': 'ai-solutions',
      'service-ai-automation': 'ai-solutions',
      'business-ai': 'ai-solutions',
      'ai-solutions': 'ai-solutions',
      'retail': 'retail',
      'restaurant': 'restaurant',
      'restaurant-solutions': 'restaurant',
      'salon': 'salon',
      'beauty-salon': 'salon',
      'fitness': 'fitness',
      'gym-fitness': 'fitness',
      'coaching': 'coaching',
      'coaching-tuition': 'coaching',
      'schools': 'schools',
      'school': 'schools',
      'colleges': 'colleges',
      'ecommerce': 'ecommerce',
      'healthcare': 'healthcare',
      'realestate': 'realestate',
      'real-estate': 'realestate',
      'ngo': 'ngo',
      'trust-ngo': 'ngo',
      'services': 'services',
      'service-business': 'services',
      'local': 'local',
      'startups': 'startups',
      'growing': 'growing'
    };

    const targetSlug = aliasMap[cleanSlug];
    if (targetSlug) {
      match = all.find(item => item.slug === targetSlug || item.id === targetSlug);
      if (match) return match;
    }

    // 3. Substring match fallback
    match = all.find(item => 
      cleanSlug.includes(item.id.toLowerCase()) || 
      item.id.toLowerCase().includes(cleanSlug) ||
      cleanSlug.includes(item.slug.toLowerCase()) || 
      item.slug.toLowerCase().includes(cleanSlug)
    );

    return match || all[0];
  },

  // Find item by ID
  getById(id: string): SolutionItem | undefined {
    const all = this.getAll();
    return all.find(item => item.id === id);
  },

  // Get related solutions based on category, contentType or shared tags
  getRelated(currentId: string, limit: number = 3): SolutionItem[] {
    const current = this.getById(currentId);
    if (!current) return this.getRecent(limit);

    const published = this.getPublished().filter(item => item.id !== currentId);
    
    // Score matches
    const scored = published.map(item => {
      let score = 0;
      if (item.category === current.category) score += 3;
      if (item.contentType === current.contentType) score += 2;
      const sharedTags = item.tags.filter(t => current.tags.includes(t));
      score += sharedTags.length;
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const results = scored.map(s => s.item).slice(0, limit);

    // If not enough results, fill with recent items
    if (results.length < limit) {
      const remaining = published.filter(p => !results.some(r => r.id === p.id)).slice(0, limit - results.length);
      return [...results, ...remaining];
    }

    return results;
  },

  // Save full items list (Protected)
  async saveAll(items: SolutionItem[]): Promise<void> {
    if (!this.isAdminAuthenticated()) {
      console.warn('Unauthorized attempt to save solutions list');
      return;
    }
    inMemorySolutions = items;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save solutions to storage:', err);
    }
    try {
      const batch = writeBatch(db);
      items.forEach(item => {
        batch.set(doc(db, 'portfolio_solutions', item.id), item);
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to sync saveAll to Firestore:', e);
    }
    notifyListeners();
  },

  // Create new solution (Protected + Sanitized)
  create(data: Omit<SolutionItem, 'id' | 'createdAt' | 'updatedAt'>): SolutionItem {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Administrative credentials required');
    }

    const all = this.getAll();
    const id = `sol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date().toISOString();
    
    // Ensure slug is clean and unique
    let slug = sanitizeSlug(data.slug || data.title);
    if (all.some(i => i.slug === slug)) {
      slug = `${slug}-${Math.random().toString(36).substr(2, 4)}`;
    }

    const sanitizedTitle = sanitizeText(data.title, 200);
    const sanitizedShortDesc = sanitizeText(data.shortDescription, 500);
    const sanitizedFullDesc = sanitizeText(data.fullDescription, 5000);
    const sanitizedClient = sanitizeText(data.clientType, 150);

    const newItem: SolutionItem = {
      ...data,
      id,
      slug,
      title: sanitizedTitle || 'Untitled Solution',
      shortDescription: sanitizedShortDesc,
      fullDescription: sanitizedFullDesc,
      clientType: sanitizedClient,
      tags: sanitizeStringArray(data.tags, 30, 50),
      createdAt: now,
      updatedAt: now
    };

    inMemorySolutions = [newItem, ...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
    } catch (err) {
      console.error('Failed to save created solution', err);
    }

    setDoc(doc(db, 'portfolio_solutions', newItem.id), cleanForFirestore(newItem)).catch(err => {
      console.error('Firestore create portfolio solution sync failed:', err);
    });

    notifyListeners();
    return newItem;
  },

  // Update existing solution (Protected + Sanitized)
  update(id: string, updates: Partial<SolutionItem>): SolutionItem | null {
    if (!this.isAdminAuthenticated()) {
      console.warn('Unauthorized attempt to update solution');
      return null;
    }

    const all = this.getAll();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) return null;

    const existing = all[index];
    const now = new Date().toISOString();

    let newSlug = updates.slug ? sanitizeSlug(updates.slug) : existing.slug;
    if (newSlug !== existing.slug && all.some(i => i.slug === newSlug && i.id !== id)) {
      newSlug = `${newSlug}-${Math.random().toString(36).substr(2, 4)}`;
    }

    const updatedItem: SolutionItem = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? sanitizeText(updates.title, 200) : existing.title,
      shortDescription: updates.shortDescription !== undefined ? sanitizeText(updates.shortDescription, 500) : existing.shortDescription,
      fullDescription: updates.fullDescription !== undefined ? sanitizeText(updates.fullDescription, 5000) : existing.fullDescription,
      clientType: updates.clientType !== undefined ? sanitizeText(updates.clientType, 150) : existing.clientType,
      tags: updates.tags !== undefined ? sanitizeStringArray(updates.tags, 30, 50) : existing.tags,
      slug: newSlug,
      updatedAt: now
    };

    all[index] = updatedItem;
    inMemorySolutions = [...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
    } catch (err) {
      console.error('Failed to update solution', err);
    }

    setDoc(doc(db, 'portfolio_solutions', updatedItem.id), cleanForFirestore(updatedItem)).catch(err => {
      console.error('Firestore update portfolio solution sync failed:', err);
    });

    notifyListeners();
    return updatedItem;
  },

  // Delete solution (Protected)
  async delete(id: string): Promise<boolean> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized attempt to delete solution');
    }
    try {
      await deleteDoc(doc(db, 'portfolio_solutions', id));
      return true;
    } catch (err) {
      console.error('Failed to delete solution', err);
      throw err;
    }
  },

  // Toggle publish / draft status (Protected)
  togglePublish(id: string): SolutionItem | null {
    if (!this.isAdminAuthenticated()) return null;
    const all = this.getAll();
    const item = all.find(i => i.id === id);
    if (!item) return null;
    return this.update(id, {
      status: item.status === 'published' ? 'draft' : 'published'
    });
  },

  // Toggle featured status (Protected)
  toggleFeatured(id: string): SolutionItem | null {
    if (!this.isAdminAuthenticated()) return null;
    const all = this.getAll();
    const item = all.find(i => i.id === id);
    if (!item) return null;
    return this.update(id, {
      isFeatured: !item.isFeatured
    });
  },

  // Reset to initial seed data (Protected)
  async resetToDefaults(): Promise<void> {
    if (!this.isAdminAuthenticated()) return;
    inMemorySolutions = [...INITIAL_SOLUTIONS];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SOLUTIONS));
    } catch {}

    try {
      const batch = writeBatch(db);
      INITIAL_SOLUTIONS.forEach(item => {
        batch.set(doc(db, 'portfolio_solutions', item.id), cleanForFirestore(item));
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to reset portfolio_solutions in Firestore:', e);
    }
    notifyListeners();
  },

  // Export JSON backup (Protected)
  exportJSON(): string {
    if (!this.isAdminAuthenticated()) {
      return JSON.stringify({ error: 'Unauthorized: Admin authentication required' });
    }
    return JSON.stringify(this.getAll(), null, 2);
  },

  // Import JSON backup (Protected)
  async importJSON(jsonString: string): Promise<boolean> {
    if (!this.isAdminAuthenticated()) return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemorySolutions = parsed;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch {}

        try {
          const batch = writeBatch(db);
          parsed.forEach((item: SolutionItem) => {
            batch.set(doc(db, 'portfolio_solutions', item.id), cleanForFirestore(item));
          });
          await batch.commit();
        } catch (e) {
          console.error('Failed to sync imported solutions to Firestore:', e);
        }
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Generate clean slug from title
  generateSlug(title: string): string {
    return sanitizeSlug(title);
  },

  // ================= ADMIN AUTHENTICATION & SESSION =================

  isAdminAuthenticated(): boolean {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!session) return false;
      const parsed = JSON.parse(session);
      // Valid for 24 hours with token check
      if (
        parsed && 
        parsed.authenticated === true && 
        typeof parsed.token === 'string' &&
        parsed.token.length > 10 &&
        parsed.expiresAt > Date.now()
      ) {
        return true;
      }
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    } catch {
      return false;
    }
  },

  loginAdmin(password: string, email: string): { success: boolean; error?: string; retryAfterSeconds?: number } {
    // Rate-limiting check: max 25 login attempts per 5 minutes
    const rateCheck = checkRateLimit('admin_login_attempt', 25, 5 * 60 * 1000, 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Too many login attempts. Please wait ${rateCheck.retryAfterSeconds || 30} seconds before retrying.`,
        retryAfterSeconds: rateCheck.retryAfterSeconds
      };
    }

    const creds = this.getAdminCredentials();
    const validEmail = constantTimeCompare(creds.email.toLowerCase(), email.trim().toLowerCase());
    const validPass = constantTimeCompare(creds.passwordHash, password.trim());

    if (validEmail && validPass) {
      resetRateLimit('admin_login_attempt');
      const sessionData = {
        authenticated: true,
        token: generateSecureToken(),
        user: creds.name,
        email: creds.email,
        loginAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid username or administrative password. Please check your credentials.' 
    };
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  getAdminSession() {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  getAdminCredentials() {
    try {
      const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
      if (stored) {
        return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_CONFIG;
  },

  updateAdminPassword(newPassword: string): boolean {
    if (!this.isAdminAuthenticated()) return false;
    try {
      const current = this.getAdminCredentials();
      const cleanPass = newPassword.trim();
      if (cleanPass.length < 6) return false;
      const updated = { ...current, passwordHash: cleanPass };
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }
};

