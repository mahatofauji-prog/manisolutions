import React from 'react';
import { Search, Compass, Cpu, Rocket } from 'lucide-react';

export const HowWeWorkSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A22]" />,
      title: 'Discovery & Audit',
      description: 'We analyze your workflows, business requirements, and operational bottlenecks to define the technical roadmap.'
    },
    {
      num: '02',
      icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A22]" />,
      title: 'Architecture & Design',
      description: 'Interactive wireframes, data models, and enterprise security guardrails designed for your exact scale.'
    },
    {
      num: '03',
      icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A22]" />,
      title: 'Agile Engineering',
      description: 'Rapid iterations with real-time feedback loops, automated testing, and strict zero-defect standards.'
    },
    {
      num: '04',
      icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-[#C79A22]" />,
      title: 'Deployment & Scaling',
      description: 'Cloud deployment, team onboarding, training, and 24/7 proactive maintenance for continuous uptime.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E4E1DA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#C79A22] bg-[#C79A22]/10 px-3 py-1 rounded-full border border-[#C79A22]/20">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
            How We Deliver Results
          </h2>
          <p className="text-xs sm:text-sm text-[#626873]">
            A structured, transparent engineering process designed to eliminate risks and deliver high-impact software.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 border border-[#E4E1DA] hover:border-[#C79A22]/60 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between aspect-[16/9] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E4E1DA] flex items-center justify-center shadow-sm">
                  {st.icon}
                </div>
                <span className="text-base sm:text-2xl font-black text-slate-300 font-mono">
                  {st.num}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-base font-black text-[#171A1F] line-clamp-1">
                  {st.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#626873] leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
