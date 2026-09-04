import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { businessAiStorage, subscribeToBusinessAi } from '../services/businessAiStorage';
import { BusinessAiItem } from '../types';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  PhoneCall, 
  Headphones, 
  UserCheck, 
  Workflow, 
  Cpu, 
  Check, 
  ArrowRight, 
  Send,
  CheckCircle2,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface BusinessAiSectionProps {
  onOpenDemoModal: () => void;
  onSelectSolution?: (slug: string) => void;
}

export const BusinessAiSection: React.FC<BusinessAiSectionProps> = ({ onOpenDemoModal, onSelectSolution }) => {
  const [selectedAiIndex, setSelectedAiIndex] = useState(0);
  const [chatInputValue, setChatInputValue] = useState('');
  const [customMessages, setCustomMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([]);
  const [aiItems, setAiItems] = useState<BusinessAiItem[]>(() => businessAiStorage.getPublished());

  useEffect(() => {
    const handleUpdate = () => {
      setAiItems(businessAiStorage.getPublished());
    };
    handleUpdate();
    const unsubscribe = subscribeToBusinessAi(handleUpdate);
    return () => unsubscribe();
  }, []);

  const currentAi = aiItems[selectedAiIndex] || aiItems[0];

  const getAssistantIcon = (id: string) => {
    switch (id) {
      case 'BAI-ai-chat': return MessageSquare;
      case 'BAI-ai-voice': return PhoneCall;
      case 'BAI-ai-support': return Headphones;
      case 'BAI-ai-leadgen': return UserCheck;
      case 'BAI-ai-automation': return Workflow;
      case 'BAI-custom-ai': return Cpu;
      default: return Bot;
    }
  };

  const handleSendSimulatedMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim() || !currentAi) return;

    const userText = chatInputValue;
    setChatInputValue('');

    const newMsgs = [...customMessages, { sender: 'user' as const, text: userText }];
    setCustomMessages(newMsgs);

    setTimeout(() => {
      let reply = `Thank you! I am the ${currentAi.category}. Our team at MANI Solution configures this assistant with your exact business rate cards, FAQs, and WhatsApp lead handoff protocols.`;
      if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('cost')) {
        reply = `Our ${currentAi.category} includes 24/7 automated inquiry handling, instant WhatsApp lead transfer, and custom knowledge base setup. Would you like to schedule a free architecture demo?`;
      } else if (userText.toLowerCase().includes('demo') || userText.toLowerCase().includes('call')) {
        reply = `Great! Please share your phone number or click 'Request Free Demo' below to connect directly with founder Mr. Hariom Mahato on WhatsApp.`;
      }
      setCustomMessages([...newMsgs, { sender: 'assistant' as const, text: reply }]);
    }, 600);
  };

  if (aiItems.length === 0) return null;

  return (
    <section id="business-ai-section" className="py-20 lg:py-28 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background Subtle Accent Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C79A22]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Service Title & Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI & Automation Suite
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            Business AI & <span className="text-gold-gradient">Automation</span>
          </h2>

          <p className="text-base sm:text-lg text-[#626873] leading-relaxed">
            Intelligent AI assistants and automation systems designed to reduce repetitive work, improve customer support, and help businesses operate more efficiently.
          </p>
        </div>

        {/* Interactive Assistant Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: 6 Service Cards Grid - Always 2 Columns on desktop, tablet, and mobile */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {aiItems.map((item, idx) => {
              const IconComponent = getAssistantIcon(item.id);
              const isSelected = selectedAiIndex === idx;

              return (
                <button
                  key={item.id}
                  id={`ai-service-card-${item.id}`}
                  onClick={() => {
                    if (onSelectSolution) {
                      onSelectSolution(item.slug);
                    } else {
                      setSelectedAiIndex(idx);
                      setCustomMessages([]);
                    }
                  }}
                  className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                    isSelected && !onSelectSolution
                      ? 'bg-white border-[#C79A22] shadow-xl shadow-[#C79A22]/10 -translate-y-1'
                      : 'bg-white/80 border-[#E4E1DA] hover:border-[#C79A22]/50 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="w-full">
                    {/* 16:9 Custom Visual */}
                    <div className="relative w-full aspect-[16/9] mb-2 sm:mb-3.5 rounded-lg overflow-hidden border border-[#E4E1DA] shadow-sm bg-[#F7F6F2] group-hover:border-[#C79A22]/40 transition-colors">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors ${
                          isSelected && !onSelectSolution ? 'bg-[#171A1F] text-[#C79A22]' : 'bg-[#F7F6F2] text-[#171A1F] group-hover:text-[#C79A22]'
                        }`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        {isSelected && !onSelectSolution && (
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#C79A22]/15 text-[#C79A22] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs sm:text-base font-bold text-[#171A1F] font-sans leading-tight sm:leading-snug group-hover:text-[#C79A22] transition-colors">
                        {item.category}
                      </h3>

                      <p className="text-[10px] sm:text-xs text-[#626873] leading-relaxed line-clamp-2">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E4E1DA]/60 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#171A1F]">
                    <span className="text-[#C79A22] truncate">{item.type}</span>
                    <ArrowRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform ${isSelected && !onSelectSolution ? 'translate-x-1 text-[#C79A22]' : 'text-[#626873]'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Assistant Simulator */}
          <div className="lg:col-span-6 text-left">
            
            <div className="rounded-2xl bg-white border border-[#E4E1DA] p-6 sm:p-8 shadow-xl shadow-slate-200/60 space-y-6">
              
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E1DA]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#171A1F] text-[#C79A22]">
                    {React.createElement(getAssistantIcon(currentAi.id), { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A22] block">
                      Live Intelligent Simulator
                    </span>
                    <h3 className="text-xl font-bold text-[#171A1F] font-sans">
                      {currentAi.title}
                    </h3>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Active
                </div>
              </div>

              {/* Description & Included Capabilities */}
              <p className="text-sm text-[#626873] leading-relaxed">
                {currentAi.shortDescription}
              </p>

              {/* Key Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#171A1F]">
                {currentAi.features.slice(0, 4).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F7F6F2] border border-[#E4E1DA]">
                    <CheckCircle2 className="w-4 h-4 text-[#C79A22] shrink-0" />
                    <span className="font-medium truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Interactive Chat Box */}
              <div className="rounded-xl border border-[#E4E1DA] bg-[#F7F6F2] overflow-hidden flex flex-col justify-between">
                
                {/* Chat Header */}
                <div className="px-4 py-2.5 bg-white border-b border-[#E4E1DA] flex items-center justify-between text-xs font-semibold text-[#171A1F]">
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#C79A22]" />
                    {currentAi.category} Sandbox
                  </span>
                  <span className="text-[10px] text-[#626873] font-mono">Simulated Response</span>
                </div>

                {/* Chat Conversation Area */}
                <div className="p-4 space-y-3 min-h-[160px] max-h-[220px] overflow-y-auto text-xs">
                  
                  {/* Default Sample Question */}
                  {currentAi.sampleInteraction && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] p-3 rounded-xl rounded-tr-none bg-[#171A1F] text-white space-y-0.5">
                        <div className="text-[10px] text-slate-400 font-mono">Customer Inbound</div>
                        <div>{currentAi.sampleInteraction.user}</div>
                      </div>
                    </div>
                  )}

                  {/* Default Sample AI Response */}
                  {currentAi.sampleInteraction && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] p-3 rounded-xl rounded-tl-none bg-white border border-[#E4E1DA] text-[#171A1F] space-y-0.5 shadow-sm">
                        <div className="text-[10px] text-[#C79A22] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[#C79A22]" /> {currentAi.category}
                        </div>
                        <div>{currentAi.sampleInteraction.assistant}</div>
                      </div>
                    </div>
                  )}

                  {/* Additional Custom Messages from user interaction */}
                  {customMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-xl space-y-0.5 ${
                        msg.sender === 'user'
                          ? 'rounded-tr-none bg-[#171A1F] text-white'
                          : 'rounded-tl-none bg-white border border-[#E4E1DA] text-[#171A1F] shadow-sm'
                      }`}>
                        <div className={`text-[10px] font-mono ${msg.sender === 'user' ? 'text-slate-400' : 'text-[#C79A22] font-bold'}`}>
                          {msg.sender === 'user' ? 'You' : currentAi.category}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendSimulatedMessage} className="p-2 bg-white border-t border-[#E4E1DA] flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    placeholder={`Test asking the ${currentAi.category}...`}
                    className="flex-1 px-3 py-2 text-xs bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg focus:outline-none focus:border-[#C79A22] text-[#171A1F]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-[#C79A22] text-black hover:bg-[#b0871d] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

              {/* Direct Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="btn-get-ai-demo"
                  onClick={() => onSelectSolution ? onSelectSolution(currentAi.slug) : onOpenDemoModal()}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-[#171A1F] hover:bg-slate-800 text-white text-xs font-bold shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#C79A22]" />
                  <span>View Details & Order</span>
                </button>

                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(`Hello MANI Solution, I am interested in implementing a ${currentAi.category} for my business. Please share details and setup pricing.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  Discuss on WhatsApp
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
