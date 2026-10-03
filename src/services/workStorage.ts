import { WorkApplicationItem, ApplicationStatus, PublicApplicationStatusDTO, PublicContributorVerificationDTO } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { 
  sanitizeText, 
  sanitizeStringArray, 
  validateEmail, 
  validatePhone, 
  checkRateLimit 
} from '../utils/security';
import { supabaseDatabase } from './supabaseDatabase';

const WORK_STORAGE_KEY = 'mani_work_applications_store_v2';
const WORK_FEATURE_ENABLED_KEY = 'mani_work_with_us_feature_enabled_v1';
const IDB_NAME = 'ManiWorkStorageDB';
const IDB_VERSION = 1;
const IDB_STORE = 'work_applications';
const IDB_KEY = 'all_applications';
const IDB_FEATURE_KEY = 'feature_enabled';

let isFeatureEnabledCache: boolean = true;

// Initial synchronous load for feature toggle
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedFeature = localStorage.getItem(WORK_FEATURE_ENABLED_KEY);
    if (storedFeature !== null) {
      isFeatureEnabledCache = storedFeature === 'true';
    }
  }
} catch (e) {
  console.warn('Initial feature toggle read warning:', e);
}

// Initial sample applications for demonstration in admin portal
const INITIAL_APPLICATIONS: WorkApplicationItem[] = [
  {
    id: 'MANI-WE-2026-000001',
    contributorId: 'MANI-CN-2026-000001',
    contributorRole: 'Web Developer & React Specialist',
    selectionDate: new Date(Date.now() - 24 * 3600 * 1000 * 10).toISOString(),
    isIdCardEnabled: true,
    fullName: 'Rahul Sharma',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    mobileNumber: '9876543210',
    whatsappNumber: '9876543210',
    email: 'rahul.dev@example.com',
    fullAddress: 'Flat 402, Green Avenue, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201301',
    workCategories: ['Web Developer', 'Software Developer'],
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    skillsText: 'React, TypeScript, Node.js, Next.js, Tailwind CSS, PostgreSQL, Express, Prisma',
    experienceLevel: 'Experienced',
    yearsOfExperience: '4 Years',
    portfolioUrl: 'https://rahul-portfolio.dev',
    githubUrl: 'https://github.com/rahul-fullstack',
    linkedinUrl: 'https://linkedin.com/in/rahul-dev-example',
    previousWorkDetails: 'Full-stack web applications, custom management dashboards, SaaS products & e-commerce portals.',
    toolsAndTechnologies: 'VS Code, Git, Docker, Postman, Figma',
    developerDetails: {
      whatDoYouDevelop: 'Full-stack web applications & custom management dashboards',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      technologiesText: 'React, TypeScript, Node.js, PostgreSQL, Tailwind CSS',
      stackType: 'Full Stack',
      devCategory: 'Web',
      frameworks: 'Next.js, Express, Prisma',
      yearsOfExp: '4 Years',
      projectTypes: 'Corporate websites, B2B SaaS, Admin Portals & Billing Softwares',
      previousWorkLinks: 'https://github.com/rahul-fullstack',
      githubGitlabLink: 'https://github.com/rahul-fullstack',
      clientProjectsWillingness: 'Yes, full client delivery capability',
      availability: 'Freelance / Project Based (25-30 hrs/week)'
    },
    paymentTermsAgreed: true,
    status: 'Selected',
    adminNotes: 'Excellent technical interview and pristine code quality. Onboarded as authorized contributor for client ERP requirements.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 12).toISOString()
  },
  {
    id: 'MANI-WE-2026-000002',
    contributorId: 'MANI-CN-2026-000002',
    contributorRole: 'Brand & UI/UX Designer',
    selectionDate: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    isIdCardEnabled: true,
    fullName: 'Priya Sundaram',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    mobileNumber: '9123456789',
    whatsappNumber: '9123456789',
    email: 'priya.graphics@example.com',
    fullAddress: 'Plot 12, Indiranagar 1st Stage',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    workCategories: ['UI/UX Designer', 'Graphic Designer', 'Logo Designer', 'Banner / Creative Designer'],
    skills: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Canva Pro', 'Brand Identity'],
    skillsText: 'Figma, Adobe Illustrator, Adobe Photoshop, Brand Guidelines, Design Systems',
    experienceLevel: 'Intermediate',
    yearsOfExperience: '3 Years',
    portfolioUrl: 'https://behance.net/priyadesign',
    behanceUrl: 'https://behance.net/priyadesign',
    linkedinUrl: 'https://linkedin.com/in/priya-designer-example',
    previousWorkDetails: 'UI/UX for SaaS dashboards, enterprise pitch decks, and brand marketing creatives.',
    toolsAndTechnologies: 'Figma, Adobe Illustrator, Photoshop, Canva Pro',
    graphicDesignerDetails: {
      designTypes: ['Logo', 'Banner', 'UI/UX', 'Graphic Design'],
      designTools: 'Figma, Illustrator, Photoshop',
      yearsOfExp: '3 Years',
      portfolioLinks: 'https://behance.net/priyadesign'
    },
    paymentTermsAgreed: true,
    status: 'Selected',
    adminNotes: 'Verified portfolio. Created high-conversion branding assets for MANI Solution clients.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString()
  }
];

let memoryCache: WorkApplicationItem[] = [];
type WorkStorageListener = () => void;
const listeners: Set<WorkStorageListener> = new Set();

// IndexedDB Helper Functions
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

async function getIdbApplications(): Promise<WorkApplicationItem[] | null> {
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

async function setIdbApplications(items: WorkApplicationItem[]): Promise<boolean> {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(items, IDB_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

// Initial synchronous load from localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(WORK_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
      }
    }
  }
} catch (e) {
  console.warn('Initial work storage read warning:', e);
}

if (memoryCache.length === 0) {
  memoryCache = [...INITIAL_APPLICATIONS];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    }
  } catch {}
}

// Background sync from IndexedDB & Supabase
if (typeof window !== 'undefined') {
  getIdbApplications().then((idbList) => {
    if (Array.isArray(idbList) && idbList.length > 0) {
      memoryCache = idbList;
      try {
        localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(idbList));
      } catch {}
      notifyListeners();
    } else {
      setIdbApplications(memoryCache);
    }
  });

  // Sync from Supabase
  supabaseDatabase.getWorkApplications().then(items => {
    if (items && items.length > 0) {
      memoryCache = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      try {
        localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
      } catch {}
      setIdbApplications(memoryCache);
      notifyListeners();
    }
  }).catch(() => {});

  // Sync feature toggle from Supabase
  supabaseDatabase.getSetting<{ enabled: boolean }>('work_with_us_feature').then(data => {
    if (data && typeof data.enabled === 'boolean') {
      isFeatureEnabledCache = data.enabled;
      try {
        localStorage.setItem(WORK_FEATURE_ENABLED_KEY, data.enabled ? 'true' : 'false');
      } catch {}
      notifyListeners();
    }
  }).catch(() => {});
}

export const subscribeToWorkApplications = (listener: WorkStorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Work storage listener error:', e);
    }
  });
};

export const workStorage = {
  // Feature status: is Work With Us & Earn enabled or disabled
  isFeatureEnabled(): boolean {
    return isFeatureEnabledCache;
  },

  // Admin action: enable or disable Work With Us & Earn without affecting existing data
  async setFeatureEnabled(enabled: boolean): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to toggle feature');
    }
    isFeatureEnabledCache = enabled;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(WORK_FEATURE_ENABLED_KEY, enabled ? 'true' : 'false');
      }
    } catch {}

    const dbInst = await openDB();
    if (dbInst) {
      try {
        const tx = dbInst.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(enabled, IDB_FEATURE_KEY);
      } catch (e) {
        console.warn('IDB feature enable put error:', e);
      }
    }

    supabaseDatabase.saveSetting('work_with_us_feature', { enabled }).catch(err => {
      console.warn('Supabase setFeatureEnabled notice:', err);
    });

    notifyListeners();
    return true;
  },

  // Get all applications (strictly for Admin Portal)
  getAll(): WorkApplicationItem[] {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return [];
    }
    return [...memoryCache];
  },

  getAllRaw(): WorkApplicationItem[] {
    return [...memoryCache];
  },

  getById(id: string): WorkApplicationItem | undefined {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return undefined;
    }
    return memoryCache.find((item) => item.id === id);
  },

  generateApplicationId(): string {
    const currentYear = new Date().getFullYear();
    const count = memoryCache.length + 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `MANI-WE-${currentYear}-${String(count).padStart(3, '0')}${randomSuffix.toString().slice(0, 3)}`;
  },

  generateContributorId(): string {
    const currentYear = new Date().getFullYear();
    const selectedCount = memoryCache.filter(
      (item) => item.status === 'Selected' || item.status === 'Active Contributor' || item.status === 'Approved'
    ).length + 1;
    return `MANI-CN-${currentYear}-${String(selectedCount).padStart(6, '0')}`;
  },

  // Create new application from public submission (Validated & Rate Limited)
  async create(applicationData: Omit<WorkApplicationItem, 'id' | 'createdAt' | 'status'>): Promise<WorkApplicationItem> {
    // Rate limit: max 3 applications per 15 minutes per browser
    const rateCheck = checkRateLimit('work_with_us_submit', 3, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Submission limit reached. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before submitting again.`);
    }

    if (!applicationData.fullName || !applicationData.fullName.trim()) {
      throw new Error('Full Name is required.');
    }
    if (!validatePhone(applicationData.mobileNumber)) {
      throw new Error('Please provide a valid 10-digit mobile number.');
    }
    if (!validateEmail(applicationData.email)) {
      throw new Error('Please provide a valid email address.');
    }
    if (!applicationData.workCategories || applicationData.workCategories.length === 0) {
      throw new Error('Please select at least one work category.');
    }
    if (!applicationData.paymentTermsAgreed) {
      throw new Error('You must acknowledge and agree to MANI Solution payment and collaboration terms.');
    }

    const newId = this.generateApplicationId();

    const newApplication: WorkApplicationItem = {
      ...applicationData,
      id: newId,
      fullName: sanitizeText(applicationData.fullName, 120),
      mobileNumber: sanitizeText(applicationData.mobileNumber, 20),
      whatsappNumber: sanitizeText(applicationData.whatsappNumber || applicationData.mobileNumber, 20),
      email: sanitizeText(applicationData.email, 120),
      dob: applicationData.dob ? sanitizeText(applicationData.dob, 20) : undefined,
      gender: applicationData.gender ? sanitizeText(applicationData.gender, 20) : undefined,
      fullAddress: sanitizeText(applicationData.fullAddress, 300),
      city: sanitizeText(applicationData.city, 80),
      state: sanitizeText(applicationData.state, 80),
      pinCode: sanitizeText(applicationData.pinCode, 10),
      workCategories: sanitizeStringArray(applicationData.workCategories, 20, 80),
      skills: sanitizeStringArray(applicationData.skills || [], 50, 60),
      skillsText: applicationData.skillsText ? sanitizeText(applicationData.skillsText, 500) : undefined,
      experienceLevel: applicationData.experienceLevel || 'Intermediate',
      yearsOfExperience: sanitizeText(applicationData.yearsOfExperience || '1 Year', 30),
      availability: applicationData.availability || 'Flexible',
      preferredWorkType: applicationData.preferredWorkType || 'Remote',
      expectedPayment: applicationData.expectedPayment ? sanitizeText(applicationData.expectedPayment, 100) : undefined,
      portfolioUrl: applicationData.portfolioUrl ? sanitizeText(applicationData.portfolioUrl, 500) : undefined,
      githubUrl: applicationData.githubUrl ? sanitizeText(applicationData.githubUrl, 500) : undefined,
      linkedinUrl: applicationData.linkedinUrl ? sanitizeText(applicationData.linkedinUrl, 500) : undefined,
      behanceUrl: applicationData.behanceUrl ? sanitizeText(applicationData.behanceUrl, 500) : undefined,
      dribbbleUrl: applicationData.dribbbleUrl ? sanitizeText(applicationData.dribbbleUrl, 500) : undefined,
      websiteUrl: applicationData.websiteUrl ? sanitizeText(applicationData.websiteUrl, 500) : undefined,
      otherWorkLink: applicationData.otherWorkLink ? sanitizeText(applicationData.otherWorkLink, 500) : undefined,
      previousWorkDetails: applicationData.previousWorkDetails ? sanitizeText(applicationData.previousWorkDetails, 4000) : undefined,
      toolsAndTechnologies: applicationData.toolsAndTechnologies ? sanitizeText(applicationData.toolsAndTechnologies, 500) : undefined,
      introduction: applicationData.introduction ? sanitizeText(applicationData.introduction, 2000) : undefined,
      paymentTermsAgreed: true,
      status: 'Application Received',
      createdAt: new Date().toISOString()
    };

    memoryCache = [newApplication, ...memoryCache];

    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch (e) {
      console.warn('LocalStorage quota warning, synced with IndexedDB:', e);
    }

    await setIdbApplications(memoryCache);

    supabaseDatabase.saveWorkApplication(newApplication).catch(err => {
      console.warn('Supabase create work application notice:', err);
    });

    notifyListeners();
    return newApplication;
  },

  // Update application details or notes (Admin Protected)
  async update(id: string, updates: Partial<WorkApplicationItem>): Promise<WorkApplicationItem | null> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to update applicant');
    }
    const idx = memoryCache.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    memoryCache[idx] = {
      ...memoryCache[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch {}

    await setIdbApplications(memoryCache);

    supabaseDatabase.saveWorkApplication(memoryCache[idx]).catch(err => {
      console.warn('Supabase update work application notice:', err);
    });

    notifyListeners();
    return memoryCache[idx];
  },

  // Admin action: Select applicant and generate Contributor ID (Admin Protected)
  async selectApplicant(id: string, contributorRole?: string): Promise<WorkApplicationItem | null> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to select applicant');
    }
    const idx = memoryCache.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    const current = memoryCache[idx];
    const generatedContributorId = current.contributorId || this.generateContributorId();
    const role = contributorRole || current.contributorRole || current.workCategories[0] || 'Digital Contributor';

    memoryCache[idx] = {
      ...current,
      status: 'Selected',
      contributorId: generatedContributorId,
      contributorRole: role,
      selectionDate: current.selectionDate || new Date().toISOString(),
      isIdCardEnabled: true,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch {}

    await setIdbApplications(memoryCache);

    supabaseDatabase.saveWorkApplication(memoryCache[idx]).catch(err => {
      console.warn('Supabase select applicant notice:', err);
    });

    notifyListeners();
    return memoryCache[idx];
  },

  // Update status (Admin Protected)
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    adminNotes?: string,
    extraUpdates?: Partial<WorkApplicationItem>
  ): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required to update status');
    }
    const idx = memoryCache.findIndex((item) => item.id === id);
    if (idx === -1) return false;

    const current = memoryCache[idx];
    let contributorId = current.contributorId;
    let isIdCardEnabled = current.isIdCardEnabled;
    let selectionDate = current.selectionDate;

    if (status === 'Selected' || status === 'Active Contributor') {
      if (!contributorId) {
        contributorId = this.generateContributorId();
      }
      isIdCardEnabled = true;
      if (!selectionDate) {
        selectionDate = new Date().toISOString();
      }
    } else if (status === 'Not Selected' || status === 'Rejected') {
      isIdCardEnabled = false;
    }

    memoryCache[idx] = {
      ...current,
      ...extraUpdates,
      status,
      contributorId,
      isIdCardEnabled,
      selectionDate,
      adminNotes: adminNotes !== undefined ? sanitizeText(adminNotes, 2000) : current.adminNotes,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch {}

    await setIdbApplications(memoryCache);

    supabaseDatabase.saveWorkApplication(memoryCache[idx]).catch(err => {
      console.warn('Supabase updateStatus notice:', err);
    });

    notifyListeners();
    return true;
  },

  // Public: Safe tracking lookup by Application Number (Returns sanitized non-sensitive DTO + Rate Limited)
  trackApplication(applicationNumber: string): PublicApplicationStatusDTO | null {
    if (!applicationNumber || !applicationNumber.trim()) return null;
    
    // Rate limit public lookups to prevent brute force enumeration
    const rateCheck = checkRateLimit('work_track_lookup', 25, 60 * 1000);
    if (!rateCheck.allowed) {
      return null;
    }

    const cleanNumber = sanitizeText(applicationNumber, 50).toUpperCase();

    const found = memoryCache.find(
      (item) => item.id.toUpperCase() === cleanNumber || (item.contributorId && item.contributorId.toUpperCase() === cleanNumber)
    );

    if (!found) return null;

    // Return ONLY public safe fields (IDOR protection)
    return {
      id: found.id,
      fullName: found.fullName,
      status: found.status,
      workCategories: found.workCategories,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
      contributorId: found.contributorId,
      contributorRole: found.contributorRole || found.workCategories[0],
      isIdCardEnabled: found.isIdCardEnabled
    };
  },

  // Public: Contributor ID verification lookup (Rate Limited + Safe badge fields)
  verifyContributor(contributorId: string): PublicContributorVerificationDTO {
    if (!contributorId || !contributorId.trim()) {
      return {
        isValid: false,
        contributorId: '',
        contributorName: '',
        contributorRole: '',
        status: 'Not Valid'
      };
    }

    const rateCheck = checkRateLimit('contributor_verify_lookup', 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return {
        isValid: false,
        contributorId: 'RATE_LIMITED',
        contributorName: 'Too many queries',
        contributorRole: 'Please wait a moment',
        status: 'Not Valid'
      };
    }

    const cleanId = sanitizeText(contributorId, 50).toUpperCase();
    const found = memoryCache.find((item) => item.contributorId && item.contributorId.toUpperCase() === cleanId);

    if (!found) {
      return {
        isValid: false,
        contributorId: cleanId,
        contributorName: 'Record Not Found',
        contributorRole: 'N/A',
        status: 'Not Valid'
      };
    }

    const isActive = (found.status === 'Selected' || found.status === 'Active Contributor' || found.status === 'Approved') && found.isIdCardEnabled !== false;

    return {
      isValid: isActive,
      contributorId: found.contributorId || cleanId,
      contributorName: found.fullName,
      contributorRole: found.contributorRole || found.workCategories[0] || 'Authorized Contributor',
      status: isActive ? 'Active Contributor' : 'Inactive',
      issueDate: found.selectionDate || found.createdAt,
      profilePhoto: found.profilePhoto
    };
  },

  // Permanent Delete application (Admin Protected)
  async delete(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    const filtered = memoryCache.filter((item) => item.id !== id);
    if (filtered.length === memoryCache.length) return false;

    memoryCache = filtered;
    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch {}

    await setIdbApplications(memoryCache);

    supabaseDatabase.deleteWorkApplication(id).catch(err => {
      console.warn('Supabase delete work application notice:', err);
    });

    notifyListeners();
    return true;
  },

  // Reset to defaults (Admin Protected)
  async resetToDefaults(): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    memoryCache = [...INITIAL_APPLICATIONS];
    try {
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    } catch {}
    await setIdbApplications(INITIAL_APPLICATIONS);

    for (const app of INITIAL_APPLICATIONS) {
      await supabaseDatabase.saveWorkApplication(app).catch(() => {});
    }

    notifyListeners();
  },

  // Export JSON (Admin Protected)
  exportJSON(): string {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return JSON.stringify({ error: 'Unauthorized: Admin authentication required' });
    }
    return JSON.stringify(memoryCache, null, 2);
  }
};
