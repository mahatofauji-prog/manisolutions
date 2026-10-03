import { supabaseDatabase } from './supabaseDatabase';

export interface WebsiteSectionConfig {
  id: string;
  name: string;
  category: 'Core' | 'Solutions' | 'Showcase' | 'Conversion' | 'Company';
  description: string;
  isVisible: boolean;
  updatedAt: string;
}

export const INITIAL_WEBSITE_SECTIONS: WebsiteSectionConfig[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    category: 'Core',
    description: 'Main brand hero with dynamic typing headline, quick statistics and primary consultation CTAs.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'workCta',
    name: 'Work With Us Hero Banner',
    category: 'Showcase',
    description: 'Promotional banner linking to the Work With Us & Earn contributor program.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trustStrip',
    name: 'Trust Strip & Metrics',
    category: 'Core',
    description: 'Trust indicators, verified stats, enterprise client logos, and technology standards.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'digitalProducts',
    name: 'Digital Products Store Section',
    category: 'Solutions',
    description: 'Homepage product grid displaying downloadable software, guides, and digital assets.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'readySolutions',
    name: 'ERP & CRM Solutions (Pre-Built)',
    category: 'Solutions',
    description: 'Grid of ready-to-deploy ERP, CRM, and management software systems for institutions and businesses.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'featuredWork',
    name: 'Website & App Solutions (Featured Work)',
    category: 'Showcase',
    description: 'Live case studies, custom mobile apps, and full-stack web solutions built for clients.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'about',
    name: 'About MANI Solution Section',
    category: 'Company',
    description: 'Company overview, executive philosophy, and technological transformation mission.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mission',
    name: 'Mission & Vision Section',
    category: 'Company',
    description: 'Strategic vision for New India digital empowerment and technological advancement.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'services',
    name: 'Our Digital Solutions & Services',
    category: 'Solutions',
    description: 'Detailed cards for Website Development, Custom Software, and AI Automation with ₹199 booking buttons.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'businessAi',
    name: 'Business AI & Automation Showcase',
    category: 'Solutions',
    description: 'Showcase of intelligent workflows, AI chatbots, automated lead engines, and smart tooling.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'costEstimator',
    name: 'Interactive Cost Estimator',
    category: 'Conversion',
    description: 'Live interactive calculator helping prospective clients calculate custom software or website quotes.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'whyMani',
    name: 'Why MANI Solution Section',
    category: 'Showcase',
    description: 'Comparative value propositions, 24/7 dedicated support, and enterprise engineering practices.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'howWeWork',
    name: 'How We Work Process Workflow',
    category: 'Showcase',
    description: 'Four-stage delivery roadmap: Discovery, Architecture, Agile Execution, and Guaranteed Launch.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'contact',
    name: 'Inbound Contact & Inquiry Section',
    category: 'Conversion',
    description: 'Inbound consultation form and direct communication channels for general inquiries.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'footer',
    name: 'Corporate Global Footer',
    category: 'Core',
    description: 'Global site footer featuring company registration info, legal links, and social channels.',
    isVisible: true,
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'mani_website_cms_sections_v1';

let inMemorySections: WebsiteSectionConfig[] = [...INITIAL_WEBSITE_SECTIONS];

// Hydrate from localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initial in case new sections were defined
        inMemorySections = INITIAL_WEBSITE_SECTIONS.map(init => {
          const found = parsed.find((p: any) => p.id === init.id);
          return found ? { ...init, ...found } : init;
        });
      }
    }
  }
} catch (e) {
  console.warn('Website CMS load notice:', e);
}

type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeToWebsiteCms = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const notify = () => {
  listeners.forEach(fn => {
    try {
      fn();
    } catch {}
  });
};

// Async Supabase Sync on Mount
export const syncWebsiteCmsFromRemote = async () => {
  try {
    const remote = await supabaseDatabase.getSetting<WebsiteSectionConfig[]>('website_cms_sections');
    if (remote && Array.isArray(remote) && remote.length > 0) {
      inMemorySections = INITIAL_WEBSITE_SECTIONS.map(init => {
        const found = remote.find(r => r.id === init.id);
        return found ? { ...init, ...found } : init;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySections));
      } catch {}
      notify();
    }
  } catch (err) {
    console.warn('Website CMS remote sync notice:', err);
  }
};

if (typeof window !== 'undefined') {
  syncWebsiteCmsFromRemote().catch(() => {});
}

export const websiteCmsStorage = {
  getAll(): WebsiteSectionConfig[] {
    return [...inMemorySections];
  },

  isSectionVisible(sectionId: string): boolean {
    const s = inMemorySections.find(item => item.id === sectionId);
    return s ? s.isVisible : true;
  },

  async toggleVisibility(sectionId: string): Promise<boolean> {
    const idx = inMemorySections.findIndex(s => s.id === sectionId);
    if (idx === -1) return false;

    inMemorySections[idx] = {
      ...inMemorySections[idx],
      isVisible: !inMemorySections[idx].isVisible,
      updatedAt: new Date().toISOString()
    };

    this.persist();
    notify();

    // Persist to Supabase
    await supabaseDatabase.saveSetting('website_cms_sections', inMemorySections);
    return true;
  },

  async setVisibility(sectionId: string, isVisible: boolean): Promise<boolean> {
    const idx = inMemorySections.findIndex(s => s.id === sectionId);
    if (idx === -1) return false;

    inMemorySections[idx] = {
      ...inMemorySections[idx],
      isVisible,
      updatedAt: new Date().toISOString()
    };

    this.persist();
    notify();

    await supabaseDatabase.saveSetting('website_cms_sections', inMemorySections);
    return true;
  },

  async resetAllToVisible(): Promise<boolean> {
    inMemorySections = INITIAL_WEBSITE_SECTIONS.map(s => ({
      ...s,
      isVisible: true,
      updatedAt: new Date().toISOString()
    }));

    this.persist();
    notify();

    await supabaseDatabase.saveSetting('website_cms_sections', inMemorySections);
    return true;
  },

  persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemorySections));
      }
    } catch {}
  }
};
