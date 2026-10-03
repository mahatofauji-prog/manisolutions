import { FounderProfile, LeadershipProfile } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { sanitizeText } from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';
import { HARIOM_MAHATO_PHOTO, DEFAULT_FOUNDER_PHOTO } from '../assets/founderImage';

const STORAGE_KEY = 'mani_founder_profile_v1';
const LEADERSHIP_KEY = 'mani_leadership_profiles_v1';

export const DEFAULT_FOUNDER_PROFILE: FounderProfile = {
  name: 'Mr. Hariom Mahato',
  designation: 'FOUNDER & LEAD TECHNOLOGIST',
  photoUrl: HARIOM_MAHATO_PHOTO,
  bio: 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.',
  title: 'Founder & Lead Technologist',
  updatedAt: '2026-08-25T05:32:33.205Z'
};

export const DEFAULT_LEADERSHIP_PROFILES: LeadershipProfile[] = [
  {
    id: 'lead-founder-hariom',
    name: 'Mr. Hariom Mahato',
    designation: 'FOUNDER & LEAD TECHNOLOGIST',
    role: 'Founder',
    photoUrl: HARIOM_MAHATO_PHOTO,
    shortBio: 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.',
    fullBio: 'With extensive systems architecture and digital engineering experience, Mr. Hariom Mahato founded MANI Solution to deliver high-performance web applications, enterprise software, and AI solutions.',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/company/mani-solution/',
      email: 'hariomkdi@gmail.com'
    },
    displayOrder: 1,
    isPublished: true,
    createdAt: '2026-08-25T05:32:33.205Z',
    updatedAt: new Date().toISOString()
  }
];

function normalizeLeadership(rawLeads: LeadershipProfile[]): LeadershipProfile[] {
  if (!Array.isArray(rawLeads) || rawLeads.length === 0) {
    return [...DEFAULT_LEADERSHIP_PROFILES];
  }

  let leads = rawLeads.map(p => {
    if (p.role === 'Founder' || (p.name && p.name.toLowerCase().includes('hariom'))) {
      return {
        ...p,
        role: 'Founder' as const,
        name: 'Mr. Hariom Mahato',
        designation: p.designation || 'FOUNDER & LEAD TECHNOLOGIST',
        photoUrl: p.photoUrl && p.photoUrl.trim() !== '' ? p.photoUrl : HARIOM_MAHATO_PHOTO,
        shortBio: p.shortBio || DEFAULT_FOUNDER_PROFILE.bio || '',
        isPublished: true, // Mr. Hariom Mahato is always published
        displayOrder: 1
      };
    }
    return {
      ...p,
      photoUrl: p.photoUrl || DEFAULT_FOUNDER_PHOTO
    };
  });

  const hasFounder = leads.some(p => p.role === 'Founder');
  if (!hasFounder) {
    leads.unshift(DEFAULT_LEADERSHIP_PROFILES[0]);
  }

  return leads.sort((a, b) => (a.role === 'Founder' ? -1 : b.role === 'Founder' ? 1 : a.displayOrder - b.displayOrder));
}

let inMemoryProfile: FounderProfile = { ...DEFAULT_FOUNDER_PROFILE };
let inMemoryLeadership: LeadershipProfile[] = [...DEFAULT_LEADERSHIP_PROFILES];

type ProfileListener = () => void;
const listeners: Set<ProfileListener> = new Set();

export const subscribeToFounderProfile = (listener: ProfileListener) => {
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
      console.error('FounderProfile listener error', e);
    }
  });
};

// Synchronous local cache load
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      inMemoryProfile = {
        name: parsed.name || DEFAULT_FOUNDER_PROFILE.name,
        designation: parsed.designation || DEFAULT_FOUNDER_PROFILE.designation,
        photoUrl: parsed.photoUrl && parsed.photoUrl.trim() !== '' ? parsed.photoUrl : HARIOM_MAHATO_PHOTO,
        bio: parsed.bio || DEFAULT_FOUNDER_PROFILE.bio,
        title: parsed.title || DEFAULT_FOUNDER_PROFILE.title,
        updatedAt: parsed.updatedAt || DEFAULT_FOUNDER_PROFILE.updatedAt
      };
    }

    const storedLead = localStorage.getItem(LEADERSHIP_KEY);
    if (storedLead) {
      const parsedLead = JSON.parse(storedLead);
      if (Array.isArray(parsedLead) && parsedLead.length > 0) {
        inMemoryLeadership = normalizeLeadership(parsedLead);
      }
    }
  }
} catch (e) {
  console.warn('Initial profile load warning:', e);
}

// Supabase sync
if (typeof window !== 'undefined') {
  setTimeout(() => {
    supabaseDatabase.getSetting<LeadershipProfile[]>('leadership_profiles').then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        inMemoryLeadership = normalizeLeadership(data);
        const founder = inMemoryLeadership.find(p => p.role === 'Founder');
        if (founder) {
          inMemoryProfile = {
            name: founder.name,
            designation: founder.designation,
            photoUrl: founder.photoUrl,
            bio: founder.shortBio,
            title: founder.designation,
            updatedAt: founder.updatedAt
          };
        }
        try {
          localStorage.setItem(LEADERSHIP_KEY, JSON.stringify(inMemoryLeadership));
        } catch {}
        notifyListeners();
      }
    }).catch(() => {});

    supabaseDatabase.getSetting<FounderProfile>('founder_profile').then(data => {
      if (data && data.name) {
        inMemoryProfile = {
          ...data,
          name: data.name || DEFAULT_FOUNDER_PROFILE.name,
          designation: data.designation || DEFAULT_FOUNDER_PROFILE.designation,
          photoUrl: data.photoUrl && data.photoUrl.trim() !== '' ? data.photoUrl : HARIOM_MAHATO_PHOTO
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryProfile));
        } catch {}
        notifyListeners();
      }
    }).catch(() => {});
  }, 100);
}

export const founderProfileStorage = {
  // Legacy single founder getter
  get(): FounderProfile {
    const founder = inMemoryLeadership.find(p => p.role === 'Founder');
    if (founder) {
      return {
        name: founder.name,
        designation: founder.designation,
        photoUrl: founder.photoUrl,
        bio: founder.shortBio,
        title: founder.designation,
        updatedAt: founder.updatedAt
      };
    }
    return { ...inMemoryProfile };
  },

  // Legacy single founder save
  async save(updates: Partial<FounderProfile>): Promise<FounderProfile> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to modify founder profile');
    }

    const current = this.get();
    const updated: FounderProfile = {
      ...current,
      ...updates,
      name: updates.name !== undefined ? sanitizeText(updates.name, 120) : current.name,
      designation: updates.designation !== undefined ? sanitizeText(updates.designation, 120) : current.designation,
      photoUrl: updates.photoUrl !== undefined ? updates.photoUrl : current.photoUrl,
      bio: updates.bio !== undefined ? sanitizeText(updates.bio, 2000) : current.bio,
      title: updates.title !== undefined ? sanitizeText(updates.title, 120) : current.title,
      updatedAt: new Date().toISOString()
    };

    const backupProfile = { ...inMemoryProfile };
    const backupLeadership = [...inMemoryLeadership];
    inMemoryProfile = updated;

    inMemoryLeadership = inMemoryLeadership.map(p => {
      if (p.role === 'Founder') {
        return {
          ...p,
          name: updated.name,
          designation: updated.designation,
          photoUrl: updated.photoUrl,
          shortBio: updated.bio || '',
          updatedAt: updated.updatedAt
        };
      }
      return p;
    });

    try {
      const r1 = await supabaseDatabase.saveSetting('founder_profile', updated);
      const r2 = await supabaseDatabase.saveSetting('leadership_profiles', inMemoryLeadership);
      if (!r1 || !r2) {
        inMemoryProfile = backupProfile;
        inMemoryLeadership = backupLeadership;
        throw new Error('Supabase database rejected founder profile save.');
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(LEADERSHIP_KEY, JSON.stringify(inMemoryLeadership));
    } catch (err) {
      inMemoryProfile = backupProfile;
      inMemoryLeadership = backupLeadership;
      console.error('Failed to sync founder profile to Supabase:', err);
      throw err;
    }

    notifyListeners();
    return updated;
  },

  // Multi-profile Leadership & Co-Founder management
  getAllLeadership(): LeadershipProfile[] {
    return [...inMemoryLeadership].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getPublishedLeadership(): LeadershipProfile[] {
    const published = inMemoryLeadership
      .filter(p => p.isPublished)
      .sort((a, b) => (a.role === 'Founder' ? -1 : b.role === 'Founder' ? 1 : a.displayOrder - b.displayOrder));

    const hasFounder = published.some(p => p.role === 'Founder');
    if (!hasFounder) {
      const founder = inMemoryLeadership.find(p => p.role === 'Founder') || DEFAULT_LEADERSHIP_PROFILES[0];
      return [{ ...founder, isPublished: true }, ...published];
    }
    return published;
  },

  async saveLeadershipProfile(profile: Omit<LeadershipProfile, 'id' | 'createdAt'>, id?: string): Promise<LeadershipProfile> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }

    let target: LeadershipProfile;
    if (id) {
      target = {
        ...profile,
        id,
        updatedAt: new Date().toISOString(),
        createdAt: inMemoryLeadership.find(p => p.id === id)?.createdAt || new Date().toISOString()
      };
      inMemoryLeadership = inMemoryLeadership.map(p => p.id === id ? target : p);
    } else {
      target = {
        ...profile,
        id: `lead-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryLeadership = [...inMemoryLeadership, target];
    }

    if (target.role === 'Founder') {
      inMemoryProfile = {
        name: target.name,
        designation: target.designation,
        photoUrl: target.photoUrl,
        bio: target.shortBio,
        title: target.designation,
        updatedAt: target.updatedAt
      };
    }

    try {
      localStorage.setItem(LEADERSHIP_KEY, JSON.stringify(inMemoryLeadership));
      await supabaseDatabase.saveSetting('leadership_profiles', inMemoryLeadership);
      if (target.role === 'Founder') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryProfile));
        await supabaseDatabase.saveSetting('founder_profile', inMemoryProfile);
      }
    } catch {}

    notifyListeners();
    return target;
  },

  async deleteLeadershipProfile(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    inMemoryLeadership = inMemoryLeadership.filter(p => p.id !== id);
    try {
      localStorage.setItem(LEADERSHIP_KEY, JSON.stringify(inMemoryLeadership));
      await supabaseDatabase.saveSetting('leadership_profiles', inMemoryLeadership);
    } catch {}
    notifyListeners();
    return true;
  },

  async toggleLeadershipPublished(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    inMemoryLeadership = inMemoryLeadership.map(p => {
      if (p.id === id) {
        return { ...p, isPublished: !p.isPublished, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    try {
      localStorage.setItem(LEADERSHIP_KEY, JSON.stringify(inMemoryLeadership));
      await supabaseDatabase.saveSetting('leadership_profiles', inMemoryLeadership);
    } catch {}
    notifyListeners();
    return true;
  }
};
