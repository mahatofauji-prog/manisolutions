import { WorkApplicationItem, ApplicationStatus, PublicApplicationStatusDTO, PublicContributorVerificationDTO } from '../types';
import { solutionsStorage } from './solutionsStorage';
import { 
  sanitizeText, 
  sanitizeStringArray, 
  validateEmail, 
  validatePhone, 
  checkRateLimit 
} from '../utils/security';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, cleanForFirestore } from '../lib/firebase';

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
    portfolioUrl: 'https://behance.net/priyadesigns',
    linkedinUrl: 'https://linkedin.com/in/priya-designer',
    previousWorkDetails: 'Branding kits, vector logos, corporate social media packages, UI kits.',
    toolsAndTechnologies: 'Figma, Adobe Creative Suite, Miro',
    graphicDesignerDetails: {
      designTypes: ['Logo', 'Banner', 'UI/UX', 'Graphic Design'],
      designTools: 'Figma, Adobe Illustrator, Photoshop, Canva Pro',
      yearsOfExp: '3 Years',
      portfolioLinks: 'https://behance.net/priyadesigns',
      sampleWork: 'Branding kits, vector logos, corporate social media packages'
    },
    paymentTermsAgreed: true,
    status: 'Active Contributor',
    adminNotes: 'Authorized Contributor ID issued. High quality creative design output.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString()
  },
  {
    id: 'MANI-WE-2026-000003',
    fullName: 'Amitabh Verma',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    mobileNumber: '9988776655',
    whatsappNumber: '9988776655',
    email: 'amitabh.leads@example.com',
    fullAddress: 'Civil Lines Road, Near Rajendra Nagar',
    city: 'Patna',
    state: 'Bihar',
    pinCode: '800001',
    workCategories: ['Lead Generator', 'Sales / Business Development'],
    skills: ['B2B Sales', 'Cold Outreach', 'Client Acquisition', 'Lead Pipeline'],
    skillsText: 'B2B Sales, Cold Outreach, Merchant Onboarding, Tier 2/3 Market Penetration',
    experienceLevel: 'Professional',
    yearsOfExperience: '6 Years',
    linkedinUrl: 'https://linkedin.com/in/amitabh-sales',
    previousWorkDetails: '6 years in B2B sales & digital agency client acquisition across East India.',
    toolsAndTechnologies: 'Apollo, LinkedIn Sales Navigator, CRM',
    leadGenDetails: {
      leadTypes: 'B2B Retailers, Healthcare Clinics, Private Schools & Coaching Institutes',
      targetIndustries: 'Education, Retail, Real Estate, Clinics',
      geoArea: 'Bihar, Jharkhand & West Bengal (Tier 2/3 Markets)',
      generationMethod: 'Direct B2B Outreach, Cold Calling, LinkedIn & Local Merchant Networking',
      approxLeadsPerMonth: '25-40 Verified Qualified Leads',
      previousExperience: '6 years in B2B sales & digital agency client acquisition',
      resultsLink: 'https://drive.google.com/example-leads-report'
    },
    paymentTermsAgreed: true,
    status: 'Under Review',
    adminNotes: 'Profile under review by BD lead for institutional lead pipeline.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },
  {
    id: 'MANI-WE-2026-000004',
    fullName: 'Ananya Deshmukh',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    mobileNumber: '9845123670',
    whatsappNumber: '9845123670',
    email: 'ananya.ai@example.com',
    fullAddress: 'Flat 101, Horizon Towers, Hinjewadi Phase 1',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411057',
    workCategories: ['AI Developer', 'Automation Specialist'],
    skills: ['Python', 'LangChain', 'FastAPI', 'OpenAI / Gemini SDK', 'n8n', 'Zapier'],
    skillsText: 'Python, LangChain, OpenAI, Gemini SDK, FastAPI, n8n, Make.com, Webhooks',
    experienceLevel: 'Experienced',
    yearsOfExperience: '3.5 Years',
    githubUrl: 'https://github.com/ananya-ai',
    linkedinUrl: 'https://linkedin.com/in/ananya-deshmukh-ai',
    previousWorkDetails: 'Built custom AI WhatsApp bots, lead qualification voice assistants, and CRM automated syncs.',
    toolsAndTechnologies: 'Python, Docker, Supabase, n8n, Postman',
    developerDetails: {
      whatDoYouDevelop: 'AI Chatbots, Custom RAG Assistants, Automated Lead Workflows',
      technologies: ['Python', 'FastAPI', 'LangChain', 'Gemini API'],
      technologiesText: 'Python, FastAPI, LangChain, Gemini API',
      stackType: 'Backend',
      devCategory: 'AI',
      yearsOfExp: '3.5 Years',
      projectTypes: 'Enterprise automation & customer care bots',
      previousWorkLinks: 'https://github.com/ananya-ai'
    },
    paymentTermsAgreed: true,
    status: 'Shortlisted',
    adminNotes: 'Strong AI automation portfolio. Shortlisted for upcoming customer support chatbot project.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
  }
];

type WorkStorageListener = () => void;
const listeners: Set<WorkStorageListener> = new Set();

let memoryCache: WorkApplicationItem[] = [];

// IndexedDB Helper functions for robust storage
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
  } catch {
    // Ignore
  }
}

// Background sync from IndexedDB
if (typeof window !== 'undefined') {
  getIdbApplications().then((idbList) => {
    if (Array.isArray(idbList) && idbList.length > 0) {
      memoryCache = idbList;
      try {
        localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(idbList));
      } catch {
        // Ignore localStorage quota
      }
      notifyListeners();
    } else {
      setIdbApplications(memoryCache);
    }
  });

  // Also sync feature toggle state from IDB
  openDB().then((db) => {
    if (db) {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(IDB_FEATURE_KEY);
        req.onsuccess = () => {
          if (req.result !== undefined && typeof req.result === 'boolean') {
            isFeatureEnabledCache = req.result;
            try {
              localStorage.setItem(WORK_FEATURE_ENABLED_KEY, req.result ? 'true' : 'false');
            } catch {}
            notifyListeners();
          }
        };
      } catch (e) {
        console.warn('IDB feature sync warning:', e);
      }
    }
  });
}

// Firestore Real-time Listener for Work Applications & Feature Toggle
if (typeof window !== 'undefined') {
  try {
    onSnapshot(collection(db, 'work_applications'), async (snapshot) => {
      if (false) { // snapshot.empty logic removed to prevent auto-reseeding

        try {
          const batch = writeBatch(db);
          INITIAL_APPLICATIONS.forEach(app => {
            batch.set(doc(db, 'work_applications', app.id), cleanForFirestore(app));
          });
          await batch.commit();
        } catch (e) {
          console.warn('Failed to seed work_applications in Firestore:', e);
        }
      } else {
        const items = snapshot.docs.map(d => d.data() as WorkApplicationItem);
        memoryCache = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        try {
          localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(memoryCache));
        } catch {}
        setIdbApplications(memoryCache);
        notifyListeners();
      }
    }, (err) => console.warn('Firestore work_applications listener error:', err));

    onSnapshot(doc(db, 'settings', 'work_with_us_feature'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && typeof data.enabled === 'boolean') {
          isFeatureEnabledCache = data.enabled;
          try {
            localStorage.setItem(WORK_FEATURE_ENABLED_KEY, data.enabled ? 'true' : 'false');
          } catch {}
          notifyListeners();
        }
      }
    }, (err) => console.warn('Firestore work feature toggle listener error:', err));
  } catch (e) {
    console.warn('Failed to attach Firestore work listeners:', e);
  }
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
    } catch {
      // Ignore
    }

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

    setDoc(doc(db, 'settings', 'work_with_us_feature'), { enabled }).catch(err => {
      console.error('Firestore setFeatureEnabled error:', err);
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

  // Get application by ID
  getById(id: string): WorkApplicationItem | undefined {
    if (!solutionsStorage.isAdminAuthenticated()) {
      return undefined;
    }
    const trimmed = (id || '').trim().toUpperCase();
    return memoryCache.find(
      (item) => item.id.toUpperCase() === trimmed || (item.contributorId && item.contributorId.toUpperCase() === trimmed)
    );
  },

  // Generate unique Application ID: Format e.g. MANI-WE-2026-000001
  generateApplicationId(): string {
    const currentYear = new Date().getFullYear();
    const count = memoryCache.length + 1;
    const nextNumber = count.toString().padStart(6, '0');
    return `MANI-WE-${currentYear}-${nextNumber}`;
  },

  // Generate unique Contributor ID: Format e.g. MANI-CN-2026-000001
  generateContributorId(): string {
    const currentYear = new Date().getFullYear();
    const existingContributors = memoryCache.filter((item) => item.contributorId);
    const count = existingContributors.length + 1;
    const nextNumber = count.toString().padStart(6, '0');
    return `MANI-CN-${currentYear}-${nextNumber}`;
  },

  // Create and submit new application (Sanitized + Rate-limited)
  async create(data: Omit<WorkApplicationItem, 'id' | 'createdAt' | 'status'>): Promise<WorkApplicationItem> {
    if (!isFeatureEnabledCache) {
      throw new Error('Work With Us applications are currently closed. Please check back later.');
    }

    // Rate-limiting check: max 4 application submissions per 10 minutes
    const rateCheck = checkRateLimit('work_application_submit', 4, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(`Submission limit reached. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before submitting again.`);
    }

    const newId = this.generateApplicationId();
    const sanitizedName = sanitizeText(data.fullName, 150);
    const sanitizedEmail = sanitizeText(data.email, 150);
    const sanitizedMobile = sanitizeText(data.mobileNumber, 20);
    const sanitizedWhatsapp = sanitizeText(data.whatsappNumber, 20);
    const sanitizedAddress = sanitizeText(data.fullAddress, 300);
    const sanitizedCity = sanitizeText(data.city, 100);
    const sanitizedState = sanitizeText(data.state, 100);
    const sanitizedPincode = sanitizeText(data.pinCode, 10);
    const sanitizedPrevWork = sanitizeText(data.previousWorkDetails, 3000);
    const sanitizedTools = sanitizeText(data.toolsAndTechnologies, 1000);
    const sanitizedSkillsText = sanitizeText(data.skillsText, 1000);

    const newApplication: WorkApplicationItem = {
      ...data,
      id: newId,
      fullName: sanitizedName || 'Applicant',
      email: sanitizedEmail,
      mobileNumber: sanitizedMobile,
      whatsappNumber: sanitizedWhatsapp,
      fullAddress: sanitizedAddress,
      city: sanitizedCity,
      state: sanitizedState,
      pinCode: sanitizedPincode,
      workCategories: sanitizeStringArray(data.workCategories, 20, 80),
      skills: sanitizeStringArray(data.skills, 30, 80),
      skillsText: sanitizedSkillsText,
      previousWorkDetails: sanitizedPrevWork,
      toolsAndTechnologies: sanitizedTools,
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

    setDoc(doc(db, 'work_applications', newApplication.id), cleanForFirestore(newApplication)).catch(err => {
      console.error('Firestore create work application error:', err);
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
    } catch {
      // Ignore
    }

    await setIdbApplications(memoryCache);

    setDoc(doc(db, 'work_applications', id), cleanForFirestore(memoryCache[idx])).catch(err => {
      console.error('Firestore update work application error:', err);
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
    } catch {
      // Ignore
    }

    await setIdbApplications(memoryCache);

    setDoc(doc(db, 'work_applications', id), cleanForFirestore(memoryCache[idx])).catch(err => {
      console.error('Firestore select applicant error:', err);
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
    } catch {
      // Ignore
    }

    await setIdbApplications(memoryCache);

    setDoc(doc(db, 'work_applications', id), cleanForFirestore(memoryCache[idx])).catch(err => {
      console.error('Firestore updateStatus work application error:', err);
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
    } catch {
      // Ignore
    }

    await setIdbApplications(memoryCache);

    deleteDoc(doc(db, 'work_applications', id)).catch(err => {
      console.error('Firestore delete work application error:', err);
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
    } catch {
      // Ignore
    }
    await setIdbApplications(INITIAL_APPLICATIONS);

    try {
      const batch = writeBatch(db);
      INITIAL_APPLICATIONS.forEach(app => {
        batch.set(doc(db, 'work_applications', app.id), app);
      });
      await batch.commit();
    } catch (e) {
      console.error('Firestore reset work applications error:', e);
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
