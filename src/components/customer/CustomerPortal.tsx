import React, { useState, useEffect } from 'react';
import { digitalProductsStorage, subscribeToDigitalProducts } from '../../services/digitalProductsStorage';
import { DigitalProduct, DigitalOrder } from '../../types';
import { User, Package, ShoppingBag, LogOut, Download, ArrowRight, ShieldCheck, CheckCircle2, Lock, X } from 'lucide-react';

interface CustomerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ isOpen, onClose, onNavigateHome }) => {
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
  const [myProducts, setMyProducts] = useState<DigitalProduct[]>([]);
  const [myOrders, setMyOrders] = useState<DigitalOrder[]>([]);

  useEffect(() => {
    const loadCustomerData = () => {
      const cur = digitalProductsStorage.getCurrentCustomer();
      setCustomer(cur);
      if (cur) {
        setMyProducts(digitalProductsStorage.getCustomerProducts(cur.id));
        setMyOrders(digitalProductsStorage.getCustomerOrders(cur.id));
      }
    };
    loadCustomerData();
    return subscribeToDigitalProducts(loadCustomerData);
  }, [isOpen]);

  if (!isOpen) return null;

  if (!customer) {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 relative border border-[#E4E1DA] shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-[#171A1F]">
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#171A1F]">Customer Sign In</h2>
            <p className="text-xs text-[#626873]">
              Enter your registered email address to access your purchased digital products and orders.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const emailInput = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              if (!emailInput) return;
              const customerId = `cust_${emailInput.replace(/[^a-zA-Z0-9]/g, '_')}`;
              const cust = { id: customerId, email: emailInput, fullName: emailInput.split('@')[0], phone: '9876543210' };
              digitalProductsStorage.setCurrentCustomer(cust);
              setCustomer(cust);
              setMyProducts(digitalProductsStorage.getCustomerProducts(cust.id));
              setMyOrders(digitalProductsStorage.getCustomerOrders(cust.id));
            }}
            className="space-y-4 text-left text-xs"
          >
            <div>
              <label className="block text-[#626873] font-semibold mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-md"
            >
              Access Customer Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E4E1DA] shadow-2xl relative flex flex-col">
        
        {/* Header bar */}
        <div className="p-6 border-b border-[#E4E1DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-base font-black text-[#171A1F]">{customer.fullName}</h2>
              <span className="text-xs text-[#626873]">{customer.email}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#171A1F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#E4E1DA] bg-slate-50/50">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'bg-white text-[#2563EB] border-[#2563EB] shadow-sm'
                : 'text-[#626873] border-transparent hover:text-[#171A1F]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Products ({myProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-[#2563EB] border-[#2563EB] shadow-sm'
                : 'text-[#626873] border-transparent hover:text-[#171A1F]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({myOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-[#2563EB] border-[#2563EB] shadow-sm'
                : 'text-[#626873] border-transparent hover:text-[#171A1F]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
          <button
            onClick={() => {
              digitalProductsStorage.logoutCustomer();
              setCustomer(null);
            }}
            className="ml-auto px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 flex-grow overflow-y-auto space-y-6">
          {activeTab === 'products' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#171A1F]">Purchased Digital Products & Downloads</h3>
              {myProducts.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-2xl text-center border border-[#E4E1DA] space-y-3">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="font-bold text-sm text-[#171A1F]">No Purchased Products Yet</div>
                  <p className="text-xs text-[#626873]">
                    Explore the digital marketplace and purchase premium tools or guides to see them unlocked here instantly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myProducts.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#E4E1DA] shadow-sm flex flex-col justify-between space-y-3">
                      <div className="flex items-start gap-3">
                        <img src={p.thumbnailUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E4E1DA]" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h4 className="font-extrabold text-xs text-[#171A1F] leading-tight">{p.name}</h4>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Access Active</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                        {(p.productType === 'Digital Download' || p.productType === 'Both') && (
                          <button
                            onClick={() => {
                              if (!customer?.id) return;
                              digitalProductsStorage.incrementDownloadCount(p.id);
                              const downloadUrl = `/api/digital/download?customerId=${encodeURIComponent(customer.id)}&productId=${encodeURIComponent(p.id)}&filePath=${encodeURIComponent(p.productFilePath || '')}&fileName=${encodeURIComponent(p.productFileName || '')}`;
                              window.open(downloadUrl, '_blank');
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5 text-[#C79A22]" />
                            <span>DOWNLOAD PRODUCT ({p.productFileSize || p.fileSize || 'FILE'})</span>
                          </button>
                        )}
                        {(p.productType === 'Online Access' || p.productType === 'Both') && (
                          <a
                            href={`/product/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-[#171A1F] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm text-center"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>OPEN PRODUCT</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#171A1F]">Order History & Invoices</h3>
              {myOrders.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-2xl text-center border border-[#E4E1DA] space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="font-bold text-sm text-[#171A1F]">No Orders Placed Yet</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((ord) => (
                    <div key={ord.id} className="bg-white p-4 rounded-2xl border border-[#E4E1DA] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-[#2563EB]">{ord.id}</span>
                        <div className="font-bold text-[#171A1F]">
                          {ord.items.map(i => i.productName).join(', ')}
                        </div>
                        <span className="text-[11px] text-[#626873]">Placed: {new Date(ord.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-black text-sm text-[#171A1F]">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="text-sm font-extrabold text-[#171A1F]">Customer Account Information</h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-[#E4E1DA] space-y-3 text-xs">
                <div>
                  <span className="text-[#626873] block">Customer ID:</span>
                  <strong className="font-mono text-[#171A1F]">{customer.id}</strong>
                </div>
                <div>
                  <span className="text-[#626873] block">Full Name:</span>
                  <strong className="text-[#171A1F]">{customer.fullName}</strong>
                </div>
                <div>
                  <span className="text-[#626873] block">Email Address:</span>
                  <strong className="text-[#171A1F]">{customer.email}</strong>
                </div>
                <div>
                  <span className="text-[#626873] block">Phone Number:</span>
                  <strong className="text-[#171A1F]">{customer.phone || 'N/A'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
