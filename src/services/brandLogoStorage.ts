import defaultBrandLogo from '../assets/images/user_brand_logo.png';
import { BrandLogoConfig } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { sanitizeText } from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';

export const DEFAULT_LOGO_URL = defaultBrandLogo;

const STORAGE_KEY = 'mani_brand_logo_config_v2';
const IDB_NAME = 'ManiBrandStorageDB';
const IDB_VERSION = 1;
const IDB_STORE = 'brand_config';
const IDB_KEY = 'active_logo_config';

type LogoListener = () => void;
const listeners: Set<LogoListener> = new Set();

/**
 * Downscale and compress image Data URL to fit under lightweight database and LocalStorage quotas
 * while retaining crisp HD quality for brand logos.
 */
export async function compressImageDataUrl(dataUrl: string, maxDimension = 512, quality = 0.82): Promise<string> {
  if (!dataUrl || typeof window === 'undefined' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  // Fast path: if data string is already small (< 250KB), return as is immediately
  if (dataUrl.length < 250000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    let resolved = false;
    const done = (result: string) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    // Safety fallback timeout: if canvas/image loading stalls > 2.5s, resolve with raw data
    const timer = setTimeout(() => done(dataUrl), 2500);

    const img = new Image();
    // Do NOT set crossOrigin on data: URIs as it causes CORS stalls in Safari/WebView
    if (!dataUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.width || maxDimension;
        let height = img.height || maxDimension;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          done(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for ultra-light footprint, fallback to PNG
        let result = canvas.toDataURL('image/webp', quality);
        if (!result || result.length < 50 || result === 'data:,') {
          result = canvas.toDataURL('image/png');
        }

        done(result);
      } catch (e) {
        console.warn('Canvas compression error, using raw image:', e);
        done(dataUrl);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      done(dataUrl);
    };

    img.src = dataUrl;
  });
}

// Setup BroadcastChannel for cross-tab synchronization
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('mani_brand_logo_channel');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'LOGO_UPDATED') {
        notifyListeners(false);
      }
    };
  }
} catch {
  // BroadcastChannel unavailable in sandboxed environment
}

// In-memory cache for synchronous instant access
let inMemoryConfig: BrandLogoConfig = {
  activeLogoUrl: '',
  isCustom: false,
  fileName: undefined,
  fileSizeFormatted: undefined,
  updatedAt: new Date().toISOString()
};

// Initialize cache from localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.activeLogoUrl === 'string') {
        const isCleanCustom = Boolean(
          parsed.isCustom && 
          parsed.activeLogoUrl && 
          !parsed.activeLogoUrl.includes('\uFFFD') && 
          (parsed.activeLogoUrl.startsWith('data:image/') || parsed.activeLogoUrl.startsWith('http') || parsed.activeLogoUrl.startsWith('/'))
        );
        inMemoryConfig = {
          activeLogoUrl: isCleanCustom ? parsed.activeLogoUrl : '',
          isCustom: isCleanCustom,
          fileName: parsed.fileName,
          fileSizeFormatted: parsed.fileSizeFormatted,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    }
  }
} catch (e) {
  console.warn('Initial logo cache read error:', e);
}

// Supabase sync
if (typeof window !== 'undefined') {
  supabaseDatabase.getSetting<BrandLogoConfig>('brand_logo_config').then(data => {
    if (data && typeof data.activeLogoUrl === 'string') {
      const isCleanCustom = Boolean(
        data.isCustom && 
        data.activeLogoUrl && 
        !data.activeLogoUrl.includes('\uFFFD') && 
        (data.activeLogoUrl.startsWith('data:image/') || data.activeLogoUrl.startsWith('http') || data.activeLogoUrl.startsWith('/'))
      );
      inMemoryConfig = {
        activeLogoUrl: isCleanCustom ? data.activeLogoUrl : '',
        isCustom: isCleanCustom,
        fileName: data.fileName,
        fileSizeFormatted: data.fileSizeFormatted,
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryConfig));
      } catch {}
      notifyListeners(false);
    }
  }).catch(() => {});
}

// IndexedDB Helper functions
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function getIdbConfig(): Promise<BrandLogoConfig | null> {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function setIdbConfig(config: BrandLogoConfig): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(config, IDB_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

async function deleteIdbConfig(): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(IDB_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

const notifyListeners = (broadcast = true) => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('BrandLogo listener error', e);
    }
  });

  if (broadcast && broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'LOGO_UPDATED', timestamp: Date.now() });
    } catch {
      // Ignore broadcast channel failure
    }
  }
};

export const subscribeToBrandLogo = (listener: LogoListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const brandLogoStorage = {
  // Synchronous config getter
  getConfig(): BrandLogoConfig {
    return { ...inMemoryConfig };
  },

  // Returns the active logo URL (custom or fallback to default MANI Solution logo)
  getActiveLogoUrl(): string {
    if (
      inMemoryConfig.isCustom && 
      inMemoryConfig.activeLogoUrl && 
      !inMemoryConfig.activeLogoUrl.includes('\uFFFD') &&
      (inMemoryConfig.activeLogoUrl.startsWith('data:image/') || inMemoryConfig.activeLogoUrl.startsWith('http') || inMemoryConfig.activeLogoUrl.startsWith('/'))
    ) {
      return inMemoryConfig.activeLogoUrl;
    }
    return DEFAULT_LOGO_URL || '/logo.png';
  },

  // Returns true if a custom logo is currently configured
  isCustom(): boolean {
    return Boolean(
      inMemoryConfig.isCustom && 
      inMemoryConfig.activeLogoUrl && 
      !inMemoryConfig.activeLogoUrl.includes('\uFFFD')
    );
  },

  getDefaultLogoUrl(): string {
    return DEFAULT_LOGO_URL;
  },

  // Persist newly uploaded logo (Admin Protected)
  async saveLogo(
    logoDataUrl: string,
    meta?: { fileName?: string; fileSizeFormatted?: string }
  ): Promise<BrandLogoConfig> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to update brand logo');
    }

    // Validate data URL format to prevent script injection / non-image payloads
    if (!logoDataUrl || typeof logoDataUrl !== 'string' || (!logoDataUrl.startsWith('data:image/') && !logoDataUrl.startsWith('blob:') && !logoDataUrl.startsWith('/'))) {
      throw new Error('Invalid image format. Only image data URLs or valid asset paths are permitted.');
    }

    // Auto-compress image to fit under lightweight database and LocalStorage quotas
    let optimizedDataUrl = logoDataUrl;
    if (logoDataUrl.startsWith('data:image/')) {
      try {
        optimizedDataUrl = await compressImageDataUrl(logoDataUrl, 512);
      } catch (e) {
        console.warn('Failed to compress image before save, using raw payload:', e);
      }
    }

    const approxBytes = Math.round((optimizedDataUrl.length * 3) / 4);
    const formattedSize = meta?.fileSizeFormatted || `${(approxBytes / 1024).toFixed(1)} KB`;

    const updated: BrandLogoConfig = {
      activeLogoUrl: optimizedDataUrl,
      isCustom: true,
      fileName: meta?.fileName ? sanitizeText(meta.fileName, 100) : 'custom-logo.png',
      fileSizeFormatted: formattedSize,
      updatedAt: new Date().toISOString()
    };

    inMemoryConfig = updated;

    // 1. Save to localStorage for instant synchronous boots
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage quota warning, falling back to IndexedDB:', e);
    }

    // 2. Save to IndexedDB
    await setIdbConfig(updated);

    // 3. Save to Supabase
    try {
      await supabaseDatabase.saveSetting('brand_logo_config', updated);
    } catch (err: any) {
      console.warn('Supabase logo sync warning (saved locally & in IndexedDB):', err);
    }

    // 4. Notify subscribers
    notifyListeners(true);

    return updated;
  },

  // Remove custom logo and revert to default MANI Solution logo (Admin Protected)
  async removeLogo(): Promise<BrandLogoConfig> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to remove brand logo');
    }

    const fallback: BrandLogoConfig = {
      activeLogoUrl: '',
      isCustom: false,
      fileName: undefined,
      fileSizeFormatted: undefined,
      updatedAt: new Date().toISOString()
    };

    inMemoryConfig = fallback;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage logo key:', e);
    }

    await deleteIdbConfig();

    try {
      await supabaseDatabase.saveSetting('brand_logo_config', fallback);
    } catch (err) {
      console.warn('Failed to clear logo in Supabase:', err);
    }

    notifyListeners(true);
    return fallback;
  }
};
