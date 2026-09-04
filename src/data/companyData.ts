import { ServiceDetail, BusinessCategory, WorkStep } from '../types';

export const COMPANY_INFO = {
  name: 'MANI Solution',
  fullName: 'Modern Advancement for New India',
  founder: 'Mr. Hariom Mahato',
  tagline: 'Build. Automate. Grow.',
  subTagline: 'Digital solutions designed for the modern India.',
  description: 'MANI Solution is a digital solutions company founded by Mr. Hariom Mahato, providing professional websites, custom software, mobile applications, automation solutions and business management systems.',
  phone: '+91 96783 77275',
  phoneRaw: '+919678377275',
  whatsapp: '+91 96783 77275',
  whatsappRaw: '919678377275',
  email: 'manisolutions24x7@gmail.com',
  operatingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM IST',
  supportAvailability: '24x7 Priority Support for Active Projects',
  address: 'India',
  defaultWhatsAppMessage: 'Hello MANI Solution, I am interested in your digital services. I would like to discuss my requirement.',
};

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'website',
    pageView: 'service-website',
    badge: 'SERVICE 01',
    title: 'Website Development',
    shortDesc: 'Professional, responsive and conversion-focused websites designed specifically for your business.',
    fullDesc: 'We design and engineer bespoke web presences engineered for maximum speed, clean mobile responsiveness, search engine clarity, and effortless conversion. Whether you need a corporate portfolio, high-converting retail store, or educational portal, every line of code is tailored to your business identity.',
    items: [
      'Business Websites',
      'E-commerce Websites',
      'Restaurant Websites',
      'School & College Websites',
      'Coaching / Tuition Websites',
      'Trust & NGO Websites',
      'Service Business Websites',
      'Custom Websites'
    ],
    ctaText: 'Explore Website Solutions',
    keyBenefits: [
      '100% Mobile & Tablet Responsive Architecture',
      'Blazing Fast Page Load Speed (<1.5s Optimized)',
      'Search Engine Optimization (SEO) Ready',
      'Direct WhatsApp & Call Integration Buttons',
      'SSL Security & Modern Cloud Hosting Integration',
      'Zero Bloat, Scalable Frontend Code'
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Cloudflare CDN'],
    deliverables: [
      'Custom UI/UX Wireframe & Design Blueprint',
      'Complete Mobile-Optimized Website Source Code',
      'Admin Control Panel for Content Updates',
      'Domain Setup, SSL Certificate & Cloud Deployment',
      '30-Day Post-Launch Technical Support'
    ],
    sampleUseCases: [
      'Local Retailers establishing online catalogs',
      'Schools & Academies managing admissions & syllabus',
      'Healthcare Clinics scheduling patient visits',
      'Manufacturing & B2B Companies showcasing products'
    ],
    estimatedTimeline: '7 - 14 Business Days'
  },
  {
    id: 'app',
    pageView: 'service-app',
    badge: 'SERVICE 02',
    title: 'App Development',
    shortDesc: 'Custom mobile applications designed to make your business more accessible, efficient and scalable.',
    fullDesc: 'Bring your business directly onto your customers and team smartphones. We build high-performance cross-platform Android and iOS applications with intuitive navigation, real-time push notifications, secure authentication, and offline capability.',
    items: [
      'Business Apps',
      'Service Apps',
      'E-commerce Apps',
      'Customer Apps',
      'Booking Apps',
      'Management Apps',
      'Custom Applications'
    ],
    ctaText: 'Explore App Solutions',
    keyBenefits: [
      'Cross-Platform Android & iOS Compatibility',
      'Ultra-Smooth 60fps Native Feel & Performance',
      'Secure User Authentication & OTP Verification',
      'Real-Time Order & Service Status Tracking',
      'Integrated Payment Gateways (UPI, Cards, NetBanking)',
      'Instant Push Notifications for Offers & Updates'
    ],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'Firebase', 'Express.js', 'REST & GraphQL APIs'],
    deliverables: [
      'Interactive Figma UI/UX Prototype',
      'Production-Ready Android (.APK/.AAB) & iOS Builds',
      'Backend API & Database Architecture',
      'App Store & Google Play Publishing Assistance',
      'Comprehensive Admin Management Dashboard'
    ],
    sampleUseCases: [
      'Local Delivery & Grocery Ordering Systems',
      'Gyms & Fitness Centers tracking memberships & workouts',
      'Home Service Providers managing booking schedules',
      'Wholesale Distributors taking recurring retailer orders'
    ],
    estimatedTimeline: '14 - 30 Business Days'
  },
  {
    id: 'software',
    pageView: 'service-software',
    badge: 'SERVICE 03',
    title: 'Custom Software',
    shortDesc: 'Powerful software systems that simplify everyday business operations and management.',
    fullDesc: 'Eliminate manual paperwork, repetitive spreadsheets, and operational friction. MANI Solution creates specialized business operating systems, billing software, staff attendance portals, inventory managers, and QR automation systems tailored to your unique operational workflow.',
    items: [
      'Business Management',
      'Staff Management',
      'Attendance Management',
      'Order Management',
      'Payment Management',
      'QR Menu Systems',
      'Customer Management',
      'Custom Business Software'
    ],
    ctaText: 'Explore Software Solutions',
    keyBenefits: [
      'Centralized Real-Time Operational Dashboard',
      'Automated Billing, Invoicing & GST Reports',
      'Biometric / Mobile Staff Attendance Logs',
      'Dynamic QR Ordering & Table Management',
      'Role-Based Staff Access (Admin, Manager, Staff)',
      'Daily, Weekly & Monthly Analytical Summaries'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'],
    deliverables: [
      'Custom Database Schema & Business Logic',
      'Web-Based Desktop & Mobile Admin Portal',
      'Automated PDF & Thermal Receipt Printing Modules',
      'Data Backup & Secure Encryption Protocols',
      'Staff Training & Operational Documentation'
    ],
    sampleUseCases: [
      'Restaurants & Cafes with QR Menu & KOT Systems',
      'Retail Stores tracking multi-counter inventory & billing',
      'Tuition Centers managing student attendance & fee dues',
      'Contractors & Service Firms tracking daily field staff'
    ],
    estimatedTimeline: '15 - 35 Business Days'
  },
  {
    id: 'ai-automation',
    pageView: 'service-ai-automation',
    badge: 'SERVICE 04',
    title: 'Business AI & Automation',
    shortDesc: 'Intelligent AI assistants and automation systems designed to reduce repetitive work, improve customer support, and help businesses operate more efficiently.',
    fullDesc: 'Empower your business with 24/7 intelligent AI assistants, automated voice receptionists, lead qualification engines, and custom workflow automations. We design custom AI agents and private knowledge bases tailored to your specific business operations, eliminating repetitive manual tasks and capturing every potential customer inquiry.',
    items: [
      'Business AI Chat Assistant',
      'AI Voice Assistant',
      'AI Customer Support',
      'AI Lead Generation',
      'Business Process Automation',
      'Custom Business AI'
    ],
    ctaText: 'Explore AI & Automation Solutions',
    keyBenefits: [
      '24/7 Instant Customer Engagement & Inquiry Resolution',
      'Automated Lead Qualification & Direct WhatsApp Handoff',
      'Zero Missed Calls with AI Voice Receptionist',
      'Private Knowledge Base Trained on Your Business Rules',
      'Reduction of Repetitive Operational & Support Tasks by up to 80%',
      'Seamless Integration with Existing Websites & Software'
    ],
    technologies: ['Gemini AI', 'Voice Processing Engine', 'Node.js', 'WhatsApp API', 'WebSockets', 'Vector Databases'],
    deliverables: [
      'Custom Trained Business AI Chatbot & Voice Assistant',
      'Website Widget & WhatsApp API Integration',
      'Private Knowledge Base Setup & Prompt Configuration',
      'Lead Collection & Qualification Dashboard',
      'Staff Handoff & Notification Escalation Workflows',
      'Testing, Training & Post-Launch Fine-Tuning'
    ],
    sampleUseCases: [
      'Retail & Service Websites answering product & pricing inquiries 24/7',
      'Healthcare Clinics automating patient appointment bookings via voice or chat',
      'Real Estate Agencies qualifying buyer leads and collecting requirements automatically',
      'Institutions & Coaching Centers handling FAQ admissions support'
    ],
    estimatedTimeline: '5 - 14 Business Days'
  }
];

export const WHY_MANI_POINTS = [
  {
    title: 'Custom Approach',
    description: "Every project is designed according to the client's actual requirements, not cookie-cutter templates.",
    icon: 'Layers'
  },
  {
    title: 'Modern Technology',
    description: 'We use modern, fast, secure development frameworks and cloud infrastructure built to scale.',
    icon: 'Cpu'
  },
  {
    title: 'Mobile First',
    description: 'Every website, app, and digital solution is rigorously optimized for smartphone performance.',
    icon: 'Smartphone'
  },
  {
    title: 'Professional Design',
    description: 'Clean, elegant, and conversion-focused user interfaces with balanced hierarchy and clear typography.',
    icon: 'Sparkles'
  },
  {
    title: 'Business Focused',
    description: 'Technology should solve real operational bottlenecks and generate measurable business growth.',
    icon: 'TrendingUp'
  },
  {
    title: 'Long-Term Support',
    description: 'Continuous technical assistance, server maintenance, and functional enhancements as you expand.',
    icon: 'ShieldCheck'
  }
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'retail',
    categoryNumber: '01',
    name: 'Retail & Local Shops',
    iconName: 'ShoppingBag',
    shortDesc: 'Clothing, Electronics, Grocery, Hardware & General Stores',
    recommendedSolution: 'POS Billing Software + Digital Product Catalog Website',
    popularFeatures: ['Barcode Scanner Compatibility', 'Stock Alert Notifications', 'WhatsApp Bill Dispatch', 'Daily Profit Tracker'],
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'restaurant',
    categoryNumber: '02',
    name: 'Restaurants & Cafes',
    iconName: 'Utensils',
    shortDesc: 'Dine-In, Fast Food, Cloud Kitchens & Bakery Outlets',
    recommendedSolution: 'Contactless QR Menu + Kitchen Order Ticketing (KOT) System',
    popularFeatures: ['Table-Side QR Ordering', 'Live Kitchen Screen', 'Parcel & Delivery Management', 'Customer Feedback Loop'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'salon',
    categoryNumber: '03',
    name: 'Beauty & Salon',
    iconName: 'Scissors',
    shortDesc: 'Hair Studios, Unisex Salons, Spas & Beauty Parlours',
    recommendedSolution: 'Automated Slot Booking App + Business AI Chat Assistant',
    popularFeatures: ['Stylist Appointment Calendar', 'SMS & WhatsApp Reminders', 'Membership Package Tracker', 'Service Rate Card UI'],
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'fitness',
    categoryNumber: '04',
    name: 'Gyms & Fitness',
    iconName: 'Dumbbell',
    shortDesc: 'Gymnasiums, Yoga Centers, CrossFit Boxes & Dance Studios',
    recommendedSolution: 'Member Attendance & Fee Renewal Management App',
    popularFeatures: ['QR Check-In at Door', 'Automated Due Date Alerts', 'Trainer Slot Booking', 'Workout & Diet Log'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'coaching',
    categoryNumber: '05',
    name: 'Coaching & Tuition',
    iconName: 'GraduationCap',
    shortDesc: 'Entrance Exam Centers, Private Tutors & Academic Institutes',
    recommendedSolution: 'Student Portal + Online Fee Payment & Test Result Platform',
    popularFeatures: ['Batch & Attendance Tracking', 'Test Score SMS Dispatch', 'Study Material PDF Locker', 'Direct Admission Lead Form'],
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'schools',
    categoryNumber: '06',
    name: 'Schools',
    iconName: 'School',
    shortDesc: 'Primary, Secondary, CBSE & State Board Institutions',
    recommendedSolution: 'Institutional Website + Parent-Teacher Communication Portal',
    popularFeatures: ['Online Notice Board', 'Admission Inquiry Management', 'Faculty Directory', 'Academic Calendar & Events'],
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'colleges',
    categoryNumber: '07',
    name: 'Colleges & Universities',
    iconName: 'BookOpen',
    shortDesc: 'Degree Colleges, Technical Institutes & Polytechnic Centers',
    recommendedSolution: 'Enterprise Academic Portal + Department Management Suite',
    popularFeatures: ['Department Course Finder', 'Placement Cell Highlights', 'Online Fee Counter', 'Campus Virtual Tour'],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'ecommerce',
    categoryNumber: '08',
    name: 'E-commerce Stores',
    iconName: 'ShoppingCart',
    shortDesc: 'Direct-to-Consumer Brands, Wholesalers & Niche Merchants',
    recommendedSolution: 'High-Converting Online Storefront + UPI Gateway Integration',
    popularFeatures: ['Fast Checkout Flow', 'Inventory Synchronizer', 'Automated Courier Tracking', 'Customer Review Hub'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'healthcare',
    categoryNumber: '09',
    name: 'Healthcare & Clinics',
    iconName: 'HeartPulse',
    shortDesc: 'Diagnostic Labs, Dental Clinics, Pharmacies & Specialists',
    recommendedSolution: 'Doctor Appointment Booking Platform + Report Delivery Portal',
    popularFeatures: ['Instant Slot Confirmation', 'Prescription Upload System', 'WhatsApp Report Link', 'Clinic Timings Display'],
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'realestate',
    categoryNumber: '10',
    name: 'Real Estate',
    iconName: 'Building2',
    shortDesc: 'Property Developers, Brokers, Builders & Rental Agencies',
    recommendedSolution: 'Property Listing Showcase + AI Lead Generation Assistant',
    popularFeatures: ['Filter by Budget & Locality', 'Floor Plan High-Res Viewer', 'Lead Qualification Bot', 'Site Visit Scheduling'],
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'ngo',
    categoryNumber: '11',
    name: 'NGOs & Trusts',
    iconName: 'HandHeart',
    shortDesc: 'Charitable Trusts, Social Foundations & Community Groups',
    recommendedSolution: 'Transparent Trust Portal + Online Donation Collection Gateway',
    popularFeatures: ['80G Receipt Automation', 'Impact Stories Showcase', 'Volunteer Registration Form', 'Financial Transparency Reports'],
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'services',
    categoryNumber: '12',
    name: 'Service Businesses',
    iconName: 'Wrench',
    shortDesc: 'Electricians, Plumbers, AC Repair, Cleaning & Maintenance Firms',
    recommendedSolution: 'On-Demand Service Booking App + Technician Dispatch Portal',
    popularFeatures: ['Job Allocation to Staff', 'Customer Rate Card & Estimates', 'Job Completion Photos', 'Payment Collection Receipts'],
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'local',
    categoryNumber: '13',
    name: 'Portfolio & Creative',
    iconName: 'Palette',
    shortDesc: 'Photographers, Freelancers, Designers & Creative Professionals',
    recommendedSolution: 'Stunning Digital Portfolio + Multi-Media Gallery & Contact Module',
    popularFeatures: ['High-Res Image Carousel', 'Dynamic Work Categories', 'Direct WhatsApp Enquiry', 'Client Testimonial Board'],
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'startups',
    categoryNumber: '14',
    name: 'Startups & SaaS',
    iconName: 'Rocket',
    shortDesc: 'Early-Stage Ventures, SaaS Founders & Tech Innovators',
    recommendedSolution: 'Custom MVP Web & Mobile App + Business AI Assistant',
    popularFeatures: ['Rapid Prototype Deployment', 'Scalable Cloud Architecture', 'User Analytics Pipeline', 'Investor Pitch Deck Demo'],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'growing',
    categoryNumber: '15',
    name: 'Corporate & Agencies',
    iconName: 'TrendingUp',
    shortDesc: 'Expanding Mid-Market Enterprises & Multi-Branch Businesses',
    recommendedSolution: 'Custom ERP & Multi-Branch Central Operations Management',
    popularFeatures: ['Multi-Branch Synchronization', 'Staff Role Management', 'Custom Financial Reports', 'Enterprise Data Security'],
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80'
  }
];

export const HOW_WE_WORK_STEPS: WorkStep[] = [
  {
    number: '01',
    title: 'Understand',
    desc: 'We understand your business, goals and requirements.',
    detail: 'We begin with an in-depth requirement analysis. We study your day-to-day operations, customer journey, target audience, and precise operational pain points to map out the ideal technical scope.',
    iconName: 'Search'
  },
  {
    number: '02',
    title: 'Design',
    desc: 'We create the structure and user experience.',
    detail: 'Our design philosophy balances modern aesthetics with practical clarity. We craft wireframes, clean interactive UI layouts, and intuitive workflows that make digital interaction effortless for your users.',
    iconName: 'PenTool'
  },
  {
    number: '03',
    title: 'Build',
    desc: 'We develop and integrate the required features.',
    detail: 'We build your solution using modern, secure, and production-tested technologies. Every component is rigorously tested for speed, mobile responsiveness, error handling, and data safety.',
    iconName: 'Code2'
  },
  {
    number: '04',
    title: 'Launch',
    desc: 'We test, deploy and deliver the final digital solution.',
    detail: 'We deploy your platform onto secure cloud servers, configure your custom domain, set up backups, train your team, and provide ongoing technical assistance to ensure smooth operations.',
    iconName: 'Rocket'
  }
];



export const BUSINESS_AI_SHOWCASE = [
  {
    id: 'ai-chat',
    category: 'Business AI Chat Assistant',
    title: '24/7 Website AI Chat Assistant',
    type: 'Website Assistant',
    description: 'AI chatbot trained on your business knowledge base to answer customer questions, share rate cards, capture lead contact details, and seamlessly hand off qualified inquiries to WhatsApp.',
    features: [
      '24/7 Instant Response',
      'Product & Service Information',
      'Lead Collection & Qualification',
      'FAQ Automation',
      'WhatsApp Handoff'
    ],
    sampleInteraction: {
      user: "Hi! What are your pricing plans for custom website development?",
      assistant: "Hello! Our custom business websites start with mobile-optimized designs, SSL security, and WhatsApp integration. May I know your business name and preferred requirements so our team can send you a tailored proposal?"
    }
  },
  {
    id: 'ai-voice',
    category: 'AI Voice Assistant',
    title: 'AI-Powered Voice Receptionist',
    type: 'Voice Receptionist',
    description: 'Smart AI voice agent that answers incoming calls, speaks naturally in English and regional accents, handles common customer questions, and assists with appointment booking.',
    features: [
      'Zero Missed Calls',
      'Natural Accent Synthesis',
      'Appointment Booking',
      'Call Routing & Human Handoff',
      'Instant SMS/WhatsApp Confirmation'
    ],
    sampleInteraction: {
      user: "[Phone Call] Is the doctor available for consultation today at 5 PM?",
      assistant: "Dr. Sharma has an open slot at 5:30 PM today. Should I reserve this appointment for you? Please confirm your full name."
    }
  },
  {
    id: 'ai-support',
    category: 'AI Customer Support',
    title: 'Automated Customer Support Assistant',
    titleBadge: 'Support Engine',
    description: 'Automates customer service inquiries, status lookups, policy questions, and complaint registration with human escalation triggers when required.',
    features: [
      'Automated Ticket Creation',
      'Order & Service Status Tracking',
      'Escalation Protocol for Complex Issues',
      '24/7 Support Coverage'
    ],
    sampleInteraction: {
      user: "I want to track my order status for order #MN-8842.",
      assistant: "Your order #MN-8842 has been dispatched via BlueDart Express (Tracking ID: BL-992314) and is expected to reach you tomorrow by 2 PM."
    }
  },
  {
    id: 'ai-leadgen',
    category: 'AI Lead Generation',
    title: 'AI Visitor Qualification & Lead Assistant',
    type: 'Lead Qualifier',
    description: 'Engages website visitors proactively, qualifies high-intent buyers, collects contact details, and delivers instant notifications to your sales team.',
    features: [
      'Proactive Visitor Engagement',
      'Requirement Qualification',
      'Instant Lead Alert to Sales Team',
      'WhatsApp & Email Synchronization'
    ],
    sampleInteraction: {
      user: "I need a POS software for my retail store.",
      assistant: "Great! Our Retail POS software includes barcode scanning, GST billing, and WhatsApp invoices. How many store branches do you currently manage?"
    }
  },
  {
    id: 'ai-automation',
    category: 'Business Process Automation',
    title: 'Automated Customer Follow-Up & Workflow Engine',
    type: 'Workflow Engine',
    description: 'Automates repetitive business operations like post-service follow-up messages, payment reminders, report generation, and data processing.',
    features: [
      'Automated Payment & Due Reminders',
      'Scheduled Customer Follow-ups',
      'Automated Daily/Weekly Reports',
      'Multi-Tool Workflow Triggering'
    ],
    sampleInteraction: {
      user: "[System Event] Subscription due in 3 days for Client #402",
      assistant: "[Automated Action] Sent personalized WhatsApp reminder with UPI payment link to client, logged status in CRM."
    }
  },
  {
    id: 'custom-ai',
    category: 'Custom Business AI',
    title: 'Tailored Enterprise AI Agent & Knowledge Base',
    type: 'Private Business Agent',
    description: 'Custom AI architecture engineered for your unique workflow, internal staff knowledge search, document analysis, and industry-specific automation.',
    features: [
      'Private Encrypted Knowledge Base',
      'Custom Internal Staff Assistant',
      'Document Parsing & Analytics',
      'Industry-Specific API Integration'
    ],
    sampleInteraction: {
      user: "[Staff Member] What is our refund policy for annual software maintenance?",
      assistant: "According to clause 4.2 of the Enterprise Agreement, annual maintenance contracts are refundable within 14 days of activation subject to a 5% administrative fee."
    }
  }
];
