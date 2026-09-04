import React, { useState, useEffect } from 'react';
import { SolutionItem } from '../../types';
import { solutionsStorage } from '../../services/solutionsStorage';
import { COMPANY_INFO } from '../../data/companyData';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Share2, 
  ShieldCheck, 
  Layers, 
  Smartphone, 
  Globe, 
  Bot, 
  Briefcase, 
  BookOpen, 
  Radio, 
  Check, 
  X,
  Maximize2,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface SolutionDetailViewProps {
  slug: string;
  onNavigateBack: () => void;
  onSelectRelatedSolution: (slug: string) => void;
  onOpenDemoModal: () => void;
}

export const SolutionDetailView: React.FC<SolutionDetailViewProps> = ({
  slug,
  onNavigateBack,
  onSelectRelatedSolution,
  onOpenDemoModal
}) => {
  const [solution, setSolution] = useState<SolutionItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<SolutionItem[]>([]);
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; caption?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const item = solutionsStorage.getBySlug(slug);
    if (item) {
      setSolution(item);
      const related = solutionsStorage.getRelated(item.id, 3);
      setRelatedItems(related);

      // Dynamic SEO Updates
      document.title = `${item.seoTitle || item.title} | MANI Solution`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', item.seoDescription || item.shortDescription);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  if (!solution) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F7F6F2] text-[var(--theme-text-primary)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6 rounded-2xl bg-white border border-[#E4E1DA]">
          <h2 className="text-xl font-bold text-[#171A1F]">Solution Not Found</h2>
          <p className="text-sm text-[#626873]">
            The project or article you are looking for does not exist or has been unpublished.
          </p>
          <button
            onClick={onNavigateBack}
            className="px-5 py-2.5 rounded-xl bg-[#C79A22] text-[var(--theme-text-primary)] font-bold text-sm hover:bg-[#b8860b] transition-all"
          >
            ← Return to Solutions
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: solution.title,
        text: solution.shortDescription,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getWhatsAppChatUrl = () => {
    if (!solution) return `https://wa.me/${COMPANY_INFO.whatsappRaw}`;
    const text = encodeURIComponent(
      `Hello MANI Solution,\nI am interested in the ${solution.title}.\n\nI would like to discuss a free consultation/demo.`
    );
    return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${text}`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Development':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Concept':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-[#626873] border-slate-500/30';
    }
  };

  return (
    <div id="solution-detail-page" className="pt-8 sm:pt-12 pb-24 lg:pt-14 lg:pb-32 bg-[#F7F6F2] min-h-screen text-[var(--theme-text-primary)] relative">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0b1b3a]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-[#C79A22]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#626873] border-b border-[#E4E1DA] pb-4">
          <button
            id="back-to-solutions-btn"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-[#C79A22] hover:text-[#f5e6ad] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Solutions
          </button>

          <div className="flex items-center gap-2">
            <button
              id="share-solution-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4E1DA] hover:border-white/25 text-[#626873] hover:text-[#171A1F] transition-all text-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Header Badges & Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-md bg-[#C79A22]/15 border border-[#C79A22]/40 text-xs font-bold text-[#C79A22] uppercase tracking-wider">
              {solution.category}
            </span>

            {solution.projectStatus && (
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getStatusBadgeColor(solution.projectStatus)}`}>
                ● {solution.projectStatus}
              </span>
            )}

            {solution.clientType && (
              <span className="px-2.5 py-0.5 rounded bg-[#1e293b]/70 border border-[#E4E1DA] text-xs text-[#626873]">
                Client Type: <strong className="text-[#171A1F]">{solution.clientType}</strong>
              </span>
            )}

            {solution.readingTime && (
              <span className="px-2.5 py-0.5 rounded bg-[#1e293b]/40 text-xs text-[#626873]">
                {solution.readingTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171A1F] leading-tight">
            {solution.title}
          </h1>

          {/* Short Introduction: Explains product & problem it solves */}
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] border-l-4 border-[#C79A22] border-y border-r border-[#E4E1DA]">
            <h3 className="text-xs uppercase tracking-wider text-[#C79A22] font-bold mb-1">
              Short Introduction & Solution Overview
            </h3>
            <p className="text-base sm:text-lg text-[#171A1F] leading-relaxed">
              {solution.shortDescription}
            </p>
          </div>
        </div>

        {/* Featured Image (Large Premium Showcase) */}
        <div className="relative rounded-2xl overflow-hidden bg-[#F7F6F2] border border-[#E4E1DA] shadow-2xl group">
          <img
            src={solution.featuredImage}
            alt={solution.title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[480px] object-cover object-center"
          />
          <button
            onClick={() => setActiveLightboxImg({ url: solution.featuredImage, caption: solution.title })}
            className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-[#F7F6F2]/80 backdrop-blur-md border border-[var(--theme-border)] text-[#171A1F] hover:text-[#C79A22] transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Maximize2 className="w-4 h-4" /> Full View
          </button>
        </div>

        {/* Overview Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#171A1F] flex items-center gap-2 border-b border-[#E4E1DA] pb-3">
            <Layers className="w-5 h-5 text-[#C79A22]" /> Overview
          </h2>
          <div className="text-[#626873] text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 font-normal">
            {solution.fullDescription}
          </div>
        </div>

        {/* Key Features Section (Feature Cards Grid) */}
        {solution.keyFeatures && solution.keyFeatures.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <h2 className="text-2xl font-bold text-[#171A1F] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C79A22]" /> Key Features
              </h2>
              <span className="text-xs text-[#626873] font-semibold">{solution.keyFeatures.length} Built-in Capabilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solution.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/90 border border-[#E4E1DA] hover:border-[#C79A22]/40 transition-all flex items-start gap-3 shadow-md"
                >
                  <div className="p-1.5 rounded-lg bg-[#C79A22]/15 text-[#C79A22] mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#171A1F] leading-snug">
                      {feat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Helps (Practical Business Benefits) */}
        {solution.benefits && solution.benefits.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#171A1F] flex items-center gap-2 border-b border-[#E4E1DA] pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> How It Helps Your Business
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {solution.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] border border-emerald-500/20 flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-[#171A1F] leading-relaxed font-medium">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technology Used (Authentic Technologies Only) */}
        {solution.technologiesUsed && solution.technologiesUsed.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#171A1F] flex items-center gap-2 border-b border-[#E4E1DA] pb-3">
              <Cpu className="w-5 h-5 text-[#C79A22]" /> Technology Used
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {solution.technologiesUsed.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E4E1DA] text-xs sm:text-sm font-medium text-[#171A1F] shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        
        {/* Screenshots Gallery / Solution Preview */}
        {solution.galleryImages && solution.galleryImages.length > 0 && (
          <div className="space-y-8 pt-12 border-t border-[#E4E1DA]">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#171A1F]">
                Solution Preview
              </h2>
              <p className="text-[#626873] text-sm">
                Explore the professional interfaces and components included in this solution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImg(img)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E4E1DA] hover:border-[#C79A22]/50 transition-all space-y-3 p-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#F7F6F2]">
                    <img
                      src={img.url}
                      alt={img.caption || `Screenshot ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-3 rounded-full bg-white/90 text-[#C79A22] shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  {img.caption && (
                    <p className="text-sm text-[#171A1F] px-2 font-bold line-clamp-2">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Who Is This For */}
        <div className="space-y-8 pt-12 border-t border-[#E4E1DA]">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#171A1F]">
                Who Is This For?
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {['Retail Stores', 'Restaurants & Cafes', 'Gyms & Fitness', 'Schools & Institutes', 'Service Businesses', 'Multi-Branch Businesses'].map((type) => (
                 <div key={type} className="px-6 py-3 bg-white border border-[#E4E1DA] rounded-full text-sm font-bold text-[#171A1F] shadow-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C79A22]" /> {type}
                 </div>
              ))}
            </div>
        </div>

        {/* Tags */}
        {solution.tags && solution.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-[#E4E1DA]">
            <span className="text-xs text-[#626873] flex items-center gap-1 font-semibold">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {solution.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#1e293b]/50 text-[#626873] text-xs border border-[#E4E1DA]"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        
        {/* Enquiry Form */}
        <div id="solution-detail-enquiry" className="rounded-2xl bg-white p-6 sm:p-10 border border-[#E4E1DA] shadow-xl mt-16 max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#171A1F]">
              Let's Build This For Your Business
            </h3>
            <p className="text-sm text-[#626873]">
              Tell us about your business and our team will help you plan the right solution.
            </p>
          </div>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const msg = `Hello MANI Solution,\nI am interested in the ${solution.title}.\n\nName: ${data.fullName}\nBusiness: ${data.businessName}\nPhone: ${data.phone}\nWhatsApp: ${data.whatsapp}\nLocation: ${data.location}\nType: ${data.businessType}\nRequirements: ${data.requirements}\nPreferred Contact: ${data.preferredContact}\n\nI would like to discuss a free consultation/demo.`;
            const waUrl = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
          }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Full Name *</label>
                <input required name="fullName" type="text" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Business Name *</label>
                <input required name="businessName" type="text" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="My Awesome Business" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Phone Number *</label>
                <input required name="phone" type="tel" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">WhatsApp Number</label>
                <input name="whatsapp" type="tel" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Email Address</label>
                <input name="email" type="email" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Business Location</label>
                <input name="location" type="text" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="City, State" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-[#171A1F]">Select Your Business Type</label>
                <select name="businessType" className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]">
                  <option value="Retail">Retail Store</option>
                  <option value="Restaurant">Restaurant & Cafe</option>
                  <option value="Gym">Gym & Fitness</option>
                  <option value="School">School / Institute</option>
                  <option value="Service">Service Business</option>
                  <option value="Multi-Branch">Multi-Branch Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-[#171A1F]">Tell Us What You Need</label>
                <textarea name="requirements" rows={4} className="w-full p-3 rounded-lg border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-[#F7F6F2]" placeholder="I need a complete point-of-sale system..."></textarea>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-[#171A1F]">Preferred Contact Method</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="preferredContact" value="WhatsApp" defaultChecked className="text-[#C79A22] focus:ring-[#C79A22]" />
                    <span className="text-sm text-[#626873]">WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="preferredContact" value="Call" className="text-[#C79A22] focus:ring-[#C79A22]" />
                    <span className="text-sm text-[#626873]">Phone Call</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="preferredContact" value="Email" className="text-[#C79A22] focus:ring-[#C79A22]" />
                    <span className="text-sm text-[#626873]">Email</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-4 text-center">
              <button type="submit" className="px-8 py-4 rounded-xl bg-gradient-to-r from-white to-[#F7F6F2] border border-[#C79A22] text-[#171A1F] font-bold text-base shadow-xl shadow-[#C79A22]/10 hover:scale-105 transition-all w-full sm:w-auto">
                Request Free Consultation
              </button>
            </div>
          </form>
        </div>

        {/* Bottom CTA Block */}
        <div id="solution-detail-cta" className="rounded-2xl bg-gradient-to-br from-white via-[#F7F6F2] to-[#F7F6F2] p-8 sm:p-10 border border-[#C79A22]/40 shadow-2xl text-center space-y-6 mt-16">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#171A1F]">
              Ready to Build a Better Digital Business?
            </h3>
            <p className="text-sm text-[#626873]">
              Let's create a solution designed specifically around your business.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="detail-request-demo-btn"
              onClick={onOpenDemoModal}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-white to-[#F7F6F2] border border-[#E4E1DA] text-[#171A1F] font-bold text-sm shadow-xl hover:border-[#C79A22] hover:scale-105 transition-all"
            >
              Request Free Demo
            </button>
            <a
              id="detail-whatsapp-chat-btn"
              href={getWhatsAppChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-[#25D366]/20 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Related Content ("You May Also Like") */}
        {relatedItems.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-[#E4E1DA]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#171A1F]">You May Also Like</h3>
                <p className="text-xs sm:text-sm text-[#626873]">
                  Related software, applications, and technology insights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedSolution(rel.slug)}
                  className="group cursor-pointer rounded-xl bg-white/70 border border-[#E4E1DA] hover:border-[#C79A22]/40 transition-all p-4 flex flex-col justify-between space-y-3 hover:-translate-y-1"
                >
                  <div className="space-y-2">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-[#F7F6F2]">
                      <img
                        src={rel.featuredImage}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#C79A22] uppercase tracking-wider block">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#626873] line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                  
                  <span className="text-xs font-bold text-[#C79A22] flex items-center gap-1 pt-2 border-t border-[#E4E1DA]">
                    View Details →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Screenshot Lightbox Modal */}
      {activeLightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden border border-[var(--theme-border)] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#F7F6F2]/80 text-[#171A1F] hover:text-[#C79A22] border border-[var(--theme-border)] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeLightboxImg.url}
              alt={activeLightboxImg.caption || 'Screenshot'}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            {activeLightboxImg.caption && (
              <p className="text-sm text-center text-[#626873] py-3 font-semibold px-4">
                {activeLightboxImg.caption}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
