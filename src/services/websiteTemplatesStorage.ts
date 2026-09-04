import { WebsiteTemplate } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { enquiryStorage } from './enquiryStorage';
import { 
  sanitizeText, 
  sanitizeSlug, 
  checkRateLimit 
} from '../utils/security';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

const TEMPLATES_STORAGE_KEY = 'mani_website_templates_v1';
const TEMPLATE_ORDERS_STORAGE_KEY = 'mani_template_orders_v1';

export interface TemplateOrder {
  id: string; // e.g. "WTO-2026-0001"
  templateId: string;
  templateTitle: string;
  templateCategory: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  businessName?: string;
  city?: string;
  state?: string;
  fullAddress?: string;
  additionalRequirements?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  createdAt: string;
}

// Helper to normalize legacy and multi-category template objects
export function normalizeTemplate(raw: any): WebsiteTemplate {
  let cats: string[] = [];
  if (Array.isArray(raw.categories)) {
    cats = raw.categories
      .map((c: any) => typeof c === 'object' && c !== null ? (c.id || c.name || '') : c)
      .filter((c: any) => typeof c === 'string' && c.trim().length > 0);
  }
  if (cats.length === 0 && raw.category) {
    const fallback = typeof raw.category === 'object' && raw.category !== null 
      ? (raw.category.id || raw.category.name || '') 
      : raw.category;
    if (typeof fallback === 'string' && fallback.trim().length > 0) {
      cats = [fallback.trim()];
    }
  }
  if (cats.length === 0) {
    cats = ['services'];
  }
  const seen = new Set<string>();
  const uniqueCats: string[] = [];
  for (const c of cats) {
    const lower = String(c).toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueCats.push(String(c));
    }
  }
  return {
    ...raw,
    categories: uniqueCats,
    category: uniqueCats[0] || 'services'
  };
}

let inMemoryTemplates: WebsiteTemplate[] = [];
let inMemoryTemplateOrders: TemplateOrder[] = [];

// Seed templates matching user categories
const INITIAL_TEMPLATES_SEED: WebsiteTemplate[] = [
  {
    id: 'WT-2026-001',
    title: 'Retail Shop Showcase Template 01',
    slug: 'retail-template-01',
    description: 'A modern, high-conversion retail website template designed to showcase inventories, list store locations, and let customers place direct orders via WhatsApp.',
    price: '₹1,499',
    category: 'retail',
    categories: ['retail', 'services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://retail-demo01.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 1,
    features: ['WhatsApp Quick Ordering', 'Product Catalog Grid', 'Google Maps Store Locator', 'Store Timings Display'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-002',
    title: 'Supermarket Inventory & Catalog 02',
    slug: 'retail-template-02',
    description: 'Premium online shelf display for larger grocery stores, marts, and boutique shops with categorised catalogs and responsive touch navigation.',
    price: '₹1,499',
    category: 'retail',
    categories: ['retail', 'ecommerce'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://retail-demo02.manisolution.com',
    isFeatured: false,
    status: 'published',
    displayOrder: 2,
    features: ['Categorised Collections', 'In-Stock Badge Toggle', 'Social Share Integration', 'Lightweight Load'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-003',
    title: 'Bistro & Italian Cafe Template 01',
    slug: 'restaurant-template-01',
    description: 'An elegant digital presence for cozy cafes, coffee shops, and restaurants. Features high-res food graphics, categorized table menus, and table reservation calls.',
    price: '₹1,499',
    category: 'restaurant',
    categories: ['restaurant', 'services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://cafe-demo01.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 1,
    features: ['Visual Digital Menu', 'Online Table Reservation Inquiry', 'Chef Highlights Carousel', 'Mobile-Optimised Menu Tabs'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-004',
    title: 'Gourmet Dining Restaurant Template 02',
    slug: 'restaurant-template-02',
    description: 'Sophisticated luxury dining theme with custom booking logs, staff pages, and high-quality sliders for modern urban restaurants.',
    price: '₹1,999',
    category: 'restaurant',
    categories: ['restaurant'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://restaurant-demo02.manisolution.com',
    isFeatured: false,
    status: 'published',
    displayOrder: 2,
    features: ['High-End Photo Sliders', 'Comprehensive Booking Form', 'Staff & Chef Biographies', 'GST-compliant Price List'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-005',
    title: 'Premium Beauty & Hair Salon Template',
    slug: 'salon-template-01',
    description: 'A stylish and professional template for salons, spas, and wellness clinics with pricing tables and interactive service cards.',
    price: '₹1,499',
    category: 'salon',
    categories: ['salon', 'services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://salon-demo.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 1,
    features: ['Interactive Rate Card', 'Stylist Appointment Leads', 'Customer Testimonials Slider', 'Before/After Comparison Box'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-006',
    title: 'FitNation Gym & CrossFit Template',
    slug: 'gyms-template-01',
    description: 'High-energy layout for fitness centers, personal trainers, and CrossFit boxes. Focuses on membership plans, schedule logs, and trainer profiles.',
    price: '₹1,499',
    category: 'fitness',
    categories: ['fitness', 'services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://gym-demo.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 1,
    features: ['Membership Comparison Grid', 'Workout Slot Inquiry Form', 'Trainer Introduction Cards', 'Clean Dark Aesthetic Option'],
    createdAt: new Date().toISOString()
  }
];

// Load local cache initially
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryTemplates = parsed.map(normalizeTemplate);
      }
    }
    const storedOrders = localStorage.getItem(TEMPLATE_ORDERS_STORAGE_KEY);
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      if (Array.isArray(parsedOrders)) {
        inMemoryTemplateOrders = parsedOrders;
      }
    }
  }
} catch (e) {
  console.warn('Initial website templates cache read warning:', e);
}

// Event notification listeners
type TemplateListener = () => void;
const listeners: Set<TemplateListener> = new Set();

export const subscribeToTemplates = (listener: TemplateListener) => {
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
      console.error('Templates listener callback error', e);
    }
  });
};

// Real-time sync with Firebase Firestore
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'website_templates'), (snapshot) => {
      if (snapshot.empty) {
        // Seeding initial templates if database is empty
        const batch = writeBatch(db);
        INITIAL_TEMPLATES_SEED.forEach(item => {
          batch.set(doc(db, 'website_templates', item.id), cleanForFirestore(item));
        });
        batch.commit().catch(err => console.warn('Failed to commit template seed:', err));
        inMemoryTemplates = [...INITIAL_TEMPLATES_SEED];
        notifyListeners();
      } else {
        const items = snapshot.docs.map(d => normalizeTemplate(d.data()));
        inMemoryTemplates = items.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
        try {
          localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(inMemoryTemplates));
        } catch {}
        notifyListeners();
      }
    }, (err) => console.warn('Firestore website_templates listener error:', err));

    onSnapshot(collection(db, 'template_orders'), (snapshot) => {
      const orders = snapshot.docs.map(d => d.data() as TemplateOrder);
      inMemoryTemplateOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try {
        localStorage.setItem(TEMPLATE_ORDERS_STORAGE_KEY, JSON.stringify(inMemoryTemplateOrders));
      } catch {}
      notifyListeners();
    }, (err) => console.warn('Firestore template_orders listener error:', err));

  } catch (e) {
    console.warn('Failed to attach Firestore templates listeners:', e);
  }
}

export const websiteTemplatesStorage = {
  // Retrieve all templates (for Admin view)
  getAll(): WebsiteTemplate[] {
    if (inMemoryTemplates.length === 0) {
      return INITIAL_TEMPLATES_SEED;
    }
    return inMemoryTemplates;
  },

  // Retrieve published templates
  getPublished(): WebsiteTemplate[] {
    return this.getAll().filter(item => item.status === 'published');
  },

  // Retrieve templates for a specific category id (e.g. 'retail', 'restaurant', 'services')
  getByCategory(categoryId: string): WebsiteTemplate[] {
    const target = categoryId.toLowerCase();
    return this.getPublished().filter(item => {
      if (Array.isArray(item.categories) && item.categories.length > 0) {
        return item.categories.some(c => c.toLowerCase() === target);
      }
      return item.category ? item.category.toLowerCase() === target : false;
    });
  },

  // Get count of published templates per category
  getCategoryCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    const published = this.getPublished();
    published.forEach(item => {
      const cats = Array.isArray(item.categories) && item.categories.length > 0
        ? item.categories
        : (item.category ? [item.category] : []);
      const uniqueCatsInTemplate = Array.from(new Set<string>(cats.map(c => c.toLowerCase())));
      uniqueCatsInTemplate.forEach((catId: string) => {
        counts[catId] = (counts[catId] || 0) + 1;
      });
    });
    return counts;
  },

  // Find by slug
  getBySlug(slug: string): WebsiteTemplate | undefined {
    return this.getAll().find(item => item.slug === slug || item.id === slug);
  },

  // Find by id
  getById(id: string): WebsiteTemplate | undefined {
    return this.getAll().find(item => item.id === id);
  },

  // Create template (Admin Protected)
  async create(template: Omit<WebsiteTemplate, 'id' | 'createdAt'>): Promise<WebsiteTemplate> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    let catsToSave: string[] = [];
    if (Array.isArray(template.categories) && template.categories.length > 0) {
      catsToSave = template.categories;
    } else if (template.category && template.category.trim()) {
      catsToSave = [template.category.trim()];
    }

    catsToSave = Array.from(new Set(catsToSave.map(c => sanitizeText(c, 100)).filter(Boolean)));
    if (catsToSave.length === 0) {
      throw new Error('Please select at least one connected business category.');
    }

    const all = this.getAll();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `WT-2026-${randomNum}`;
    const cleanSlug = sanitizeSlug(template.slug || template.title);

    const newItem: WebsiteTemplate = {
      ...template,
      id,
      slug: cleanSlug || `template-${id.toLowerCase()}`,
      title: sanitizeText(template.title, 150),
      description: sanitizeText(template.description, 4000),
      price: sanitizeText(template.price, 50),
      categories: catsToSave,
      category: catsToSave[0] || 'services',
      thumbnailUrl: template.thumbnailUrl ? template.thumbnailUrl.trim() : '',
      demoUrl: template.demoUrl ? sanitizeText(template.demoUrl, 500) : '',
      buyUrl: template.buyUrl ? sanitizeText(template.buyUrl, 500) : '',
      isFeatured: !!template.isFeatured,
      status: template.status || 'published',
      displayOrder: template.displayOrder ? Number(template.displayOrder) : 1,
      features: template.features ? template.features.map(f => sanitizeText(f, 200)) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newItem, ...all];
    inMemoryTemplates = updated;
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      await setDoc(doc(db, 'website_templates', newItem.id), cleanForFirestore(newItem));
    } catch (err) {
      console.error('Firestore create template error:', err);
      // Revert local memory if database fails
      inMemoryTemplates = all;
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(all));
      } catch {}
      notifyListeners();
      throw new Error(`Failed to save template to database: ${err instanceof Error ? err.message : String(err)}`);
    }

    notifyListeners();
    return newItem;
  },

  // Update template (Admin Protected)
  async update(id: string, updates: Partial<WebsiteTemplate>): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    const all = this.getAll();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Template with ID "${id}" not found.`);
    }

    const existing = all[index];
    const now = new Date().toISOString();

    let cleanSlug = updates.slug !== undefined ? sanitizeSlug(updates.slug) : existing.slug;
    if (!cleanSlug && updates.title) {
      cleanSlug = sanitizeSlug(updates.title);
    }

    let catsToSave = existing.categories && existing.categories.length > 0
      ? existing.categories
      : (existing.category ? [existing.category] : ['services']);

    if (updates.categories !== undefined) {
      if (!Array.isArray(updates.categories) || updates.categories.length === 0) {
        throw new Error('Please select at least one connected business category.');
      }
      catsToSave = Array.from(new Set(updates.categories.map(c => sanitizeText(c, 100)).filter(Boolean)));
    } else if (updates.category !== undefined && updates.category.trim()) {
      const sanitizedCat = sanitizeText(updates.category, 100);
      if (sanitizedCat) {
        catsToSave = Array.from(new Set([sanitizedCat, ...catsToSave]));
      }
    }

    const updatedItem: WebsiteTemplate = {
      ...existing,
      ...updates,
      id: existing.id, // Preserving existing document ID
      createdAt: existing.createdAt, // Preserving creation date
      title: updates.title !== undefined ? sanitizeText(updates.title, 150) : existing.title,
      slug: cleanSlug || existing.slug,
      description: updates.description !== undefined ? sanitizeText(updates.description, 4000) : existing.description,
      price: updates.price !== undefined ? sanitizeText(updates.price, 50) : existing.price,
      categories: catsToSave,
      category: catsToSave[0] || existing.category || 'services',
      thumbnailUrl: updates.thumbnailUrl !== undefined ? updates.thumbnailUrl.trim() : existing.thumbnailUrl,
      demoUrl: updates.demoUrl !== undefined ? sanitizeText(updates.demoUrl, 500) : existing.demoUrl,
      buyUrl: updates.buyUrl !== undefined ? sanitizeText(updates.buyUrl, 500) : existing.buyUrl,
      isFeatured: updates.isFeatured !== undefined ? !!updates.isFeatured : existing.isFeatured,
      status: updates.status !== undefined ? updates.status : existing.status,
      displayOrder: updates.displayOrder !== undefined ? Number(updates.displayOrder) : existing.displayOrder,
      features: updates.features ? updates.features.map(f => sanitizeText(f, 200)) : existing.features,
      updatedAt: now
    };

    all[index] = updatedItem;
    inMemoryTemplates = [...all];
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      await setDoc(doc(db, 'website_templates', id), cleanForFirestore(updatedItem));
    } catch (err) {
      console.error('Firestore update template error for ID:', id, err);
      // Revert in-memory and local storage if firestore write fails
      all[index] = existing;
      inMemoryTemplates = [...all];
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(all));
      } catch {}
      notifyListeners();
      throw new Error(`Failed to update template in database: ${err instanceof Error ? err.message : String(err)}`);
    }

    notifyListeners();
    return true;
  },

  // Delete template (Admin Protected)
  async delete(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin login required');
    }

    const all = this.getAll();
    const filtered = all.filter(item => item.id !== id);
    if (filtered.length === all.length) return false;

    inMemoryTemplates = filtered;
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}

    try {
      await deleteDoc(doc(db, 'website_templates', id));
    } catch (err) {
      console.error('Firestore delete template error:', err);
      inMemoryTemplates = all;
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(all));
      } catch {}
      notifyListeners();
      throw new Error(`Failed to delete template from database: ${err instanceof Error ? err.message : String(err)}`);
    }

    notifyListeners();
    return true;
  },

  // Toggle Publish Status
  async toggleStatus(id: string): Promise<boolean> {
    const item = this.getById(id);
    if (!item) return false;
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    return await this.update(id, { status: newStatus });
  },

  // Toggle Featured Status
  async toggleFeatured(id: string): Promise<boolean> {
    const item = this.getById(id);
    if (!item) return false;
    return await this.update(id, { isFeatured: !item.isFeatured });
  },

  // Reset to seed
  async resetToDefault(): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) return;
    inMemoryTemplates = [...INITIAL_TEMPLATES_SEED];
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(INITIAL_TEMPLATES_SEED));
    } catch {}

    try {
      const batch = writeBatch(db);
      INITIAL_TEMPLATES_SEED.forEach(item => {
        batch.set(doc(db, 'website_templates', item.id), cleanForFirestore(item));
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to reset website_templates in Firestore:', e);
    }

    notifyListeners();
  },

  // ==========================
  // TEMPLATE ORDERS / REQUESTS
  // ==========================
  getAllOrders(): TemplateOrder[] {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return [];
    }
    return inMemoryTemplateOrders;
  },

  createOrder(data: Omit<TemplateOrder, 'id' | 'createdAt' | 'status'>): TemplateOrder {
    const rateCheck = checkRateLimit('template_order_submit', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Submission limit reached. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before trying again.`);
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `WTO-2026-${randomNum}`;

    const newOrder: TemplateOrder = {
      ...data,
      id: newId,
      fullName: sanitizeText(data.fullName, 120),
      mobileNumber: sanitizeText(data.mobileNumber, 25),
      whatsappNumber: sanitizeText(data.whatsappNumber || data.mobileNumber, 25),
      email: sanitizeText(data.email, 120),
      businessName: sanitizeText(data.businessName || '', 150),
      city: sanitizeText(data.city || '', 100),
      state: sanitizeText(data.state || '', 100),
      fullAddress: sanitizeText(data.fullAddress || '', 300),
      additionalRequirements: sanitizeText(data.additionalRequirements || '', 3000),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    inMemoryTemplateOrders = [newOrder, ...inMemoryTemplateOrders];
    try {
      localStorage.setItem(TEMPLATE_ORDERS_STORAGE_KEY, JSON.stringify(inMemoryTemplateOrders));
    } catch {}

    setDoc(doc(db, 'template_orders', newOrder.id), cleanForFirestore(newOrder)).catch(err => {
      console.error('Firestore save template order error:', err);
    });

    // Also mirror into general enquiries for standard admin tracking
    try {
      enquiryStorage.create({
        fullName: newOrder.fullName,
        phone: newOrder.mobileNumber,
        email: newOrder.email,
        service: `Website Template Order: ${newOrder.templateTitle}`,
        projectRequirements: `Website Template Purchase Request for: "${newOrder.templateTitle}" (${newOrder.templateCategory}).
Business Name: ${newOrder.businessName || 'N/A'}
WhatsApp: ${newOrder.whatsappNumber || newOrder.mobileNumber}
Location: ${newOrder.city || ''}, ${newOrder.state || ''}
Address: ${newOrder.fullAddress || 'N/A'}
User Comments: ${newOrder.additionalRequirements || 'No additional requirements specified.'}`
      });
    } catch (e) {
      console.warn('Mirror template order as enquiry failed:', e);
    }

    notifyListeners();
    return newOrder;
  },

  updateOrderStatus(id: string, status: 'New' | 'Contacted' | 'In Progress' | 'Closed'): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const index = inMemoryTemplateOrders.findIndex(o => o.id === id);
    if (index === -1) return false;

    inMemoryTemplateOrders[index].status = status;
    try {
      localStorage.setItem(TEMPLATE_ORDERS_STORAGE_KEY, JSON.stringify(inMemoryTemplateOrders));
    } catch {}

    setDoc(doc(db, 'template_orders', id), cleanForFirestore(inMemoryTemplateOrders[index])).catch(err => {
      console.error('Firestore update template order status error:', err);
    });

    notifyListeners();
    return true;
  },

  deleteOrder(id: string): boolean {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return false;
    }
    const filtered = inMemoryTemplateOrders.filter(o => o.id !== id);
    if (filtered.length === inMemoryTemplateOrders.length) return false;

    inMemoryTemplateOrders = filtered;
    try {
      localStorage.setItem(TEMPLATE_ORDERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch {}

    deleteDoc(doc(db, 'template_orders', id)).catch(err => {
      console.error('Firestore delete template order error:', err);
    });

    notifyListeners();
    return true;
  }
};
