import React, { useState, useEffect } from 'react';
import { DigitalProduct, DigitalOrder } from '../../types';
import { digitalProductsStorage } from '../../services/digitalProductsStorage';
import { 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  ShoppingBag
} from 'lucide-react';

interface DigitalThankYouPageProps {
  onNavigateHome: () => void;
  onNavigateStore: () => void;
}

export const DigitalThankYouPage: React.FC<DigitalThankYouPageProps> = ({
  onNavigateHome,
  onNavigateStore
}) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [order, setOrder] = useState<DigitalOrder | null>(null);
  const [downloadToken, setDownloadToken] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const verifyPurchase = async () => {
      setIsVerifying(true);
      setErrorMessage('');

      if (typeof window === 'undefined') return;

      let storedOrder: any = null;
      try {
        const raw = localStorage.getItem('last_completed_order');
        if (raw) storedOrder = JSON.parse(raw);
      } catch {}

      const urlParams = new URLSearchParams(window.location.search || window.location.hash.substring(window.location.hash.indexOf('?')));
      const paymentId = urlParams.get('razorpay_payment_id') || urlParams.get('payment_id') || urlParams.get('razorpay_payment_link_id') || storedOrder?.paymentId;
      const productId = urlParams.get('product_id') || urlParams.get('productId') || urlParams.get('id') || storedOrder?.productId;
      const customerEmail = urlParams.get('customer_email') || urlParams.get('email') || urlParams.get('customerEmail') || storedOrder?.customerEmail;
      const customerName = urlParams.get('customer_name') || urlParams.get('name') || urlParams.get('customerName') || storedOrder?.customerName || 'Valued Customer';
      const customerPhone = urlParams.get('customer_phone') || urlParams.get('phone') || storedOrder?.customerPhone || '';
      const orderId = urlParams.get('order_id') || urlParams.get('orderId') || storedOrder?.orderId;
      const rawAmount = urlParams.get('amount') || (storedOrder?.amount ? String(storedOrder.amount) : undefined);

      // Check if this was a direct visit without any parameters or stored order
      if (!paymentId && !orderId && !productId && !storedOrder) {
        setIsVerified(false);
        setIsVerifying(false);
        setErrorMessage('🔒 Unauthorized Access: No verified payment record found. Please purchase a digital product from our store to receive download access.');
        return;
      }

      try {
        // Call backend payment verification endpoint
        const res = await fetch('/api/digital/payment/verify-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentId || 'PAGE_PAY_' + Date.now(),
            orderId: orderId || `ORD-2026-${String(Date.now()).slice(-5)}`,
            productId,
            customerEmail: customerEmail || 'customer@manisolutions.com',
            customerName,
            customerPhone,
            amount: rawAmount ? Number(rawAmount) : undefined
          })
        });

        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);
          setDownloadToken(data.downloadToken || '');
          
          // Look up product details
          const targetProdId = data.order.items?.[0]?.productId || productId;
          const found = digitalProductsStorage.getAll().find(p => p.id === targetProdId || p.slug === targetProdId) || {
            id: targetProdId || 'DP-TRADING-MASTER-2026',
            name: data.order.items?.[0]?.productName || 'Trading Master - Android Trading App',
            slug: 'trading-master',
            category: 'Trading',
            shortDescription: 'Your premium downloadable digital asset.',
            fullDescription: '',
            thumbnailUrl: '/images/trading_master_cover.jpg',
            productType: 'Digital Download',
            price: data.order.totalAmount || 999,
            status: 'published',
            isFeatured: true,
            features: ['Instant Download Access', 'Verified Ownership'],
            faqs: [],
            createdAt: new Date().toISOString()
          } as DigitalProduct;

          setProduct(found);

          // Save order and access record permanently into local & Firestore state
          await digitalProductsStorage.recordOrder(data.order);

          // Save current customer session
          digitalProductsStorage.setCurrentCustomer({
            email: data.order.customerEmail,
            name: data.order.customerName,
            phone: data.order.customerPhone
          });

          setIsVerified(true);
        } else {
          setIsVerified(false);
          setErrorMessage(data.message || '🔒 Payment Verification Failed: No authentic payment was recorded for this transaction. Direct download access is restricted.');
        }
      } catch (err: any) {
        console.error('Payment verification error:', err);
        setIsVerified(false);
        setErrorMessage('Failed to verify payment authorization with the server. Please check your internet connection.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPurchase();
  }, []);

  const handleDownload = async () => {
    if (!order || !product) return;
    setIsDownloading(true);

    const safeFileName = product.productFileName || (product.slug.endsWith('.html') ? product.slug : `${product.slug}.pdf`);
    const downloadUrl = `/api/digital/download?token=${encodeURIComponent(downloadToken)}&orderId=${encodeURIComponent(order.id)}&productId=${encodeURIComponent(product.id)}&customerId=${encodeURIComponent(order.customerId)}&filePath=${encodeURIComponent(product.productFilePath || '')}&fileName=${encodeURIComponent(safeFileName)}`;

    try {
      // 1. Fetch file as binary blob to ensure direct file delivery
      const res = await fetch(downloadUrl);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok || contentType.includes('application/json')) {
        // If server returned JSON, check if it's an error
        let errorMsg = 'Failed to download file.';
        try {
          const json = await res.json();
          errorMsg = json.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', safeFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
      }, 10000);

      // Increment download counter
      await digitalProductsStorage.incrementDownloadCount(product.id);
    } catch (e: any) {
      console.warn('Fetch blob download error, falling back to direct navigation:', e);
      // Fallback: direct window navigation to downloadUrl so browser triggers attachment header
      window.location.href = downloadUrl;
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-secondary)] py-12 sm:py-20 text-[#171A1F] text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={onNavigateStore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] text-xs font-bold text-[#171A1F] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C79A22]" />
            <span>Back to Digital Store</span>
          </button>
        </div>

        {/* Verifying State */}
        {isVerifying && (
          <div className="bg-white rounded-3xl border border-[#E4E1DA] p-12 text-center shadow-lg space-y-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 border-4 border-[#C79A22] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-black text-[#171A1F]">Verifying Payment with Razorpay...</h2>
            <p className="text-xs text-[#626873]">Please do not close or refresh this window while we securely authorize your download access.</p>
          </div>
        )}

        {/* Verification Failed / Unauthorized Access */}
        {!isVerifying && !isVerified && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center shadow-lg space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-200">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-[#171A1F]">Payment Verification Required</h2>
              <p className="text-xs text-[#626873] leading-relaxed">
                {errorMessage || 'Direct download access is restricted. A verified payment record from Razorpay is required to access digital products.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onNavigateStore}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#C79A22]" />
                <span>Browse Digital Products</span>
              </button>
              <button
                onClick={onNavigateHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold transition-all"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        )}

        {/* Verified Thank You Card */}
        {!isVerifying && isVerified && product && order && (
          <div className="bg-white rounded-3xl border border-[#E4E1DA] overflow-hidden shadow-2xl space-y-0 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-[#171A1F] text-white p-6 sm:p-10 text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-400/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Verified Successfully</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                🎉 Thank You For Your Purchase!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-lg mx-auto">
                Your payment has been securely confirmed. Your digital asset is ready for instant download.
              </p>
            </div>

            {/* Order & Product Details Section */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Product Card Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E4E1DA] shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase text-[#C79A22] bg-[#C79A22]/10 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-[#171A1F]">
                      {product.name}
                    </h3>
                    <span className="text-xs text-[#626873]">
                      Format: {product.productFileType || 'PDF / Digital Package'}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Paid</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-700">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#E4E1DA] bg-white space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Order ID</span>
                  <span className="font-mono font-bold text-[#2563EB]">{order.id}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E4E1DA] bg-white space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer</span>
                  <span className="font-bold text-[#171A1F] truncate block">{order.customerName}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E4E1DA] bg-white space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payment Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Paid
                  </span>
                </div>
              </div>

              {/* Secure Download CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-[#C79A22]/40 text-center space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C79A22] uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Protected Digital Download</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#171A1F]">
                    📧 Your Download Access Is Ready
                  </h4>
                  <p className="text-xs text-[#626873] max-w-md mx-auto">
                    Click the button below to download your complete E-book / digital product files immediately.
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Download className="w-5 h-5" />
                  <span>{isDownloading ? 'Preparing Secure File...' : 'DOWNLOAD E-BOOK / ASSET'}</span>
                </button>

                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  🔒 Your download link is secure and intended exclusively for the purchaser ({order.customerEmail}).
                </p>
              </div>

              {/* Trust Information */}
              <div className="p-4 rounded-2xl border border-[#E4E1DA] bg-slate-50 text-xs text-[#626873] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#171A1F]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>MANI Solution Digital Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  You can access and re-download your purchased assets anytime through the MANI Solution Customer Portal using your registered email: <strong>{order.customerEmail}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E4E1DA]">
                <button
                  onClick={onNavigateStore}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C79A22]" />
                  <span>Continue Browsing Store</span>
                </button>

                <button
                  onClick={onNavigateHome}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold transition-all"
                >
                  Back to Homepage
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
