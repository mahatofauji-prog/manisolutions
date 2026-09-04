import { IndustrySolutionDetail } from '../types';

export const INDUSTRY_SOLUTIONS: IndustrySolutionDetail[] = [
  {
    id: 'retail',
    categoryNumber: '01',
    name: 'Retail Shops',
    tagline: 'High-speed billing, automated inventory control & WhatsApp customer retention for retail outlets.',
    shortDesc: 'Clothing, Electronics, Grocery, Hardware & General Stores',
    fullOverview: 'We engineer turnkey digital solutions for modern retail businesses across India. From lightning-fast barcode POS billing and GST invoicing to automated stock alerts and direct WhatsApp bill delivery, we empower store owners to eliminate billing queues, prevent inventory leakage, and cultivate repeat shoppers.',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    iconName: 'ShoppingBag',
    recommendedSolution: 'POS Billing Software + Digital Product Catalog Website + WhatsApp Automation',
    popularFeatures: [
      'Split-Second Barcode Scanner Compatibility',
      'Low Stock & Expiry Alert Notifications',
      'Instant WhatsApp Invoice & Receipt Dispatch',
      'Daily Profit, Cash Drawer & GST Sales Tracker',
      'Customer Loyalty Reward Points & Cashback Engine',
      'Multi-Counter & Multi-Store Inventory Synchronization'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Retail POS & Inventory Management System',
        description: 'Complete point-of-sale software running smoothly on touch screens, desktops, and handheld POS devices with offline support.',
        capabilities: ['Fast barcode billing', 'Thermal receipt printer integration', 'Purchase order management', 'Daily sales & profit analytics']
      },
      {
        type: 'Website',
        title: 'Digital Storefront & Online Catalog',
        description: 'Mobile-first showcase website allowing neighbourhood customers to browse your complete catalog and order via WhatsApp.',
        capabilities: ['Product categories with high-res photos', 'Instant WhatsApp order button', 'Store address & Google Maps navigation', 'Promotional offer banners']
      },
      {
        type: 'AI & Automation',
        title: 'WhatsApp Marketing & Automated Follow-Up',
        description: 'Intelligent automation that delivers digital bills and sends birthday greetings, renewal reminders, and seasonal discounts.',
        capabilities: ['Automated PDF bill dispatch on WhatsApp', 'Festival offer broadcast engine', 'Inactive customer win-back alerts']
      }
    ],
    businessBenefits: [
      'Reduce customer checkout time by up to 70% during peak rush hours',
      'Eliminate inventory discrepancies and stock loss with real-time tracking',
      'Increase customer repeat rate by delivering paperless bills with WhatsApp offers',
      'Generate 100% compliant GST B2B/B2C invoices in a single click'
    ],
    technologies: ['React', 'Electron.js', 'Node.js', 'PostgreSQL', 'Thermal POS SDK', 'WhatsApp Cloud API'],
    suitableFor: ['Clothing & Apparel Stores', 'Electronics & Mobile Shops', 'Supermarkets & Groceries', 'Hardware & Sanitaryware Outlets', 'Footwear Showrooms'],
    readySolutionCategories: ['Retail']
  },
  {
    id: 'restaurant',
    categoryNumber: '02',
    name: 'Restaurants & Cafes',
    tagline: 'Contactless QR menus, Kitchen Order Ticketing (KOT) & integrated table management.',
    shortDesc: 'Dine-In, Fast Food, Cloud Kitchens & Bakery Outlets',
    fullOverview: 'Designed specifically for restaurants, cafes, cloud kitchens, and bakeries. Our custom food & beverage technology streamlines everything from contactless table ordering to high-speed kitchen order printing, bill splitting, and customer feedback collection.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Utensils',
    recommendedSolution: 'Contactless QR Menu + Kitchen Order Ticketing (KOT) System + Takeaway Portal',
    popularFeatures: [
      'Table-Side QR Code Ordering with Live Menu Sync',
      'Instant Kitchen Order Ticket (KOT) Printing & Kitchen Display',
      'Parcel, Takeaway & Delivery Partner Order Aggregator',
      'Dynamic Table Floor Map with Occupancy Status',
      'Ingredient-Level Inventory & Recipe Costing',
      'Automated Feedback Collection & Google Review Booster'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Restaurant POS & Kitchen Display (KDS)',
        description: 'High-speed order taking interface with automated kitchen routing, split bills, and raw material stock tracking.',
        capabilities: ['One-touch order punches', 'Thermal KOT printer support', 'Inventory recipe deduction', 'Cashier shift reports']
      },
      {
        type: 'Website',
        title: 'Interactive QR Menu & Direct Ordering Website',
        description: 'Beautiful digital menu accessible by scanning table QR codes without needing to download any heavy app.',
        capabilities: ['Photo menu with chef specials', 'Dietary filter tags (Veg/Non-Veg/Jain)', 'Direct table ordering', 'UPI payment integration']
      },
      {
        type: 'Mobile App',
        title: 'Captain / Waiter Mobile Order App',
        description: 'Handheld Android app for waitstaff to punch orders directly at the table with zero mistakes.',
        capabilities: ['Instant table order entry', 'Special cooking instructions entry', 'Live bill preview for guests']
      }
    ],
    businessBenefits: [
      'Increase table turnover speed by 35% with contactless QR ordering',
      'Prevent order errors and misplaced kitchen tickets completely',
      'Monitor real-time food cost margins and eliminate raw material wastage',
      'Collect verified customer phone numbers for festival marketing'
    ],
    technologies: ['React', 'Node.js', 'WebSockets', 'SQLite', 'Thermal Print SDK', 'Tailwind CSS'],
    suitableFor: ['Fine Dining Restaurants', 'Cafes & Bistro Outlets', 'Quick Service (QSR) Chains', 'Cloud & Ghost Kitchens', 'Bakeries & Sweet Shops'],
    readySolutionCategories: ['Restaurants']
  },
  {
    id: 'salon',
    categoryNumber: '03',
    name: 'Beauty & Salon',
    tagline: 'Stylist appointment scheduling, automated SMS reminders & client treatment records.',
    shortDesc: 'Hair Studios, Unisex Salons, Spas & Beauty Parlours',
    fullOverview: 'We help salon owners, luxury spas, and aesthetic clinics modernize client bookings, manage busy stylist calendars, track cosmetic product inventory, and eliminate no-shows with automated WhatsApp appointment confirmations.',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Scissors',
    recommendedSolution: 'Automated Slot Booking App + Business AI Assistant + Stylist CRM',
    popularFeatures: [
      '24/7 Online Client Self-Booking with Stylist Choice',
      'Automated WhatsApp Appointment Confirmation & Reminders',
      'Stylist Commission & Performance Calculator',
      'Membership Packages, Prepaid Passbooks & Gift Vouchers',
      'Client Service History & Preferences Log',
      'Salon Retail Shelf & Consumption Stock Management'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Salon Front-Desk Billing & Stylist CRM',
        description: 'Central management console to manage appointment slots, calculate stylist commissions, and bill services.',
        capabilities: ['Interactive calendar schedule', 'Service rate card manager', 'Commission payouts engine', 'GST billing with discounts']
      },
      {
        type: 'Website',
        title: 'Brand Portfolio & Online Booking Portal',
        description: 'Elegant website showcasing your haircut styles, bridal packages, and price list with an instant booking calendar.',
        capabilities: ['Lookbook gallery with high-res photos', 'Stylist portfolio showcase', 'Service rate card', 'Instant booking with OTP']
      },
      {
        type: 'AI & Automation',
        title: 'AI Appointment Assistant & Birthday Reminders',
        description: 'Smart AI chatbot answering customer service queries, sharing prices, and sending anniversary & birthday greetings.',
        capabilities: ['Automated WhatsApp booking bot', 'Zero no-show reminder engine', 'Client review follow-up']
      }
    ],
    businessBenefits: [
      'Cut appointment no-show rates by up to 75% via automated alerts',
      'Calculate complex stylist commissions automatically with one click',
      'Give clients a seamless 24/7 online booking experience',
      'Build long-term loyalty with prepaid package tracking'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Twilio / SMS Gateway', 'WhatsApp API'],
    suitableFor: ['Hair Salons & Barbershops', 'Luxury Spas & Wellness Retreats', 'Bridal Makeup Studios', 'Nail & Lash Lounges', 'Skin & Aesthetic Clinics'],
    readySolutionCategories: ['Salons']
  },
  {
    id: 'fitness',
    categoryNumber: '04',
    name: 'Gyms & Fitness',
    tagline: 'Biometric access control, automated fee renewals & member workout progress trackers.',
    shortDesc: 'Gymnasiums, Yoga Centers, CrossFit Boxes & Dance Studios',
    fullOverview: 'We empower fitness centers, yoga studios, and athletic clubs with cutting-edge membership management software. Keep track of active memberships, automate fee renewal reminders on WhatsApp, integrate biometric turnstiles, and offer member apps.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Dumbbell',
    recommendedSolution: 'Member Attendance & Fee Renewal CRM + Member Mobile App',
    popularFeatures: [
      'Biometric Fingerprint & QR Code Check-In at Door',
      'Automated WhatsApp Membership Expiry & Payment Alerts',
      'Trainer Slot Booking & PT Commission Tracking',
      'Dedicated Member Mobile App for Workout & Diet Plans',
      'Supplement & Energy Drink In-House Billing POS',
      'Footfall Analytics & Inactive Member Retention Alerts'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Gym Management CRM & Front Desk POS',
        description: 'All-in-one desktop and cloud portal for member admissions, fee installment tracking, and financial reporting.',
        capabilities: ['Biometric turnstile hardware sync', 'Automated fee receipts', 'Expense tracker', 'Trainer commission reports']
      },
      {
        type: 'Mobile App',
        title: 'Member Mobile App (Android / iOS)',
        description: 'Empowers members to view digital membership ID cards, log daily workouts, check attendance, and renew fees online.',
        capabilities: ['Digital QR access card', 'Trainer workout plans', 'Online fee payment with UPI', 'Push notifications for events']
      },
      {
        type: 'Website',
        title: 'Fitness Studio Brand & Lead Magnet Website',
        description: 'High-energy website showcasing your equipment, certified trainers, pricing packages, and free trial pass booking.',
        capabilities: ['Free 1-Day trial pass lead form', 'Facility & equipment photo tour', 'Trainer profiles & certifications', 'Interactive class schedule']
      }
    ],
    businessBenefits: [
      'Increase membership renewals by 40% with automated WhatsApp alerts',
      'Prevent unpaid entry with strict biometric gate access synchronization',
      'Provide a modern digital experience that beats competing local gyms',
      'Track monthly cash flow, pending dues, and trainer productivity effortlessly'
    ],
    technologies: ['Flutter', 'React', 'Node.js', 'MongoDB', 'Biometric Hardware SDK', 'Razorpay UPI'],
    suitableFor: ['Strength & Cardio Gyms', 'Yoga & Pilates Studios', 'CrossFit & Functional Training Boxes', 'Dance & Martial Arts Academies'],
    readySolutionCategories: ['Gyms']
  },
  {
    id: 'coaching',
    categoryNumber: '05',
    name: 'Coaching & Tuition',
    tagline: 'Student batch management, online test engine & automated fee due alerts.',
    shortDesc: 'Entrance Exam Centers, Private Tutors & Academic Institutes',
    fullOverview: 'Purpose-built for competitive exam coaching institutes (IIT-JEE, NEET, UPSC, SSC), tuition centers, and skill training academies. Centralize student enrollment, batch scheduling, encrypted video lectures, online CBT test series, and parental attendance notifications.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    iconName: 'GraduationCap',
    recommendedSolution: 'Student Portal + Online CBT Test Series & Anti-Piracy Lecture Platform',
    popularFeatures: [
      'Batch-Wise Student Attendance & Instant Absent SMS to Parents',
      'Online CBT Test Series Engine with Negative Marking & Ranks',
      'DRM-Encrypted Anti-Screen Recording Video Lecture Locker',
      'Automated Installment Fee Reminders with UPI Payment Links',
      'PDF Study Material, Notes & Homework Distribution Portal',
      'Direct WhatsApp Admission Lead Capture Widget'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Institute Administration & Fee Management Portal',
        description: 'Comprehensive administrative dashboard to manage batches, track student payments, and generate report cards.',
        capabilities: ['Batch allocation', 'Fee receipt generation', 'SMS / WhatsApp notification triggers', 'Staff salary & payroll']
      },
      {
        type: 'Mobile App',
        title: 'Student & Parent Learning App',
        description: 'Branded mobile application for students to watch lectures, attempt online tests, view results, and submit doubts.',
        capabilities: ['Video lecture player', 'Online MCQ practice tests', 'Leaderboard & performance analytics', 'Doubt clearing forum']
      },
      {
        type: 'Website',
        title: 'Institute Showcase & Online Admission Website',
        description: 'Trust-building website showcasing toppers, faculty achievements, courses offered, and online inquiry registration.',
        capabilities: ['Topper gallery & testimonial videos', 'Course curriculum explorer', 'Downloadable prospectus', 'Direct admission inquiry form']
      }
    ],
    businessBenefits: [
      'Scale your teaching beyond physical classrooms to students across the country',
      'Protect your valuable study materials with secure encrypted video streaming',
      'Automate fee collection and eliminate uncomfortable manual payment follow-ups',
      'Keep parents informed with real-time test scores and attendance updates'
    ],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Cloudflare Stream', 'AWS S3', 'Tailwind CSS'],
    suitableFor: ['IIT-JEE & NEET Coaching', 'UPSC & Government Job Prep Centers', 'Private Tuition Classes', 'Language & Skill Training Institutes'],
    readySolutionCategories: ['Coaching']
  },
  {
    id: 'schools',
    categoryNumber: '06',
    name: 'Schools',
    tagline: 'Complete school operating ERP, biometric attendance, report cards & parent mobile apps.',
    shortDesc: 'Primary, Secondary, CBSE & State Board Institutions',
    fullOverview: 'We provide end-to-end digital transformation for modern K-12 schools, play schools, and educational trusts. From online admissions and automated fee receipts to biometric teacher/student attendance, report card generation, and live GPS bus tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    iconName: 'School',
    recommendedSolution: 'Smart School Management ERP + Parent Mobile App + Official School Website',
    popularFeatures: [
      'Automated Fee Collection with Instant WhatsApp Receipts',
      'Biometric & RFID Student & Staff Attendance System',
      'CBSE / ICSE / State Board Compliant Report Card Generator',
      'Dedicated Parent & Student Mobile App (Android & iOS)',
      'Digital Timetable, Daily Homework & Live Notice Board',
      'GPS School Bus Fleet Tracking & Library Manager'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Enterprise School ERP Dashboard',
        description: 'Central cloud software connecting the Principal, administration office, teachers, and account department.',
        capabilities: ['Student information management', 'Examination grading & marksheets', 'Staff payroll & biometric logs', 'Inventory & library modules']
      },
      {
        type: 'Mobile App',
        title: 'Parent & Teacher Communication App',
        description: 'Enables parents to track daily attendance, view homework, pay school fees, and receive emergency circulars.',
        capabilities: ['Instant push circulars', 'Online fee payment gateway', 'Live bus tracking map', 'Teacher direct messaging']
      },
      {
        type: 'Website',
        title: 'Official School Portal & Admission Website',
        description: 'Prestigious institutional website showcasing campus infrastructure, academic achievements, events, and admission forms.',
        capabilities: ['Virtual campus tour', 'Mandatory public disclosures page', 'Online admission application flow', 'Annual calendar & sports highlights']
      }
    ],
    businessBenefits: [
      'Save 80+ hours of monthly manual administrative paper work for office staff',
      'Eliminate fee collection delays with automated WhatsApp notifications',
      'Establish modern transparency and trust between parents and management',
      'Zero-data loss with automated daily cloud backups'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS Cloud', 'WhatsApp Business API'],
    suitableFor: ['K-12 Private Schools', 'Play Schools & Daycares', 'CBSE & ICSE Affiliated Institutions', 'Educational Trusts & Groups'],
    readySolutionCategories: ['Schools']
  },
  {
    id: 'colleges',
    categoryNumber: '07',
    name: 'Colleges & Universities',
    tagline: 'Enterprise academic management, placement portals & multi-department digital ecosystems.',
    shortDesc: 'Degree Colleges, Technical Institutes & Polytechnic Centers',
    fullOverview: 'Custom software architecture engineered for higher education institutions, degree colleges, technical universities, and polytechnics. Manage semester registrations, university exam results, placement drives, alumni networks, and faculty research.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    iconName: 'BookOpen',
    recommendedSolution: 'Enterprise Academic Management Suite + Placement Cell & Alumni Portal',
    popularFeatures: [
      'Department-Wise Course Finder & Syllabus Repository',
      'Campus Placement Cell with Company Interview Scheduling',
      'Online Semester Fee Counter & Scholarship Processing',
      'Hostel Room Allotment & Mess Attendance Management',
      'Alumni Directory & Networking Platform',
      'Campus Virtual 360° Tour & NAAC Accreditation Data Portal'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'University / College Academic ERP',
        description: 'Scalable campus operating software handling semester credits, faculty workloads, exam controller modules, and transcripts.',
        capabilities: ['Credit system & course registration', 'Internal assessment marks entry', 'Hostel management', 'Faculty research repository']
      },
      {
        type: 'Website',
        title: 'High-Impact University Web Portal',
        description: 'Comprehensive digital home showcasing academic departments, research papers, campus life, admissions, and accreditation.',
        capabilities: ['Department landing pages', 'Admission application funnel', 'Event & seminar calendar', 'NAAC / NBA compliance pages']
      },
      {
        type: 'Software / ERP',
        title: 'Placement & Corporate Relations Portal',
        description: 'Dedicated system for students to upload resumes, apply for campus hiring drives, and track job offers.',
        capabilities: ['Resume parser & student shortlisting', 'Company interview scheduler', 'Offer letter repository', 'Placement statistics charts']
      }
    ],
    businessBenefits: [
      'Digitize thousands of student records across multiple faculties and campuses',
      'Simplify NAAC, NIRF, and government accreditation reporting',
      'Improve campus placement success with centralized recruiter pipelines',
      'Secure alumni donations and industry collaboration'
    ],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
    suitableFor: ['Degree Colleges', 'Engineering & Polytechnic Institutes', 'Medical & Nursing Colleges', 'Universities & Autonomous Campuses'],
    readySolutionCategories: ['Schools', 'Business']
  },
  {
    id: 'ecommerce',
    categoryNumber: '08',
    name: 'E-commerce',
    tagline: 'High-converting online storefronts, UPI checkout & multi-channel inventory sync.',
    shortDesc: 'Direct-to-Consumer Brands, Wholesalers & Niche Merchants',
    fullOverview: 'We design and build bespoke e-commerce experiences tailored to Indian consumers. Featuring split-second page loads, single-tap UPI and Cash-on-Delivery checkout, automated Shiprocket/courier tracking, and abandoned cart recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    iconName: 'ShoppingCart',
    recommendedSolution: 'Custom E-commerce Storefront + Mobile App + Courier Automation',
    popularFeatures: [
      'Lightning-Fast 1-Click UPI & Card Checkout Flow',
      'Automated Courier Integration (Shiprocket / Delhivery)',
      'Multi-Variant Product Catalog with High-Res Zoom',
      'WhatsApp Abandoned Cart & Order Tracking Alerts',
      'Customer Product Reviews, Photos & Ratings Hub',
      'Coupon Codes, BOGO Discounts & Referral Program Engine'
    ],
    modules: [
      {
        type: 'Website',
        title: 'Custom Fast E-Commerce Storefront',
        description: 'Ultra-fast web store built for maximum mobile conversion without recurring high marketplace commission cuts.',
        capabilities: ['Instant search & filter', 'UPI, Card, NetBanking & COD payment', 'Order status tracking', 'Automated GST invoices']
      },
      {
        type: 'Mobile App',
        title: 'Customer Shopping Mobile App (Android / iOS)',
        description: 'Native mobile app with push notifications for flash sales, wishlist syncing, and frictionless repeat orders.',
        capabilities: ['Push notification campaigns', 'Saved addresses & instant reorder', 'In-app wallet & loyalty rewards']
      },
      {
        type: 'AI & Automation',
        title: 'WhatsApp Order & Abandoned Cart Recovery Bot',
        description: 'Automatically sends order confirmation WhatsApp messages and recovers abandoned checkouts with exclusive discount codes.',
        capabilities: ['Abandoned cart WhatsApp trigger', 'Live shipment tracking updates', 'AI customer service chatbot']
      }
    ],
    businessBenefits: [
      'Stop paying 20-35% marketplace commissions on Amazon/Flipkart',
      'Achieve sub-second mobile load times for double the checkout conversions',
      'Own your customer database and build long-term brand equity',
      'Automate shipping label generation and courier pickup schedules'
    ],
    technologies: ['Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Razorpay', 'Shiprocket API', 'Tailwind CSS'],
    suitableFor: ['Fashion & Apparel Brands', 'Jewellery & Accessories', 'Packaged Food & Snacks', 'Electronics & Gadgets', 'Handicraft & Organic Producers'],
    readySolutionCategories: ['Retail', 'Business']
  },
  {
    id: 'healthcare',
    categoryNumber: '09',
    name: 'Healthcare Businesses',
    tagline: 'OPD queue tokens, doctor appointment bookings & digital prescription delivery.',
    shortDesc: 'Diagnostic Labs, Dental Clinics, Pharmacies & Specialists',
    fullOverview: 'We engineer HIPAA and NABH-compliant digital tools for hospitals, multi-specialty clinics, diagnostic pathology labs, and individual doctors. Eliminate crowded waiting rooms with smart queue tokens, digital EMR prescriptions, and automated WhatsApp lab test reports.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    iconName: 'HeartPulse',
    recommendedSolution: 'Clinic Management Suite + Digital Prescription (EMR) + Lab Report Delivery',
    popularFeatures: [
      'OPD / IPD Registration & Live Token Display Queue',
      'Instant WhatsApp Appointment Booking & Reminders',
      'Electronic Medical Records (EMR) & Digital Prescription Pad',
      'Pathology & Diagnostic Test Report Delivery via WhatsApp Link',
      'Pharmacy Billing with Drug Batch & Expiry Tracking',
      'Doctor Consultation Schedule & Telehealth Video Calls'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Hospital & Multi-Specialty Clinic Suite',
        description: 'Comprehensive healthcare operating software for reception, consultation chambers, lab, and pharmacy.',
        capabilities: ['Live OPD token display', 'Digital prescription builder', 'Patient medical history timeline', 'GST medical billing']
      },
      {
        type: 'Website',
        title: 'Doctor / Clinic Trust Website & Booking Portal',
        description: 'Professional medical website showcasing specialist doctors, clinic facilities, treatments offered, and appointment slots.',
        capabilities: ['Doctor profile & qualifications', 'Online slot reservation', 'Clinic timings & Google Maps directions', 'Patient testimonials']
      },
      {
        type: 'AI & Automation',
        title: 'AI Medical Receptionist & Report Dispatcher',
        description: '24/7 AI voice and chat assistant answering patient queries, scheduling visits, and sending test results securely.',
        capabilities: ['Voice appointment booking bot', 'Encrypted PDF report delivery on WhatsApp', 'Post-consultation medicine reminders']
      }
    ],
    businessBenefits: [
      'Reduce clinic waiting room congestion by 60% with live token management',
      'Deliver lab reports directly to patient smartphones without paper waste',
      'Maintain secure, lifelong digital patient medical records',
      'Prevent expired drug wastage in pharmacy inventory with automated alerts'
    ],
    technologies: ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'WhatsApp Cloud API'],
    suitableFor: ['Multi-Specialty Hospitals', 'Polyclinics & Nursing Homes', 'Pathology & Diagnostic Labs', 'Dental & Eye Clinics', 'Pharmacies & Medical Stores'],
    readySolutionCategories: ['Hospitals']
  },
  {
    id: 'realestate',
    categoryNumber: '10',
    name: 'Real Estate',
    tagline: 'Interactive property listings, high-resolution floor plans & automated buyer lead qualification.',
    shortDesc: 'Property Developers, Brokers, Builders & Rental Agencies',
    fullOverview: 'We empower real estate developers, builders, and property brokerage firms with high-converting digital portals. Showcase residential and commercial projects with interactive floor plans, virtual tours, and automated AI lead distribution that sends buyer inquiries directly to sales agents via WhatsApp.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Building2',
    recommendedSolution: 'Property Listing Showcase + AI Lead Generation Assistant + Agent CRM',
    popularFeatures: [
      'Filter Properties by Budget, Locality, BHK & Ready/Under-Construction',
      'High-Resolution Floor Plan & 3D Virtual Walkthrough Viewer',
      'Instant Lead Capture with Automated Sales Agent Assignment',
      'Site Visit Scheduling with WhatsApp Calendar Reminders',
      'Lead Status Pipeline (New Lead → Contacted → Site Visit → Booking)',
      'Broker / Channel Partner Commission & Inventory Matrix'
    ],
    modules: [
      {
        type: 'Website',
        title: 'Luxury Property Showcase & Project Micro-Sites',
        description: 'Stunning property portal showcasing floor plans, drone videos, price breakups, and instant brochure downloads.',
        capabilities: ['Interactive location map & amenities', 'Downloadable project brochure PDF', 'EMI calculator widget', 'Site visit booking calendar']
      },
      {
        type: 'Software / ERP',
        title: 'Real Estate Lead CRM & Inventory Matrix',
        description: 'Central dashboard tracking every buyer inquiry, site visit feedback, booking status, and agent performance.',
        capabilities: ['Lead pipeline kanban board', 'Unit inventory availability grid', 'Channel partner network manager', 'Sales commission reports']
      },
      {
        type: 'AI & Automation',
        title: 'AI Property Inquiry & Qualification Agent',
        description: 'Engages website visitors 24/7, qualifies their budget and location requirements, and routes high-intent buyers to agents.',
        capabilities: ['Automated brochure dispatch on WhatsApp', 'Budget qualification chatbot', 'Instant SMS/WhatsApp lead alert to sales team']
      }
    ],
    businessBenefits: [
      'Capture 3x more qualified buyer and tenant inquiries from your marketing campaigns',
      'Prevent lead leakage with instant automated WhatsApp notifications to agents',
      'Present residential and commercial developments with high aesthetic luxury standards',
      'Track sales agent closing speed and pipeline velocity in real time'
    ],
    technologies: ['React', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'WhatsApp Cloud API', 'Mapbox SDK'],
    suitableFor: ['Real Estate Builders & Developers', 'Property Brokerage Agencies', 'Commercial Leasing Firms', 'Plotting & Township Promoters'],
    readySolutionCategories: ['Business']
  },
  {
    id: 'ngo',
    categoryNumber: '11',
    name: 'Trusts & NGOs',
    tagline: 'Transparent donation collection, instant 80G tax receipts & volunteer management.',
    shortDesc: 'Charitable Trusts, Social Foundations & Community Groups',
    fullOverview: 'We empower non-profits, charitable trusts, social organizations, and religious foundations with transparent, trustworthy digital portals. Accept online donations via UPI and international cards, generate automated 80G tax exemption receipts, and showcase social impact.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    iconName: 'HandHeart',
    recommendedSolution: 'Transparent Trust Portal + Online Donation Gateway + 80G Receipt Engine',
    popularFeatures: [
      'One-Time & Monthly Recurring Online Donation Engine (UPI / Cards)',
      'Automated 80G Tax Exemption Receipt Generation (Instant PDF Download)',
      'Live Crowdfunding & Cause Campaign Progress Trackers',
      'Comprehensive Donor CRM with Giving History & Thank-You Letters',
      'Volunteer Registration, Event Scheduling & Certificate Issuance',
      'Financial Transparency & Annual Impact Reports Portal'
    ],
    modules: [
      {
        type: 'Website',
        title: 'Official NGO Portal & Online Donation Platform',
        description: 'Impactful website highlighting your mission, ground stories, transparent finances, and friction-free donation forms.',
        capabilities: ['Live fundraising progress bar', 'Instant UPI / Card donation flow', 'Impact story photo & video gallery', 'Annual reports repository']
      },
      {
        type: 'Software / ERP',
        title: 'Donor CRM & 80G Compliance System',
        description: 'Central database recording every contribution, generating government-compliant 80G receipt numbers, and sending thank-you notes.',
        capabilities: ['Automated PDF receipt generation', 'Donor segmentation & CSR reporting', 'Volunteer database & task assignment', 'Fund utilization audits']
      },
      {
        type: 'AI & Automation',
        title: 'WhatsApp Donor Engagement & Update Engine',
        description: 'Sends real-time photo updates of projects funded, festival greetings, and renewal reminders to recurring donors.',
        capabilities: ['Automated WhatsApp donation receipt delivery', 'Periodic impact story broadcast', 'Volunteer event alert dispatch']
      }
    ],
    businessBenefits: [
      'Double online donations through trustworthy, friction-free payment flows',
      'Automate compliance with automated 80G tax receipt dispatch to donors',
      'Maintain strong long-term relationships with domestic and CSR corporate donors',
      'Showcase transparent accountability that inspires higher donor contributions'
    ],
    technologies: ['Next.js', 'Tailwind CSS', 'Node.js', 'Razorpay', 'PDFKit', 'PostgreSQL'],
    suitableFor: ['Charitable Trusts & Foundations', 'Non-Governmental Organizations (NGOs)', 'Religious & Social Institutions', 'Animal Welfare & Environmental Shelters'],
    readySolutionCategories: ['NGO']
  },
  {
    id: 'services',
    categoryNumber: '12',
    name: 'Service Businesses',
    tagline: 'Technician dispatch, online job bookings, digital rate cards & customer invoicing.',
    shortDesc: 'Electricians, Plumbers, AC Repair, Cleaning & Maintenance Firms',
    fullOverview: 'Tailored for on-demand service providers, facility management companies, HVAC contractors, and cleaning firms. Manage customer service requests, dispatch field technicians, calculate transparent estimates, and collect payments on completion.',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Wrench',
    recommendedSolution: 'On-Demand Service Booking App + Technician Dispatch Portal + GST Invoicing',
    popularFeatures: [
      'Job Allocation & Live Field Technician Assignment',
      'Transparent Customer Rate Card & Instant Estimate Generator',
      'Job Completion Photos & Customer Digital Signature',
      'Payment Collection via UPI QR & Instant WhatsApp Invoices',
      'Annual Maintenance Contract (AMC) & Service Renewal Tracker',
      'Customer Rating & Quality Feedback Loop'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Service Dispatch & Field Operations Portal',
        description: 'Central dispatch system to receive complaints, assign field staff, track job progress, and calculate daily revenue.',
        capabilities: ['Job scheduling calendar', 'Technician location assignment', 'AMC renewal reminders', 'Invoicing & payment reconciliation']
      },
      {
        type: 'Mobile App',
        title: 'Field Technician Mobile App (Android)',
        description: 'Simple mobile app for technicians to view assigned jobs, navigate to customer addresses, upload work photos, and collect payment.',
        capabilities: ['Job details & customer contact', 'Google Maps route navigation', 'Before/After work photo upload', 'UPI QR payment generator']
      },
      {
        type: 'Website',
        title: 'Service Showcase & Online Booking Website',
        description: 'Professional website displaying services offered, transparent pricing, customer testimonials, and instant booking forms.',
        capabilities: ['Service catalog with pricing', 'Instant service booking form', 'Customer reviews showcase', 'Direct WhatsApp inquiry link']
      }
    ],
    businessBenefits: [
      'Eliminate forgotten customer bookings and unassigned service calls',
      'Track field technician attendance, productivity, and collected cash accurately',
      'Boost recurring revenue with automated Annual Maintenance Contract (AMC) renewals',
      'Provide customers with a reliable, corporate-grade service experience'
    ],
    technologies: ['React', 'Flutter', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WhatsApp Cloud API'],
    suitableFor: ['AC & Appliance Repair Centers', 'Plumbing & Electrical Contractors', 'Pest Control & Cleaning Services', 'Security & Facility Management Firms'],
    readySolutionCategories: ['Business']
  },
  {
    id: 'local',
    categoryNumber: '13',
    name: 'Local Businesses',
    tagline: 'Google Maps SEO optimization, WhatsApp quick catalogs & neighbourhood trust building.',
    shortDesc: 'Neighbourhood Stores, Wholesalers & Family-Owned Enterprises',
    fullOverview: 'We help local retail shops, traditional wholesalers, and family-owned businesses dominate their neighbourhood online. Get found when local customers search on Google Maps, showcase your top products on WhatsApp, and receive direct phone and chat orders.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    iconName: 'MapPin',
    recommendedSolution: 'Google Maps Optimized Business Website + WhatsApp Quick Catalog + Local SEO',
    popularFeatures: [
      'Click-to-Call & Direct WhatsApp Inquiry Integration',
      'Google Maps & Local Search Engine Optimization (SEO)',
      'Store Photo Gallery, Product Highlights & Virtual Tour',
      'Working Hours, Holiday Notices & Directions Map',
      'Customer Testimonials & Verified Local Ratings',
      'Easy Self-Service Admin Panel for Updating Prices & Offers'
    ],
    modules: [
      {
        type: 'Website',
        title: 'High-Speed Local Business Website',
        description: 'Mobile-first website engineered to rank on the first page of Google for local searches in your city and neighbourhood.',
        capabilities: ['Instant click-to-call & WhatsApp buttons', 'Google Maps embedded location', 'Photo gallery of store and products', 'Fast loading on 4G/5G mobile networks']
      },
      {
        type: 'AI & Automation',
        title: 'WhatsApp Catalog & Quick Response Bot',
        description: 'Automated WhatsApp assistant that greets customers, shares store timings, sends your product price list, and takes orders.',
        capabilities: ['Instant greeting message', 'PDF catalog auto-sender', 'Address and directions sharing']
      },
      {
        type: 'Software / ERP',
        title: 'Simple Billing & Expense Scratchpad',
        description: 'Clean, simplified billing tool to generate GST or Non-GST receipts and track daily credit (Udhaar) records.',
        capabilities: ['Quick bill printing', 'Customer credit ledger (Khata)', 'Daily cash summary reports']
      }
    ],
    businessBenefits: [
      'Attract new local customers searching for your products on Google Maps',
      'Make it effortless for customers to contact you via one-tap WhatsApp and phone calls',
      'Stand out from traditional local competitors with a polished online presence',
      'Keep your customers informed about seasonal discounts and festival hours'
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Google Maps API', 'WhatsApp Cloud API'],
    suitableFor: ['Sweet Shops & Bakeries', 'Hardware & Building Material Stores', 'Jewellery Showrooms', 'Auto Spare Parts Shops', 'Wholesale Traders'],
    readySolutionCategories: ['Retail', 'Business']
  },
  {
    id: 'startups',
    categoryNumber: '14',
    name: 'Startups',
    tagline: 'Rapid MVP deployment, scalable cloud backend & intelligent AI agent integration.',
    shortDesc: 'Early-Stage Ventures, SaaS Founders & Tech Innovators',
    fullOverview: 'We act as the dedicated technical execution partner for founders and early-stage tech ventures across India. We architect and launch production-ready Minimum Viable Products (MVPs), scalable cloud infrastructure, and innovative AI agents in record time.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    iconName: 'Rocket',
    recommendedSolution: 'Custom MVP Web & Mobile App + Scalable Backend + AI Agent Architecture',
    popularFeatures: [
      'Rapid 14-Day Production Prototype & MVP Deployment',
      'Scalable Serverless & Container Cloud Architecture',
      'User Authentication, Role Permissions & Subscription Billing',
      'Integrated Telemetry, Product Analytics & Error Tracking',
      'AI Large Language Model (LLM) Integration & Agent Workflows',
      'Clean Modular TypeScript Codebase Ready for VC Due Diligence'
    ],
    modules: [
      {
        type: 'Website',
        title: 'High-Converting SaaS Landing Page & Web App',
        description: 'Sleek, modern web application with high-converting waitlist funnels, user dashboard, and Stripe/Razorpay billing.',
        capabilities: ['Modern responsive UI/UX', 'User authentication (OAuth/OTP)', 'Subscription billing engine', 'Dark/Light mode support']
      },
      {
        type: 'Mobile App',
        title: 'Cross-Platform React Native / Flutter App',
        description: 'High-performance mobile application ready for deployment on the Apple App Store and Google Play Store.',
        capabilities: ['Offline caching & fast sync', 'Push notifications pipeline', 'In-app purchases', 'Biometric login']
      },
      {
        type: 'AI & Automation',
        title: 'Custom AI Intelligence & Agent Pipelines',
        description: 'Integration of custom AI workflows, private vector databases, voice processing, and autonomous tasks.',
        capabilities: ['Gemini / LLM API integration', 'Vector database embeddings', 'Real-time WebSocket streaming', 'Document parsing & insights']
      }
    ],
    businessBenefits: [
      'Launch your product to market 3x faster without hiring an expensive in-house tech team',
      'Ensure your architecture scales smoothly from 10 to 100,000+ active users',
      'Impress angel investors and venture capitalists with clean, working prototypes',
      'Retain 100% full ownership of your intellectual property and source code'
    ],
    technologies: ['React', 'Next.js', 'React Native', 'Node.js', 'PostgreSQL', 'Docker', 'Gemini AI', 'Tailwind CSS'],
    suitableFor: ['SaaS Founders', 'D2C Tech Brands', 'FinTech & EdTech Startups', 'AI Tool Builders', 'Marketplace Platforms'],
    readySolutionCategories: ['Business']
  },
  {
    id: 'growing',
    categoryNumber: '15',
    name: 'Growing Companies',
    tagline: 'Multi-branch synchronization, custom ERP workflows & centralized executive dashboards.',
    shortDesc: 'Expanding Mid-Market Enterprises & Multi-Branch Businesses',
    fullOverview: 'We engineer tailored enterprise systems and custom ERP solutions for multi-branch organizations, manufacturing units, and growing corporations. Break free from generic, rigid software and build systems that adapt exactly to your proprietary business processes.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    iconName: 'TrendingUp',
    recommendedSolution: 'Custom Enterprise ERP + Multi-Branch Central Operations Management',
    popularFeatures: [
      'Multi-Branch & Multi-Warehouse Centralized Synchronization',
      'Granular Role-Based Staff Access (Admin, Manager, Auditor, Staff)',
      'Custom Financial P&L, Inventory Valuation & GST Reports',
      'Biometric Multi-Location Staff Attendance & Payroll',
      'Automated Approval Workflows for Purchase Orders & Expenses',
      'Enterprise-Grade Data Encryption, Audit Logs & Cloud Redundancy'
    ],
    modules: [
      {
        type: 'Software / ERP',
        title: 'Custom Multi-Branch ERP & Operations Suite',
        description: 'Tailored enterprise software connecting your headquarters with regional branches, factories, and warehouses.',
        capabilities: ['Inter-branch stock transfers', 'Consolidated financial ledger', 'Purchase approval matrix', 'Supplier lifecycle management']
      },
      {
        type: 'Software / ERP',
        title: 'Executive Real-Time Analytics Dashboard',
        description: 'Executive command center displaying live revenue, regional performance, top-selling lines, and cash flow forecasts.',
        capabilities: ['Interactive charts & KPI cards', 'Automated daily WhatsApp summary to directors', 'Branch comparison matrices']
      },
      {
        type: 'AI & Automation',
        title: 'Internal Business Process Automation & Staff AI',
        description: 'Private AI assistant trained on your company SOPs and automated reconciliation of invoices and bank statements.',
        capabilities: ['Internal policy search bot', 'Bank reconciliation engine', 'Automated vendor follow-ups']
      }
    ],
    businessBenefits: [
      'Achieve 100% real-time visibility across all branch locations from a single screen',
      'Eliminate departmental silos and manual data re-entry between teams',
      'Enforce strict security permissions and audit trails for all financial actions',
      'Scale your business without operational chaos or expanding administrative overhead'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
    suitableFor: ['Multi-Branch Retail Chains', 'Manufacturing & Distribution Firms', 'Logistics & Supply Chain Operators', 'Franchise Networks'],
    readySolutionCategories: ['Business']
  }
];

export const getIndustrySolutionById = (id: string): IndustrySolutionDetail | undefined => {
  return INDUSTRY_SOLUTIONS.find(item => item.id.toLowerCase() === id.toLowerCase());
};
