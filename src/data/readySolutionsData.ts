import { ReadySolutionItem } from '../types';

export const READY_SOLUTIONS_CATEGORIES = [
  'All',
  'Schools',
  'Hospitals',
  'Restaurants',
  'Retail',
  'Gyms',
  'Salons',
  'Coaching',
  'NGO',
  'Business',
  'Other'
];

export const INITIAL_READY_SOLUTIONS: ReadySolutionItem[] = [
  {
    id: 'RS-2026-001',
    title: 'Smart School Management ERP System',
    slug: 'smart-school-management-erp-system',
    category: 'Schools',
    shortDescription: 'Complete school operating software with student admissions, fee collection, attendance biometric, report cards, and parent mobile app.',
    fullDescription: 'MANI Solution\'s Smart School ERP is a comprehensive, cloud-ready software platform engineered to digitize every administrative and academic workflow of modern schools and educational institutions. From automated fee reminders on WhatsApp to biometric student/staff attendance, examination grading, and GPS bus tracking, it centralizes complete institution management into one intuitive dashboard.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Automated Online Fee Collection & Instant WhatsApp Receipts',
      'Biometric & RFID Student & Staff Attendance Tracking',
      'CBSE/ICSE/State Board Compliant Report Card Generator',
      'Dedicated Parent & Student Mobile App (Android/iOS)',
      'Digital Timetable, Homework & Live Notice Board',
      'Library Management & GPS Vehicle Fleet Tracking'
    ],
    benefits: [
      'Save 80+ hours of monthly manual administrative paper work',
      'Eliminate fee payment delays with automated SMS/WhatsApp reminders',
      'Real-time transparency between parents, teachers, and school management',
      'Zero-data loss cloud backup with role-based staff access controls'
    ],
    technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS Cloud', 'WhatsApp Business API'],
    suitableFor: ['K-12 Schools', 'Play Schools & Daycares', 'High Schools', 'Colleges & Educational Trusts'],
    price: 'Starting from ₹24,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 1,
    demoUrl: 'https://demo.manisolution.com/school-erp',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'RS-2026-002',
    title: 'Hospital & Multi-Specialty Clinic Suite',
    slug: 'hospital-clinic-management-suite',
    category: 'Hospitals',
    shortDescription: 'Integrated healthcare software with OPD/IPD registration, doctor appointment scheduling, digital prescription (EMR), and pharmacy billing.',
    fullDescription: 'Our Hospital & Multi-Specialty Clinic Management Suite is an enterprise-grade healthcare automation tool. It streamlines patient registration, bed management, doctor appointment tokens, Electronic Medical Records (EMR), lab pathology test reporting, and pharmacy inventory billing with GST compliance.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'OPD/IPD Registration & Live Token Display Queue',
      'Electronic Medical Records (EMR) & Digital Prescription Pad',
      'Pathology & Diagnostic Lab Test Reporting Module',
      'In-House Pharmacy Billing with Drug Batch & Expiry Tracking',
      'Doctor Consultation Schedule & WhatsApp Appointment Booking',
      'Insurance TPA Claim Management & GST Hospital Billing'
    ],
    benefits: [
      'Reduce patient waiting time by up to 60% with smart queue system',
      'Instant access to complete patient medical history and lab reports',
      'Prevent medicine expiry wastage with automatic inventory alerts',
      'HIPAA & NABH compliant data privacy and encrypted storage'
    ],
    technology: ['Next.js', 'Python FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    suitableFor: ['Multi-Specialty Hospitals', 'Polyclinics', 'Diagnostic Centers', 'Dental & Eye Clinics'],
    price: 'Starting from ₹34,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 2,
    demoUrl: 'https://demo.manisolution.com/hospital-suite',
    createdAt: '2026-08-19T11:30:00.000Z'
  },
  {
    id: 'RS-2026-003',
    title: 'Smart Restaurant POS & QR Digital Menu',
    slug: 'smart-restaurant-pos-qr-menu',
    category: 'Restaurants',
    shortDescription: 'High-speed touch POS billing, contactless table QR ordering, Kitchen Display System (KDS), table management, and raw material inventory.',
    fullDescription: 'Built specifically for fine dining, cafes, QSRs, cloud kitchens, and bakeries. Customers can scan table QR codes to browse the digital menu and order, while waitstaff and cashiers process orders seamlessly with automated KOT printing, split billing, Zomato/Swiggy integration, and inventory recipe costing.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Dynamic Contactless Table QR Code Digital Menu & Ordering',
      'Split-Second Touch Billing & Thermal Receipt / KOT Printer Support',
      'Real-Time Kitchen Order Display System (KDS)',
      'Live Table Floor Map with Occupancy & Reservation Status',
      'Recipe-Level Raw Ingredient Inventory & Low-Stock Alerts',
      'Swiggy / Zomato Order Aggregation & Delivery Partner Tracking'
    ],
    benefits: [
      'Increase table turnover speed by 35% with instant QR ordering',
      'Eliminate order miscommunications between waiters and the kitchen',
      'Track food costs, wastage, and gross margins accurately',
      'Works smoothly offline and syncs automatically when internet returns'
    ],
    technology: ['React Native', 'Node.js', 'SQLite', 'WebSockets', 'Thermal Print SDK'],
    suitableFor: ['Fine Dining Restaurants', 'Cafes & Bakeries', 'Fast Food & QSR Chains', 'Cloud Kitchens & Pubs'],
    price: 'Starting from ₹14,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 3,
    demoUrl: 'https://demo.manisolution.com/restaurant-pos',
    createdAt: '2026-08-18T14:15:00.000Z'
  },
  {
    id: 'RS-2026-004',
    title: 'Retail & Supermarket Billing & Inventory POS',
    slug: 'retail-supermarket-billing-inventory-pos',
    category: 'Retail',
    shortDescription: 'Lightning-fast barcode billing software with multi-store inventory sync, customer loyalty points, GST invoicing, and supplier purchase orders.',
    fullDescription: 'Designed for grocery stores, supermarkets, apparel boutiques, electronic stores, and hardware outlets. Supports barcode scanners, electronic weighing scales, instant GST invoice printing, customer loyalty reward points, and automated supplier reorders.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Fast 1D/2D Barcode Scanning & Custom Barcode Label Printing',
      'Integrated Electronic Weighing Scale Interface',
      'Multi-Store Real-Time Centralized Inventory Tracking',
      'GST Compliant B2B & B2C Invoicing with E-Way Bill Ready Export',
      'Customer Loyalty Points, Cashbacks & Promotional Discount Engine',
      'Vendor Purchase Orders, Stock Inward & Dead-Stock Analytics'
    ],
    benefits: [
      'Bill up to 5 items per second during peak supermarket rush hours',
      'Zero stock discrepancies with real-time audit logs',
      'Boost repeat customer visits through automatic WhatsApp offer campaigns',
      'Multi-user cashier shift closing reports with cash drawer reconciliation'
    ],
    technology: ['Electron.js', 'React', 'Node.js', 'PostgreSQL', 'Thermal POS'],
    suitableFor: ['Supermarkets & Groceries', 'Apparel & Footwear Stores', 'Electronics & Hardware', 'Wholesale Distributors'],
    price: 'Starting from ₹18,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 4,
    demoUrl: 'https://demo.manisolution.com/retail-pos',
    createdAt: '2026-08-17T09:45:00.000Z'
  },
  {
    id: 'RS-2026-005',
    title: 'Gym & Fitness Club Membership & Attendance CRM',
    slug: 'gym-fitness-club-membership-crm',
    category: 'Gyms',
    shortDescription: 'Fitness center CRM with biometric fingerprint / QR check-in, automated membership renewal reminders, trainer allocation, and diet plans.',
    fullDescription: 'All-in-one gym and health club management platform. Handle new member registrations, automated membership expiration notices on WhatsApp, biometric turnstile integration, personal trainer bookings, workout plans, and supplement store point of sale.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Biometric Fingerprint & QR Code Member Access Control',
      'Automated WhatsApp Membership Expiry & Renewal Alerts',
      'Personal Trainer Booking & Commission Tracking',
      'Member Mobile App for Workout Logs, Diet Plans & Attendance',
      'In-House Supplement & Beverage Billing POS',
      'Daily Footfall Analytics & Member Retention Reports'
    ],
    benefits: [
      'Increase membership renewals by 40% with automated follow-ups',
      'Prevent unauthorized entry with integrated biometric turnstiles',
      'Empower trainers to assign interactive digital workout routines',
      'Track complete financial health and daily cash/UPI collections'
    ],
    technology: ['Flutter', 'Node.js', 'MongoDB', 'Biometric SDK', 'Razorpay Payment Gateway'],
    suitableFor: ['Gyms & Fitness Centers', 'Yoga & Pilates Studios', 'CrossFit Boxes', 'Sports & Martial Arts Academies'],
    price: 'Starting from ₹12,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 5,
    demoUrl: 'https://demo.manisolution.com/gym-crm',
    createdAt: '2026-08-16T16:20:00.000Z'
  },
  {
    id: 'RS-2026-006',
    title: 'Luxury Salon & Spa Booking & Stylist CRM',
    slug: 'luxury-salon-spa-booking-crm',
    category: 'Salons',
    shortDescription: 'Modern salon booking platform with online client appointment scheduling, stylist commission tracking, service packages, and SMS reminders.',
    fullDescription: 'Designed for beauty parlours, luxury hair salons, spas, and aesthetic wellness clinics. Provides a branded online booking page for customers, real-time stylist calendar scheduling, inventory tracking for beauty products, and client treatment history.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      '24/7 Online Client Self-Booking Portal with Stylist Choice',
      'Smart Appointment Calendar with Drag-and-Drop Rescheduling',
      'Automated SMS & WhatsApp Appointment Reminders (Zero No-Shows)',
      'Stylist & Beautician Performance & Commission Calculator',
      'Service Packages, Prepaid Memberships & Gift Vouchers',
      'Salon Product Consumption & Retail Shelf Stock Management'
    ],
    benefits: [
      'Eliminate missed calls and scheduling double-bookings',
      'Cut customer no-show rates by up to 75% via automated alerts',
      'Calculate complex stylist commissions automatically with one click',
      'Build client loyalty with personalized birthday wishes and offers'
    ],
    technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Twilio/SMS API'],
    suitableFor: ['Hair Salons & Barbershops', 'Luxury Spas & Wellness Centers', 'Nail & Lash Studios', 'Skin & Aesthetic Clinics'],
    price: 'Starting from ₹11,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: true,
    homepagePriority: 6,
    demoUrl: 'https://demo.manisolution.com/salon-spa',
    createdAt: '2026-08-15T12:00:00.000Z'
  },
  {
    id: 'RS-2026-007',
    title: 'Coaching & Tuition Institute LMS & Student App',
    slug: 'coaching-tuition-institute-lms',
    category: 'Coaching',
    shortDescription: 'Complete institute platform with live video classes, recorded lectures, online test series (MCQ/Subjective), attendance, and fee tracking.',
    fullDescription: 'Customizable learning management platform designed for competitive exam coaching centers (IIT-JEE, NEET, UPSC, SSC), tuition academies, and private tutors. Includes an encrypted video lecture library to prevent piracy, an online test engine with instant rank analysis, student attendance, and fee receipt management.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'DRM-Encrypted Video Lectures (Anti-Screen Recording & Watermarked)',
      'Online CBT Test Series Engine with Detailed Negative Marking & Ranks',
      'Batch-Wise Student Attendance & Live Class Scheduling',
      'PDF Notes, Assignments & Digital Study Material Locker',
      'Integrated Online Fee Payment Gateway with Installment Tracking',
      'Dedicated Android & iOS Mobile App with Institute Branding'
    ],
    benefits: [
      'Scale from offline batches to thousands of online students across India',
      'Protect valuable lecture content with enterprise-grade DRM video security',
      'Provide instant performance benchmarks and analytics to students & parents',
      'Manage multiple batches and branch locations seamlessly'
    ],
    technology: ['React Native', 'Node.js', 'AWS S3', 'Cloudflare Stream', 'PostgreSQL'],
    suitableFor: ['IIT-JEE & NEET Coaching', 'UPSC & Government Exam Academies', 'Private Tuition Centers', 'Skill Training Institutes'],
    price: 'Starting from ₹21,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: false,
    homepagePriority: 7,
    demoUrl: 'https://demo.manisolution.com/coaching-lms',
    createdAt: '2026-08-14T09:15:00.000Z'
  },
  {
    id: 'RS-2026-008',
    title: 'NGO & Trust Donation & Volunteer Portal',
    slug: 'ngo-trust-donation-volunteer-portal',
    category: 'NGO',
    shortDescription: 'Transparent charity platform with 80G tax exemption receipt generation, recurring donation gateway, donor CRM, and campaign tracking.',
    fullDescription: 'Empowers non-profits, charitable trusts, and community foundations to raise funds efficiently and manage social impact programs. Features instant 80G tax receipt PDF generation upon donation, campaign progress milestones, volunteer management, and transparent expense accountability reports.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'One-Time & Monthly Recurring Online Donation Engine (UPI / Cards / Net Banking)',
      'Automated 80G Compliant Tax Exemption Receipt Generation (PDF)',
      'Live Crowdfunding & Cause Campaign Progress Trackers',
      'Comprehensive Donor CRM with Giving History & Thank-You Letters',
      'Volunteer Registration, Event Scheduling & Certificate Issuance',
      'Annual Impact Report & Project Fund Utilization Transparency Portal'
    ],
    benefits: [
      'Double online donations through trustworthy and friction-free payment flows',
      'Automate compliance with automated tax receipt dispatch to donors via email',
      'Maintain strong long-term relationships with domestic and CSR corporate donors',
      'Fully responsive portal customized with the NGO\'s branding and mission'
    ],
    technology: ['Next.js', 'Tailwind CSS', 'Node.js', 'Razorpay/Stripe', 'PDFKit'],
    suitableFor: ['Charitable Trusts', 'Non-Governmental Organizations (NGOs)', 'Religious & Social Foundations', 'Animal Welfare Shelters'],
    price: 'Starting from ₹15,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: false,
    homepagePriority: 8,
    demoUrl: 'https://demo.manisolution.com/ngo-portal',
    createdAt: '2026-08-13T15:00:00.000Z'
  },
  {
    id: 'RS-2026-009',
    title: 'Real Estate Property & Lead CRM Portal',
    slug: 'real-estate-property-lead-crm',
    category: 'Business',
    shortDescription: 'High-conversion real estate website with interactive property listings, agent lead distribution, site visit bookings, and WhatsApp enquiry alerts.',
    fullDescription: 'Turnkey digital solution for real estate builders, property developers, and brokerage agencies. Includes interactive property search with maps and virtual tours, lead capture funnels connected directly to sales agents via WhatsApp, automated follow-up scheduling, and commission tracking.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Interactive Property Filter (Location, BHK, Price, Ready/Under-Construction)',
      'High-Resolution Image Galleries, Video Walkthroughs & Floor Plans',
      'Instant Lead Capture & Automatic Round-Robin Agent Assignment',
      'Site Visit Scheduling & Automated WhatsApp Calendar Reminders',
      'Lead Status Pipeline (New Lead → Contacted → Site Visit → Booking)',
      'Agent Commission, Broker Network & Inventory Unit Availability Grid'
    ],
    benefits: [
      'Capture 3x more qualified buyer and tenant inquiries',
      'Prevent lead leakage with instant automated WhatsApp alerts to agents',
      'Present luxury residential and commercial projects with modern design',
      'Track sales agent closing performance and pipeline velocity'
    ],
    technology: ['React', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'WhatsApp Cloud API'],
    suitableFor: ['Real Estate Developers', 'Property Brokerage Firms', 'Commercial Leasing Agencies', 'Plotting & Township Builders'],
    price: 'Starting from ₹26,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: false,
    homepagePriority: 9,
    demoUrl: 'https://demo.manisolution.com/real-estate-crm',
    createdAt: '2026-08-12T11:20:00.000Z'
  },
  {
    id: 'RS-2026-010',
    title: 'Hotel, Resort & Homestay Direct Booking Engine',
    slug: 'hotel-resort-booking-engine',
    category: 'Business',
    shortDescription: 'Zero-commission direct booking website with room calendar availability, seasonal pricing, add-on packages, and automated guest confirmation.',
    fullDescription: 'Empowers boutique hotels, luxury resorts, homestays, and bed & breakfasts to accept direct guest reservations without paying high OTA commissions (MakeMyTrip, Booking.com, Airbnb). Features a real-time room availability matrix, seasonal rate manager, guest check-in vouchers, and online advance payment integration.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop'
    ],
    features: [
      'Interactive Room Availability Calendar & Direct Booking Engine',
      'Dynamic Seasonal Pricing, Weekend Surcharges & Promo Codes',
      'Room Amenities Showcase, Photo Galleries & Local Experience Add-Ons',
      'Automated Guest Booking Confirmation Vouchers with QR Code Check-In',
      'Instant UPI, Credit Card & Net Banking Advance Payment Collection',
      'Front Desk Check-In/Check-Out Management & Housekeeping Tracker'
    ],
    benefits: [
      'Save 15% - 25% in OTA commissions by driving direct guest bookings',
      'Collect 100% advance or partial deposit payments securely',
      'Deliver a 5-star digital guest onboarding experience before arrival',
      'Sync room availability with external channel managers seamlessly'
    ],
    technology: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Razorpay/Stripe'],
    suitableFor: ['Boutique Hotels & Resorts', 'Homestays & Villas', 'Eco-Lodges & Glamping Sites', 'Service Apartments'],
    price: 'Starting from ₹19,999',
    priceType: 'Starting From',
    status: 'published',
    featuredOnHomepage: false,
    homepagePriority: 10,
    demoUrl: 'https://demo.manisolution.com/hotel-booking',
    createdAt: '2026-08-11T13:40:00.000Z'
  }
];
