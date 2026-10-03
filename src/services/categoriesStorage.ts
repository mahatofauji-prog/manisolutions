import { BusinessCategory } from '../types';
import { BUSINESS_CATEGORIES as DEFAULT_CATEGORIES } from '../data/companyData';
import { solutionsStorage } from './solutionsStorage';
import { sanitizeText, sanitizeSlug } from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';
import { websiteTemplatesStorage } from './websiteTemplatesStorage';

const CATEGORIES_STORAGE_KEY = 'mani_business_categories_v1';

let inMemoryCategories: BusinessCategory[] = [];
let listeners: Array<() => void> = [];

// Initialize from LocalStorage immediately to prevent flickers
try {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      inMemoryCategories = JSON.parse(stored);
    }
  }
} catch (e) {
  console.warn('LocalStorage failed to load categories', e);
}

export const subscribeToCategories = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Categories listener callback error', e);
    }
  });
};

// Initial sync from Supabase
if (typeof window !== 'undefined') {
  supabaseDatabase.getWebsiteCategories().then(items => {
    if (items && items.length > 0) {
      inMemoryCategories = items.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug || sanitizeSlug(c.name),
        iconName: 'Sparkles',
        shortDesc: (c as any).description || '',
        recommendedSolution: 'Ready-Made Website',
        popularFeatures: ['Mobile Responsive', 'WhatsApp Integration', 'SEO Optimized'],
        status: 'published' as const,
        displayOrder: c.displayOrder || 1
      })).sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(inMemoryCategories));
      } catch {}
      notifyListeners();
    }
  }).catch(() => {});
}

export const categoriesStorage = {
  // Read Operations
  getAll(): BusinessCategory[] {
    if (inMemoryCategories.length === 0) {
      return DEFAULT_CATEGORIES.map((cat, idx) => ({
        ...cat,
        status: 'published' as const,
        displayOrder: idx + 1,
        slug: sanitizeSlug(cat.name),
      }));
    }
    return [...inMemoryCategories];
  },

  getPublished(): BusinessCategory[] {
    return this.getAll()
      .filter(cat => cat.status !== 'draft')
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  },

  getById(id: string): BusinessCategory | undefined {
    return this.getAll().find(item => item.id === id);
  },

  getBySlug(slug: string): BusinessCategory | undefined {
    return this.getAll().find(item => item.slug === slug || item.id === slug);
  },

  // Write Operations (Admin Protected)
  async create(category: Omit<BusinessCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessCategory> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    const all = this.getAll();
    const id = `cat-${Date.now().toString(36)}`;
    const cleanSlug = category.slug ? sanitizeSlug(category.slug) : sanitizeSlug(category.name);
    
    // Check slug uniqueness
    if (all.some(c => c.slug === cleanSlug)) {
      throw new Error(`A category with slug "${cleanSlug}" already exists.`);
    }

    const newItem: BusinessCategory = {
      ...category,
      id,
      slug: cleanSlug,
      name: sanitizeText(category.name, 100),
      shortDesc: sanitizeText(category.shortDesc, 500),
      iconName: category.iconName || 'Sparkles',
      status: category.status || 'published',
      displayOrder: category.displayOrder ? Number(category.displayOrder) : all.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recommendedSolution: sanitizeText(category.recommendedSolution || 'Ready-Made Website', 200),
      popularFeatures: category.popularFeatures || ['Mobile Responsive', 'WhatsApp Integration', 'SEO Optimized']
    };

    const updated = [...all, newItem].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    inMemoryCategories = updated;
    
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await supabaseDatabase.saveWebsiteCategory({
        id: newItem.id,
        name: newItem.name,
        slug: newItem.slug || sanitizeSlug(newItem.name),
        description: newItem.shortDesc,
        displayOrder: newItem.displayOrder || 1
      });
    } catch (err) {
      console.warn('Supabase create category notice:', err);
    }

    notifyListeners();
    return newItem;
  },

  async update(id: string, updates: Partial<BusinessCategory>): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    const all = this.getAll();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Category with ID "${id}" not found.`);
    }

    const existing = all[index];
    let cleanSlug = updates.slug !== undefined ? sanitizeSlug(updates.slug) : existing.slug;
    
    if (cleanSlug && cleanSlug !== existing.slug) {
      if (all.some(c => c.slug === cleanSlug && c.id !== id)) {
        throw new Error(`A category with slug "${cleanSlug}" already exists.`);
      }
    }

    const updatedItem: BusinessCategory = {
      ...existing,
      ...updates,
      id: existing.id,
      slug: cleanSlug,
      name: updates.name ? sanitizeText(updates.name, 100) : existing.name,
      shortDesc: updates.shortDesc ? sanitizeText(updates.shortDesc, 500) : existing.shortDesc,
      updatedAt: new Date().toISOString()
    };

    all[index] = updatedItem;
    all.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    inMemoryCategories = all;

    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(all));
    } catch {}

    try {
      await supabaseDatabase.saveWebsiteCategory({
        id: updatedItem.id,
        name: updatedItem.name,
        slug: updatedItem.slug || sanitizeSlug(updatedItem.name),
        description: updatedItem.shortDesc,
        displayOrder: updatedItem.displayOrder || 1
      });
    } catch (err) {
      console.warn('Supabase update category notice:', err);
    }

    notifyListeners();
    return true;
  },

  async toggleStatus(id: string): Promise<boolean> {
    const item = this.getById(id);
    if (!item) return false;
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    return this.update(id, { status: newStatus });
  },

  async delete(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    // Safety check: ensure no templates are connected
    const templates = websiteTemplatesStorage.getAll();
    const connectedTemplates = templates.filter(t => 
      Array.isArray(t.categories) && t.categories.includes(id)
    );

    if (connectedTemplates.length > 0) {
      throw new Error(`Cannot delete category because ${connectedTemplates.length} template(s) are still connected to it.`);
    }

    const all = this.getAll();
    const updated = all.filter(item => item.id !== id);
    
    inMemoryCategories = updated;
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    try {
      await supabaseDatabase.deleteWebsiteCategory(id);
    } catch (err) {
      console.warn('Supabase delete category notice:', err);
    }

    notifyListeners();
    return true;
  }
};
