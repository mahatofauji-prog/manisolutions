import { PageSeoConfig } from '../types';
import { supabaseDatabase } from './supabaseDatabase';

const SEO_STORAGE_KEY = 'mani_seo_settings_v1';

export const DEFAULT_SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    pageId: 'home',
    pageName: 'Homepage',
    title: 'MANI Solution | Digital Solutions, Websites & ERP Services in India',
    metaDescription: 'MANI Solution provides professional digital solutions, website development, custom ERP, software development and digital products for businesses and organizations across India.',
    canonicalUrl: 'https://www.manisolution.com/',
    ogTitle: 'MANI Solution | Digital Solutions, Websites & ERP Services in India',
    ogDescription: 'MANI Solution provides professional digital solutions, website development, custom ERP, software development and digital products across India.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Digital Solutions for Modern India'
  },
  'service-website': {
    pageId: 'service-website',
    pageName: 'Website Development',
    title: 'Website Development Services in India | MANI Solution',
    metaDescription: 'Professional website development and design services in India by MANI Solution. Build modern, responsive and business-focused websites.',
    canonicalUrl: 'https://www.manisolution.com/website-development',
    ogTitle: 'Website Development Services in India | MANI Solution',
    ogDescription: 'Professional website development and design services in India by MANI Solution. Modern, responsive, and conversion-focused web solutions.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Professional Website Development Services in India'
  },
  'service-software': {
    pageId: 'service-software',
    pageName: 'Custom ERP & Software Development',
    title: 'Custom ERP Development Services in India | MANI Solution',
    metaDescription: 'MANI Solution provides custom ERP and business management software solutions for schools, coaching centres, restaurants, shops and organizations in India.',
    canonicalUrl: 'https://www.manisolution.com/erp',
    ogTitle: 'Custom ERP Development Services in India | MANI Solution',
    ogDescription: 'MANI Solution provides custom ERP and business management software solutions for schools, coaching centres, restaurants, shops and organizations in India.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Custom ERP Solutions for Modern Businesses'
  },
  'service-app': {
    pageId: 'service-app',
    pageName: 'App Development',
    title: 'Mobile App Development Services in India | MANI Solution',
    metaDescription: 'Custom Android and iOS mobile app development services in India by MANI Solution. Build fast, secure, and user-friendly mobile applications.',
    canonicalUrl: 'https://www.manisolution.com/app-development',
    ogTitle: 'Mobile App Development Services in India | MANI Solution',
    ogDescription: 'Custom Android and iOS mobile app development services in India by MANI Solution.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Mobile App Development Services in India'
  },
  'service-ai-automation': {
    pageId: 'service-ai-automation',
    pageName: 'Business AI & Automation',
    title: 'Business AI & Automation Services in India | MANI Solution',
    metaDescription: 'Implement AI assistants, automated voice receptionists, and workflow automation for your business in India with MANI Solution.',
    canonicalUrl: 'https://www.manisolution.com/ai-automation',
    ogTitle: 'Business AI & Automation Services in India | MANI Solution',
    ogDescription: 'Implement AI assistants, automated voice receptionists, and workflow automation for your business in India with MANI Solution.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Business AI & Automation Solutions'
  },
  services: {
    pageId: 'services',
    pageName: 'All Services',
    title: 'Digital Solutions & Software Development Services in India | MANI Solution',
    metaDescription: 'Explore custom website development, ERP solutions, mobile apps, software and AI automation services provided by MANI Solution in India.',
    canonicalUrl: 'https://www.manisolution.com/services',
    ogTitle: 'Digital Solutions & Software Development Services in India | MANI Solution',
    ogDescription: 'Explore custom website development, ERP solutions, mobile apps, software and AI automation services provided by MANI Solution in India.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Digital Solutions & Software Services'
  },
  'digital-products': {
    pageId: 'digital-products',
    pageName: 'Digital Products Store',
    title: 'Digital Products & Resources | MANI Solution',
    metaDescription: 'Explore useful digital products, templates, tools, business resources and productivity solutions from MANI Solution.',
    canonicalUrl: 'https://www.manisolution.com/digital-products',
    ogTitle: 'Digital Products & Resources | MANI Solution',
    ogDescription: 'Explore useful digital products, templates, tools, business resources and productivity solutions from MANI Solution.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Our Digital Products'
  },
  about: {
    pageId: 'about',
    pageName: 'About Us',
    title: 'About MANI Solution | Digital Solutions Provider in India',
    metaDescription: 'Learn about MANI Solution and our approach to website development, ERP, software development and digital solutions.',
    canonicalUrl: 'https://www.manisolution.com/about',
    ogTitle: 'About MANI Solution | Digital Solutions Provider in India',
    ogDescription: 'Learn about MANI Solution (Modern Advancement for New India) and our approach to digital solutions, web, ERP and custom software.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'About MANI Solution'
  },
  work: {
    pageId: 'work',
    pageName: 'Portfolio & Work',
    title: 'Portfolio & Featured Work | MANI Solution',
    metaDescription: 'Explore completed projects, client websites, custom ERP implementations, and case studies developed by MANI Solution.',
    canonicalUrl: 'https://www.manisolution.com/work',
    ogTitle: 'Portfolio & Featured Work | MANI Solution',
    ogDescription: 'Explore completed projects, client websites, custom ERP implementations, and case studies developed by MANI Solution.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Our Featured Work & Solutions'
  },
  solutions: {
    pageId: 'solutions',
    pageName: 'Industry Solutions',
    title: 'Industry Digital Solutions | MANI Solution',
    metaDescription: 'Tailored digital solutions, website systems and ERP software for schools, clinics, restaurants, retail and manufacturing across India.',
    canonicalUrl: 'https://www.manisolution.com/solutions',
    ogTitle: 'Industry Digital Solutions | MANI Solution',
    ogDescription: 'Tailored digital solutions, website systems and ERP software for industries across India.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Solutions by Industry'
  },
  contact: {
    pageId: 'contact',
    pageName: 'Contact & Enquiries',
    title: 'Contact Us | MANI Solution',
    metaDescription: 'Get in touch with MANI Solution for website inquiries, ERP consultations, digital product support and software development projects.',
    canonicalUrl: 'https://www.manisolution.com/contact',
    ogTitle: 'Contact Us | MANI Solution',
    ogDescription: 'Get in touch with MANI Solution for website inquiries, ERP consultations, and software development projects.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Get in Touch'
  },
  'work-with-us': {
    pageId: 'work-with-us',
    pageName: 'Work With Us',
    title: 'Work With Us & Careers | MANI Solution',
    metaDescription: 'Join or partner with MANI Solution (Modern Advancement for New India). Explore career opportunities, freelancing, and technical partnerships.',
    canonicalUrl: 'https://www.manisolution.com/work-with-us',
    ogTitle: 'Work With Us & Careers | MANI Solution',
    ogDescription: 'Join or partner with MANI Solution (Modern Advancement for New India). Explore career opportunities and technical partnerships.',
    ogImage: 'https://www.manisolution.com/logo.png',
    robotsNoIndex: false,
    h1Heading: 'Work With MANI Solution'
  }
};

let inMemorySeoConfigs: Record<string, PageSeoConfig> = { ...DEFAULT_SEO_CONFIGS };

// Load local storage initial cache
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const cached = localStorage.getItem(SEO_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (typeof parsed === 'object' && parsed !== null) {
        inMemorySeoConfigs = { ...DEFAULT_SEO_CONFIGS, ...parsed };
      }
    }
  }
} catch (e) {
  console.warn('SEO storage cache load warning:', e);
}

type SeoListener = () => void;
const listeners: Set<SeoListener> = new Set();
export const subscribeToSeoSettings = (fn: SeoListener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const subscribeToSeoConfigs = subscribeToSeoSettings;
const notify = () => listeners.forEach(fn => { try { fn(); } catch {} });

// Supabase sync
if (typeof window !== 'undefined') {
  supabaseDatabase.getSetting<{ configs?: Record<string, PageSeoConfig> }>('seo_config').then(data => {
    if (data && data.configs) {
      inMemorySeoConfigs = { ...DEFAULT_SEO_CONFIGS, ...data.configs };
      try {
        localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(inMemorySeoConfigs));
      } catch {}
      notify();
    }
  }).catch(() => {});
}

export const seoStorage = {
  getAll(): Record<string, PageSeoConfig> {
    return inMemorySeoConfigs;
  },

  getAllArray(): PageSeoConfig[] {
    return Object.values(inMemorySeoConfigs);
  },

  getForPage(pageId: string): PageSeoConfig {
    return inMemorySeoConfigs[pageId] || DEFAULT_SEO_CONFIGS[pageId] || {
      pageId,
      pageName: pageId,
      title: 'MANI Solution | Digital Solutions, Websites & ERP Services in India',
      metaDescription: 'MANI Solution provides professional digital solutions, website development, custom ERP, software development and digital products for businesses across India.',
      canonicalUrl: `https://www.manisolution.com/${pageId === 'home' ? '' : pageId}`,
      ogTitle: 'MANI Solution | Digital Solutions, Websites & ERP Services in India',
      ogDescription: 'MANI Solution provides professional digital solutions across India.',
      ogImage: 'https://www.manisolution.com/logo.png',
      robotsNoIndex: false
    };
  },

  getByPage(pageId: string): PageSeoConfig {
    return this.getForPage(pageId);
  },

  async savePageConfig(pageIdOrConfig: string | PageSeoConfig, config?: Partial<PageSeoConfig>): Promise<void> {
    let targetPageId = '';
    let updatedData: Partial<PageSeoConfig> = {};

    if (typeof pageIdOrConfig === 'string') {
      targetPageId = pageIdOrConfig;
      updatedData = config || {};
    } else {
      targetPageId = pageIdOrConfig.pageId;
      updatedData = pageIdOrConfig;
    }

    const existing = this.getForPage(targetPageId);
    const updated: PageSeoConfig = {
      ...existing,
      ...updatedData
    };

    const backup = { ...inMemorySeoConfigs };
    inMemorySeoConfigs[targetPageId] = updated;

    try {
      const success = await supabaseDatabase.saveSetting('seo_config', {
        configs: inMemorySeoConfigs,
        updatedAt: new Date().toISOString()
      });
      if (!success) {
        inMemorySeoConfigs = backup;
        throw new Error('Supabase database rejected SEO configuration save.');
      }
      localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(inMemorySeoConfigs));
      notify();
    } catch (err) {
      inMemorySeoConfigs = backup;
      console.error('Failed to sync SEO settings to Supabase:', err);
      throw err;
    }
  },

  async resetToDefaults(): Promise<void> {
    inMemorySeoConfigs = { ...DEFAULT_SEO_CONFIGS };
    try {
      localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(inMemorySeoConfigs));
      notify();
    } catch {}

    try {
      await supabaseDatabase.saveSetting('seo_config', {
        configs: DEFAULT_SEO_CONFIGS,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to reset SEO configs in Supabase:', e);
    }
  }
};
