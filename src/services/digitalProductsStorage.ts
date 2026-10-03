import { DigitalProduct, DigitalCategory, DigitalOrder, DigitalAccess, DigitalCoupon } from '../types';
import { supabaseDatabase } from './supabaseDatabase';

const SETTINGS_KEY = 'mani_digital_settings_v2';
const PRODUCTS_KEY = 'mani_digital_products_v2';
const CATEGORIES_KEY = 'mani_digital_categories_v2';
const ORDERS_KEY = 'mani_digital_orders_v2';
const ACCESS_KEY = 'mani_digital_access_v2';
const COUPONS_KEY = 'mani_digital_coupons_v2';
const CUSTOMER_KEY = 'mani_current_customer_v2';

export interface DigitalSettings {
  enableCoupons: boolean;
}

let inMemorySettings: DigitalSettings = { enableCoupons: false };

const DEFAULT_CATEGORIES: DigitalCategory[] = [
  { id: 'Trading', name: 'Trading', slug: 'trading', displayOrder: 1, status: 'published' },
  { id: 'Business', name: 'Business', slug: 'business', displayOrder: 2, status: 'published' },
  { id: 'Finance', name: 'Finance', slug: 'finance', displayOrder: 3, status: 'published' },
  { id: 'Productivity', name: 'Productivity', slug: 'productivity', displayOrder: 4, status: 'published' },
  { id: 'Templates', name: 'Templates', slug: 'templates', displayOrder: 5, status: 'published' },
  { id: 'Education', name: 'Education', slug: 'education', displayOrder: 6, status: 'published' },
  { id: 'E-books', name: 'E-books', slug: 'e-books', displayOrder: 7, status: 'published' },
  { id: 'Tools', name: 'Tools', slug: 'tools', displayOrder: 8, status: 'published' },
  { id: 'Other', name: 'Other', slug: 'other', displayOrder: 9, status: 'published' },
];

const DEFAULT_PRODUCTS: DigitalProduct[] = [
  {
    id: 'dp-ai-business-grow',
    name: 'AI से अपना Business Grow कैसे करें?',
    slug: 'ai-business-grow-guide',
    category: 'E-books',
    shortDescription: 'Discover practical AI strategies, automated WhatsApp sales funnels, and lead generation techniques designed specifically for Indian businesses.',
    fullDescription: 'Master the practical application of Artificial Intelligence to scale your business operations, automate customer support, eliminate manual tasks, and generate high-intent leads 24/7. Written specifically for modern entrepreneurs and business owners.\n\n### What You Will Learn:\n- **AI Fundamentals for Business**: Understanding how modern generative models and automation can save 15+ hours weekly.\n- **WhatsApp Business AI Integration**: Automated customer response flows and 24/7 sales assistants.\n- **Lead Generation & Social Automation**: Scaling content marketing and qualifying prospects automatically.\n- **Cost Reduction & Efficiency**: Eliminating manual data entry and repetitive clerical work.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop'
    ],
    productType: 'Digital Download',
    price: 299,
    compareAtPrice: 999,
    offer: {
      isEnabled: true,
      title: 'Special Launch Offer',
      badge: '70% OFF',
      text: 'Limited Time Introductory Offer'
    },
    productFilePath: 'secure-asset-ai-business-growth.pdf',
    productFileName: 'AI_se_apna_Business_Grow_kaise_karen.pdf',
    productFileSize: '2.4 MB',
    productFileType: 'PDF',
    productFileUploadedAt: new Date().toISOString(),
    status: 'published',
    isFeatured: true,
    features: [
      'Step-by-step AI implementation guide with Indian business case studies',
      'Ready-to-use WhatsApp automation scripts & reply prompts',
      'Lead qualification frameworks & workflow blueprints',
      'Instant secure PDF download + Lifetime free updates'
    ],
    whatYouGet: [
      'Complete 120-Page E-book (High Resolution PDF format)',
      '15+ Copy-Paste AI Prompts for Customer Support & Marketing',
      'WhatsApp Automation Strategy Workflow Diagrams',
      'Lifetime Free Updates & Future Revisions'
    ],
    testimonials: [
      {
        id: 't-1',
        customerName: 'Rahul Sharma',
        rating: 5,
        testimonialText: 'Very useful guide for understanding AI automation. Implemented the WhatsApp lead funnel within 2 days and saw immediate customer engagement.',
        designation: 'Business Owner, Delhi',
        displayOrder: 1,
        status: 'published'
      },
      {
        id: 't-2',
        customerName: 'Pooja Verma',
        rating: 5,
        testimonialText: 'Clear, concise and practical. No unnecessary fluff. The prompt engineering cheat sheets saved my marketing team countless hours.',
        designation: 'Digital Marketing Lead, Mumbai',
        displayOrder: 2,
        status: 'published'
      },
      {
        id: 't-3',
        customerName: 'Amit Patel',
        rating: 5,
        testimonialText: 'Best ₹299 investment for my retail business. The step-by-step Hindi-English mixed instructions made it super easy to understand for everyone.',
        designation: 'Retail Entrepreneur, Ahmedabad',
        displayOrder: 3,
        status: 'published'
      }
    ],
    faqs: [
      {
        id: 'f-1',
        question: 'Is this product downloadable immediately after payment?',
        answer: 'Yes! Immediately after your payment of ₹299 is verified by Razorpay, you will be redirected to the secure Thank You page where you can download the PDF file with one click.',
        displayOrder: 1,
        status: 'published'
      },
      {
        id: 'f-2',
        question: 'What format is the digital guide provided in?',
        answer: 'You will receive a pristine, high-resolution PDF document that can be read on any mobile phone, tablet, laptop, or desktop.',
        displayOrder: 2,
        status: 'published'
      },
      {
        id: 'f-3',
        question: 'Do I need prior programming or coding knowledge?',
        answer: 'No coding or technical background is required. Everything is explained step-by-step with practical business examples and ready-to-use tools.',
        displayOrder: 3,
        status: 'published'
      },
      {
        id: 'f-4',
        question: 'Will I get future updates if AI tools change?',
        answer: 'Yes, all buyers receive lifetime access and free updates whenever we update the guide with new AI tools and automations.',
        displayOrder: 4,
        status: 'published'
      },
      {
        id: 'f-5',
        question: 'What if I face any issue during download?',
        answer: 'Our dedicated support team is available via WhatsApp and email (support@manisolution.com) to assist you immediately.',
        displayOrder: 5,
        status: 'published'
      }
    ],
    downloadsCount: 142,
    createdAt: new Date().toISOString()
  },
  {
    id: 'dp-small-business-management-software',
    name: 'Small Business Management Software',
    slug: 'small-business-management-software',
    category: 'Tools',
    shortDescription: 'A complete offline business management solution designed for small businesses.',
    fullDescription: 'A standalone offline business management software by MANI Solution. Includes Dashboard, Sales & Invoicing, Product & Inventory Management, Expenses, Customer Dues, Supplier Payables, Profit & Loss Reports, Business Settings, and JSON Backup & Restore. Works 100% offline on any device with zero monthly fees.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'
    ],
    productType: 'Digital Download',
    price: 999,
    compareAtPrice: 2999,
    offer: {
      isEnabled: true,
      title: 'Commercial License Offer',
      badge: '67% OFF',
      text: 'Lifetime Single Purchase - No Recurring Fees'
    },
    productFilePath: 'secure-asset-small-business-software.html',
    productFileName: 'MANI_Small_Business_Software.html',
    productFileSize: '450 KB',
    productFileType: 'HTML',
    productFileUploadedAt: new Date().toISOString(),
    status: 'published',
    isFeatured: true,
    features: [
      '100% Offline functionality - No internet required after download',
      'Sales, Invoicing & Billing with print support',
      'Inventory tracking with low stock alerts',
      'Expense tracking and Profit & Loss financial reports',
      'Customer credit dues and Supplier payable management',
      'Built-in secure Data Backup & Restore (JSON)'
    ],
    whatYouGet: [
      'Single-File Standalone Offline Web Application',
      'Comprehensive User Manual & Quick Start Guide',
      'Sample Data Templates & Export/Import Utilities',
      'Full Commercial Lifetime Usage Rights'
    ],
    testimonials: [
      {
        id: 't-sb-1',
        customerName: 'Kishore Patel',
        rating: 5,
        testimonialText: 'Works completely offline without monthly subscription. Exactly what my hardware shop needed for fast customer billing and GST invoices.',
        designation: 'Store Owner, Surat',
        displayOrder: 1,
        status: 'published'
      }
    ],
    faqs: [
      { 
        id: 'f-sb-1',
        question: 'How do I use the software after purchase?', 
        answer: 'Download the secure software file instantly after payment and double-click to open it in any web browser. It runs completely offline.',
        displayOrder: 1,
        status: 'published'
      },
      { 
        id: 'f-sb-2',
        question: 'Are there any monthly subscription fees?', 
        answer: 'No! This is a one-time purchase with lifetime offline usage on your PC or laptop.',
        displayOrder: 2,
        status: 'published'
      }
    ],
    downloadsCount: 89,
    createdAt: new Date().toISOString()
  },
  {
    id: 'DP-TRADING-MASTER-2026',
    name: 'Trading Master - Android Trading App',
    slug: 'trading-master',
    category: 'Trading',
    shortDescription: 'Professional stock, options & algorithmic trading Android app (APK). Live candlestick indicators, automated buy/sell signals, and risk calculator.',
    fullDescription: '### Trading Master — Professional Android Trading System\n**Trading Master** is a high-performance Android mobile application built for stock market, F&O (Futures & Options), commodity, and forex traders across India.\n\nDesigned to eliminate emotional decision-making, Trading Master provides real-time multi-timeframe chart intelligence, algorithmic buy/sell signal alerts, and built-in risk management calculators right on your Android smartphone.\n\n---\n\n### Core Highlights & Capabilities:\n- **Real-Time Technical Indicators**: Supertrend, RSI divergence, MACD crossovers, EMA ribbon, and Volume Profile calculated on the fly.\n- **Automated Buy / Sell Alerts**: High-probability swing and intraday signal notifications delivered instantly without screen staring.\n- **Futures & Options Strategy Builder**: Option Greeks tracker, Payoff visualizer, and Open Interest (OI) PCR heatmaps.\n- **Risk-to-Reward Calculator**: Automatically calculates maximum position sizing, optimal stop-loss, and target points based on your account capital.\n- **100% Offline Capable & Private**: Your trading journal and strategy logs remain securely encrypted on your local Android device.\n- **Zero Subscription Fees**: One-time purchase of ₹999 gives you lifetime unlimited access with free future updates.\n\n---\n\n### Android System Requirements:\n- **Operating System**: Android 7.0 (Nougat) or newer\n- **RAM**: Minimum 2 GB (4 GB recommended)\n- **Storage**: ~30 MB free space\n- **Permissions**: Network access for live market feeds',
    thumbnailUrl: '/images/trading_master_cover.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop'
    ],
    productType: 'Digital Download',
    price: 999,
    compareAtPrice: 3999,
    offer: {
      isEnabled: true,
      title: 'Special Launch Offer',
      badge: '75% OFF',
      text: 'Limited Time Introductory Price — Save ₹3,000'
    },
    productFilePath: 'trading_master.apk',
    productFileName: 'trading master.apk',
    productFileSize: '19.8 MB',
    productFileType: 'APK',
    productFileUploadedAt: new Date().toISOString(),
    status: 'published',
    isFeatured: true,
    features: [
      'Native Android APK installation package (19.8 MB) — Zero monthly fees',
      'Real-time candlestick chart patterns & automated buy/sell signals',
      'Intraday & Swing trading indicator scanner with instant notifications',
      'Option chain analysis, Open Interest heatmaps & Greeks tracker',
      'Position size and Risk-to-Reward calculator to protect capital',
      'Lifetime license with free future feature updates'
    ],
    whatYouGet: [
      'Trading Master Pro APK file (version 2.4 - 19.8 MB)',
      'Android Quick Installation & Setup PDF Guide',
      'High-Probability Strategy Setup Cheat Sheet',
      'Direct WhatsApp Technical Support for Installation & Activation'
    ],
    testimonials: [
      {
        id: 't-tm-1',
        customerName: 'Vikas Deshmukh',
        rating: 5,
        testimonialText: 'The buy/sell alerts and Supertrend scanner on Trading Master APK are remarkably accurate. Recovered my ₹999 on day one itself.',
        designation: 'Options Trader, Pune',
        displayOrder: 1,
        status: 'published'
      },
      {
        id: 't-tm-2',
        customerName: 'Rajesh K. Singhania',
        rating: 5,
        testimonialText: 'Very clean Android UI. No clutter or lag even when checking Nifty 50 1-minute candles. The risk calculator prevents overleveraging.',
        designation: 'Swing Trader, Delhi',
        displayOrder: 2,
        status: 'published'
      },
      {
        id: 't-tm-3',
        customerName: 'Sunil Nair',
        rating: 5,
        testimonialText: 'Smooth APK download immediately after Razorpay payment. Installed directly on my Samsung Galaxy without any issue.',
        designation: 'Equity Investor, Bengaluru',
        displayOrder: 3,
        status: 'published'
      }
    ],
    faqs: [
      {
        id: 'f-tm-1',
        question: 'How do I download and install Trading Master APK on Android?',
        answer: 'Immediately upon completing your ₹999 payment, click the Download APK button on the Thank You page. Once downloaded, open your Downloads folder, tap "trading master.apk", and select Install. (If prompted, allow "Install unknown apps" in Android settings).',
        displayOrder: 1,
        status: 'published'
      },
      {
        id: 'f-tm-2',
        question: 'Is there any monthly subscription or renewal charge?',
        answer: 'No. This is a one-time payment of ₹999 (regular compare price ₹3,999). You get a lifetime license with zero recurring or hidden monthly fees.',
        displayOrder: 2,
        status: 'published'
      },
      {
        id: 'f-tm-3',
        question: 'What Android versions are supported?',
        answer: 'Trading Master is compatible with all Android devices running Android version 7.0 and above, including Samsung, OnePlus, Xiaomi, Realme, Vivo, and Google Pixel.',
        displayOrder: 3,
        status: 'published'
      },
      {
        id: 'f-tm-4',
        question: 'Is this suitable for beginners in stock and options trading?',
        answer: 'Yes! Trading Master includes beginner-friendly presets, built-in indicator explanations, and an automated risk calculator so you always know your exact stop-loss and lot size.',
        displayOrder: 4,
        status: 'published'
      },
      {
        id: 'f-tm-5',
        question: 'What if I need help during download or installation?',
        answer: 'Our support team is available 24/7 on WhatsApp (+91 96783 77275) and email (manisolutions24x7@gmail.com) to assist you with installation.',
        displayOrder: 5,
        status: 'published'
      }
    ],
    downloadsCount: 89,
    createdAt: new Date().toISOString()
  }
];

let inMemoryProducts: DigitalProduct[] = DEFAULT_PRODUCTS;
let inMemoryCategories: DigitalCategory[] = DEFAULT_CATEGORIES;
let inMemoryOrders: DigitalOrder[] = [];
let inMemoryAccess: DigitalAccess[] = [];
let inMemoryCoupons: DigitalCoupon[] = [
  { id: 'CP-1', code: 'MANI20', discountType: 'percentage', discountValue: 20, usageLimit: 100, usageCount: 0, status: 'active' },
  { id: 'CP-2', code: 'LAUNCH500', discountType: 'fixed', discountValue: 500, usageLimit: 50, usageCount: 0, status: 'active' }
];

// Initial local storage load
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const p = localStorage.getItem(PRODUCTS_KEY);
    if (p) {
      const parsed = JSON.parse(p);
      if (Array.isArray(parsed) && parsed.length > 0) inMemoryProducts = parsed;
    }
    const c = localStorage.getItem(CATEGORIES_KEY);
    if (c) {
      const parsed = JSON.parse(c);
      if (Array.isArray(parsed) && parsed.length > 0) inMemoryCategories = parsed;
    }
    const o = localStorage.getItem(ORDERS_KEY);
    if (o) {
      const parsed = JSON.parse(o);
      if (Array.isArray(parsed)) inMemoryOrders = parsed;
    }
    const a = localStorage.getItem(ACCESS_KEY);
    if (a) {
      const parsed = JSON.parse(a);
      if (Array.isArray(parsed)) inMemoryAccess = parsed;
    }
    const cp = localStorage.getItem(COUPONS_KEY);
    if (cp) {
      const parsed = JSON.parse(cp);
      if (Array.isArray(parsed)) inMemoryCoupons = parsed;
    }
  }
} catch {}

type Listener = () => void;
const listeners: Set<Listener> = new Set();
export const subscribeToDigitalProducts = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const notify = () => listeners.forEach(fn => { try { fn(); } catch {} });

// Async Supabase Sync on Mount
if (typeof window !== 'undefined') {
  setTimeout(async () => {
    try {
      const remoteSettingsProducts = await supabaseDatabase.getSetting<DigitalProduct[]>('digital_products_all_v2');
      const remoteProducts = await supabaseDatabase.getDigitalProducts();

      const productMap = new Map<string, DigitalProduct>();

      // 1. Populate from digital_products table
      if (remoteProducts && remoteProducts.length > 0) {
        for (const p of remoteProducts) {
          if (p.id) productMap.set(p.id, p);
        }
      }

      // 2. Merge/Overlay from digital_products_all_v2 setting (contains rich fields like offer, gallery, testimonials)
      if (remoteSettingsProducts && remoteSettingsProducts.length > 0) {
        for (const p of remoteSettingsProducts) {
          if (p.id) {
            const existing = productMap.get(p.id);
            if (existing) {
              productMap.set(p.id, {
                ...existing,
                ...p,
                price: p.price !== undefined ? Number(p.price) : Number(existing.price)
              });
            } else {
              productMap.set(p.id, p);
            }
          }
        }
      }

      if (productMap.size > 0) {
        const finalProducts = Array.from(productMap.values());
        for (const def of DEFAULT_PRODUCTS) {
          if (!finalProducts.some(p => p.id === def.id || p.slug === def.slug)) {
            finalProducts.push(def);
          }
        }

        inMemoryProducts = finalProducts;
        try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(finalProducts)); } catch {}
        notify();
      }
    } catch (err) {
      console.warn('Sync products from remote error:', err);
    }

    supabaseDatabase.getDigitalCategories().then(remoteCats => {
      if (remoteCats && remoteCats.length > 0) {
        inMemoryCategories = remoteCats;
        try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(remoteCats)); } catch {}
        notify();
      }
    }).catch(() => {});
  }, 100);
}

export const digitalProductsStorage = {
  getSettings(): DigitalSettings {
    return inMemorySettings;
  },

  async saveSettings(settings: Partial<DigitalSettings>): Promise<void> {
    inMemorySettings = { ...inMemorySettings, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(inMemorySettings));
      await supabaseDatabase.saveSetting('digital_settings', inMemorySettings);
    } catch {}
    notify();
  },

  getAll(): DigitalProduct[] {
    return inMemoryProducts;
  },

  getPublished(): DigitalProduct[] {
    return inMemoryProducts.filter(p => p.status === 'published');
  },

  getBySlug(slug: string): DigitalProduct | undefined {
    const clean = (slug || '').toLowerCase().trim();
    return inMemoryProducts.find(p => (
      p.slug.toLowerCase() === clean || 
      p.id.toLowerCase() === clean ||
      (clean.includes('trading') && p.id === 'DP-TRADING-MASTER-2026') ||
      (clean.includes('business-grow') && (p.id === 'dp-ai-business-grow' || p.id === 'DP-AI-GROWTH-2026')) ||
      (clean.includes('small-business') && (p.id === 'dp-small-business-management-software' || p.id === 'DP-SBMS-2026'))
    ));
  },

  getById(id: string): DigitalProduct | undefined {
    const clean = (id || '').toLowerCase().trim();
    return inMemoryProducts.find(p => (
      p.id.toLowerCase() === clean || 
      p.slug.toLowerCase() === clean ||
      (clean.includes('trading') && p.id === 'DP-TRADING-MASTER-2026') ||
      (clean.includes('business-grow') && (p.id === 'dp-ai-business-grow' || p.id === 'DP-AI-GROWTH-2026')) ||
      (clean.includes('small-business') && (p.id === 'dp-small-business-management-software' || p.id === 'DP-SBMS-2026'))
    ));
  },

  getCategories(): DigitalCategory[] {
    return inMemoryCategories.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getOrders(): DigitalOrder[] {
    return inMemoryOrders;
  },

  getAccessRecords(): DigitalAccess[] {
    return inMemoryAccess;
  },

  getCoupons(): DigitalCoupon[] {
    return inMemoryCoupons;
  },
  
  getCurrentCustomer() {
    try {
      const s = localStorage.getItem(CUSTOMER_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return null;
  },

  setCurrentCustomer(customer: any) {
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      notify();
    } catch {}
  },

  logoutCustomer() {
    try {
      localStorage.removeItem(CUSTOMER_KEY);
      notify();
    } catch {}
  },

  hasAccess(customerId: string, productId: string): boolean {
    if (!customerId || !productId) return false;
    const access = inMemoryAccess.find(a => a.customerId === customerId && a.productId === productId);
    return access ? access.accessStatus === 'ACTIVE' : false;
  },

  getCustomerProducts(customerId: string): DigitalProduct[] {
    if (!customerId) return [];
    const activeAccessIds = inMemoryAccess
      .filter(a => a.customerId === customerId && a.accessStatus === 'ACTIVE')
      .map(a => a.productId);
    return inMemoryProducts.filter(p => activeAccessIds.includes(p.id));
  },

  getCustomerOrders(customerId: string): DigitalOrder[] {
    if (!customerId) return [];
    return inMemoryOrders.filter(o => o.customerId === customerId);
  },

  async saveProduct(data: Omit<DigitalProduct, 'id' | 'createdAt'>, id?: string): Promise<string> {
    const prodId = id || `DP-2026-${String(Date.now()).slice(-4)}`;
    const newProduct: DigitalProduct = {
      ...data,
      id: prodId,
      createdAt: id ? (inMemoryProducts.find(p => p.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingIndex = inMemoryProducts.findIndex(p => p.id === prodId);
    if (existingIndex >= 0) {
      inMemoryProducts[existingIndex] = newProduct;
    } else {
      inMemoryProducts.unshift(newProduct);
    }
    
    try {
      const r1 = await supabaseDatabase.saveDigitalProduct(newProduct);
      const r2 = await supabaseDatabase.saveSetting('digital_products_all_v2', inMemoryProducts);
      if (!r1 || !r2) {
        throw new Error('Failed to save digital product to Supabase database. Please check Supabase connection or permissions.');
      }
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(inMemoryProducts));
    } catch (e) {
      console.error('Failed to save digital product:', e);
      throw e;
    }
    notify();
    return prodId;
  },

  async deleteProduct(id: string): Promise<boolean> {
    inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(inMemoryProducts));
      const r1 = await supabaseDatabase.deleteDigitalProduct(id);
      const r2 = await supabaseDatabase.saveSetting('digital_products_all_v2', inMemoryProducts);
      if (!r1 || !r2) {
        throw new Error('Failed to delete digital product from Supabase database.');
      }
    } catch (e) {
      console.error('Failed to delete digital product:', e);
      throw e;
    }
    notify();
    return true;
  },

  async saveCategory(cat: DigitalCategory): Promise<void> {
    const existing = inMemoryCategories.findIndex(c => c.id === cat.id);
    if (existing >= 0) {
      inMemoryCategories[existing] = cat;
    } else {
      inMemoryCategories.push(cat);
    }
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(inMemoryCategories));
      await supabaseDatabase.saveDigitalCategory(cat);
    } catch (e) {
      console.error('Failed to save category:', e);
    }
    notify();
  },

  async deleteCategory(id: string): Promise<void> {
    inMemoryCategories = inMemoryCategories.filter(c => c.id !== id);
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(inMemoryCategories));
    } catch (e) {
      console.error('Failed to delete category:', e);
    }
    notify();
  },

  async saveCoupon(coupon: DigitalCoupon): Promise<void> {
    const idx = inMemoryCoupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) inMemoryCoupons[idx] = coupon;
    else inMemoryCoupons.push(coupon);
    try {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(inMemoryCoupons));
    } catch (e) {
      console.error('Failed to save coupon:', e);
    }
    notify();
  },

  async deleteCoupon(id: string): Promise<void> {
    inMemoryCoupons = inMemoryCoupons.filter(c => c.id !== id);
    try {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(inMemoryCoupons));
    } catch (e) {
      console.error('Failed to delete coupon:', e);
    }
    notify();
  },

  async recordOrder(order: DigitalOrder): Promise<void> {
    const existingIndex = inMemoryOrders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      inMemoryOrders[existingIndex] = order;
    } else {
      inMemoryOrders.unshift(order);
    }
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(inMemoryOrders));
      await supabaseDatabase.saveDigitalOrder(order);
    } catch (e) {
      console.error('Failed to save order:', e);
    }
    notify();
  },

  async updateOrderStatus(orderId: string, paymentStatus: DigitalOrder['paymentStatus'], accessStatus: DigitalOrder['accessStatus']): Promise<void> {
    const order = inMemoryOrders.find(o => o.id === orderId);
    if (!order) return;
    order.paymentStatus = paymentStatus;
    order.accessStatus = accessStatus;
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(inMemoryOrders));
      await supabaseDatabase.saveDigitalOrder(order);
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
    notify();
  },

  async grantAccess(customerId: string, productId: string): Promise<void> {
    const accessId = `${customerId}_${productId}`;
    const accessRecord: DigitalAccess = {
      id: accessId,
      customerId,
      productId,
      orderId: 'ADMIN_GRANT_' + Date.now(),
      accessStatus: 'ACTIVE',
      grantedAt: new Date().toISOString(),
      downloadCount: 0
    };
    inMemoryAccess = inMemoryAccess.filter(a => a.id !== accessId);
    inMemoryAccess.push(accessRecord);
    try {
      localStorage.setItem(ACCESS_KEY, JSON.stringify(inMemoryAccess));
    } catch (e) {
      console.error('Failed to grant access:', e);
    }
    notify();
  },

  async revokeAccess(customerId: string, productId: string): Promise<void> {
    const accessId = `${customerId}_${productId}`;
    const rec = inMemoryAccess.find(a => a.id === accessId);
    if (rec) {
      rec.accessStatus = 'REVOKED';
    }
    try {
      localStorage.setItem(ACCESS_KEY, JSON.stringify(inMemoryAccess));
    } catch (e) {
      console.error('Failed to revoke access:', e);
    }
    notify();
  },

  async incrementDownloadCount(productId: string): Promise<void> {
    const p = inMemoryProducts.find(item => item.id === productId);
    if (p) {
      p.downloadsCount = (p.downloadsCount || 0) + 1;
      p.lastDownloadedAt = new Date().toISOString();
      try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(inMemoryProducts));
        await supabaseDatabase.saveDigitalProduct(p);
      } catch {}
      notify();
    }
  }
};
