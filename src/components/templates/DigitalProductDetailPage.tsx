import React, { useState, useEffect } from 'react';
import { DigitalProduct, ProductTestimonial, ProductFaq } from '../../types';
import { digitalProductsStorage, subscribeToDigitalProducts } from '../../services/digitalProductsStorage';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  Lock, 
  HelpCircle, 
  Tag, 
  Check, 
  Share2, 
  Copy, 
  ExternalLink, 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  Info,
  Facebook,
  MessageCircle,
  Send,
  Twitter,
  ArrowLeft,
  Calendar,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  ChevronLeft,
  Clock,
  Zap,
  AlertCircle,
  QrCode,
  Smartphone,
  CheckCheck
} from 'lucide-react';

interface DigitalProductDetailPageProps {
  product?: DigitalProduct;
  productSlug?: string;
  autoOpenCheckout?: boolean;
  onBackToListing: () => void;
  onBackToHome: () => void;
  onOpenCustomerPortal?: () => void;
  onSelectProduct?: (product: DigitalProduct) => void;
}

export const DigitalProductDetailPage: React.FC<DigitalProductDetailPageProps> = ({
  product: propProduct,
  productSlug,
  autoOpenCheckout = false,
  onBackToListing,
  onBackToHome,
  onSelectProduct
}) => {
  const [product, setProduct] = useState<DigitalProduct | undefined>(propProduct);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Payment Checkout Tabs & Methods
  const [paymentTab, setPaymentTab] = useState<'gateway' | 'upi_qr' | 'whatsapp'>('gateway');
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifyingUtr, setIsVerifyingUtr] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isTimeoutError, setIsTimeoutError] = useState(false);

  // Gallery & Lightbox state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // FAQs Accordion open state (by FAQ ID or index)
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'f-1': true });

  // Razorpay Checkout Modal Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-open checkout modal if requested via prop or ?buy=true URL parameter
  useEffect(() => {
    if (autoOpenCheckout) {
      setIsCheckoutOpen(true);
    } else if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('buy') === 'true' || params.get('checkout') === 'true') {
        setIsCheckoutOpen(true);
      }
    }
  }, [autoOpenCheckout]);

  useEffect(() => {
    const resolveProduct = () => {
      if (propProduct) {
        setProduct(propProduct);
        setIsNotFound(propProduct.status !== 'published');
      } else if (productSlug) {
        const found = digitalProductsStorage.getBySlug(productSlug);
        if (found) {
          if (found.status === 'published') {
            setProduct(found);
            setIsNotFound(false);
          } else {
            setIsNotFound(true);
          }
        } else {
          const isDbEmpty = digitalProductsStorage.getPublished().length === 0;
          if (!isDbEmpty) {
            setIsNotFound(true);
          }
        }
      }
    };
    resolveProduct();
    return subscribeToDigitalProducts(resolveProduct);
  }, [propProduct, productSlug]);

  // Combine Cover Photo + Up to 7 Gallery Images = Up to 8 Visuals Total
  const allVisuals: string[] = React.useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.thumbnailUrl) list.push(product.thumbnailUrl);
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach(img => {
        if (img && !list.includes(img) && list.length < 8) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'];
  }, [product]);

  // Handle Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImageIndex(prev => (prev + 1) % allVisuals.length);
      if (e.key === 'ArrowLeft') setActiveImageIndex(prev => (prev - 1 + allVisuals.length) % allVisuals.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allVisuals.length]);

  if (isNotFound || !product) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg-main)] py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-3xl border border-[#E4E1DA] shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#C79A22] mx-auto" />
          <h2 className="text-xl font-black text-[#171A1F]">Digital Product Not Found</h2>
          <p className="text-xs text-[#626873]">
            The requested digital product is either unpublished, removed, or the link is incorrect.
          </p>
          <button
            onClick={onBackToListing}
            className="w-full py-3 rounded-xl bg-[#171A1F] text-white text-xs font-bold shadow-md hover:bg-black transition-all cursor-pointer"
          >
            Back to Digital Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Published Testimonials
  const publishedTestimonials: ProductTestimonial[] = (product.testimonials || []).filter(
    t => t.status !== 'hidden'
  );

  // Published FAQs
  const publishedFaqs: ProductFaq[] = (product.faqs || []).filter(
    f => f.status !== 'hidden'
  );

  // Pricing calculations
  const authoritativePrice = Number(product.price || 0);
  const comparePrice = Number(product.compareAtPrice || 0);
  const discountPercent = comparePrice > authoritativePrice && authoritativePrice > 0
    ? Math.round(((comparePrice - authoritativePrice) / comparePrice) * 100)
    : 0;

  // Dedicated Offer
  const offerConfig = product.offer;
  const isOfferActive = offerConfig?.isEnabled ?? (discountPercent > 0);

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const cleanUrl = `${origin}/product/${product.slug}`;
      navigator.clipboard.writeText(cleanUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handleOpenWhatsAppInquiry = () => {
    const text = encodeURIComponent(`Hello MANI Solution, I am interested in purchasing "${product.name}" (Price: ₹${authoritativePrice}). Please guide me.`);
    window.open(`https://wa.me/919931653196?text=${text}`, '_blank');
  };

  // Verified Razorpay Payment Handler
  const handlePayWithRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail || !product) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create Razorpay Order via Server
      const res = await fetch('/api/digital/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: custEmail,
          couponCode
        })
      });

      const data = await res.json();
      if (!data.success || !data.razorpayOrderId) {
        setErrorMessage(data.message || 'Failed to initialize payment order with server.');
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: 'INR',
          name: 'MANI Solution',
          description: product.name,
          order_id: data.razorpayOrderId,
          prefill: {
            name: custName,
            email: custEmail,
            contact: custPhone
          },
          theme: { color: '#C79A22' },
          handler: async (response: any) => {
            // Verify payment
            const verifyRes = await fetch('/api/digital/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                internalOrderId: data.internalOrderId,
                productId: product.id,
                productName: product.name,
                customerId: custEmail,
                customerName: custName,
                customerEmail: custEmail,
                customerPhone: custPhone,
                totalAmount: data.amount,
                couponCode
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const verifiedPaidAmount = verifyData.order?.totalAmount || data.amount || product.price;
              try {
                localStorage.setItem('last_completed_order', JSON.stringify({
                  paymentId: response.razorpay_payment_id,
                  orderId: data.internalOrderId,
                  productId: product.id,
                  productName: product.name,
                  amount: verifiedPaidAmount,
                  customerEmail: custEmail,
                  customerName: custName,
                  customerPhone: custPhone,
                  timestamp: Date.now()
                }));
                sessionStorage.setItem('payment_session_auth_' + response.razorpay_payment_id, 'active_purchase_session_2026');
              } catch {}
              window.location.href = `/thank-you?payment_id=${response.razorpay_payment_id}&order_id=${data.internalOrderId}&product_id=${product.id}&amount=${verifiedPaidAmount}`;
            } else {
              setErrorMessage('Payment signature verification failed.');
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Razorpay Payment Failed Event:', response.error);
          const desc = response.error?.description || response.error?.reason || 'Payment was declined or cancelled.';
          const isTimeout = desc.toLowerCase().includes('in time') || desc.toLowerCase().includes('timeout') || response.error?.reason === 'payment_timed_out';
          setIsTimeoutError(isTimeout);
          setErrorMessage(`Payment failed: ${desc}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setErrorMessage('Razorpay Checkout SDK is loading. Please refresh the page and try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  // Direct UPI Payment & Manual UTR Verification Handler
  const handleVerifyManualUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !custEmail) return;
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 6) {
      setErrorMessage('Please enter a valid 12-digit UPI Reference / UTR number from your payment app.');
      return;
    }
    setIsVerifyingUtr(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/digital/payment/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: `UPI_UTR_${cleanUtr}`,
          orderId: `ORD-2026-${String(Date.now()).slice(-5)}`,
          productId: product.id,
          customerEmail: custEmail,
          customerName: custName || 'Valued Customer',
          customerPhone: custPhone,
          amount: authoritativePrice
        })
      });
      const data = await res.json();
      if (data.success && data.order) {
        try {
          localStorage.setItem('last_completed_order', JSON.stringify({
            paymentId: `UPI_UTR_${cleanUtr}`,
            orderId: data.order.id,
            productId: product.id,
            productName: product.name,
            amount: authoritativePrice,
            customerEmail: custEmail,
            customerName: custName || 'Valued Customer',
            customerPhone: custPhone,
            timestamp: Date.now()
          }));
          sessionStorage.setItem('payment_session_auth_UPI_UTR_' + cleanUtr, 'active_purchase_session_2026');
        } catch {}
        window.location.href = `/thank-you?payment_id=UPI_UTR_${encodeURIComponent(cleanUtr)}&order_id=${data.order.id}&product_id=${product.id}&amount=${authoritativePrice}`;
      } else {
        setErrorMessage(data.message || 'Verification could not be completed. Please contact WhatsApp support.');
        setIsVerifyingUtr(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
      setIsVerifyingUtr(false);
    }
  };

  const handleCopyUpiId = (idToCopy: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(idToCopy);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  // Average Rating
  const avgRating = publishedTestimonials.length > 0
    ? (publishedTestimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / publishedTestimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[#171A1F] pb-24 lg:pb-32 selection:bg-[#C79A22] selection:text-white">
      
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#E4E1DA] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 overflow-x-auto scrollbar-none">
            <button
              onClick={onBackToHome}
              className="hover:text-[#171A1F] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={onBackToListing}
              className="hover:text-[#171A1F] font-bold shrink-0 cursor-pointer"
            >
              Digital Store
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[#171A1F] font-extrabold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              title="Share Product Link"
            >
              {copySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10 sm:space-y-14">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: PRODUCT GALLERY & PURCHASE DETAILS                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: E-COMMERCE PRODUCT GALLERY (Cover + Up to 7 Gallery Images = 8 Visuals) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4">
            
            {/* Main Stage View */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#E4E1DA] shadow-sm group">
              <img
                src={allVisuals[activeImageIndex] || allVisuals[0]}
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Offer / Discount Badge */}
              {isOfferActive && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-900/20">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{offerConfig?.badge || `${discountPercent}% OFF`}</span>
                </div>
              )}

              {/* Category Pill */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#171A1F]/80 backdrop-blur-md text-[#C79A22] text-[11px] font-extrabold uppercase border border-[#C79A22]/40 shadow">
                {product.category}
              </div>

              {/* Click to Enlarge / Lightbox Trigger */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 z-10 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-[#171A1F] hover:bg-white shadow-md transition-all opacity-90 hover:opacity-100 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Open Gallery Lightbox"
              >
                <Maximize2 className="w-4 h-4 text-[#C79A22]" />
                <span className="hidden sm:inline">View Larger</span>
              </button>

              {/* Previous / Next Arrows for Main Stage on Hover */}
              {allVisuals.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => (prev - 1 + allVisuals.length) % allVisuals.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white shadow-md transition-opacity opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => (prev + 1) % allVisuals.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white shadow-md transition-opacity opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails Strip (Cover + Exactly Up to 7 Images) */}
            {allVisuals.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                  <span>Product Visuals ({allVisuals.length} images)</span>
                  <span className="text-[#C79A22]">Click thumbnail to inspect</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {allVisuals.map((imgUrl, idx) => {
                    const isSelected = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-[#C79A22] ring-2 ring-[#C79A22]/30 shadow-md scale-105'
                            : 'border-[#E4E1DA] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#171A1F]/80 text-[#C79A22] text-[8px] font-black uppercase text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Instant Delivery Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white border border-[#E4E1DA] text-center space-y-1">
                <Download className="w-4 h-4 text-[#C79A22] mx-auto" />
                <div className="text-[11px] font-extrabold text-[#171A1F]">Instant Access</div>
                <div className="text-[10px] text-slate-500">Immediate download</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#E4E1DA] text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                <div className="text-[11px] font-extrabold text-[#171A1F]">100% Verified</div>
                <div className="text-[10px] text-slate-500">Secure Razorpay</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#E4E1DA] text-center space-y-1">
                <Sparkles className="w-4 h-4 text-blue-600 mx-auto" />
                <div className="text-[11px] font-extrabold text-[#171A1F]">Lifetime Updates</div>
                <div className="text-[10px] text-slate-500">Free future releases</div>
              </div>
            </div>

          </div>

          {/* RIGHT: PRODUCT INFO, AUTHORITATIVE PRICING & BUY NOW */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            
            <div className="space-y-2.5">
              {/* Category & Rating Summary */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-[#C79A22] text-xs font-black uppercase tracking-wider shadow-sm">
                  {product.category}
                </span>

                {publishedTestimonials.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-extrabold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{avgRating}</span>
                    <span className="text-amber-700/70 font-normal">({publishedTestimonials.length} reviews)</span>
                  </div>
                )}
              </div>

              {/* Product Title / Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-[#626873] leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* AUTHORITATIVE PRICING CARD & SPECIAL OFFER BANNER */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E4E1DA] shadow-md space-y-4">
              
              {/* Special Offer Header Banner */}
              {isOfferActive && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-amber-950">
                        {offerConfig?.title || 'Special Launch Offer'}
                      </span>
                      <p className="text-[11px] text-amber-800 font-medium">
                        {offerConfig?.text || 'Limited time introductory price'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-[#171A1F] text-[#C79A22] font-black text-xs shrink-0 shadow-sm">
                    {offerConfig?.badge || `${discountPercent}% OFF`}
                  </span>
                </div>
              )}

              {/* Price Row */}
              <div className="flex items-baseline justify-between gap-4 pt-1">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 block">
                    Special Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#171A1F] tracking-tight">
                      ₹{authoritativePrice}
                    </span>
                    {comparePrice > authoritativePrice && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                        ₹{comparePrice}
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Primary BUY NOW Action Button */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-[#C79A22] hover:bg-[#b0871b] text-[#171A1F] font-black text-sm sm:text-base shadow-lg shadow-[#C79A22]/20 hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>BUY NOW — ₹{authoritativePrice}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary WhatsApp & Share Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenWhatsAppInquiry}
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Order via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C79A22]" />
                    <span>{copySuccess ? 'Link Copied!' : 'Share Product'}</span>
                  </button>
                </div>
              </div>

              {/* Trust Badge Guarantee */}
              <div className="pt-2 border-t border-[#E4E1DA] text-[11px] text-[#626873] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-bit Encrypted Checkout</span>
                </span>
                <span className="font-bold text-slate-700">Official MANI Solution Product</span>
              </div>

            </div>

            {/* Quick Deliverable Summary */}
            {product.productFileName && (
              <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                  <FileText className="w-5 h-5" />
                </span>
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-[#171A1F]">
                    {product.productFileName}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Format: {product.productFileType || 'PDF Document'}</span>
                    <span>•</span>
                    <span>Size: {product.productFileSize || 'Instant Delivery'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RICH DESCRIPTION & WHAT YOU WILL LEARN                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Full Product Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-4">
                <FileText className="w-5 h-5 text-[#C79A22]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#171A1F]">
                  Product Overview &amp; Curriculum
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {product.fullDescription || product.shortDescription}
              </div>
            </div>

            {/* Key Features Section */}
            {product.features && product.features.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-sm space-y-5 text-left">
                <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-4">
                  <Sparkles className="w-5 h-5 text-[#C79A22]" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#171A1F]">
                    Key Features &amp; Capabilities
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C79A22] shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-[#171A1F] leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables / What You Get */}
            {product.whatYouGet && product.whatYouGet.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-sm space-y-5 text-left">
                <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-4">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#171A1F]">
                    What You Get (Deliverables)
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {product.whatYouGet.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3"
                    >
                      <Download className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-[#171A1F]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. TESTIMONIALS (UNLIMITED / STRICTLY NO FAKE REVIEWS)                    */}
            {/* ========================================================================= */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#171A1F]">
                    Customer Reviews &amp; Testimonials
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {publishedTestimonials.length} Verified Reviews
                </span>
              </div>

              {publishedTestimonials.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No testimonials yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {publishedTestimonials.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating || 5 }).map((_, sIdx) => (
                            <Star key={sIdx} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ))}
                        </div>

                        <p className="text-xs text-slate-700 italic leading-relaxed">
                          &quot;{t.testimonialText}&quot;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#171A1F]">{t.customerName}</span>
                        {t.designation && (
                          <span className="text-[11px] text-slate-500">{t.designation}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* 4. FREQUENTLY ASKED QUESTIONS (ACCORDION STYLE)                          */}
            {/* ========================================================================= */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-4">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#171A1F]">
                  Frequently Asked Questions
                </h2>
              </div>

              {publishedFaqs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  No FAQs available.
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedFaqs.map((faq, idx) => {
                    const faqId = faq.id || `faq-${idx}`;
                    const isOpen = Boolean(openFaqIds[faqId]);

                    return (
                      <div
                        key={faqId}
                        className="rounded-2xl border border-[#E4E1DA] overflow-hidden transition-colors bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faqId)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-[#171A1F]">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#C79A22] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: QUICK BUY CARD & GUARANTEE */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            <div className="p-6 rounded-3xl bg-[#171A1F] text-white shadow-xl space-y-5 text-left border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#C79A22] uppercase tracking-wider">
                  Instant Access Pass
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Get Full Access Today
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#C79A22]">₹{authoritativePrice}</span>
                  {comparePrice > authoritativePrice && (
                    <span className="text-xs text-slate-400 line-through">₹{comparePrice}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  One-time payment. Zero subscription fees.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-[#C79A22] hover:bg-[#b0871b] text-[#171A1F] font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now (₹{authoritativePrice})</span>
              </button>

              <div className="space-y-2 text-[11px] text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>Instant digital file download</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>Official GST Tax Invoice provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>24/7 dedicated support team</span>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="p-5 rounded-3xl bg-white border border-[#E4E1DA] space-y-3 text-left">
              <h4 className="font-extrabold text-xs text-[#171A1F]">Have questions before buying?</h4>
              <p className="text-[11px] text-[#626873]">
                Chat directly with our solutions team on WhatsApp for instant assistance.
              </p>
              <button
                type="button"
                onClick={handleOpenWhatsAppInquiry}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. STICKY MOBILE BOTTOM BUY BAR                                           */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E1DA] p-3.5 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-[#171A1F]">₹{authoritativePrice}</span>
            {comparePrice > authoritativePrice && (
              <span className="text-[11px] text-slate-400 line-through">₹{comparePrice}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="py-2.5 px-6 rounded-xl bg-[#C79A22] text-[#171A1F] font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>BUY NOW</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. FULL-SCREEN LIGHTBOX MODAL (Responsive, Next/Prev, Keyboard)          */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Close (ESC)</span>
            </button>

            {/* Counter */}
            <div className="absolute -top-10 left-0 text-white/80 text-xs font-bold font-mono">
              Image {activeImageIndex + 1} of {allVisuals.length}
            </div>

            {/* Main Lightbox Image */}
            <div className="w-full max-h-[78vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-2xl relative">
              <img
                src={allVisuals[activeImageIndex]}
                alt={`Lightbox view ${activeImageIndex + 1}`}
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />

              {/* Prev / Next Navigation Arrows */}
              {allVisuals.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev - 1 + allVisuals.length) % allVisuals.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev + 1) % allVisuals.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails Strip in Lightbox */}
            {allVisuals.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {allVisuals.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx ? 'border-[#C79A22] scale-110' : 'border-white/30 opacity-60'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SECURE MULTI-METHOD CHECKOUT MODAL                                     */}
      {/* ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#E4E1DA] shadow-2xl p-5 sm:p-7 space-y-5 text-left my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#171A1F] text-[#C79A22]">
                  <ShoppingBag className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#171A1F]">Complete Purchase</h3>
                  <p className="text-[11px] text-slate-500">Instant Delivery • 100% Verified Secure</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-slate-50 border border-[#E4E1DA] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">Selected Product</span>
                <div className="text-xs sm:text-sm font-black text-[#171A1F] truncate">{product.name}</div>
                <div className="text-[11px] text-slate-500">{product.productFileType || 'Digital File'} • Lifetime License</div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 line-through block">₹{comparePrice}</span>
                <span className="text-lg font-black text-[#C79A22]">₹{authoritativePrice}</span>
              </div>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setPaymentTab('gateway'); setErrorMessage(''); }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                  paymentTab === 'gateway'
                    ? 'bg-[#171A1F] text-[#C79A22] shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-white/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs">Online Gateway</span>
              </button>
              <button
                type="button"
                onClick={() => { setPaymentTab('upi_qr'); setErrorMessage(''); }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                  paymentTab === 'upi_qr'
                    ? 'bg-[#171A1F] text-[#C79A22] shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-white/60'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs">Direct UPI QR</span>
              </button>
              <button
                type="button"
                onClick={() => { setPaymentTab('whatsapp'); setErrorMessage(''); }}
                className={`py-2 px-1.5 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer ${
                  paymentTab === 'whatsapp'
                    ? 'bg-[#171A1F] text-emerald-400 shadow-sm'
                    : 'text-slate-600 hover:text-black hover:bg-white/60'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-xs">WhatsApp Buy</span>
              </button>
            </div>

            {/* Timeout Error Recovery Banner */}
            {isTimeoutError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>UPI Payment Timed Out / Bank App Delay</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Aapke UPI app (PhonePe / Google Pay) par notification aane me samay lag gaya. Fikar na karein! Aap <strong>Direct UPI QR Code</strong> scan karke bina kisi delay ke pay kar sakte hain ya seedha <strong>WhatsApp par file pa sakte hain</strong>.
                </p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => { setPaymentTab('upi_qr'); setErrorMessage(''); setIsTimeoutError(false); }}
                    className="py-1.5 px-3 rounded-xl bg-[#C79A22] text-[#171A1F] font-black text-[11px] shadow-sm hover:bg-[#b0871b] flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan Direct UPI QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenWhatsAppInquiry}
                    className="py-1.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Get File on WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* Standard Error Notice */}
            {errorMessage && !isTimeoutError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 1: ONLINE GATEWAY (RAZORPAY - ALL UPI, CARDS, NETBANKING)  */}
            {/* ============================================================= */}
            {paymentTab === 'gateway' && (
              <div className="space-y-4">
                {/* UPI Instructions helper box */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Quick Tip for UPI Users:</span>
                  </div>
                  <p className="text-blue-700 text-[10.5px] leading-relaxed">
                    When choosing UPI, open your <strong>PhonePe, Google Pay, or Paytm</strong> app within 5 minutes to approve the payment request. Or choose the <strong>Direct UPI QR</strong> tab above to scan & pay directly!
                  </p>
                </div>

                <form onSubmit={handlePayWithRazorpay} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#171A1F]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#171A1F]">Email Address (for instant file delivery) *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#171A1F]">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl bg-[#C79A22] hover:bg-[#b0871b] text-[#171A1F] font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isProcessing ? 'Connecting to Razorpay...' : `Pay ₹${authoritativePrice} via Gateway`}</span>
                  </button>
                </form>

                <div className="text-center text-[10px] text-slate-400">
                  Supports all UPI Apps, RuPay, Visa, MasterCard, NetBanking & Wallets.
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 2: DIRECT UPI QR CODE (SCAN & PAY VIA ANY UPI APP)        */}
            {/* ============================================================= */}
            {paymentTab === 'upi_qr' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex flex-col items-center text-center space-y-3">
                  <span className="text-[11px] font-extrabold text-[#171A1F] uppercase tracking-wider">
                    Scan using PhonePe, Google Pay, Paytm, or BHIM
                  </span>
                  
                  {/* Dynamic UPI QR Code */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#C79A22] shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                        `upi://pay?pa=9678377275@upi&pn=MANI%20Solution&am=${authoritativePrice}&cu=INR&tn=${encodeURIComponent(product.name)}`
                      )}`}
                      alt="MANI Solution UPI QR Code"
                      className="w-44 h-44 object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">Pay Exactly:</span>
                    <span className="text-base font-black text-[#171A1F]">₹{authoritativePrice}</span>
                  </div>

                  {/* UPI ID with Copy Button */}
                  <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#E4E1DA] text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">UPI ID:</span>
                      <span className="font-mono font-bold text-[#171A1F] truncate">9678377275@upi</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyUpiId('9678377275@upi')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      {copiedUpi ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>

                  {/* Direct Mobile UPI Intent Link */}
                  <a
                    href={`upi://pay?pa=9678377275@upi&pn=MANI%20Solution&am=${authoritativePrice}&cu=INR&tn=${encodeURIComponent(product.name)}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 sm:hidden transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tap to Pay Directly with Any UPI App</span>
                  </a>
                </div>

                {/* UTR Reference Submission Form */}
                <form onSubmit={handleVerifyManualUtr} className="space-y-3 text-xs pt-1 border-t border-[#E4E1DA]">
                  <div className="space-y-1">
                    <label className="font-bold text-[#171A1F]">Your Email Address (for file access) *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#171A1F]">
                      UPI 12-Digit Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428198765432"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Found in your PhonePe / GPay / Paytm payment details receipt
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingUtr || !utrNumber.trim()}
                    className="w-full py-3 rounded-2xl bg-[#171A1F] hover:bg-black text-[#C79A22] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isVerifyingUtr ? 'Verifying & Generating Access...' : 'Verify UTR & Download Now'}</span>
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleOpenWhatsAppInquiry}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                  >
                    Need assistance or want to send screenshot on WhatsApp? Click here
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 3: DIRECT WHATSAPP 1-CLICK BUY                            */}
            {/* ============================================================= */}
            {paymentTab === 'whatsapp' && (
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-2">
                  <div className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant WhatsApp Delivery & Support</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Prefer direct assistance? Our solutions team will verify your payment and send the official download link and installation guidance directly to your WhatsApp.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E4E1DA] text-left space-y-2 text-xs">
                  <div className="text-slate-500 text-[11px]">Product: <strong className="text-black">{product.name}</strong></div>
                  <div className="text-slate-500 text-[11px]">Price: <strong className="text-[#C79A22]">₹{authoritativePrice}</strong></div>
                  <div className="text-slate-500 text-[11px]">Support Number: <strong className="text-black">+91 96783 77275 / +91 99316 53196</strong></div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenWhatsAppInquiry}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat & Buy Directly on WhatsApp</span>
                </button>
              </div>
            )}

            <div className="text-center text-[10px] text-slate-400 border-t border-[#E4E1DA] pt-3">
              Official MANI Solution Digital Delivery • GST Invoice & 24/7 Technical Support
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
