import { BusinessAiItem } from '../types';
import { sanitizeText, sanitizeStringArray, sanitizeSlug } from '../utils/security';
import { solutionsStorage } from './solutionsStorage';
import { BUSINESS_AI_SHOWCASE } from '../data/companyData';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

import aiChatImg from '../assets/images/ai_chat_visual_1787467331635.jpg';
import aiVoiceImg from '../assets/images/ai_voice_visual_1787467347227.jpg';
import aiSupportImg from '../assets/images/ai_support_visual_1787467360024.jpg';
import aiLeadgenImg from '../assets/images/ai_leadgen_visual_1787467373926.jpg';
import processAutomationImg from '../assets/images/process_automation_visual_1787467388274.jpg';
import customAiImg from '../assets/images/custom_ai_visual_1787467400831.jpg';

const STORAGE_KEY = 'mani_business_ai_v1';

const getInitialImage = (id: string) => {
  switch (id) {
    case 'ai-chat': return aiChatImg;
    case 'ai-voice': return aiVoiceImg;
    case 'ai-support': return aiSupportImg;
    case 'ai-leadgen': return aiLeadgenImg;
    case 'ai-automation': return processAutomationImg;
    case 'custom-ai': return customAiImg;
    default: return aiChatImg;
  }
};

const INITIAL_DATA: BusinessAiItem[] = BUSINESS_AI_SHOWCASE.map((item, index) => ({
  id: `BAI-${item.id}`,
  title: item.title,
  slug: item.id,
  category: item.category,
  type: item.type || item.category,
  shortDescription: item.description,
  fullOverview: item.description,
  thumbnailUrl: getInitialImage(item.id),
  features: item.features,
  benefits: [
    'Saves staff time',
    'Faster customer response',
    'Works 24/7',
    'Reduces repetitive work',
    'Captures more enquiries',
    'Improves customer experience'
  ],
  howItWorks: [
    'Customer Engages',
    'AI Understands Query',
    'AI Responds Intelligently',
    'Customer Gets Information',
    'Lead/Enquiry Captured'
  ],
  targetBusinesses: [
    'Retail Stores',
    'Restaurants & Cafes',
    'Schools',
    'Healthcare',
    'Real Estate',
    'Service Businesses',
    'E-commerce'
  ],
  deliverables: [
    'Solution Setup',
    'Business Knowledge Setup',
    'Website Integration',
    'AI Configuration',
    'Testing',
    'Deployment',
    'Basic Support'
  ],
  technologies: ['React', 'Node.js', 'AI Models'],
  integrations: ['WhatsApp', 'Website Widget', 'API'],
  pricingType: 'Custom Pricing',
  customPricingText: 'Tell us about your requirements and we\'ll prepare a solution for your business.',
  status: 'published',
  order: index + 1,
  sampleInteraction: item.sampleInteraction,
  createdAt: new Date().toISOString()
}));

let memoryCache: BusinessAiItem[] = [];

type BusinessAiListener = () => void;
const listeners: Set<BusinessAiListener> = new Set();

export const subscribeToBusinessAi = (listener: BusinessAiListener) => {
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
      console.error('BusinessAi listener error:', e);
    }
  });
};

// Initial synchronous cache read
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
      }
    }
  }
} catch (e) {
  console.warn('Initial business AI cache read warning:', e);
}

// Firestore Real-time Sync
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'business_ai_solutions'), async (snapshot) => {
      if (false) { // snapshot.empty logic removed to prevent auto-reseeding

        if (INITIAL_DATA.length > 0) {
          try {
            const batch = writeBatch(db);
            INITIAL_DATA.forEach(item => {
              batch.set(doc(db, 'business_ai_solutions', item.id), cleanForFirestore(item));
            });
            await batch.commit();
          } catch (e) {
            console.warn('Failed to seed business_ai_solutions in Firestore:', e);
          }
        }
        memoryCache = [...INITIAL_DATA];
        notifyListeners();
      } else {
        const items = snapshot.docs.map(d => d.data() as BusinessAiItem);
        memoryCache = items;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
        notifyListeners();
      }
    }, (err) => console.warn('Firestore business_ai_solutions listener error:', err));
  } catch (e) {
    console.warn('Failed to attach Firestore business_ai listener:', e);
  }
}

export const businessAiStorage = {
  getAllRaw(): BusinessAiItem[] {
    return memoryCache.map(item => {
      const slugKey = item.slug || item.id.replace('BAI-', '');
      let validUrl = item.thumbnailUrl;
      if (!validUrl || validUrl.trim() === '' || validUrl.includes('unsplash.com') || validUrl.startsWith('../') || (validUrl.startsWith('/') && !validUrl.startsWith('/src'))) {
        validUrl = getInitialImage(slugKey);
      }
      return {
        ...item,
        thumbnailUrl: validUrl
      };
    });
  },

  getAll(): BusinessAiItem[] {
    return this.getAllRaw().sort((a, b) => (a.order || 999) - (b.order || 999));
  },

  getPublished(): BusinessAiItem[] {
    return this.getAll().filter(item => item.status === 'published');
  },

  getBySlug(slug: string): BusinessAiItem | undefined {
    return this.getAll().find(item => item.slug === slug);
  },

  save(item: Omit<BusinessAiItem, "id" | "createdAt" | "order">): BusinessAiItem {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }

    const all = this.getAllRaw();
    const newId = `BAI-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Enforce unique slug
    let newSlug = sanitizeSlug(item.slug);
    let counter = 1;
    while (all.some(i => i.slug === newSlug)) {
      newSlug = `${sanitizeSlug(item.slug)}-${counter}`;
      counter++;
    }

    const newItem: BusinessAiItem = {
      ...item,
      id: newId,
      title: sanitizeText(item.title, 200),
      slug: newSlug,
      category: sanitizeText(item.category, 100),
      type: sanitizeText(item.type, 100),
      shortDescription: sanitizeText(item.shortDescription, 500),
      fullOverview: sanitizeText(item.fullOverview, 5000),
      features: sanitizeStringArray(item.features, 30, 200),
      benefits: sanitizeStringArray(item.benefits, 30, 200),
      howItWorks: sanitizeStringArray(item.howItWorks, 10, 200),
      targetBusinesses: sanitizeStringArray(item.targetBusinesses, 30, 100),
      deliverables: sanitizeStringArray(item.deliverables, 30, 200),
      technologies: sanitizeStringArray(item.technologies, 30, 100),
      integrations: sanitizeStringArray(item.integrations, 30, 100),
      price: item.price ? sanitizeText(item.price, 50) : undefined,
      customPricingText: item.customPricingText ? sanitizeText(item.customPricingText, 200) : undefined,
      ctaText: item.ctaText ? sanitizeText(item.ctaText, 50) : undefined,
      whatsappCta: item.whatsappCta ? sanitizeText(item.whatsappCta, 50) : undefined,
      order: all.length + 1,
      createdAt: new Date().toISOString()
    };

    all.push(newItem);
    memoryCache = [...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}

    setDoc(doc(db, 'business_ai_solutions', newItem.id), cleanForFirestore(newItem)).catch(err => {
      console.error('Firestore save business AI item error:', err);
    });

    notifyListeners();
    return newItem;
  },

  update(id: string, updates: Partial<BusinessAiItem>): BusinessAiItem {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }

    const all = this.getAllRaw();
    const index = all.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');

    // Handle slug update safely
    let newSlug = all[index].slug;
    if (updates.slug !== undefined && updates.slug !== all[index].slug) {
      newSlug = sanitizeSlug(updates.slug);
      let counter = 1;
      while (all.some(i => i.slug === newSlug && i.id !== id)) {
        newSlug = `${sanitizeSlug(updates.slug)}-${counter}`;
        counter++;
      }
    }

    const updatedItem: BusinessAiItem = {
      ...all[index],
      ...updates,
      slug: newSlug,
      title: updates.title !== undefined ? sanitizeText(updates.title, 200) : all[index].title,
      category: updates.category !== undefined ? sanitizeText(updates.category, 100) : all[index].category,
      type: updates.type !== undefined ? sanitizeText(updates.type, 100) : all[index].type,
      shortDescription: updates.shortDescription !== undefined ? sanitizeText(updates.shortDescription, 500) : all[index].shortDescription,
      fullOverview: updates.fullOverview !== undefined ? sanitizeText(updates.fullOverview, 5000) : all[index].fullOverview,
      features: updates.features !== undefined ? sanitizeStringArray(updates.features, 30, 200) : all[index].features,
      benefits: updates.benefits !== undefined ? sanitizeStringArray(updates.benefits, 30, 200) : all[index].benefits,
      howItWorks: updates.howItWorks !== undefined ? sanitizeStringArray(updates.howItWorks, 10, 200) : all[index].howItWorks,
      targetBusinesses: updates.targetBusinesses !== undefined ? sanitizeStringArray(updates.targetBusinesses, 30, 100) : all[index].targetBusinesses,
      deliverables: updates.deliverables !== undefined ? sanitizeStringArray(updates.deliverables, 30, 200) : all[index].deliverables,
      technologies: updates.technologies !== undefined ? sanitizeStringArray(updates.technologies, 30, 100) : all[index].technologies,
      integrations: updates.integrations !== undefined ? sanitizeStringArray(updates.integrations, 30, 100) : all[index].integrations,
      price: updates.price !== undefined ? sanitizeText(updates.price, 50) : all[index].price,
      customPricingText: updates.customPricingText !== undefined ? sanitizeText(updates.customPricingText, 200) : all[index].customPricingText,
      ctaText: updates.ctaText !== undefined ? sanitizeText(updates.ctaText, 50) : all[index].ctaText,
      whatsappCta: updates.whatsappCta !== undefined ? sanitizeText(updates.whatsappCta, 50) : all[index].whatsappCta,
      updatedAt: new Date().toISOString()
    };

    all[index] = updatedItem;
    memoryCache = [...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}

    setDoc(doc(db, 'business_ai_solutions', updatedItem.id), cleanForFirestore(updatedItem)).catch(err => {
      console.error('Firestore update business AI item error:', err);
    });

    notifyListeners();
    return updatedItem;
  },

  async delete(id: string): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'business_ai_solutions', id));
    } catch (err) {
      console.error('Firestore delete business AI item error:', err);
      throw err;
    }
  },

  reorder(ids: string[]): void {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    const all = this.getAllRaw();
    ids.forEach((id, index) => {
      const item = all.find(i => i.id === id);
      if (item) {
        item.order = index + 1;
        setDoc(doc(db, 'business_ai_solutions', item.id), cleanForFirestore(item)).catch(() => {});
      }
    });
    memoryCache = [...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}

    notifyListeners();
  }
};
