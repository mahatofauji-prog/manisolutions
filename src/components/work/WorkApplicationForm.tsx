import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Globe, 
  Smartphone, 
  Code, 
  Layers, 
  Palette, 
  Megaphone, 
  TrendingUp, 
  Video, 
  PenTool, 
  Search, 
  Users, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Briefcase,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  User,
  ExternalLink,
  Cpu,
  Zap,
  Info
} from 'lucide-react';
import { WorkApplicationItem } from '../../types';
import { workStorage } from '../../services/workStorage';
import { WorkAcknowledgementModal } from './WorkAcknowledgementModal';

interface WorkApplicationFormProps {
  onSuccess?: (appId: string) => void;
  onCancel?: () => void;
  onOpenTracker?: (appId: string) => void;
}

export const WORK_CATEGORIES_LIST = [
  { id: 'Lead Generator', label: 'Lead Generator', icon: TrendingUp, desc: 'B2B outreach, local merchant acquisition & verified sales lead pipelines' },
  { id: 'Sales / Business Development', label: 'Sales / Business Development', icon: Users, desc: 'Client acquisition, offline business pitches & commercial contract closing' },
  { id: 'Web Developer', label: 'Web Developer', icon: Globe, desc: 'Responsive business websites, landing pages, SaaS apps & custom web portals' },
  { id: 'App Developer', label: 'App Developer', icon: Smartphone, desc: 'iOS & Android native or cross-platform Flutter/React Native applications' },
  { id: 'Software Developer', label: 'Software Developer', icon: Code, desc: 'Custom billing software, ERP systems, desktop applications & backend APIs' },
  { id: 'UI/UX Designer', label: 'UI/UX Designer', icon: Layers, desc: 'User interface layouts, design systems, wireframes & Figma prototypes' },
  { id: 'Graphic Designer', label: 'Graphic Designer', icon: Palette, desc: 'Marketing visuals, promotional banners, social media creatives & print graphics' },
  { id: 'Logo Designer', label: 'Logo Designer', icon: Palette, desc: 'Vector brand marks, typography logos & complete corporate identity packages' },
  { id: 'Banner / Creative Designer', label: 'Banner / Creative Designer', icon: Layers, desc: 'High-converting ad banners, outdoor flex boards & digital promotional banners' },
  { id: 'Digital Marketing / Ads Specialist', label: 'Digital Marketing / Ads Specialist', icon: Megaphone, desc: 'Meta (FB/Insta) Ads, Google Ads PPC & multi-channel performance marketing' },
  { id: 'AI Developer', label: 'AI Developer', icon: Cpu, desc: 'LLM implementations, custom chatbots, voice AI agents & prompt workflows' },
  { id: 'Automation Specialist', label: 'Automation Specialist', icon: Zap, desc: 'n8n, Zapier, Make.com workflows, API webhooks & business process automation' },
  { id: 'Video Editor', label: 'Video Editor', icon: Video, desc: 'Short-form reels, YouTube shorts, promotional explainers & motion graphics' },
  { id: 'Other Digital Professional', label: 'Other Digital Professional', icon: HelpCircle, desc: 'Specialized digital service, content writing, SEO or custom domain capability' }
];

export const WorkApplicationForm: React.FC<WorkApplicationFormProps> = ({
  onSuccess,
  onCancel,
  onOpenTracker
}) => {
  // Section 1: Personal Details
  const [fullName, setFullName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Profile Photo Upload State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Section 2: Professional Details
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Web Developer']);
  const [skillsText, setSkillsText] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Experienced' | 'Professional'>('Experienced');
  const [yearsOfExperience, setYearsOfExperience] = useState('3 Years');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [previousWorkDetails, setPreviousWorkDetails] = useState('');
  const [toolsAndTechnologies, setToolsAndTechnologies] = useState('');

  // Section 3: Category-Specific Details
  // Developer Specifics
  const [devWhat, setDevWhat] = useState('');
  const [devTechnologies, setDevTechnologies] = useState('');
  const [devStackType, setDevStackType] = useState<'Frontend' | 'Backend' | 'Full Stack'>('Full Stack');
  const [devCategory, setDevCategory] = useState<'Web' | 'App' | 'Software' | 'AI' | 'Automation'>('Web');

  // Designer Specifics
  const [designerTypes, setDesignerTypes] = useState<string[]>(['Logo', 'Banner', 'UI/UX']);
  const [designerTools, setDesignerTools] = useState('');

  // Ads / Marketing Specifics
  const [adPlatforms, setAdPlatforms] = useState<string[]>(['Facebook Ads', 'Instagram Ads', 'Google Ads']);
  const [adCampaignExperience, setAdCampaignExperience] = useState('');

  // Lead Generator Specifics
  const [leadIndustries, setLeadIndustries] = useState('');
  const [leadMethod, setLeadMethod] = useState('');
  const [leadPreviousExp, setLeadPreviousExp] = useState('');

  // Other Digital Professional
  const [otherServiceDesc, setOtherServiceDesc] = useState('');

  // Section 4: Payment Terms Agreement
  const [paymentTermsAgreed, setPaymentTermsAgreed] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<WorkApplicationItem | null>(null);
  const [isAcknowledgementOpen, setIsAcknowledgementOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Profile Photo Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size should be less than 5MB.');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Compress & scale to 400x400
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);
        canvas.width = 400;
        canvas.height = 400;

        if (ctx) {
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            400,
            400
          );
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setProfilePhoto(compressedDataUrl);
          setIsProcessingPhoto(false);
        } else {
          setProfilePhoto(event.target?.result as string);
          setIsProcessingPhoto(false);
        }
      };
      img.onerror = () => {
        setPhotoError('Could not process this image.');
        setIsProcessingPhoto(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) return; // Keep at least one
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const toggleDesignerType = (type: string) => {
    if (designerTypes.includes(type)) {
      setDesignerTypes(designerTypes.filter(t => t !== type));
    } else {
      setDesignerTypes([...designerTypes, type]);
    }
  };

  const toggleAdPlatform = (plat: string) => {
    if (adPlatforms.includes(plat)) {
      setAdPlatforms(adPlatforms.filter(p => p !== plat));
    } else {
      setAdPlatforms([...adPlatforms, plat]);
    }
  };

  // Determine if specific category sections are visible
  const isDeveloperSelected = selectedCategories.some(c => 
    ['Web Developer', 'App Developer', 'Software Developer', 'AI Developer', 'Automation Specialist'].includes(c)
  );

  const isDesignerSelected = selectedCategories.some(c => 
    ['UI/UX Designer', 'Graphic Designer', 'Logo Designer', 'Banner / Creative Designer'].includes(c)
  );

  const isMarketingSelected = selectedCategories.some(c => 
    ['Digital Marketing / Ads Specialist'].includes(c)
  );

  const isLeadGenSelected = selectedCategories.some(c => 
    ['Lead Generator', 'Sales / Business Development'].includes(c)
  );

  const isOtherSelected = selectedCategories.includes('Other Digital Professional');

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    if (!fullName.trim()) {
      setValidationError('Please enter your full legal name.');
      return;
    }
    if (!profilePhoto) {
      setValidationError('Please upload a clear profile photo for your contributor record.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!whatsappNumber.trim()) {
      setValidationError('Please provide your WhatsApp number for project coordination.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid email address.');
      return;
    }
    if (!fullAddress.trim() || !city.trim() || !state.trim() || !pinCode.trim()) {
      setValidationError('Please complete your full address (Street Address, City, State, and PIN Code).');
      return;
    }
    if (selectedCategories.length === 0) {
      setValidationError('Please select at least one work category.');
      return;
    }
    if (!paymentTermsAgreed) {
      setValidationError('You must read and agree to the Work With Us & Earn payment terms before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = skillsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const applicationData: Omit<WorkApplicationItem, 'id' | 'createdAt' | 'status'> = {
        fullName: fullName.trim(),
        profilePhoto,
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: whatsappNumber.trim(),
        email: email.trim().toLowerCase(),
        fullAddress: fullAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        workCategories: selectedCategories,
        skills: skillsArray,
        skillsText: skillsText.trim(),
        experienceLevel,
        yearsOfExperience: yearsOfExperience.trim() || '2+ Years',
        portfolioUrl: portfolioUrl.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        previousWorkDetails: previousWorkDetails.trim(),
        toolsAndTechnologies: toolsAndTechnologies.trim(),
        
        developerDetails: isDeveloperSelected ? {
          whatDoYouDevelop: devWhat.trim() || previousWorkDetails.trim(),
          technologiesText: devTechnologies.trim() || toolsAndTechnologies.trim(),
          stackType: devStackType,
          devCategory: devCategory,
          yearsOfExp: yearsOfExperience.trim()
        } : undefined,

        graphicDesignerDetails: isDesignerSelected ? {
          designTypes: designerTypes,
          designTools: designerTools.trim() || toolsAndTechnologies.trim(),
          yearsOfExp: yearsOfExperience.trim()
        } : undefined,

        adsMarketingDetails: isMarketingSelected ? {
          platforms: adPlatforms,
          skillsExpertise: adCampaignExperience.trim(),
          yearsOfExp: yearsOfExperience.trim()
        } : undefined,

        leadGenDetails: isLeadGenSelected ? {
          targetIndustries: leadIndustries.trim(),
          generationMethod: leadMethod.trim(),
          previousExperience: leadPreviousExp.trim()
        } : undefined,

        otherDetails: isOtherSelected ? {
          serviceDescription: otherServiceDesc.trim()
        } : undefined,

        paymentTermsAgreed: true
      };

      const created = await workStorage.create(applicationData);
      setSubmittedApplication(created);
      setIsAcknowledgementOpen(true);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(created.id);
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
      setValidationError('Failed to save application. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="work-application-form-container" className="max-w-4xl mx-auto text-left space-y-8">
      
      {/* Top Form Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-5">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-[11px] font-bold tracking-wider uppercase">
              Contributor Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F]">
              Apply for Work With MANI Solution
            </h2>
            <p className="text-xs sm:text-sm text-[#626873]">
              Join our independent contributor network. Receive 40% project share on successfully assigned and delivered client projects.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-[#E4E1DA] text-xs font-semibold text-[#626873] hover:text-[#171A1F] hover:bg-slate-50 transition-all self-start sm:self-auto"
            >
              Cancel & Back to Overview
            </button>
          )}
        </div>

        {/* 40% Model Reminder Strip */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C79A22] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 block">Project-Based Contributor Share (40%)</span>
            <p className="leading-relaxed text-amber-800">
              This is a project-based contributor model without fixed monthly salaries. When a project is closed and assigned to you, you receive <strong>40% of the agreed project amount</strong> upon milestone fulfillment (e.g. ₹20,000 on a ₹50,000 finalized client project).
            </p>
          </div>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ============================================================ */}
        {/* SECTION 1: PERSONAL DETAILS */}
        {/* ============================================================ */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E4E1DA] pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171A1F]">Personal Details</h3>
              <p className="text-xs text-[#626873]">Contact information and contributor photo.</p>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Profile Photo <span className="text-rose-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA]">
              {/* Photo Preview Box */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-[#E4E1DA] shadow-inner flex items-center justify-center shrink-0">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Applicant Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}

                {isProcessingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{profilePhoto ? 'Change Photo' : 'Upload Profile Photo'}</span>
                  </button>

                  {profilePhoto && (
                    <button
                      type="button"
                      onClick={() => setProfilePhoto('')}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[#626873]">
                  Required for your official Authorized Contributor ID card. Clear square photo (JPG, PNG, WebP up to 5MB).
                </p>
                {photoError && <p className="text-[11px] font-semibold text-rose-600">{photoError}</p>}
              </div>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Mobile & WhatsApp Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setWhatsappNumber(mobileNumber)}
                  className="text-[10px] text-[#2563EB] hover:underline font-semibold"
                >
                  Same as Mobile
                </button>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Full Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Full Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House / Flat No., Street, Landmark / Colony"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* City, State & PIN Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru / Noida"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Karnataka / Bihar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="e.g. 560001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: PROFESSIONAL DETAILS & CATEGORY SELECTION */}
        {/* ============================================================ */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E4E1DA] pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171A1F]">Professional Skills & Category</h3>
              <p className="text-xs text-[#626873]">Select one or multiple categories that match your capabilities.</p>
            </div>
          </div>

          {/* Work Categories Selection Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Select Work Categories <span className="text-rose-500">*</span>
              <span className="ml-2 text-[11px] font-normal text-[#626873] normal-case">(Click to select multiple)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORK_CATEGORIES_LIST.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#2563EB] shadow-sm'
                        : 'bg-[#FCFAF6] border-[#E4E1DA] hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#171A1F]'}`}>
                          {cat.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                      </div>
                      <p className="text-[11px] text-[#626873] leading-tight">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level & Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              >
                <option value="Beginner">Beginner (0 - 1 Year)</option>
                <option value="Intermediate">Intermediate (1 - 3 Years)</option>
                <option value="Experienced">Experienced (3 - 6 Years)</option>
                <option value="Professional">Professional (6+ Years)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Total Years of Experience
              </label>
              <input
                type="text"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="e.g. 3.5 Years"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Skills & Tools */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, TypeScript, Tailwind CSS, PostgreSQL, Figma, Meta Ads, B2B Calling"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Tools / Technologies Used
            </label>
            <input
              type="text"
              value={toolsAndTechnologies}
              onChange={(e) => setToolsAndTechnologies(e.target.value)}
              placeholder="e.g. VS Code, Figma, Adobe Illustrator, Premiere Pro, Meta Business Suite, Apollo.io"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Portfolio & Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                Portfolio / Live URL (Optional)
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                GitHub / Behance URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Previous Work Details */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Previous Work Details & Key Highlights
            </label>
            <textarea
              rows={3}
              value={previousWorkDetails}
              onChange={(e) => setPreviousWorkDetails(e.target.value)}
              placeholder="Briefly describe what kind of client projects, apps, graphics, campaigns, or leads you have worked on previously..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: CATEGORY-SPECIFIC DETAILS */}
        {/* ============================================================ */}
        {(isDeveloperSelected || isDesignerSelected || isMarketingSelected || isLeadGenSelected || isOtherSelected) && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-[#E4E1DA] pb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-[#171A1F]">Category-Specific Capabilities</h3>
                <p className="text-xs text-[#626873]">Tailored questions based on your selected domain.</p>
              </div>
            </div>

            {/* Developer Details */}
            {isDeveloperSelected && (
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-4">
                <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider">
                  <Code className="w-4 h-4" />
                  <span>Developer Capabilities</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      What do you develop?
                    </label>
                    <input
                      type="text"
                      value={devWhat}
                      onChange={(e) => setDevWhat(e.target.value)}
                      placeholder="e.g. ERP Dashboards, Landing Pages, Mobile Apps, AI Bots"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Technologies / Frameworks
                    </label>
                    <input
                      type="text"
                      value={devTechnologies}
                      onChange={(e) => setDevTechnologies(e.target.value)}
                      placeholder="e.g. React, Next.js, Node.js, Flutter, Python, FastAPI"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Stack Specialization
                    </label>
                    <select
                      value={devStackType}
                      onChange={(e) => setDevStackType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    >
                      <option value="Full Stack">Full Stack</option>
                      <option value="Frontend">Frontend Specialist</option>
                      <option value="Backend">Backend / API Specialist</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Primary Domain
                    </label>
                    <select
                      value={devCategory}
                      onChange={(e) => setDevCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    >
                      <option value="Web">Web Development</option>
                      <option value="App">Mobile App</option>
                      <option value="Software">Business Software / ERP</option>
                      <option value="AI">AI Developer</option>
                      <option value="Automation">Automation Specialist</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Designer Details */}
            {isDesignerSelected && (
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-4">
                <div className="flex items-center gap-2 text-[#C79A22] font-bold text-xs uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>Design Specialization</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#171A1F]">
                    Design Types You Deliver
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Logo', 'Banner', 'UI/UX', 'Graphic Design', 'Branding Kit', 'Print Poster', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleDesignerType(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          designerTypes.includes(t)
                            ? 'bg-[#171A1F] text-white border-[#171A1F]'
                            : 'bg-white text-[#626873] border-[#E4E1DA]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#171A1F]">
                    Primary Design Tools
                  </label>
                  <input
                    type="text"
                    value={designerTools}
                    onChange={(e) => setDesignerTools(e.target.value)}
                    placeholder="e.g. Figma, Adobe Illustrator, Adobe Photoshop, Canva Pro"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Ads / Marketing Details */}
            {isMarketingSelected && (
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Megaphone className="w-4 h-4" />
                  <span>Marketing & Ads Platforms</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#171A1F]">
                    Ad Platforms Managed
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Facebook Ads', 'Instagram Ads', 'Google Ads', 'Lead Generation', 'YouTube Ads', 'LinkedIn Ads', 'Other'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleAdPlatform(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          adPlatforms.includes(p)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-[#626873] border-[#E4E1DA]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#171A1F]">
                    Campaign Experience & Target ROI
                  </label>
                  <input
                    type="text"
                    value={adCampaignExperience}
                    onChange={(e) => setAdCampaignExperience(e.target.value)}
                    placeholder="e.g. Managed ₹5L+ ad spend on Meta & Google Ads for local businesses & e-commerce"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Lead Generator Details */}
            {isLeadGenSelected && (
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>Lead Generation & Sales Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Industries you can generate leads for
                    </label>
                    <input
                      type="text"
                      value={leadIndustries}
                      onChange={(e) => setLeadIndustries(e.target.value)}
                      placeholder="e.g. Schools, Hospitals, Coaching, Retail Shops, Real Estate"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Lead Generation Method
                    </label>
                    <input
                      type="text"
                      value={leadMethod}
                      onChange={(e) => setLeadMethod(e.target.value)}
                      placeholder="e.g. Field visits, Telecalling, LinkedIn, Merchant networking"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#171A1F]">
                    Previous Lead Conversion Track Record
                  </label>
                  <input
                    type="text"
                    value={leadPreviousExp}
                    onChange={(e) => setLeadPreviousExp(e.target.value)}
                    placeholder="e.g. Onboarded 40+ local merchants for digital solutions in past 6 months"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Other Digital Professional */}
            {isOtherSelected && (
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-2">
                <label className="block text-xs font-bold text-[#171A1F]">
                  Describe your unique digital service or specialized expertise
                </label>
                <textarea
                  rows={2}
                  value={otherServiceDesc}
                  onChange={(e) => setOtherServiceDesc(e.target.value)}
                  placeholder="Provide a detailed description of your skill set and how you can contribute to client mandates..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 4: PAYMENT TERMS AGREEMENT */}
        {/* ============================================================ */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#C79A22]/40 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E4E1DA] pb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171A1F]">Important Payment Terms</h3>
              <p className="text-xs text-[#626873]">Please review the transparent contributor remuneration policy.</p>
            </div>
          </div>

          {/* Terms Box */}
          <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-3 text-xs text-[#171A1F] leading-relaxed">
            <div className="font-bold text-sm text-[#171A1F]">
              Work With Us & Earn — Contributor Terms:
            </div>
            <ul className="space-y-2 text-[#626873]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span><strong>This is not a salaried employment position.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span><strong>No fixed monthly salary is provided.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span>Work and payment are project-based.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span>For an accepted project, the selected contributor's standard share is <strong>40% of the agreed project amount</strong>, subject to the project's applicable terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span>Payment is linked to successful project execution and milestone payment conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span>Applying does not guarantee selection or assignment of projects.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0 mt-1.5" />
                <span>MANI Solution reserves the right to review and approve applications based on merit and active project requirements.</span>
              </li>
            </ul>
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={paymentTermsAgreed}
              onChange={(e) => setPaymentTermsAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-[#2563EB] rounded border-gray-300 focus:ring-[#2563EB]"
            />
            <span className="text-xs font-bold text-[#171A1F]">
              I have read and agree to the Work With Us & Earn terms. <span className="text-rose-500">*</span>
            </span>
          </label>
        </div>

        {/* Submit Application Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#626873]">
            <ShieldCheck className="w-4 h-4 text-[#C79A22]" />
            <span>Generates an official unique Application Number on submission.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

      {/* Acknowledgement Modal triggered right after submission */}
      <WorkAcknowledgementModal
        isOpen={isAcknowledgementOpen}
        onClose={() => setIsAcknowledgementOpen(false)}
        application={submittedApplication}
        onOpenTracker={(appId) => {
          setIsAcknowledgementOpen(false);
          if (onOpenTracker) {
            onOpenTracker(appId);
          }
        }}
      />

    </div>
  );
};
