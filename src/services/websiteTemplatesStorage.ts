import { WebsiteTemplate } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { enquiryStorage } from './enquiryStorage';
import { 
  sanitizeText, 
  sanitizeSlug, 
  checkRateLimit 
} from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';

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
    features: ['Instant Category Filter', 'Special Offers Banner', 'Customer Inquiry Box', 'Direct Phone Dialing'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-003',
    title: 'Dine-in & Cafe QR Menu Website',
    slug: 'restaurant-template-01',
    description: 'Ultra-fast loading digital food menu for cafes, restaurants, and cloud kitchens with dish image zoom, chef specials, and online reservation inquiry.',
    price: '₹1,499',
    category: 'restaurant',
    categories: ['restaurant'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://restaurant-demo01.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 3,
    features: ['Digital QR Food Menu', 'Table Booking Form', 'Customer Reviews Carousel', 'Chef Special Tagging'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-004',
    title: 'Cloud Kitchen & Quick Food Delivery Hub',
    slug: 'restaurant-template-02',
    description: 'Optimized conversion landing website for takeaway outlets and cloud kitchens featuring WhatsApp food ordering cart and real-time delivery radius display.',
    price: '₹1,499',
    category: 'restaurant',
    categories: ['restaurant', 'ecommerce'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://restaurant-demo02.manisolution.com',
    isFeatured: false,
    status: 'published',
    displayOrder: 4,
    features: ['WhatsApp Order Cart', 'Live Delivery Radius', 'Combos & Discounts Section', 'Customer Rating Display'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-005',
    title: 'School & Institute Official Portal',
    slug: 'school-template-01',
    description: 'Clean and authoritative official website template for schools, colleges, and academies. Includes admission notices, principal message, and photo gallery.',
    price: '₹1,499',
    category: 'school',
    categories: ['school', 'education'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://school-demo01.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 5,
    features: ['Online Admission Enquiry', 'Notice Board & Circulars', 'Campus Gallery Showcase', 'Faculty Directory'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-006',
    title: 'Competitive Coaching & Test Prep Hub',
    slug: 'coaching-template-01',
    description: 'High-converting website built for competitive coaching institutes, test prep centres, and private tutors. Includes course syllabus and topper testimonial showcase.',
    price: '₹1,499',
    category: 'coaching',
    categories: ['coaching', 'school'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://coaching-demo01.manisolution.com',
    isFeatured: false,
    status: 'published',
    displayOrder: 6,
    features: ['Free Demo Class Booking', 'Batch Schedule Table', 'Topper Rank Wall', 'Downloadable PDF Syllabus'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-007',
    title: 'Doctor Clinic & OPD Appointment Hub',
    slug: 'doctor-clinic-template-01',
    description: 'Professional healthcare clinic website with doctor qualifications, treatment services list, OPD consultation timings, and instant appointment booking.',
    price: '₹1,499',
    category: 'doctor',
    categories: ['doctor', 'services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://clinic-demo01.manisolution.com',
    isFeatured: true,
    status: 'published',
    displayOrder: 7,
    features: ['Doctor Profiles & Degrees', 'OPD Timing Schedule', 'Online Appointment Request', 'Clinic Location & Directions'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'WT-2026-008',
    title: 'Corporate Services & Consultant Showcase',
    slug: 'corporate-services-template-01',
    description: 'Corporate business website for consulting firms, agencies, CA / tax advocates, and service providers looking for credibility and inbound B2B client leads.',
    price: '₹1,499',
    category: 'services',
    categories: ['services'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    demoUrl: 'https://corporate-demo01.manisolution.com',
    isFeatured: false,
    status: 'published',
    displayOrder: 8,
    features: ['B2B Lead Capture Form', 'Client Case Studies', 'Services Grid', 'Google Reviews Integration'],
    createdAt: new Date().toISOString()
  }
];

// Initialize from LocalStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryTemplates = parsed.map(normalizeTemplate);
      } else {
        inMemoryTemplates = [...INITIAL_TEMPLATES_SEED];
      }
    } else {
      inMemoryTemplates = [...INITIAL_TEMPLATES_SEED];
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
  inMemoryTemplates = [...INITIAL_TEMPLATES_SEED];
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();
export const subscribeToWebsiteTemplates = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const subscribeToTemplates = subscribeToWebsiteTemplates;

const notifyListeners = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Templates listener callback error', e);
    }
  });
};

// Supabase sync for templates
if (typeof window !== 'undefined') {
  supabaseDatabase.getWebsiteTemplates().then(items => {
    if (items && items.length > 0) {
      inMemoryTemplates = items.map(t => normalizeTemplate({
        id: t.id,
        title: t.title,
        slug: t.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: t.description,
        price: `₹${t.price}`,
        category: t.category,
        categories: [t.category],
        thumbnailUrl: t.thumbnailUrl,
        demoUrl: t.demoUrl || (t as any).previewUrl || '',
        isFeatured: Boolean(t.isFeatured),
        status: (t.status === 'draft' ? 'draft' : 'published') as any,
        displayOrder: 1,
        features: t.features || [],
        createdAt: t.createdAt
      }));
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(inMemoryTemplates));
      } catch {}
      notifyListeners();
    }
  }).catch(() => {});
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

    const saved = await supabaseDatabase.saveWebsiteTemplate(newItem);
    if (!saved) {
      throw new Error('Failed to save website template to Supabase database.');
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
      id: existing.id,
      createdAt: existing.createdAt,
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

    const saved = await supabaseDatabase.saveWebsiteTemplate(updatedItem);
    if (!saved) {
      throw new Error('Failed to update website template in Supabase database.');
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

    const deleted = await supabaseDatabase.deleteWebsiteTemplate(id);
    if (!deleted) {
      throw new Error('Failed to delete website template from Supabase database.');
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

    for (const item of INITIAL_TEMPLATES_SEED) {
      await supabaseDatabase.saveWebsiteTemplate(item).catch(() => {});
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

    // Mirror into general enquiries for standard admin tracking and Supabase persistence
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

    notifyListeners();
    return true;
  }
};
