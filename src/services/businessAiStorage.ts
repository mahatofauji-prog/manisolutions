import { BusinessAiItem } from '../types';
import { supabaseDatabase } from './supabaseDatabase';

const STORAGE_KEY = 'mani_business_ai_items_v2';

const DEFAULT_AI_ITEMS: BusinessAiItem[] = [
  {
    id: 'BAI-ai-automation',
    title: 'Business Process Automation',
    slug: 'business-process-automation',
    category: 'Business Process Automation',
    type: 'Workflow Engine',
    shortDescription: 'Automates repetitive business operations like post-service follow-up messages, payment reminders, report generation, and data processing.',
    fullOverview: 'Intelligent workflow automation that connects your tools and executes tasks without manual intervention.',
    thumbnailUrl: '/images/automation_workflow_visual_1790521682331.jpg',
    features: ['Workflow mapping', 'Data synchronization', 'Automated trigger systems'],
    benefits: ['Reduced operational costs', 'Error-free data processing', 'Faster turnaround times'],
    howItWorks: ['Map existing workflows', 'Identify automation bottlenecks', 'Implement trigger-action loops'],
    targetBusinesses: ['Logistics', 'E-commerce', 'Service providers'],
    deliverables: ['Automated workflow setup', 'Monitoring dashboard', 'Integration documentation'],
    technologies: ['Node.js', 'Zapier/Make', 'PostgreSQL'],
    integrations: ['CRM', 'ERP', 'Email', 'Payment Gateways'],
    pricingType: 'Fixed Price',
    price: '₹19,999',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BAI-ai-chat',
    title: 'Business AI Chat Assistant',
    slug: 'business-ai-chat',
    category: 'Business AI Chat Assistant',
    type: 'Website Assistant',
    shortDescription: 'AI chatbot trained on your business knowledge base to answer customer questions, share rate cards, capture lead contact details, and seamlessly handle support.',
    fullOverview: 'Intelligent conversational bot trained on your product catalog and FAQs to close sales instantly.',
    thumbnailUrl: '/images/ai_chat_assistant_visual_1790521700760.jpg',
    features: ['Natural language understanding in Hindi & English', 'CRM integration', 'Human takeover option'],
    benefits: ['Zero response delay', 'Higher conversion', 'Lower support staff overhead'],
    howItWorks: ['Integrates via WhatsApp Business Cloud API', 'Analyzes client intent', 'Responds dynamically'],
    targetBusinesses: ['Retail', 'Healthcare clinics', 'Real estate consultants', 'Restaurants'],
    deliverables: ['Configured WhatsApp bot', 'Admin dashboard', 'Staff training session'],
    technologies: ['Node.js', 'Meta Cloud API', 'Gemini AI', 'Supabase'],
    integrations: ['WhatsApp', 'Google Sheets', 'Webhook API'],
    pricingType: 'Fixed Price',
    price: '₹14,999',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BAI-ai-leadgen',
    title: 'AI Lead Generation',
    slug: 'ai-lead-generation',
    category: 'AI Lead Generation',
    type: 'Lead Qualifier',
    shortDescription: 'Engages website visitors proactively, qualifies high-intent buyers, collects contact details, and delivers instant notifications to your sales team.',
    fullOverview: 'An intelligent qualification engine that filters high-intent leads from casual traffic.',
    thumbnailUrl: '/images/ai_lead_gen_visual_1790521714133.jpg',
    features: ['Intent analysis', 'Lead scoring', 'Instant WhatsApp notifications'],
    benefits: ['Higher conversion rates', 'Faster sales follow-ups', 'Improved lead quality'],
    howItWorks: ['Analyzes user behavior', 'Asks qualifying questions', 'Handoff to sales'],
    targetBusinesses: ['Real estate', 'Consulting firms', 'B2B Services'],
    deliverables: ['Qualification script', 'Dashboard', 'Notification system'],
    technologies: ['Node.js', 'Gemini AI', 'Supabase'],
    integrations: ['WhatsApp', 'CRM', 'Google Sheets'],
    pricingType: 'Fixed Price',
    price: '₹9,999',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BAI-ai-support',
    title: 'AI Customer Support',
    slug: 'ai-customer-support',
    category: 'AI Customer Support',
    type: 'AI Customer Support',
    shortDescription: 'Automates customer service inquiries, status lookups, policy questions, and complaint registration with human escalation triggers when required.',
    fullOverview: '24/7 support agent that resolves queries instantly.',
    thumbnailUrl: '/images/ai_customer_support_visual_1790521724553.jpg',
    features: ['Knowledge base integration', 'Automated ticketing', 'Human escalation support'],
    benefits: ['Always-on support', 'Reduced wait times', 'Consistency in responses'],
    howItWorks: ['Learns from business documents', 'Handles queries using AI', 'Escalates to staff if needed'],
    targetBusinesses: ['E-commerce', 'SaaS', 'Education'],
    deliverables: ['Trained support agent', 'Ticket tracking system', 'Escalation workflow'],
    technologies: ['Node.js', 'Gemini AI', 'Supabase'],
    integrations: ['Helpdesk Software', 'Email'],
    pricingType: 'Fixed Price',
    price: '₹12,999',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BAI-ai-voice',
    title: 'AI Voice Assistant',
    slug: 'ai-voice-assistant',
    category: 'AI Voice Assistant',
    type: 'Voice Receptionist',
    shortDescription: 'Smart AI voice agent that answers incoming calls, speaks naturally in English and regional accents, handles common customer questions, and assists with bookings.',
    fullOverview: 'Handles multiple simultaneous phone inquiries, answers business questions, and schedules appointments.',
    thumbnailUrl: '/images/ai_voice_assistant_visual_1790521735195.jpg',
    features: ['Bilingual speech processing', 'Interactive call routing', 'Call recording & transcriptions'],
    benefits: ['100% call answered rate', 'Instant SMS confirmation to caller', 'Detailed analytics'],
    howItWorks: ['Connects to your IVR or cloud telephony line', 'Converses in real-time', 'Saves caller info'],
    targetBusinesses: ['Diagnostic centers', 'Coaching institutes', 'Salons & Spas', 'Logistics'],
    deliverables: ['Custom voice model', 'Telephony trunk setup', 'Live testing'],
    technologies: ['WebRTC', 'Speech-to-Text', 'TTS', 'Gemini AI'],
    integrations: ['Twilio / Exotel', 'WhatsApp SMS'],
    pricingType: 'Custom Pricing',
    customPricingText: 'Custom Enterprise Plan',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'BAI-custom-ai',
    title: 'Custom Business AI',
    slug: 'custom-business-ai',
    category: 'Custom Business AI',
    type: 'Private Business Agent',
    shortDescription: 'Custom AI architecture engineered for your unique workflow, internal staff knowledge search, document analysis, and industry-specific automation.',
    fullOverview: 'A completely bespoke AI system tailored for high-complexity enterprise tasks.',
    thumbnailUrl: '/images/custom_enterprise_ai_visual_1790521746923.jpg',
    features: ['Private knowledge base', 'Custom workflow engine', 'Data security protocols'],
    benefits: ['Competitive advantage', 'Significant cost reduction', 'Improved business agility'],
    howItWorks: ['Deep business consultation', 'Model training & fine-tuning', 'Deployment'],
    targetBusinesses: ['Enterprises', 'Financial Services', 'Legal Firms'],
    deliverables: ['Custom AI model', 'Enterprise infrastructure', 'Long-term support'],
    technologies: ['Node.js', 'Gemini Pro', 'Vector Databases'],
    integrations: ['Internal Databases', 'API Ecosystems'],
    pricingType: 'Custom Pricing',
    customPricingText: 'Custom Enterprise Plan',
    status: 'published',
    createdAt: new Date().toISOString()
  }
];

let inMemoryAiItems: BusinessAiItem[] = DEFAULT_AI_ITEMS;

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryAiItems = parsed.map((item: BusinessAiItem, index: number) => {
          const defaultMatch = DEFAULT_AI_ITEMS.find(d => d.id === item.id || d.slug === item.slug);
          if (defaultMatch) {
            return { ...item, thumbnailUrl: defaultMatch.thumbnailUrl };
          }
          if (DEFAULT_AI_ITEMS[index]) {
            return { ...item, thumbnailUrl: DEFAULT_AI_ITEMS[index].thumbnailUrl };
          }
          return item;
        });
      }
    }
  }
} catch (e) {
  console.warn('AI items cache load warning:', e);
}

type Listener = () => void;
const listeners: Set<Listener> = new Set();
export const subscribeToBusinessAi = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const notify = () => listeners.forEach(fn => { try { fn(); } catch {} });

// Sync from Supabase
if (typeof window !== 'undefined') {
  supabaseDatabase.getBusinessAi().then(items => {
    if (items && items.length > 0) {
      inMemoryAiItems = items.map((item: BusinessAiItem, index: number) => {
        const defaultMatch = DEFAULT_AI_ITEMS.find(d => d.id === item.id || d.slug === item.slug);
        if (defaultMatch) {
          return { ...item, thumbnailUrl: defaultMatch.thumbnailUrl };
        }
        if (DEFAULT_AI_ITEMS[index]) {
          return { ...item, thumbnailUrl: DEFAULT_AI_ITEMS[index].thumbnailUrl };
        }
        return item;
      });
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryAiItems)); } catch {}
      notify();
    }
  }).catch(() => {});
}

export const businessAiStorage = {
  getAll(): BusinessAiItem[] {
    return inMemoryAiItems;
  },

  getAllRaw(): BusinessAiItem[] {
    return inMemoryAiItems;
  },

  getPublished(): BusinessAiItem[] {
    return inMemoryAiItems.filter(item => item.status === 'published');
  },

  getBySlug(slug: string): BusinessAiItem | undefined {
    const clean = (slug || '').toLowerCase().trim();
    return inMemoryAiItems.find(item => item.slug?.toLowerCase() === clean || item.id?.toLowerCase() === clean);
  },

  async save(item: Partial<BusinessAiItem> & { title: string; category: string }): Promise<void> {
    const id = item.id || `BAI-2026-${String(Date.now()).slice(-4)}`;
    const fullItem: BusinessAiItem = {
      ...item,
      id,
      slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: item.type || 'AI Solution',
      shortDescription: item.shortDescription || '',
      fullOverview: item.fullOverview || '',
      thumbnailUrl: item.thumbnailUrl || '/images/automation_workflow_visual_1790521682331.jpg',
      features: item.features || [],
      benefits: item.benefits || [],
      howItWorks: item.howItWorks || [],
      targetBusinesses: item.targetBusinesses || [],
      deliverables: item.deliverables || [],
      technologies: item.technologies || [],
      integrations: item.integrations || [],
      pricingType: item.pricingType || 'Fixed Price',
      createdAt: item.createdAt || new Date().toISOString()
    } as BusinessAiItem;
    return this.saveItem(fullItem);
  },

  async saveItem(item: BusinessAiItem): Promise<void> {
    const idx = inMemoryAiItems.findIndex(i => i.id === item.id);
    if (idx >= 0) inMemoryAiItems[idx] = item;
    else inMemoryAiItems.unshift(item);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryAiItems));
      await supabaseDatabase.saveBusinessAi(item);
    } catch (e) {
      console.warn('Failed to save AI solution to Supabase:', e);
    }
    notify();
  },

  async update(id: string, updates: Partial<BusinessAiItem>): Promise<BusinessAiItem> {
    const idx = inMemoryAiItems.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    const updated = { ...inMemoryAiItems[idx], ...updates };
    inMemoryAiItems[idx] = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryAiItems));
      await supabaseDatabase.saveBusinessAi(updated);
    } catch (e) {
      console.warn('Failed to update AI solution on Supabase:', e);
    }
    notify();
    return updated;
  },

  async delete(id: string): Promise<void> {
    inMemoryAiItems = inMemoryAiItems.filter(i => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryAiItems));
      await supabaseDatabase.deleteBusinessAi(id);
    } catch (e) {
      console.warn('Failed to delete AI solution on Supabase:', e);
    }
    notify();
  }
};
