import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { BusinessAiItem } from '../../types';
import { businessAiStorage } from '../../services/businessAiStorage';

interface AdminAiAutomationEditorProps {
  solutionId: string | null;
  onClose: () => void;
}

export const AdminAiAutomationEditor: React.FC<AdminAiAutomationEditorProps> = ({
  solutionId,
  onClose
}) => {
  const [formData, setFormData] = useState<Partial<BusinessAiItem>>({
    title: '',
    slug: '',
    category: '',
    type: '',
    shortDescription: '',
    fullOverview: '',
    features: [''],
    benefits: [''],
    howItWorks: [''],
    targetBusinesses: [''],
    deliverables: [''],
    technologies: [''],
    integrations: [''],
    pricingType: 'Custom Pricing',
    price: '',
    customPricingText: '',
    ctaText: '',
    whatsappCta: '',
    status: 'draft',
    thumbnailUrl: '',
    sampleInteraction: {
      user: '',
      assistant: ''
    }
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (solutionId) {
      const existing = businessAiStorage.getAllRaw().find(s => s.id === solutionId);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [solutionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title for new items
    if (name === 'title' && !solutionId && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: keyof BusinessAiItem, index: number, value: string) => {
    setFormData(prev => {
      const arr = [...(prev[field] as string[] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: keyof BusinessAiItem) => {
    setFormData(prev => {
      const arr = [...(prev[field] as string[] || [])];
      arr.push('');
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field: keyof BusinessAiItem, index: number) => {
    setFormData(prev => {
      const arr = [...(prev[field] as string[] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleInteractionChange = (field: 'user' | 'assistant', value: string) => {
    setFormData(prev => ({
      ...prev,
      sampleInteraction: {
        ...(prev.sampleInteraction || { user: '', assistant: '' }),
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnailUrl: reader.result as string }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Basic validation
      if (!formData.title || !formData.slug || !formData.category || !formData.shortDescription || !formData.fullOverview) {
        throw new Error('Please fill in all required fields (Title, Slug, Category, Short Description, Full Overview)');
      }

      // Filter empty array items
      const cleanData = {
        ...formData,
        features: (formData.features || []).filter(i => i.trim() !== ''),
        benefits: (formData.benefits || []).filter(i => i.trim() !== ''),
        howItWorks: (formData.howItWorks || []).filter(i => i.trim() !== ''),
        targetBusinesses: (formData.targetBusinesses || []).filter(i => i.trim() !== ''),
        deliverables: (formData.deliverables || []).filter(i => i.trim() !== ''),
        technologies: (formData.technologies || []).filter(i => i.trim() !== ''),
        integrations: (formData.integrations || []).filter(i => i.trim() !== ''),
      };

      if (solutionId) {
        businessAiStorage.update(solutionId, cleanData);
      } else {
        businessAiStorage.save(cleanData as Omit<BusinessAiItem, "id" | "createdAt" | "order">);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save solution');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E1DA] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#F7F6F2]">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#171A1F]">
              {solutionId ? 'Edit AI Solution' : 'Create New AI Solution'}
            </h2>
            <p className="text-xs text-[#626873]">Fill in the details for the solution page.</p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C79A22] text-[#171A1F] rounded-lg font-bold hover:bg-[#b0871d] transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Solution
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
        
        <div className="space-y-10">
          
          {/* Section 1: Basic Info */}
          <section>
            <h3 className="text-lg font-bold text-[#171A1F] mb-6 pb-2 border-b border-[#E4E1DA]">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Solution Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. AI Customer Support"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. ai-customer-support"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Category Label *</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. AI Support Bot"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Type/Context Label</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. Support Solution"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-bold text-[#171A1F]">Thumbnail Image *</label>
              <div className="flex items-center gap-6">
                <div className="w-40 h-24 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  {formData.thumbnailUrl ? (
                    <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#C79A22]/40" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-[#626873] file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#171A1F] file:text-white hover:file:bg-[#2D313A] transition-all cursor-pointer"
                  />
                  <p className="text-xs text-[#626873] mt-2">Recommended: 16:9 ratio, Max 2MB (JPG/PNG/WEBP)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Descriptions */}
          <section>
            <h3 className="text-lg font-bold text-[#171A1F] mb-6 pb-2 border-b border-[#E4E1DA]">2. Descriptions</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Short Description * (Used in cards)</label>
                <textarea
                  name="shortDescription"
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Full Overview * (Used in detail page)</label>
                <textarea
                  name="fullOverview"
                  required
                  rows={6}
                  value={formData.fullOverview}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Lists (Features, Benefits, etc) */}
          <section>
            <h3 className="text-lg font-bold text-[#171A1F] mb-6 pb-2 border-b border-[#E4E1DA]">3. Solution Details (Lists)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">Key Features</label>
                  <button type="button" onClick={() => addArrayItem('features')} className="text-xs text-[#C79A22] font-bold">+ Add Feature</button>
                </div>
                {(formData.features || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('features', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">Business Benefits</label>
                  <button type="button" onClick={() => addArrayItem('benefits')} className="text-xs text-[#C79A22] font-bold">+ Add Benefit</button>
                </div>
                {(formData.benefits || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('benefits', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('benefits', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* How it Works */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">How It Works (Steps)</label>
                  <button type="button" onClick={() => addArrayItem('howItWorks')} className="text-xs text-[#C79A22] font-bold">+ Add Step</button>
                </div>
                {(formData.howItWorks || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="p-2 font-bold text-[#C79A22]">{idx + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('howItWorks', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('howItWorks', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">What You Get (Deliverables)</label>
                  <button type="button" onClick={() => addArrayItem('deliverables')} className="text-xs text-[#C79A22] font-bold">+ Add Deliverable</button>
                </div>
                {(formData.deliverables || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('deliverables', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('deliverables', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              
              {/* Target Businesses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">Target Businesses</label>
                  <button type="button" onClick={() => addArrayItem('targetBusinesses')} className="text-xs text-[#C79A22] font-bold">+ Add Target</button>
                </div>
                {(formData.targetBusinesses || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('targetBusinesses', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('targetBusinesses', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {/* Tech & Integrations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#171A1F]">Technologies</label>
                  <button type="button" onClick={() => addArrayItem('technologies')} className="text-xs text-[#C79A22] font-bold">+ Add Tech</button>
                </div>
                {(formData.technologies || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('technologies', idx, e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#F7F6F2] border border-[#E4E1DA] rounded-lg text-sm"
                    />
                    <button type="button" onClick={() => removeArrayItem('technologies', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Section 4: Sample Interaction Simulator */}
          <section>
            <h3 className="text-lg font-bold text-[#171A1F] mb-6 pb-2 border-b border-[#E4E1DA]">4. Sample Chat Simulator</h3>
            <div className="grid grid-cols-1 gap-6 p-6 bg-[#F7F6F2] rounded-xl border border-[#E4E1DA]">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Customer Example Message</label>
                <input
                  type="text"
                  value={formData.sampleInteraction?.user || ''}
                  onChange={(e) => handleInteractionChange('user', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. I need help with my recent order."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">AI Example Response</label>
                <input
                  type="text"
                  value={formData.sampleInteraction?.assistant || ''}
                  onChange={(e) => handleInteractionChange('assistant', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. I can help with that. Could you please provide your order ID?"
                />
              </div>
            </div>
          </section>

          {/* Section 5: Pricing & CTA */}
          <section>
            <h3 className="text-lg font-bold text-[#171A1F] mb-6 pb-2 border-b border-[#E4E1DA]">5. Pricing & Call to Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Pricing Type</label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                >
                  <option value="Custom Pricing">Custom Pricing (Quote)</option>
                  <option value="Fixed Price">Fixed Price</option>
                </select>
              </div>

              {formData.pricingType === 'Fixed Price' ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#171A1F]">Price Amount</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                    placeholder="e.g. ₹25,000 / month"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#171A1F]">Custom Pricing Text</label>
                  <input
                    type="text"
                    name="customPricingText"
                    value={formData.customPricingText || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                    placeholder="e.g. Tell us about your requirements..."
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Button Text (CTA)</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                  placeholder="e.g. Request a Quote (Default)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#171A1F]">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22]"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Visible)</option>
                </select>
              </div>
            </div>
          </section>

        </div>
      </form>
    </div>
  );
};
