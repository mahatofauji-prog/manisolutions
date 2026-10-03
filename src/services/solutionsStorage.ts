import { SolutionItem } from '../types';
import { INITIAL_SOLUTIONS } from '../data/solutionsData';
import { supabaseDatabase } from './supabaseDatabase';
import { 
  constantTimeCompare, 
  generateSecureToken, 
  checkRateLimit, 
  resetRateLimit, 
  sanitizeText, 
  sanitizeStringArray, 
  sanitizeSlug 
} from '../utils/security';

const STORAGE_KEY = 'mani_solutions_cms_items_v3';
const ADMIN_SESSION_KEY = 'mani_admin_session_auth_v1';
const ADMIN_CREDENTIALS_KEY = 'mani_admin_custom_creds_v1';

const DEFAULT_ADMIN_CONFIG = {
  email: 'hariomkdi@gmail.com',
  passwordHash: 'Hariom@011253',
  name: 'Mr. Hariom Mahato (Founder & Admin)'
};

let inMemorySolutions: SolutionItem[] = [...INITIAL_SOLUTIONS];

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
} catch {}

// Ensure all INITIAL_SOLUTIONS (the 4 required websites) are present
for (const initItem of INITIAL_SOLUTIONS) {
  if (!inMemorySolutions.some(item => item.slug === initItem.slug || item.id === initItem.id || item.liveUrl === initItem.liveUrl)) {
    inMemorySolutions.unshift(initItem);
  }
}

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
  }
} catch {}

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
    } catch {}
  });
};

// Async Supabase Sync on Mount
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    try {
      const remoteSettings = await supabaseDatabase.getSetting<SolutionItem[]>('solutions_cms_all_v2');
      if (remoteSettings && remoteSettings.length > 0) {
        inMemorySolutions = remoteSettings;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteSettings)); } catch {}
        notifyListeners();
      }

      const remote = await supabaseDatabase.getSolutions();
      if (remote && remote.length > 0) {
        const merged = [...remote];
        for (const initItem of INITIAL_SOLUTIONS) {
          if (!merged.some(m => m.slug === initItem.slug || m.id === initItem.id || m.liveUrl === initItem.liveUrl)) {
            merged.unshift(initItem);
          }
        }
        if (!remoteSettings || remoteSettings.length <= merged.length) {
          inMemorySolutions = merged;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          await supabaseDatabase.saveSetting('solutions_cms_all_v2', merged);
          notifyListeners();
        }
      }
    } catch {}
  }, 100);
}

export const solutionsStorage = {
  getAll(): SolutionItem[] {
    return [...inMemorySolutions];
  },

  getPublished(): SolutionItem[] {
    const all = this.getAll();
    return all.filter(item => item.status === 'published');
  },

  getFeatured(): SolutionItem[] {
    const published = this.getPublished();
    const featured = published.filter(item => item.isFeatured);
    if (featured.length > 0) return featured;
    return published.slice(0, 2);
  },

  getRecent(limit: number = 6): SolutionItem[] {
    const published = this.getPublished();
    return [...published]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getByCategory(category: string): SolutionItem[] {
    const published = this.getPublished();
    if (!category || category === 'All') return published;
    return published.filter(item => item.category === category);
  },

  getById(id: string): SolutionItem | undefined {
    return inMemorySolutions.find(item => item.id === id);
  },

  getBySlug(slug: string): SolutionItem | undefined {
    const cleanSlug = sanitizeSlug(slug);
    return inMemorySolutions.find(item => sanitizeSlug(item.slug || item.id) === cleanSlug);
  },

  getRelated(currentId: string, limit: number = 3): SolutionItem[] {
    const current = this.getById(currentId);
    if (!current) return this.getPublished().slice(0, limit);
    return this.getPublished()
      .filter(item => item.id !== currentId && item.category === current.category)
      .slice(0, limit);
  },

  getCategories(): string[] {
    const published = this.getPublished();
    const cats = published.map(item => item.category);
    return Array.from(new Set(cats));
  },

  async create(data: Omit<SolutionItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<SolutionItem> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized attempt to create solution');
    }

    const all = this.getAll();
    const now = new Date().toISOString();
    const id = `sol-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    let slug = data.slug ? sanitizeSlug(data.slug) : sanitizeSlug(data.title);
    if (all.some(item => item.slug === slug)) {
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

    const backupList = [...all];
    inMemorySolutions = [newItem, ...all];
    try {
      const r1 = await supabaseDatabase.saveSolution(newItem);
      const r2 = await supabaseDatabase.saveSetting('solutions_cms_all_v2', inMemorySolutions);
      if (!r1 || !r2) {
        inMemorySolutions = backupList;
        throw new Error('Supabase database rejected solution save.');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
    } catch (e) {
      inMemorySolutions = backupList;
      console.error('Failed to create solution in database:', e);
      throw e;
    }

    notifyListeners();
    return newItem;
  },

  async update(id: string, updates: Partial<SolutionItem>): Promise<SolutionItem | null> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized attempt to update solution');
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

    const backupList = [...all];
    all[index] = updatedItem;
    inMemorySolutions = [...all];
    try {
      const r1 = await supabaseDatabase.saveSolution(updatedItem);
      const r2 = await supabaseDatabase.saveSetting('solutions_cms_all_v2', inMemorySolutions);
      if (!r1 || !r2) {
        inMemorySolutions = backupList;
        throw new Error('Supabase database rejected solution update.');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
    } catch (e) {
      inMemorySolutions = backupList;
      console.error('Failed to update solution in database:', e);
      throw e;
    }

    notifyListeners();
    return updatedItem;
  },

  async delete(id: string): Promise<boolean> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized attempt to delete solution');
    }
    inMemorySolutions = inMemorySolutions.filter(i => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySolutions));
      await supabaseDatabase.saveSetting('solutions_cms_all_v2', inMemorySolutions);
    } catch {}
    await supabaseDatabase.deleteSolution(id);
    notifyListeners();
    return true;
  },

  togglePublish(id: string): SolutionItem | null {
    if (!this.isAdminAuthenticated()) return null;
    const all = this.getAll();
    const item = all.find(i => i.id === id);
    if (!item) return null;
    return this.update(id, {
      status: item.status === 'published' ? 'draft' : 'published'
    });
  },

  toggleFeatured(id: string): SolutionItem | null {
    if (!this.isAdminAuthenticated()) return null;
    const all = this.getAll();
    const item = all.find(i => i.id === id);
    if (!item) return null;
    return this.update(id, {
      isFeatured: !item.isFeatured
    });
  },

  generateSlug(title: string): string {
    return sanitizeSlug(title);
  },

  isAdminAuthenticated(): boolean {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!session) return false;
      const parsed = JSON.parse(session);
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
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
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
    } catch {}
    return DEFAULT_ADMIN_CONFIG;
  },

  verifyAdminPassword(password: string): boolean {
    const current = this.getAdminCredentials();
    return current.passwordHash === password.trim();
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
