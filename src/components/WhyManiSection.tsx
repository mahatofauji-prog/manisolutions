import React from 'react';
import { ShieldCheck, Zap, Award, Headphones, Code2, Users } from 'lucide-react';

export const WhyManiSection: React.FC = () => {
  const points = [
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Industry-Grade Excellence',
      description: 'Crafted with modern engineering practices, scalable architectures, and clean, maintainable code.'
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Rapid Deployment',
      description: 'Pre-engineered business modules and agile delivery workflows that save weeks of development time.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Zero-Trust Security',
      description: 'Built-in protection against unauthorized downloads, tokenized signed URLs, and rigorous data privacy.'
    },
    {
      icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Full Source & Ownership',
      description: 'Transparent deliverables with no vendor lock-in. You retain full ownership of your assets and code.'
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Built For Indian Businesses',
      description: 'Tailored for Indian MSMEs, startups, institutions, and retail merchants with native UPI & Razorpay support.'
    },
    {
      icon: <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />,
      title: 'Dedicated 24/7 Support',
      description: 'Direct access to senior engineers and prompt support for setup, integrations, and customization.'
    }
  ];

  return (
    <section className="py-20 bg-[var(--theme-bg-secondary)] border-y border-[#E4E1DA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#C79A22] bg-[#C79A22]/10 px-3 py-1 rounded-full border border-[#C79A22]/20">
            Why MANI Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
            Built with Precision. Designed to Scale.
          </h2>
          <p className="text-xs sm:text-sm text-[#626873]">
            We bridge the gap between vision and technology with robust software, modern digital products, and production-grade reliability.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/50 hover:shadow-lg transition-all flex flex-col justify-between aspect-[16/9] overflow-y-auto group"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-amber-50 group-hover:bg-[#C79A22]/10 border border-amber-200/60 flex items-center justify-center transition-colors">
                  {pt.icon}
                </div>
                <h3 className="text-xs sm:text-base font-black text-[#171A1F] line-clamp-1">
                  {pt.title}
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-[#626873] leading-relaxed line-clamp-2 sm:line-clamp-3">
                {pt.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
