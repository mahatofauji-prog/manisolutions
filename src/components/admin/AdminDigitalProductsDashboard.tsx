import React, { useState, useEffect, useRef } from 'react';
import { digitalProductsStorage, subscribeToDigitalProducts } from '../../services/digitalProductsStorage';
import { 
  DigitalProduct, 
  DigitalCategory, 
  DigitalOrder, 
  DigitalCoupon, 
  ProductTestimonial, 
  ProductFaq, 
  ProductOfferConfig 
} from '../../types';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  ShoppingBag, 
  Users, 
  Settings, 
  Layers, 
  CheckCircle2, 
  X, 
  Copy, 
  ExternalLink, 
  Share2, 
  Upload, 
  FileText, 
  Download, 
  AlertCircle, 
  Image as ImageIcon,
  Check,
  Eye,
  Star,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  DollarSign,
  Percent,
  Calendar,
  Lock,
  Archive,
  RefreshCw,
  Search
} from 'lucide-react';

export const AdminDigitalProductsDashboard: React.FC<{ onBackToSite: () => void }> = () => {
  const [subTab, setSubTab] = useState<'products' | 'categories' | 'orders' | 'customers' | 'coupons' | 'settings'>('products');
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [categories, setCategories] = useState<DigitalCategory[]>([]);
  const [orders, setOrders] = useState<DigitalOrder[]>([]);
  const [coupons, setCoupons] = useState<DigitalCoupon[]>([]);
  const [enableCouponsSetting, setEnableCouponsSetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add/Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'media' | 'pricing' | 'content' | 'testimonials' | 'faqs' | 'file' | 'publishing'>('basic');

  // Live Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form Field States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Trading');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [productType, setProductType] = useState<'Digital Download' | 'Online Access' | 'Both'>('Digital Download');
  
  // Media: 1 Cover + Up to 7 Gallery Images
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  // Pricing & Offer
  const [price, setPrice] = useState<number>(299);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(999);
  const [offerEnabled, setOfferEnabled] = useState(true);
  const [offerTitle, setOfferTitle] = useState('Special Launch Offer');
  const [offerBadge, setOfferBadge] = useState('70% OFF');
  const [offerText, setOfferText] = useState('Limited Time Offer');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');

  // Features & What You Get
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [whatYouGetList, setWhatYouGetList] = useState<string[]>([]);
  const [newWhatYouGetInput, setNewWhatYouGetInput] = useState('');

  // Unlimited Testimonials
  const [testimonials, setTestimonials] = useState<ProductTestimonial[]>([]);

  // Unlimited FAQs
  const [faqs, setFaqs] = useState<ProductFaq[]>([]);

  // Digital Product File States
  const [productFilePath, setProductFilePath] = useState('');
  const [productFileName, setProductFileName] = useState('');
  const [productFileSize, setProductFileSize] = useState('');
  const [productFileType, setProductFileType] = useState('');
  const [productFileUploadedAt, setProductFileUploadedAt] = useState('');

  // Status & Visibility
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  // Upload Feedback & Progress States
  type UploadStage = 'idle' | 'preparing' | 'uploading' | 'processing' | 'completed' | 'error';

  const [thumbnailUploadStage, setThumbnailUploadStage] = useState<UploadStage>('idle');
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [thumbnailUploadStatusText, setThumbnailUploadStatusText] = useState('');
  const thumbnailXhrRef = useRef<XMLHttpRequest | null>(null);

  const [galleryUploadStage, setGalleryUploadStage] = useState<UploadStage>('idle');
  const [galleryUploadProgress, setGalleryUploadProgress] = useState(0);
  const galleryXhrRef = useRef<XMLHttpRequest | null>(null);

  const [productUploadStage, setProductUploadStage] = useState<UploadStage>('idle');
  const [productFileUploadProgress, setProductFileUploadProgress] = useState(0);
  const [productUploadStatusText, setProductUploadStatusText] = useState('');
  const productXhrRef = useRef<XMLHttpRequest | null>(null);

  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs for hidden file inputs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminDownload = async (p: DigitalProduct) => {
    const filePath = p.productFilePath || '';
    const fileName = p.productFileName || 'digital-product.pdf';
    const url = `/api/digital/download?adminToken=mani_admin_secret_token_2026&filePath=${encodeURIComponent(filePath)}&fileName=${encodeURIComponent(fileName)}&productId=${p.id}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert('Download failed: ' + (errData.message || res.statusText));
        return;
      }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert('Download error: ' + (err.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    const load = () => {
      setProducts(digitalProductsStorage.getAll());
      setCategories(digitalProductsStorage.getCategories());
      setOrders(digitalProductsStorage.getOrders());
      setCoupons(digitalProductsStorage.getCoupons());
      setEnableCouponsSetting(digitalProductsStorage.getSettings().enableCoupons);
    };
    load();
    return subscribeToDigitalProducts(load);
  }, []);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategory(categories[0]?.name || 'E-books');
    setShortDesc('');
    setFullDesc('');
    setProductType('Digital Download');
    
    // Media
    setThumbnailUrl('https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop');
    setGalleryImages([]);
    setNewGalleryUrlInput('');

    // Pricing & Offer
    setPrice(299);
    setCompareAtPrice(999);
    setOfferEnabled(true);
    setOfferTitle('Special Launch Offer');
    setOfferBadge('70% OFF');
    setOfferText('Limited Time Offer');
    setOfferStartDate('');
    setOfferEndDate('');

    // Features & What You Get
    setFeaturesList(['Instant Secure Download', '100% Practical Implementation', 'Lifetime Free Updates']);
    setNewFeatureInput('');
    setWhatYouGetList(['Complete High-Resolution Digital Guide', 'Workflow Blueprints & Templates']);
    setNewWhatYouGetInput('');

    // Testimonials
    setTestimonials([]);

    // FAQs
    setFaqs([
      {
        id: 'faq-1',
        question: 'Is this product downloadable immediately after payment?',
        answer: 'Yes! After successful payment verification, you will receive instant access to download the digital file.',
        displayOrder: 1,
        status: 'published'
      }
    ]);
    
    // Digital file
    setProductFilePath('');
    setProductFileName('');
    setProductFileSize('');
    setProductFileType('');
    setProductFileUploadedAt('');

    // Stages
    setProductUploadStage('idle');
    setProductFileUploadProgress(0);
    setThumbnailUploadStage('idle');
    setThumbnailUploadProgress(0);
    setGalleryUploadStage('idle');
    setGalleryUploadProgress(0);

    setStatus('published');
    setIsFeatured(false);
    setFormError('');
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const openEditModal = (p: DigitalProduct) => {
    setEditingProduct(p);
    setName(p.name || '');
    setSlug(p.slug || '');
    setCategory(p.category || 'E-books');
    setShortDesc(p.shortDescription || '');
    setFullDesc(p.fullDescription || '');
    setProductType(p.productType || 'Digital Download');

    // Media
    setThumbnailUrl(p.thumbnailUrl || '');
    setGalleryImages(p.galleryImages || []);
    setNewGalleryUrlInput('');

    // Pricing & Offer
    setPrice(p.price || 0);
    setCompareAtPrice(p.compareAtPrice || 0);
    if (p.offer) {
      setOfferEnabled(p.offer.isEnabled ?? true);
      setOfferTitle(p.offer.title || 'Special Launch Offer');
      setOfferBadge(p.offer.badge || '70% OFF');
      setOfferText(p.offer.text || 'Limited Time Offer');
      setOfferStartDate(p.offer.startDate || '');
      setOfferEndDate(p.offer.endDate || '');
    } else {
      const disc = p.compareAtPrice && p.compareAtPrice > p.price 
        ? `${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% OFF` 
        : 'Special Offer';
      setOfferEnabled(Boolean(p.compareAtPrice && p.compareAtPrice > p.price));
      setOfferTitle('Special Offer');
      setOfferBadge(disc);
      setOfferText('Limited Time Deal');
      setOfferStartDate('');
      setOfferEndDate('');
    }

    // Features & What You Get
    setFeaturesList(p.features || []);
    setNewFeatureInput('');
    setWhatYouGetList(p.whatYouGet || []);
    setNewWhatYouGetInput('');

    // Testimonials
    setTestimonials(p.testimonials || []);

    // FAQs
    const rawFaqs = (p.faqs || []).map((f: any, idx) => ({
      id: f.id || `faq-${idx + 1}`,
      question: f.question || '',
      answer: f.answer || '',
      displayOrder: f.displayOrder || idx + 1,
      status: (f.status === 'hidden' ? 'hidden' : 'published') as 'published' | 'hidden'
    }));
    setFaqs(rawFaqs);

    // File metadata
    setProductFilePath(p.productFilePath || '');
    setProductFileName(p.productFileName || '');
    setProductFileSize(p.productFileSize || p.fileSize || '');
    setProductFileType(p.productFileType || '');
    setProductFileUploadedAt(p.productFileUploadedAt || '');

    setProductUploadStage(p.productFilePath || p.productFileName ? 'completed' : 'idle');
    setProductFileUploadProgress(0);
    setThumbnailUploadStage('idle');
    setThumbnailUploadProgress(0);
    setGalleryUploadStage('idle');
    setGalleryUploadProgress(0);

    setStatus(p.status || 'published');
    setIsFeatured(Boolean(p.isFeatured));
    setFormError('');
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  // Thumbnail Upload Handler
  const uploadThumbnailFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }
    setFormError('');
    setThumbnailUploadStage('preparing');
    setThumbnailUploadProgress(0);
    setThumbnailUploadStatusText('Uploading cover photo...');

    const formData = new FormData();
    formData.append('thumbnail', file);

    const xhr = new XMLHttpRequest();
    thumbnailXhrRef.current = xhr;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setThumbnailUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            setThumbnailUrl(res.url);
            setThumbnailUploadStage('completed');
            setThumbnailUploadStatusText('Cover photo uploaded successfully!');
            showToast('Cover photo updated.');
          } else {
            setThumbnailUploadStage('error');
            setFormError(res.message || 'Image upload failed.');
          }
        } catch {
          setThumbnailUploadStage('error');
          setFormError('Failed to parse server upload response.');
        }
      } else {
        setThumbnailUploadStage('error');
        setFormError(`Server error (${xhr.status}) during image upload.`);
      }
    };

    xhr.onerror = () => {
      setThumbnailUploadStage('error');
      setFormError('Network connection error during cover image upload.');
    };

    xhr.open('POST', '/api/digital/upload-thumbnail');
    xhr.send(formData);
  };

  // Gallery Image Upload Handler (Up to 7 gallery images)
  const uploadGalleryImage = (file: File) => {
    if (galleryImages.length >= 7) {
      setFormError('Maximum 7 gallery images allowed (in addition to Cover photo).');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      return;
    }
    setFormError('');
    setGalleryUploadStage('uploading');
    setGalleryUploadProgress(0);

    const formData = new FormData();
    formData.append('thumbnail', file);

    const xhr = new XMLHttpRequest();
    galleryXhrRef.current = xhr;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setGalleryUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            setGalleryImages(prev => [...prev, res.url].slice(0, 7));
            setGalleryUploadStage('completed');
            showToast('Gallery image added.');
          } else {
            setGalleryUploadStage('error');
            setFormError(res.message || 'Gallery upload failed.');
          }
        } catch {
          setGalleryUploadStage('error');
        }
      } else {
        setGalleryUploadStage('error');
      }
    };

    xhr.onerror = () => setGalleryUploadStage('error');
    xhr.open('POST', '/api/digital/upload-thumbnail');
    xhr.send(formData);
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrlInput.trim()) return;
    if (galleryImages.length >= 7) {
      setFormError('Maximum 7 gallery images allowed.');
      return;
    }
    setGalleryImages(prev => [...prev, newGalleryUrlInput.trim()].slice(0, 7));
    setNewGalleryUrlInput('');
  };

  const handleMoveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;
    const copy = [...galleryImages];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setGalleryImages(copy);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  // Product File Upload Handler (Chunked Direct Stream Upload - Bypasses Serverless Request Size Limits)
  const uploadProductFile = async (file: File) => {
    if (!file) return;

    const targetProdId = editingProduct?.id || 'DP-PENDING-' + Date.now();
    setFormError('');
    setProductUploadStage('preparing');
    setProductFileUploadProgress(0);
    setProductUploadStatusText('Preparing secure direct upload...');

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB per chunk to stay well under serverless payload limits
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      setProductUploadStage('uploading');

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end);

        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', String(chunkIndex));
        formData.append('totalChunks', String(totalChunks));
        formData.append('fileName', file.name);
        formData.append('productId', targetProdId);
        formData.append('chunk', chunkBlob, file.name);

        setProductUploadStatusText(`Uploading file chunk ${chunkIndex + 1} of ${totalChunks}...`);

        const qParams = new URLSearchParams({
          uploadId,
          chunkIndex: String(chunkIndex),
          totalChunks: String(totalChunks),
          fileName: file.name,
          productId: targetProdId
        }).toString();

        const res = await fetch(`/api/digital/upload-chunk?${qParams}`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Server error (${res.status}) during chunk upload.`);
        }

        const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setProductFileUploadProgress(percent);
      }

      setProductUploadStatusText('Finalizing and verifying digital asset...');

      // Finalize upload request
      const finalizeRes = await fetch('/api/digital/finalize-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          fileName: file.name,
          totalChunks,
          productId: targetProdId
        })
      });

      if (!finalizeRes.ok) {
        const errData = await finalizeRes.json().catch(() => ({}));
        throw new Error(errData.message || `Server error (${finalizeRes.status}) during upload finalization.`);
      }

      const finalData = await finalizeRes.json();
      if (finalData.success && finalData.filePath) {
        setProductFilePath(finalData.filePath);
        setProductFileName(finalData.fileName || file.name);
        setProductFileSize(finalData.fileSize || '');
        setProductFileType(finalData.fileType || '');
        setProductFileUploadedAt(finalData.uploadedAt || new Date().toISOString());
        setProductUploadStage('completed');
        setProductUploadStatusText('File uploaded securely!');
        showToast('Digital asset uploaded successfully.');
      } else {
        throw new Error(finalData.message || 'Failed to finalize uploaded file.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setProductUploadStage('error');
      setProductFileUploadProgress(0);
      setFormError(err.message || 'Digital file upload failed. Please try again.');
    }
  };

  // Testimonials Helpers (UNLIMITED)
  const handleAddTestimonial = () => {
    const newT: ProductTestimonial = {
      id: `t-${Date.now()}`,
      productId: editingProduct?.id,
      customerName: '',
      rating: 5,
      testimonialText: '',
      designation: '',
      displayOrder: testimonials.length + 1,
      status: 'published'
    };
    setTestimonials(prev => [...prev, newT]);
  };

  const handleUpdateTestimonial = (index: number, field: keyof ProductTestimonial, value: any) => {
    setTestimonials(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveTestimonial = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= testimonials.length) return;
    const copy = [...testimonials];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    // update displayOrder
    copy.forEach((t, i) => { t.displayOrder = i + 1; });
    setTestimonials(copy);
  };

  // FAQs Helpers (UNLIMITED)
  const handleAddFaq = () => {
    const newF: ProductFaq = {
      id: `faq-${Date.now()}`,
      productId: editingProduct?.id,
      question: '',
      answer: '',
      displayOrder: faqs.length + 1,
      status: 'published'
    };
    setFaqs(prev => [...prev, newF]);
  };

  const handleUpdateFaq = (index: number, field: keyof ProductFaq, value: any) => {
    setFaqs(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    const copy = [...faqs];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    copy.forEach((f, i) => { f.displayOrder = i + 1; });
    setFaqs(copy);
  };

  // Save Product Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Product Name is required.');
      setActiveFormTab('basic');
      return;
    }

    const cleanPrice = Number(price);
    if (isNaN(cleanPrice) || cleanPrice <= 0) {
      setFormError('Please enter a valid Product Price greater than ₹0.');
      setActiveFormTab('pricing');
      return;
    }

    const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(name);
    
    // Validate clean testimonials
    const cleanTestimonials: ProductTestimonial[] = testimonials
      .filter(t => t.customerName.trim() || t.testimonialText.trim())
      .map((t, i) => ({
        ...t,
        id: t.id || `t-${i + 1}`,
        displayOrder: i + 1
      }));

    // Validate clean FAQs
    const cleanFaqs: ProductFaq[] = faqs
      .filter(f => f.question.trim() || f.answer.trim())
      .map((f, i) => ({
        ...f,
        id: f.id || `faq-${i + 1}`,
        displayOrder: i + 1
      }));

    const offerConfig: ProductOfferConfig = {
      isEnabled: offerEnabled,
      title: offerTitle.trim() || 'Special Offer',
      badge: offerBadge.trim() || (compareAtPrice > cleanPrice ? `${Math.round(((compareAtPrice - cleanPrice) / compareAtPrice) * 100)}% OFF` : 'SPECIAL'),
      text: offerText.trim() || 'Limited Time Offer',
      startDate: offerStartDate || undefined,
      endDate: offerEndDate || undefined
    };

    setIsSavingProduct(true);
    setFormError('');

    try {
      const payload: Omit<DigitalProduct, 'id' | 'createdAt'> = {
        name: name.trim(),
        slug: finalSlug,
        category: category.trim() || 'E-books',
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim() || shortDesc.trim(),
        thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
        galleryImages: galleryImages.slice(0, 7),
        productType,
        price: cleanPrice,
        compareAtPrice: compareAtPrice > 0 ? compareAtPrice : undefined,
        offer: offerConfig,
        features: featuresList.filter(Boolean),
        whatYouGet: whatYouGetList.filter(Boolean),
        testimonials: cleanTestimonials,
        faqs: cleanFaqs,
        productFilePath: productFilePath || undefined,
        productFileName: productFileName || undefined,
        productFileSize: productFileSize || undefined,
        productFileType: productFileType || undefined,
        productFileUploadedAt: productFileUploadedAt || undefined,
        status,
        isFeatured,
        downloadsCount: editingProduct?.downloadsCount || 0
      };

      await digitalProductsStorage.saveProduct(payload, editingProduct?.id);
      setIsSavingProduct(false);
      setIsModalOpen(false);
      showToast(`Product "${name}" saved successfully.`);
    } catch (err: any) {
      setIsSavingProduct(false);
      setFormError('Failed to save product: ' + (err.message || 'Unknown error'));
    }
  };

  const handleQuickToggleStatus = async (p: DigitalProduct) => {
    const nextStatus = p.status === 'published' ? 'draft' : 'published';
    await digitalProductsStorage.saveProduct({ ...p, status: nextStatus }, p.id);
    showToast(`Product ${nextStatus === 'published' ? 'published to public store' : 'moved to draft'}.`);
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to delete product "${prodName}"? This action cannot be undone.`)) {
      await digitalProductsStorage.deleteProduct(id);
      showToast(`Product "${prodName}" deleted.`);
    }
  };

  const handleCopyPublicLink = (prodSlug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/product/${prodSlug}`;
    navigator.clipboard.writeText(url);
    showToast('Public product link copied to clipboard!');
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(q) || 
      p.slug.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Calculate live discount percentage for pricing form
  const calcDiscountPercent = compareAtPrice > price && price > 0
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E1DA] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#171A1F]">Digital Products CMS</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Super Store Architecture
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Single Source of Truth for digital guides, e-books, offline software, and commercial digital assets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#171A1F] text-[#C79A22] text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-black transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'products', label: `Products (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'categories', label: `Categories (${categories.length})`, icon: <Tag className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: <Percent className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              subTab === t.id
                ? 'bg-[#171A1F] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SUBTAB: PRODUCTS CATALOG */}
      {subTab === 'products' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E4E1DA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, category, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4E1DA] text-xs focus:outline-none focus:border-[#C79A22]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E4E1DA] text-xs font-bold bg-white cursor-pointer"
              >
                <option value="ALL">All Statuses ({products.length})</option>
                <option value="published">Published ({products.filter(p => p.status === 'published').length})</option>
                <option value="draft">Draft ({products.filter(p => p.status === 'draft').length})</option>
                <option value="archived">Archived ({products.filter(p => p.status === 'archived').length})</option>
              </select>
            </div>
          </div>

          {/* Products Grid / Table */}
          <div className="bg-white rounded-2xl border border-[#E4E1DA] shadow-sm overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No digital products found</p>
                <p className="text-xs text-slate-500">Click &quot;Add New Product&quot; to configure a new digital offering.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E4E1DA]">
                {filteredProducts.map(prod => {
                  const disc = prod.compareAtPrice && prod.compareAtPrice > prod.price
                    ? Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)
                    : 0;

                  return (
                    <div key={prod.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#E4E1DA]">
                          <img
                            src={prod.thumbnailUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                          {prod.isFeatured && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase shadow">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-extrabold text-[#171A1F]">
                              {prod.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {prod.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              prod.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {prod.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-[#626873] line-clamp-1 max-w-xl">
                            {prod.shortDescription || 'No description provided.'}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 flex-wrap">
                            <span className="font-mono text-slate-600 font-bold">
                              Slug: /{prod.slug}
                            </span>
                            <span>•</span>
                            <span>
                              Gallery: <strong>{prod.galleryImages?.length || 0}/7</strong> visuals
                            </span>
                            <span>•</span>
                            <span>
                              Testimonials: <strong>{prod.testimonials?.length || 0}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              FAQs: <strong>{prod.faqs?.length || 0}</strong>
                            </span>
                            {prod.productFileName && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {prod.productFileName} ({prod.productFileSize || prod.productFileType || 'Asset'})
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        {/* Price Display */}
                        <div className="text-right">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            <span className="text-base font-extrabold text-[#171A1F]">
                              ₹{prod.price}
                            </span>
                            {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{prod.compareAtPrice}
                              </span>
                            )}
                          </div>
                          {disc > 0 && (
                            <span className="text-[10px] font-extrabold text-emerald-600 uppercase">
                              {disc}% OFF
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Quick Toggle Publish */}
                          <button
                            onClick={() => handleQuickToggleStatus(prod)}
                            title={prod.status === 'published' ? 'Unpublish to Draft' : 'Publish Product'}
                            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              prod.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Share Public Link */}
                          <button
                            onClick={() => handleCopyPublicLink(prod.slug)}
                            title="Copy Public Product Link"
                            className="p-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Admin File Download */}
                          {prod.productFilePath && (
                            <button
                              onClick={() => handleAdminDownload(prod)}
                              title="Download Asset (Admin Verification)"
                              className="p-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit Product */}
                          <button
                            onClick={() => openEditModal(prod)}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-[#171A1F] text-[#C79A22] hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            title="Delete Product"
                            className="p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: CATEGORIES */}
      {subTab === 'categories' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E4E1DA] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#171A1F]">Digital Product Categories</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 rounded-xl border border-[#E4E1DA] bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#171A1F]">{cat.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">slug: {cat.slug}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 text-[10px] font-bold border border-slate-200">
                  {products.filter(p => p.category === cat.name).length} Products
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: ORDERS */}
      {subTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden">
          <div className="p-5 border-b border-[#E4E1DA] flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#171A1F]">Digital Product Sales & Orders</h3>
            <span className="text-xs text-slate-500 font-bold">{orders.length} Verified Orders</span>
          </div>
          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-bold">
              No orders recorded yet. Verified purchases will automatically populate here.
            </div>
          ) : (
            <div className="divide-y divide-[#E4E1DA]">
              {orders.map(o => (
                <div key={o.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#171A1F]">{o.customerName} ({o.customerEmail})</div>
                    <div className="text-slate-500 text-[11px] font-mono">Order: {o.id} • Razorpay: {o.paymentId || 'Verified'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#171A1F]">₹{o.totalAmount}</div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {o.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: COUPONS */}
      {subTab === 'coupons' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E4E1DA] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#171A1F]">Promotional Coupon Codes</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              enableCouponsSetting ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
            }`}>
              Coupons: {enableCouponsSetting ? 'ENABLED' : 'DISABLED (Protected Selling Price)'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-[#E4E1DA] bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#171A1F] text-[#C79A22] font-mono text-xs font-bold">
                    {c.code}
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Flat Off`}
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 font-bold">Limit: {c.usageLimit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: SETTINGS */}
      {subTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E4E1DA] space-y-4 max-w-xl">
          <h3 className="text-sm font-extrabold text-[#171A1F]">Digital Store Settings</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E4E1DA] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#171A1F]">Enable Promotional Coupons at Checkout</div>
              <div className="text-[11px] text-slate-500">Allow customers to input promo codes. By default, disabled to protect authoritative selling price.</div>
            </div>
            <input
              type="checkbox"
              checked={enableCouponsSetting}
              onChange={async (e) => {
                const checked = e.target.checked;
                setEnableCouponsSetting(checked);
                await digitalProductsStorage.saveSettings({ enableCoupons: checked });
                showToast(`Coupons ${checked ? 'enabled' : 'disabled'}.`);
              }}
              className="w-4 h-4 accent-[#C79A22] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROFESSIONAL E-COMMERCE ADD / EDIT PRODUCT MODAL                          */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#E4E1DA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-[#E4E1DA] bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#171A1F] text-[#C79A22]">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[#171A1F]">
                    {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
                  </h3>
                  <p className="text-[11px] text-[#626873]">
                    Configure comprehensive product information, media gallery, pricing, offer, testimonials, and FAQs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Page</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabbed Navigation */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-[#E4E1DA] bg-white overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'media', label: `2. Media (${1 + galleryImages.length}/8)` },
                { id: 'pricing', label: '3. Pricing & Offer' },
                { id: 'content', label: '4. Features' },
                { id: 'testimonials', label: `5. Testimonials (${testimonials.length})` },
                { id: 'faqs', label: `6. FAQs (${faqs.length})` },
                { id: 'file', label: '7. Digital Asset' },
                { id: 'publishing', label: '8. Status' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                    activeFormTab === tab.id
                      ? 'border-[#C79A22] text-[#171A1F] bg-slate-50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-800">
              
              {/* Form Error Alert */}
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-extrabold text-[#171A1F]">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AI से अपना Business Grow कैसे करें?"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!editingProduct) setSlug(generateSlug(e.target.value));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-semibold text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-extrabold text-[#171A1F]">Slug (URL Identifier)</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-[#E4E1DA] rounded-l-xl text-slate-500 font-mono">
                          /product/
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="ai-business-growth-guide"
                          value={slug}
                          onChange={(e) => setSlug(generateSlug(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-r-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-extrabold text-[#171A1F]">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-bold bg-white cursor-pointer"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-extrabold text-[#171A1F]">Product Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Digital Download', 'Online Access', 'Both'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setProductType(t)}
                            className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                              productType === t
                                ? 'bg-[#171A1F] text-white border-[#171A1F]'
                                : 'bg-white text-slate-600 border-[#E4E1DA] hover:bg-slate-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-extrabold text-[#171A1F]">Short Summary / Tagline</label>
                      <textarea
                        rows={2}
                        placeholder="Brief 1-2 sentence overview shown in store catalogue and hero cards."
                        value={shortDesc}
                        onChange={(e) => setShortDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="font-extrabold text-[#171A1F]">Rich Product Description (Markdown / Headings / Bullet Lists)</label>
                        <span className="text-[10px] text-slate-400 font-mono">Supports # Headings, **Bold**, - Lists</span>
                      </div>
                      <textarea
                        rows={6}
                        placeholder="Complete details of what the product covers, practical modules, chapters, and instructions."
                        value={fullDesc}
                        onChange={(e) => setFullDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & PRODUCT GALLERY (1 Cover + UP TO 7 Gallery Images = 8 visuals) */}
              {activeFormTab === 'media' && (
                <div className="space-y-6">
                  {/* Primary Cover Image */}
                  <div className="p-4 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-[#171A1F] text-sm">1. Primary Cover Photo</span>
                        <p className="text-[11px] text-[#626873]">Used as primary visual on Store Cards and Product Detail hero.</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#171A1F] text-[#C79A22] text-[10px] font-black uppercase">
                        Primary Cover
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white border border-[#E4E1DA] shrink-0 relative group">
                        <img
                          src={thumbnailUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-1 w-full">
                        <input
                          type="text"
                          placeholder="Image URL or upload below..."
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] text-xs font-mono"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={thumbnailInputRef}
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadThumbnailFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="px-3.5 py-1.5 rounded-xl bg-[#171A1F] text-white hover:bg-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C79A22]" />
                            <span>Upload Cover</span>
                          </button>

                          {thumbnailUploadStage === 'uploading' && (
                            <span className="text-xs text-blue-600 font-bold">Uploading {thumbnailUploadProgress}%</span>
                          )}
                          {thumbnailUploadStage === 'completed' && (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Gallery: Up to 7 Images */}
                  <div className="p-4 rounded-2xl border border-[#E4E1DA] bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E1DA] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#171A1F] text-sm">2. Product Gallery</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {galleryImages.length} of 7 Images
                          </span>
                        </div>
                        <p className="text-[11px] text-[#626873]">
                          Provide up to 7 gallery screenshots / preview slides for the public product gallery &amp; lightbox.
                        </p>
                      </div>

                      {galleryImages.length < 7 && (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={galleryInputRef}
                            accept="image/*"
                            onChange={(e) => {
                              if (e.files?.[0] || (e.target as any).files?.[0]) {
                                uploadGalleryImage((e.target as any).files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C79A22]" />
                            <span>+ Upload Gallery Image</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Add URL input */}
                    {galleryImages.length < 7 && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Or paste image URL to add..."
                          value={newGalleryUrlInput}
                          onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGalleryUrl();
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#E4E1DA] text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryUrl}
                          className="px-3.5 py-2 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs cursor-pointer hover:bg-black"
                        >
                          Add URL
                        </button>
                      </div>
                    )}

                    {/* Gallery Items List with Preview, Reorder & Remove */}
                    {galleryImages.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-[#E4E1DA] rounded-xl">
                        No gallery images added yet. Click above to add up to 7 gallery visuals.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl border border-[#E4E1DA] bg-slate-50 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E4E1DA] bg-white shrink-0">
                                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[10px] text-slate-600 font-mono line-clamp-1 max-w-[140px]">
                                {imgUrl}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveGalleryImage(idx, 'up')}
                                className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === galleryImages.length - 1}
                                onClick={() => handleMoveGalleryImage(idx, 'down')}
                                className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & OFFER */}
              {activeFormTab === 'pricing' && (
                <div className="space-y-6">
                  {/* Authoritative Pricing */}
                  <div className="p-5 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-4">
                    <div>
                      <h4 className="font-extrabold text-[#171A1F] text-sm">Product Pricing</h4>
                      <p className="text-[11px] text-[#626873]">
                        The Product Price is the authoritative selling amount charged to customer on Razorpay.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-extrabold text-[#171A1F]">Product Price (₹ INR) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="299"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-black text-sm"
                          />
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">Authoritative checkout charge</span>
                      </div>

                      <div className="space-y-1">
                        <label className="font-extrabold text-[#171A1F]">Compare-at Price (₹ INR)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            min={0}
                            placeholder="999"
                            value={compareAtPrice}
                            onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22] font-bold text-sm"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">Crossed out on website for anchor comparison</span>
                      </div>
                    </div>

                    {/* Calculated Discount Display */}
                    {calcDiscountPercent > 0 && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-between text-xs">
                        <span>Dynamic Calculated Discount:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold">
                          {calcDiscountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dedicated Offer Configuration */}
                  <div className="p-5 rounded-2xl border border-[#E4E1DA] bg-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-[#171A1F] text-sm">Offer &amp; Badge Configuration</h4>
                        <p className="text-[11px] text-[#626873]">Display special launch banners and badges without altering base price.</p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={offerEnabled}
                          onChange={(e) => setOfferEnabled(e.target.checked)}
                          className="w-4 h-4 accent-[#C79A22]"
                        />
                        <span className="font-extrabold text-xs text-[#171A1F]">Offer Enabled</span>
                      </label>
                    </div>

                    {offerEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="font-bold text-[#171A1F]">Offer Title</label>
                          <input
                            type="text"
                            placeholder="Special Launch Offer"
                            value={offerTitle}
                            onChange={(e) => setOfferTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#171A1F]">Offer Badge</label>
                          <input
                            type="text"
                            placeholder="70% OFF"
                            value={offerBadge}
                            onChange={(e) => setOfferBadge(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] font-bold text-amber-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#171A1F]">Offer Text / Subtitle</label>
                          <input
                            type="text"
                            placeholder="Limited Time Deal"
                            value={offerText}
                            onChange={(e) => setOfferText(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: FEATURES & WHAT YOU GET */}
              {activeFormTab === 'content' && (
                <div className="space-y-6">
                  {/* Key Features */}
                  <div className="p-4 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[#171A1F]">Key Product Features</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{featuresList.length} Features</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add key feature..."
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newFeatureInput.trim()) {
                              setFeaturesList(prev => [...prev, newFeatureInput.trim()]);
                              setNewFeatureInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#E4E1DA] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureInput.trim()) {
                            setFeaturesList(prev => [...prev, newFeatureInput.trim()]);
                            setNewFeatureInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {featuresList.map((feat, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white border border-[#E4E1DA] flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#C79A22]" />
                            <span>{feat}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setFeaturesList(prev => prev.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What You Get / Deliverables */}
                  <div className="p-4 rounded-2xl border border-[#E4E1DA] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[#171A1F]">What You Get / Deliverables</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{whatYouGetList.length} Items</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 120-Page High Resolution PDF E-book..."
                        value={newWhatYouGetInput}
                        onChange={(e) => setNewWhatYouGetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newWhatYouGetInput.trim()) {
                              setWhatYouGetList(prev => [...prev, newWhatYouGetInput.trim()]);
                              setNewWhatYouGetInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#E4E1DA] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newWhatYouGetInput.trim()) {
                            setWhatYouGetList(prev => [...prev, newWhatYouGetInput.trim()]);
                            setNewWhatYouGetInput('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {whatYouGetList.map((item, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-[#E4E1DA] flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <span>{item}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setWhatYouGetList(prev => prev.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TESTIMONIALS (UNLIMITED) */}
              {activeFormTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E1DA] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-[#171A1F] text-sm">Customer Testimonials</h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          {testimonials.length} Total
                        </span>
                      </div>
                      <p className="text-[11px] text-[#626873]">
                        Add unlimited real customer reviews. If empty, the public website will show &quot;No testimonials yet.&quot;
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="px-3.5 py-1.5 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Testimonial</span>
                    </button>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-[#E4E1DA] rounded-2xl">
                      No testimonials added for this product yet. Click &quot;+ Add Testimonial&quot; above to add genuine customer feedback.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testimonials.map((t, idx) => (
                        <div key={t.id || idx} className="p-4 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-[#171A1F] flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>Testimonial #{idx + 1}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              {/* Publish / Hide */}
                              <button
                                type="button"
                                onClick={() => handleUpdateTestimonial(idx, 'status', t.status === 'published' ? 'hidden' : 'published')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                                  t.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                                }`}
                              >
                                {t.status === 'published' ? 'PUBLISHED' : 'HIDDEN'}
                              </button>

                              {/* Reorder */}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveTestimonial(idx, 'up')}
                                className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === testimonials.length - 1}
                                onClick={() => handleMoveTestimonial(idx, 'down')}
                                className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleRemoveTestimonial(idx)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600">Customer Name *</label>
                              <input
                                type="text"
                                placeholder="Rahul Sharma"
                                value={t.customerName}
                                onChange={(e) => handleUpdateTestimonial(idx, 'customerName', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600">Designation / Business</label>
                              <input
                                type="text"
                                placeholder="Business Owner, Delhi"
                                value={t.designation || ''}
                                onChange={(e) => handleUpdateTestimonial(idx, 'designation', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600">Rating (1 to 5 Stars)</label>
                              <select
                                value={t.rating || 5}
                                onChange={(e) => handleUpdateTestimonial(idx, 'rating', Number(e.target.value))}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs font-bold"
                              >
                                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                <option value={2}>⭐⭐ (2 Stars)</option>
                                <option value={1}>⭐ (1 Star)</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="text-[10px] font-bold text-slate-600">Testimonial Review Text *</label>
                              <textarea
                                rows={2}
                                placeholder="Very useful guide for understanding AI automation..."
                                value={t.testimonialText}
                                onChange={(e) => handleUpdateTestimonial(idx, 'testimonialText', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: FAQS (UNLIMITED) */}
              {activeFormTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E1DA] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-[#171A1F] text-sm">Frequently Asked Questions (FAQ)</h4>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                          {faqs.length} Total
                        </span>
                      </div>
                      <p className="text-[11px] text-[#626873]">
                        Add unlimited FAQs displayed in accordion style on the public product page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3.5 py-1.5 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add FAQ</span>
                    </button>
                  </div>

                  {faqs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-[#E4E1DA] rounded-2xl">
                      No FAQs configured for this product. Click &quot;+ Add FAQ&quot; above to add common questions and answers.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {faqs.map((f, idx) => (
                        <div key={f.id || idx} className="p-4 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-[#171A1F] flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                              <span>FAQ #{idx + 1}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              {/* Publish / Hide */}
                              <button
                                type="button"
                                onClick={() => handleUpdateFaq(idx, 'status', f.status === 'published' ? 'hidden' : 'published')}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                                  f.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                                }`}
                              >
                                {f.status === 'published' ? 'PUBLISHED' : 'HIDDEN'}
                              </button>

                              {/* Reorder */}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveFaq(idx, 'up')}
                                className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === faqs.length - 1}
                                onClick={() => handleMoveFaq(idx, 'down')}
                                className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(idx)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600">Question *</label>
                              <input
                                type="text"
                                placeholder="e.g. Is this product downloadable immediately?"
                                value={f.question}
                                onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600">Answer *</label>
                              <textarea
                                rows={2}
                                placeholder="e.g. Yes, after successful payment verification, you receive instant download access."
                                value={f.answer}
                                onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#E4E1DA] bg-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: DIGITAL ASSET FILE */}
              {activeFormTab === 'file' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-4">
                    <div>
                      <h4 className="font-extrabold text-[#171A1F] text-sm">Protected Digital Asset File</h4>
                      <p className="text-[11px] text-[#626873]">
                        Upload the actual file for customer download upon verified Razorpay payment. Supported: PDF, APK, ZIP, XLS, XLSX, CSV, DOC, DOCX, PPT, PPTX, EXE, HTML.
                      </p>
                    </div>

                    {productFilePath || productFileName ? (
                      <div className="p-4 rounded-xl bg-white border border-[#E4E1DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <FileText className="w-6 h-6" />
                          </span>
                          <div>
                            <div className="font-bold text-sm text-[#171A1F]">{productFileName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>Size: {productFileSize || 'Uploaded'}</span>
                              <span>•</span>
                              <span>Type: {productFileType || 'Secure Asset'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={productFileInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadProductFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => productFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                          >
                            Replace File
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-[#E4E1DA] bg-white text-center space-y-3">
                        <Upload className="w-8 h-8 text-[#C79A22] mx-auto" />
                        <div>
                          <p className="font-bold text-slate-700 text-xs">No digital file uploaded for this product yet.</p>
                          <p className="text-[11px] text-slate-500">Select any digital asset file from your computer.</p>
                        </div>

                        <input
                          type="file"
                          ref={productFileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadProductFile(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-[#171A1F] text-[#C79A22] font-bold text-xs cursor-pointer hover:bg-black shadow"
                        >
                          Select Digital File
                        </button>
                      </div>
                    )}

                    {productUploadStage === 'uploading' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-blue-700">
                          <span>{productUploadStatusText}</span>
                          <span>{productFileUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${productFileUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: PUBLISHING & STATUS */}
              {activeFormTab === 'publishing' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-[#E4E1DA] bg-slate-50 space-y-4">
                    <h4 className="font-extrabold text-[#171A1F] text-sm">Product Visibility &amp; Status</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['published', 'draft', 'archived'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`p-3.5 rounded-2xl border font-bold text-left transition-all cursor-pointer ${
                            status === st
                              ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-sm'
                              : 'bg-white text-slate-700 border-[#E4E1DA] hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-xs uppercase font-extrabold">{st}</div>
                          <div className="text-[10px] opacity-70 mt-0.5">
                            {st === 'published' ? 'Visible in public store' : st === 'draft' ? 'Hidden from customers' : 'Stored in archives'}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E4E1DA] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#171A1F] text-xs">Featured Product</div>
                        <div className="text-[11px] text-slate-500">Showcase this item at the top of the store and homepage.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#C79A22] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-[#E4E1DA] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-500">
                  Authoritative Price: <strong className="text-[#171A1F]">₹{price}</strong>
                  {compareAtPrice > price && <span className="ml-1.5 text-emerald-600 font-bold">({calcDiscountPercent}% OFF)</span>}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2.5 rounded-xl bg-[#C79A22] hover:bg-[#b0871b] text-[#171A1F] font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN PRODUCT PREVIEW MODAL (Simulating Public Detail Page)               */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--theme-bg-main)] w-full max-w-5xl rounded-3xl border border-[#E4E1DA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="p-4 bg-[#171A1F] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C79A22]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#C79A22]">Public Product Detail Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[var(--theme-bg-secondary)]">
              {/* Product Top Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visuals */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-[#E4E1DA] bg-white shadow-sm relative">
                    <img
                      src={thumbnailUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    {offerEnabled && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md">
                        {offerBadge || '70% OFF'}
                      </span>
                    )}
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      <div className="w-16 h-16 rounded-xl border-2 border-[#C79A22] overflow-hidden shrink-0">
                        <img src={thumbnailUrl} className="w-full h-full object-cover" />
                      </div>
                      {galleryImages.map((g, i) => (
                        <div key={i} className="w-16 h-16 rounded-xl border border-[#E4E1DA] overflow-hidden shrink-0">
                          <img src={g} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="lg:col-span-6 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-[#C79A22] text-xs font-bold uppercase">
                    {category}
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F]">
                    {name || 'Product Title Preview'}
                  </h1>

                  <p className="text-xs text-[#626873]">
                    {shortDesc || 'Short description summary.'}
                  </p>

                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#171A1F]">₹{price}</span>
                      {compareAtPrice > price && (
                        <span className="text-sm text-slate-400 line-through">₹{compareAtPrice}</span>
                      )}
                      {calcDiscountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {calcDiscountPercent}% OFF
                        </span>
                      )}
                    </div>
                    {offerEnabled && (
                      <div className="text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                        ⚡ {offerTitle}: {offerText}
                      </div>
                    )}
                  </div>

                  <div className="w-full py-3.5 rounded-2xl bg-[#C79A22] text-[#171A1F] font-black text-center text-sm shadow-md">
                    BUY NOW FOR ₹{price} (RAZORPAY CHECKOUT)
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] space-y-3">
                <h3 className="text-base font-extrabold text-[#171A1F]">Product Overview &amp; Curriculum</h3>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {fullDesc || shortDesc || 'No detailed description entered.'}
                </div>
              </div>

              {/* Testimonials Preview */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#171A1F]">Customer Reviews</h3>
                {testimonials.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No testimonials yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {testimonials.map((t, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E4E1DA] space-y-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-700 italic">&quot;{t.testimonialText}&quot;</p>
                        <div className="text-[11px] font-bold text-[#171A1F]">{t.customerName} {t.designation && `• ${t.designation}`}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQs Preview */}
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-[#171A1F]">Frequently Asked Questions</h3>
                {faqs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No FAQs available.</p>
                ) : (
                  <div className="space-y-2">
                    {faqs.map((f, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E4E1DA] space-y-1">
                        <div className="font-extrabold text-xs text-[#171A1F]">Q: {f.question}</div>
                        <div className="text-xs text-[#626873]">A: {f.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#E4E1DA] text-right">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#171A1F] text-white font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
