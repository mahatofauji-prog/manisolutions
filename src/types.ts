export type PageView = 
  | 'home'
  | 'services'
  | 'service-website'
  | 'service-app'
  | 'service-software'
  | 'service-ai-automation'
  | 'solutions'
  | 'solution-detail'
  | 'industry-detail'
  | 'ready-solutions'
  | 'ready-solution-detail'
  | 'business-ai-detail'
  | 'order-custom-solution'
  | 'about'
  | 'work'
  | 'contact'
  | 'demo'
  | 'admin'
  | 'work-with-us'
  | 'templates-listing'
  | 'template-detail';

export type ServiceId = 'website' | 'app' | 'software' | 'ai-automation';

export interface IndustryModule {
  type: 'Website' | 'Mobile App' | 'Software / ERP' | 'AI & Automation';
  title: string;
  description: string;
  capabilities: string[];
}

export interface IndustrySolutionDetail {
  id: string;
  categoryNumber: string;
  name: string;
  tagline: string;
  shortDesc: string;
  fullOverview: string;
  imageUrl: string;
  iconName: string;
  recommendedSolution: string;
  popularFeatures: string[];
  modules: IndustryModule[];
  businessBenefits: string[];
  technologies: string[];
  suitableFor: string[];
  readySolutionCategories: string[];
}

export type SolutionContentType = 
  | 'software' 
  | 'app' 
  | 'website' 
  | 'ai-solution' 
  | 'case-study' 
  | 'article' 
  | 'update';

export type SolutionCategory = 
  | 'All'
  | 'Software'
  | 'Apps'
  | 'Websites'
  | 'AI Solutions'
  | 'Business Solutions'
  | 'Case Studies'
  | 'Technology'
  | 'Updates';

export type ProjectStatus = 'Active' | 'Completed' | 'In Development' | 'Maintenance' | 'Beta' | 'Concept' | 'Archived' | 'Live';

export type ProjectCategory =
  | 'Websites'
  | 'Apps'
  | 'Software'
  | 'AI'
  | 'Automation'
  | 'Tools';

export interface ProjectItem {
  id: string;
  projectName: string;
  category: ProjectCategory | string;
  description: string;
  projectUrl: string;
  thumbnailUrl: string;
  technologies: string[];
  clientName?: string;
  projectDate?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}


export interface GalleryImage {
  url: string;
  caption?: string;
  type?: 'desktop' | 'mobile' | 'dashboard' | 'feature';
}

export interface SolutionItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentType: SolutionContentType;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  galleryImages: GalleryImage[];
  projectStatus: ProjectStatus;
  technologiesUsed: string[];
  keyFeatures: string[];
  benefits: string[];
  clientType?: string;
  projectDate: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
  author?: string;
  readingTime?: string;
  liveUrl?: string;
  demoUrl?: string;
  platforms?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDetail {
  id: ServiceId;
  pageView: PageView;
  badge: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  items: string[];
  ctaText: string;
  keyBenefits: string[];
  technologies: string[];
  deliverables: string[];
  sampleUseCases: string[];
  estimatedTimeline: string;
}

export interface BusinessCategory {
  id: string;
  categoryNumber?: string;
  name: string;
  slug?: string;
  iconName: string;
  shortDesc: string;
  recommendedSolution: string;
  popularFeatures: string[];
  imageUrl?: string;
  status?: 'published' | 'draft';
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkStep {
  number: string;
  title: string;
  desc: string;
  detail: string;
  iconName: string;
}


export interface DemoFormData {
  fullName: string;
  businessName: string;
  businessType: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  service: string;
  projectDescription: string;
  timelinePreference: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  projectRequirements: string;
  status: EnquiryStatus;
  internalNotes: string;
  createdAt: string; // ISO date string
}

export type ApplicationStatus = 
  | 'Application Received'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview / Discussion Required'
  | 'Selected'
  | 'On Hold'
  | 'Not Selected'
  | 'Project Assigned'
  | 'Active Contributor'
  | 'New'
  | 'Approved'
  | 'Rejected';

export interface WorkApplicationItem {
  id: string; // e.g. "MANI-WE-2026-000001" or legacy "MS-WU-2026-0001"
  contributorId?: string; // e.g. "MANI-CN-2026-000001"
  contributorRole?: string;
  selectionDate?: string;
  isIdCardEnabled?: boolean;
  
  // Section A: Personal Details
  fullName: string;
  profilePhoto: string; // Base64 or image URL
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  dob?: string;
  gender?: string;
  fullAddress: string;
  city: string;
  state: string;
  pinCode: string;

  // Section B: Work Information
  workCategories: string[];
  skills?: string[];
  skillsText?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Experienced' | 'Professional' | string;
  yearsOfExperience: string;
  availability?: 'Full Time' | 'Part Time' | 'Freelance' | 'Project Based' | 'Flexible' | string;
  preferredWorkType?: 'Remote' | 'On-site' | 'Hybrid' | string;
  expectedPayment?: string;

  // Links & Previous Work
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  websiteUrl?: string;
  otherWorkLink?: string;
  previousWorkDetails?: string;
  toolsAndTechnologies?: string;

  // Section C: Dynamic Category Questions
  developerDetails?: {
    whatDoYouDevelop?: string;
    technologies?: string[];
    technologiesText?: string;
    stackType?: 'Frontend' | 'Backend' | 'Full Stack' | string;
    devCategory?: 'Web' | 'App' | 'Software' | 'AI' | 'Automation' | string;
    frameworks?: string;
    yearsOfExp?: string;
    projectTypes?: string;
    previousWorkLinks?: string;
    githubGitlabLink?: string;
    clientProjectsWillingness?: string;
    availability?: string;
  };
  mobileAppDetails?: {
    appPlatforms?: string[]; // Android, iOS, Flutter, React Native, Native Android, Native iOS, Other
    frameworks?: string;
    yearsOfExp?: string;
    appLinks?: string;
  };
  graphicDesignerDetails?: {
    designTypes?: string[]; // Logo, Banner, UI/UX, Graphic Design, Other
    designTools?: string;
    yearsOfExp?: string;
    portfolioLinks?: string;
    sampleWork?: string;
  };
  adsMarketingDetails?: {
    platforms?: string[]; // Facebook Ads, Instagram Ads, Google Ads, Lead Generation, Other
    yearsOfExp?: string;
    approxCampaigns?: string;
    industriesWorkedWith?: string;
    campaignLinks?: string;
    skillsExpertise?: string;
  };
  leadGenDetails?: {
    leadTypes?: string;
    targetIndustries?: string;
    geoArea?: string;
    generationMethod?: string;
    approxLeadsPerMonth?: string;
    previousExperience?: string;
    resultsLink?: string;
  };
  videoEditorDetails?: {
    videoTypes?: string[];
    editingSoftware?: string;
    previousWorkLinks?: string;
  };
  contentWriterDetails?: {
    contentTypes?: string[];
    languages?: string;
    previousWorkLinks?: string;
  };
  salesBdDetails?: {
    salesExperience?: string;
    industryExperience?: string;
    leadConversionExperience?: string;
    geoArea?: string;
    previousExperience?: string;
    availability?: string;
  };
  otherDetails?: {
    serviceDescription?: string;
    skillDescription?: string;
    experience?: string;
    previousWork?: string;
    additionalInfo?: string;
  };

  // Section E: Attachments (optional)
  resumeFileName?: string;
  resumeDataUrl?: string;
  sampleWorkFileName?: string;
  sampleWorkDataUrl?: string;

  // Section F: Introduction & Agreement
  introduction?: string;
  paymentTermsAgreed: boolean;

  // Metadata & Status
  status: ApplicationStatus;
  adminNotes?: string;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export interface PublicApplicationStatusDTO {
  id: string; // Application Number
  fullName: string;
  status: ApplicationStatus;
  workCategories: string[];
  createdAt: string;
  updatedAt?: string;
  contributorId?: string;
  contributorRole?: string;
  isIdCardEnabled?: boolean;
}

export interface PublicContributorVerificationDTO {
  isValid: boolean;
  contributorId: string;
  contributorName: string;
  contributorRole: string;
  status: 'Active Contributor' | 'Selected' | 'Inactive' | 'Not Valid';
  issueDate?: string;
  profilePhoto?: string;
}

export type ReadySolutionPriceType = 
  | 'Request Price' 
  | 'Fixed Price' 
  | 'Starting From' 
  | 'Monthly Subscription' 
  | 'Yearly Subscription'
  | string;

export interface ReadySolutionItem {
  id: string; // e.g. "RS-2026-001"
  title: string;
  slug: string;
  category: string; // e.g. "Schools", "Hospitals", "Restaurants", "Retail", "Gyms", "Salons", "Coaching", "NGO", "Business", "Other"
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  additionalImages?: string[];
  features: string[]; // Key feature bullet points
  benefits?: string[];
  technology?: string[];
  suitableFor?: string[];
  price?: string; // e.g. "₹24,999"
  priceType: ReadySolutionPriceType;
  status: 'published' | 'draft';
  featuredOnHomepage: boolean; // Show on homepage toggle
  homepagePriority?: number; // Sort order (1 = highest)
  demoUrl?: string;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export interface WebsiteTemplate {
  id: string; // WT-2026-XXX
  title: string;
  slug: string;
  description: string;
  price: string;
  category?: string; // Legacy single category ID fallback e.g. "retail"
  categories: string[]; // Multi-category IDs linked to BUSINESS_CATEGORIES e.g. ["retail", "restaurant", "services"]
  thumbnailUrl: string;
  demoUrl?: string;
  buyUrl?: string;
  isFeatured: boolean;
  status: 'published' | 'draft';
  displayOrder: number;
  features: string[]; // key features bullet list
  createdAt: string;
  updatedAt?: string;
}

export interface ReadySolutionRequest {
  id: string; // e.g. "RS-REQ-2026-0001"
  solutionId: string;
  solutionTitle: string;
  solutionCategory?: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  businessName?: string;
  city?: string;
  state?: string;
  fullAddress?: string;
  additionalRequirements?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed';
  createdAt: string;
}

export type CustomSolutionOrderStatus = 
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Proposal Sent'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export type RequiredSolutionType =
  | 'Website'
  | 'Web Application'
  | 'Mobile App'
  | 'Business Software'
  | 'School Management System'
  | 'Hospital Management System'
  | 'E-commerce'
  | 'AI Solution'
  | 'Automation'
  | 'Other';

export interface CustomSolutionOrder {
  id: string; // e.g. "CSO-2026-0001"
  fullName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  businessName: string;
  businessCategory: string;
  locationCity?: string;
  requiredSolution: string;
  projectRequirements: string;
  budget?: string;
  expectedTimeline?: string;
  referenceUrl?: string;
  additionalNotes?: string;
  referenceFileName?: string;
  referenceFileDataUrl?: string;
  status: CustomSolutionOrderStatus;
  adminNotes?: string;
  createdAt: string; // ISO date string
  updatedAt?: string;
}

export interface FounderProfile {
  name: string;
  designation: string;
  photoUrl: string; // Base64 data URL or external image URL
  bio?: string;
  updatedAt?: string;
}

export interface BrandLogoConfig {
  activeLogoUrl: string; // Either custom data URL or empty (default)
  isCustom: boolean;
  fileName?: string;
  fileSizeFormatted?: string;
  updatedAt?: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  founderName: string;
  logo: BrandLogoConfig;
}

export type PricingType = 'Fixed Price' | 'Custom Pricing';

export interface BusinessAiItem {
  id: string; // e.g. "BAI-2026-001"
  category: string;
  title: string;
  slug: string;
  type: string;
  shortDescription: string;
  fullOverview: string;
  thumbnailUrl: string;
  additionalImages?: string[];
  features: string[];
  benefits: string[];
  howItWorks: string[];
  targetBusinesses: string[];
  deliverables: string[];
  technologies: string[];
  integrations: string[];
  pricingType: PricingType;
  price?: string;
  customPricingText?: string;
  ctaText?: string;
  whatsappCta?: string;
  sampleInteraction?: {
    user: string;
    assistant: string;
  };
  status: 'published' | 'draft';
  order?: number; // For manual reordering
  createdAt: string;
  updatedAt?: string;
}



