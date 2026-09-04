import React from 'react';
import { COMPANY_INFO } from '../data/companyData';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
    COMPANY_INFO.defaultWhatsAppMessage
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none pointer-events-auto">
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="relative group flex items-center justify-center p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Subtle Pulsing Outer Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-pulse pointer-events-none" />

        {/* Clean SVG WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-current relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.268-.468-2.416-1.492-.893-.797-1.497-1.781-1.672-2.082-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.231-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.527.075-.802.376s-1.054 1.029-1.054 2.509c0 1.48 1.079 2.91 1.229 3.11.151.201 2.124 3.243 5.147 4.549.719.311 1.28.497 1.718.636.723.23 1.38.197 1.9.12.58-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.075-.125-.276-.201-.577-.351zM12.042 21.879h-.008a9.837 9.837 0 0 1-5.016-1.378l-.36-.214-3.731.978.996-3.638-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.452 4.44-9.888 9.897-9.888 2.64 0 5.122 1.03 6.987 2.898a9.825 9.825 0 0 1 2.892 6.991c-.003 5.453-4.441 9.885-9.897 9.885z" />
        </svg>
      </a>
    </div>
  );
};
