import { FounderProfile } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { sanitizeText } from '../utils/security';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

const STORAGE_KEY = 'mani_founder_profile_v1';

export const DEFAULT_FOUNDER_PROFILE: FounderProfile = {
  name: 'Mr. Hariom Mahato',
  designation: 'FOUNDER & LEAD TECHNOLOGIST',
  photoUrl: '', // Default empty => clean professional placeholder
  bio: 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.',
  updatedAt: new Date().toISOString()
};

let inMemoryProfile: FounderProfile = { ...DEFAULT_FOUNDER_PROFILE };

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
        photoUrl: typeof parsed.photoUrl === 'string' ? parsed.photoUrl : DEFAULT_FOUNDER_PROFILE.photoUrl,
        bio: parsed.bio || DEFAULT_FOUNDER_PROFILE.bio,
        updatedAt: parsed.updatedAt || DEFAULT_FOUNDER_PROFILE.updatedAt
      };
    }
  }
} catch (e) {
  console.warn('Initial profile load warning:', e);
}

// Real-time Firestore Sync
if (typeof window !== 'undefined') {
  try {
    onSnapshot(doc(db, 'settings', 'founder_profile'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as FounderProfile;
        if (data && data.name) {
          inMemoryProfile = data;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {}
          notifyListeners();
        }
      }
    }, (err) => console.warn('Firestore founder profile listener error:', err));
  } catch (e) {
    console.warn('Failed to attach Firestore founder profile listener:', e);
  }
}

export const founderProfileStorage = {
  // Get current founder profile from in-memory cache
  get(): FounderProfile {
    return { ...inMemoryProfile };
  },

  // Save changes to founder profile (Admin Protected)
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
      updatedAt: new Date().toISOString()
    };

    inMemoryProfile = updated;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save founder profile to localStorage:', e);
    }

    try {
      await setDoc(doc(db, 'settings', 'founder_profile'), cleanForFirestore(updated));
    } catch (err) {
      console.error('Failed to sync founder profile to Firestore:', err);
    }

    notifyListeners();
    return updated;
  },

  // Update only the photo (Admin Protected)
  updatePhoto(photoUrl: string): Promise<FounderProfile> {
    return this.save({ photoUrl });
  },

  // Remove photo (falls back to default placeholder) (Admin Protected)
  removePhoto(): Promise<FounderProfile> {
    return this.save({ photoUrl: '' });
  },

  // Reset to default (Admin Protected)
  async resetToDefault(): Promise<FounderProfile> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to reset founder profile');
    }
    const reset = { ...DEFAULT_FOUNDER_PROFILE, updatedAt: new Date().toISOString() };
    inMemoryProfile = reset;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
    } catch (e) {
      console.warn('Failed to reset founder profile', e);
    }

    try {
      await setDoc(doc(db, 'settings', 'founder_profile'), cleanForFirestore(reset));
    } catch (err) {
      console.error('Failed to reset founder profile in Firestore:', err);
    }

    notifyListeners();
    return reset;
  }
};
