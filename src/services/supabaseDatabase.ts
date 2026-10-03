import { supabase } from '../lib/supabase';
import { 
  DigitalProduct, 
  DigitalCategory, 
  DigitalOrder, 
  ReadySolutionItem, 
  SolutionItem, 
  WebsiteTemplate, 
  BusinessCategory, 
  BusinessAiItem,
  FounderProfile,
  BrandLogoConfig,
  Enquiry,
  WorkApplicationItem,
  CustomSolutionOrder
} from '../types';

export const supabaseDatabase = {
  // 1. DIGITAL PRODUCTS
  async getDigitalProducts(): Promise<DigitalProduct[] | null> {
    try {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: item.category,
        shortDescription: item.short_description,
        fullDescription: item.full_description,
        thumbnailUrl: item.thumbnail_url,
        galleryImages: Array.isArray(item.gallery_images) ? item.gallery_images : (Array.isArray(item.galleryImages) ? item.galleryImages : []),
        productType: item.product_type,
        price: Number(item.price),
        compareAtPrice: item.compare_at_price ? Number(item.compare_at_price) : undefined,
        offer: item.offer || undefined,
        testimonials: Array.isArray(item.testimonials) ? item.testimonials : [],
        productFilePath: item.product_file_path,
        productFileName: item.product_file_name,
        productFileSize: item.product_file_size,
        productFileType: item.product_file_type,
        productFileUploadedAt: item.product_file_uploaded_at,
        status: item.status,
        isFeatured: Boolean(item.is_featured),
        features: Array.isArray(item.features) ? item.features : [],
        faqs: Array.isArray(item.faqs) ? item.faqs : [],
        whatYouGet: Array.isArray(item.what_you_get) ? item.what_you_get : [],
        downloadsCount: Number(item.downloads_count || 0),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveDigitalProduct(product: DigitalProduct): Promise<boolean> {
    try {
      // 1. Try server-side proxy route (bypasses CORS/JWT restrictions on live server)
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/admin/save-digital-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success) return true;
          }
        } catch (fetchErr) {
          console.warn('Server proxy save-digital-product notice:', fetchErr);
        }
      }

      // 2. Direct client-side Supabase attempt (schema-safe payload)
      const payload: Record<string, any> = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        short_description: product.shortDescription,
        full_description: product.fullDescription,
        thumbnail_url: product.thumbnailUrl,
        product_type: product.productType || 'Digital Download',
        price: product.price,
        compare_at_price: product.compareAtPrice || null,
        product_file_path: product.productFilePath || null,
        product_file_name: product.productFileName || null,
        product_file_size: product.productFileSize || null,
        product_file_type: product.productFileType || null,
        product_file_uploaded_at: product.productFileUploadedAt || new Date().toISOString(),
        status: product.status || 'published',
        is_featured: Boolean(product.isFeatured),
        features: product.features || [],
        faqs: product.faqs || [],
        downloads_count: product.downloadsCount || 0,
        updated_at: new Date().toISOString()
      };

      let { error } = await supabase
        .from('digital_products')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('First saveDigitalProduct attempt note:', error.message);
        const corePayload = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category || 'Tools',
          price: product.price,
          status: product.status || 'published',
          updated_at: new Date().toISOString()
        };
        const resCore = await supabase
          .from('digital_products')
          .upsert(corePayload, { onConflict: 'id' });
        error = resCore.error;
      }

      return !error;
    } catch (e) {
      console.error('saveDigitalProduct exception:', e);
      return false;
    }
  },

  async deleteDigitalProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('digital_products')
        .delete()
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 2. DIGITAL CATEGORIES
  async getDigitalCategories(): Promise<DigitalCategory[] | null> {
    try {
      const { data, error } = await supabase
        .from('digital_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data) return null;
      return data.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || undefined,
        displayOrder: c.display_order || 0,
        status: c.status || 'published',
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveDigitalCategory(cat: DigitalCategory): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('digital_categories')
        .upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          display_order: cat.displayOrder || 0,
          status: cat.status || 'published',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteDigitalCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('digital_categories').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 3. DIGITAL ORDERS & ACCESS
  async getDigitalOrders(): Promise<DigitalOrder[] | null> {
    try {
      const { data, error } = await supabase
        .from('digital_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(o => ({
        id: o.id,
        customerId: o.customer_id,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        customerPhone: o.customer_phone || '',
        items: o.items || [],
        subtotal: Number(o.total_amount || 0) + Number(o.discount_amount || 0),
        discount: Number(o.discount_amount || 0),
        totalAmount: Number(o.total_amount || 0),
        paymentProvider: 'razorpay',
        razorpayOrderId: o.razorpay_order_id || '',
        paymentId: o.razorpay_payment_id || '',
        paymentStatus: o.payment_status || 'Paid',
        accessStatus: o.access_status || 'Active',
        couponCode: o.coupon_code || '',
        createdAt: o.created_at
      }));
    } catch {
      return null;
    }
  },

  async saveDigitalOrder(order: DigitalOrder): Promise<boolean> {
    try {
      const payload = {
        id: order.id,
        customer_id: order.customerId,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone || null,
        items: order.items,
        total_amount: order.totalAmount,
        currency: 'INR',
        payment_status: order.paymentStatus,
        access_status: order.accessStatus,
        razorpay_order_id: order.razorpayOrderId || null,
        razorpay_payment_id: order.paymentId || null,
        coupon_code: order.couponCode || null,
        discount_amount: order.discount || 0,
        created_at: order.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('digital_orders')
        .upsert(payload, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  async saveDigitalAccess(access: {
    id: string;
    customerId: string;
    productId: string;
    orderId?: string;
    accessStatus?: string;
    grantedAt?: string;
    downloadCount?: number;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('digital_access')
        .upsert({
          id: access.id,
          customer_id: access.customerId,
          product_id: access.productId,
          order_id: access.orderId || null,
          access_status: access.accessStatus || 'ACTIVE',
          granted_at: access.grantedAt || new Date().toISOString(),
          download_count: access.downloadCount || 0
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // 4. READY SOLUTIONS (ERP & CRM)
  async getReadySolutions(): Promise<ReadySolutionItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('ready_solutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: item.category,
        price: item.price,
        priceType: 'Contact for Quotation',
        thumbnailUrl: item.image_url,
        shortDescription: item.description,
        fullDescription: item.description,
        features: Array.isArray(item.features) ? item.features : [],
        demoUrl: item.demo_url,
        status: (item.status === 'draft' ? 'draft' : 'published') as 'draft' | 'published',
        featuredOnHomepage: Boolean(item.is_featured),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveReadySolution(sol: ReadySolutionItem): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ready_solutions')
        .upsert({
          id: sol.id,
          title: sol.title,
          category: sol.category,
          price: sol.price || sol.priceType || 'Contact for Quotation',
          image_url: sol.thumbnailUrl,
          description: sol.shortDescription || sol.fullDescription,
          features: sol.features || [],
          demo_url: sol.demoUrl || null,
          status: sol.status || 'published',
          is_featured: Boolean(sol.featuredOnHomepage),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteReadySolution(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('ready_solutions').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 5. PORTFOLIO SOLUTIONS / PROJECTS (Website & App Solution)
  async getSolutions(): Promise<SolutionItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_solutions')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: item.category,
        contentType: 'website' as const,
        shortDescription: item.description,
        fullDescription: item.description,
        featuredImage: item.image_url,
        galleryImages: [],
        projectStatus: 'Live' as const,
        technologiesUsed: Array.isArray(item.tags) ? item.tags : [],
        keyFeatures: Array.isArray(item.features) ? item.features : [],
        benefits: [],
        clientType: item.client,
        projectDate: item.created_at || new Date().toISOString(),
        tags: Array.isArray(item.tags) ? item.tags : [],
        seoTitle: item.title,
        seoDescription: item.description,
        status: (item.status === 'draft' ? 'draft' : 'published') as 'draft' | 'published',
        isFeatured: Boolean(item.is_featured),
        liveUrl: item.live_url,
        demoUrl: item.live_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveSolution(item: SolutionItem): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_solutions')
        .upsert({
          id: item.id,
          title: item.title,
          category: item.category,
          client: item.clientType || 'MANI Solution Client',
          image_url: item.featuredImage,
          description: item.shortDescription || item.fullDescription,
          tags: item.tags || item.technologiesUsed || [],
          features: item.keyFeatures || [],
          live_url: item.liveUrl || null,
          display_order: 0,
          is_featured: Boolean(item.isFeatured),
          status: item.status || 'published',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteSolution(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('portfolio_solutions').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 6. BUSINESS AI SOLUTIONS
  async getBusinessAi(): Promise<BusinessAiItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('business_ai_solutions')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: item.category,
        type: 'AI Solution',
        shortDescription: item.short_description,
        fullOverview: item.full_description,
        thumbnailUrl: item.icon || '/images/automation_workflow_visual_1790521682331.jpg',
        features: Array.isArray(item.features) ? item.features : [],
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
        howItWorks: [],
        targetBusinesses: [],
        deliverables: [],
        technologies: [],
        integrations: [],
        pricingType: 'Fixed Price',
        price: '₹14,999',
        status: item.status || 'published',
        createdAt: item.created_at
      }));
    } catch {
      return null;
    }
  },

  async saveBusinessAi(item: BusinessAiItem): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_ai_solutions')
        .upsert({
          id: item.id,
          title: item.title,
          category: item.category,
          short_description: item.shortDescription,
          full_description: item.fullOverview || item.shortDescription,
          icon: item.thumbnailUrl || 'Bot',
          features: item.features || [],
          benefits: item.benefits || [],
          display_order: 0,
          status: item.status || 'published',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteBusinessAi(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('business_ai_solutions').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 7. WEBSITE TEMPLATES
  async getWebsiteTemplates(): Promise<WebsiteTemplate[] | null> {
    try {
      const { data, error } = await supabase
        .from('website_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: item.category,
        categories: [item.category || 'services'],
        price: item.price ? `₹${item.price}` : '₹1,499',
        thumbnailUrl: item.thumbnail_url,
        description: item.description,
        demoUrl: item.preview_url,
        displayOrder: 1,
        features: Array.isArray(item.features) ? item.features : [],
        status: (item.status === 'draft' ? 'draft' : 'published') as 'draft' | 'published',
        isFeatured: Boolean(item.is_featured),
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveWebsiteTemplate(tmpl: WebsiteTemplate): Promise<boolean> {
    try {
      const numPrice = Number(String(tmpl.price).replace(/[^0-9.]/g, '')) || 1499;
      const { error } = await supabase
        .from('website_templates')
        .upsert({
          id: tmpl.id,
          title: tmpl.title,
          category: tmpl.category || (tmpl.categories ? tmpl.categories[0] : 'services'),
          price: numPrice,
          thumbnail_url: tmpl.thumbnailUrl,
          description: tmpl.description,
          preview_url: tmpl.demoUrl || null,
          features: tmpl.features || [],
          status: tmpl.status || 'published',
          is_featured: Boolean(tmpl.isFeatured),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteWebsiteTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('website_templates').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 8. WEBSITE CATEGORIES
  async getWebsiteCategories(): Promise<BusinessCategory[] | null> {
    try {
      const { data, error } = await supabase
        .from('website_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data) return null;
      return data.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        iconName: 'Sparkles',
        shortDesc: item.description || '',
        recommendedSolution: 'Ready-Made Website',
        popularFeatures: ['Mobile Responsive', 'WhatsApp Integration', 'SEO Optimized'],
        displayOrder: item.display_order || 0,
        status: 'published' as const,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveWebsiteCategory(cat: { id: string; name: string; slug?: string; description?: string; displayOrder?: number }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('website_categories')
        .upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          display_order: cat.displayOrder || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteWebsiteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('website_categories').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 9. ENQUIRIES
  async getEnquiries(): Promise<Enquiry[] | null> {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(e => ({
        id: e.id,
        fullName: e.name || 'Anonymous',
        email: e.email || '',
        phone: e.phone || '',
        service: e.service || '',
        projectRequirements: e.message || '',
        status: (e.status || 'New') as any,
        internalNotes: '',
        createdAt: e.created_at
      }));
    } catch {
      return null;
    }
  },

  async saveEnquiry(enquiry: Enquiry): Promise<boolean> {
    try {
      const payload = {
        id: enquiry.id || `ENQ-${Date.now()}`,
        name: enquiry.fullName || 'Anonymous',
        email: enquiry.email || 'no-email@provided.com',
        phone: enquiry.phone || null,
        service: enquiry.service || 'General Enquiry',
        subject: enquiry.service || null,
        message: enquiry.projectRequirements || '',
        status: enquiry.status || 'New',
        created_at: enquiry.createdAt || new Date().toISOString()
      };

      const { error } = await supabase
        .from('enquiries')
        .upsert(payload, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 10. WORK APPLICATIONS
  async getWorkApplications(): Promise<WorkApplicationItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('work_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(app => ({
        id: app.id,
        contributorId: app.contributor_id || '',
        contributorRole: app.contributor_role || app.role_applied || '',
        selectionDate: app.selection_date || undefined,
        isIdCardEnabled: Boolean(app.is_id_card_enabled),
        fullName: app.full_name,
        profilePhoto: app.profile_photo || '',
        mobileNumber: app.phone || '',
        whatsappNumber: app.whatsapp_number || app.phone || '',
        email: app.email,
        dob: app.dob || '',
        gender: app.gender || '',
        fullAddress: app.full_address || '',
        city: app.city || '',
        state: app.state || '',
        pinCode: app.pin_code || '',
        workCategories: Array.isArray(app.work_categories) ? app.work_categories : (app.role_applied ? [app.role_applied] : []),
        skills: Array.isArray(app.skills) ? app.skills : [],
        skillsText: app.skills_text || '',
        experienceLevel: app.experience_level || 'Experienced',
        yearsOfExperience: app.experience_years || '1 Year',
        portfolioUrl: app.portfolio_url || '',
        githubUrl: app.github_url || '',
        linkedinUrl: app.linkedin_url || '',
        previousWorkDetails: app.cover_letter || '',
        status: app.status || 'Application Received',
        adminNotes: app.admin_notes || '',
        paymentTermsAgreed: true,
        createdAt: app.created_at,
        updatedAt: app.updated_at
      }));
    } catch {
      return null;
    }
  },

  async saveWorkApplication(app: WorkApplicationItem): Promise<boolean> {
    try {
      const payload = {
        id: app.id || `APP-${Date.now()}`,
        full_name: app.fullName || 'Applicant',
        email: app.email || 'no-email@provided.com',
        phone: app.mobileNumber || null,
        whatsapp_number: app.whatsappNumber || null,
        profile_photo: app.profilePhoto || null,
        role_applied: app.contributorRole || (Array.isArray(app.workCategories) ? app.workCategories.join(', ') : 'Digital Contributor'),
        contributor_id: app.contributorId || null,
        contributor_role: app.contributorRole || null,
        is_id_card_enabled: Boolean(app.isIdCardEnabled),
        experience_years: app.yearsOfExperience || '1-3',
        experience_level: app.experienceLevel || null,
        portfolio_url: app.portfolioUrl || null,
        github_url: app.githubUrl || null,
        linkedin_url: app.linkedinUrl || null,
        resume_url: app.resumeDataUrl || null,
        cover_letter: app.previousWorkDetails || app.skillsText || null,
        full_address: app.fullAddress || null,
        city: app.city || null,
        state: app.state || null,
        pin_code: app.pinCode || null,
        work_categories: app.workCategories || [],
        skills: app.skills || [],
        skills_text: app.skillsText || null,
        admin_notes: app.adminNotes || null,
        status: app.status || 'Application Received',
        created_at: app.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('work_applications')
        .upsert(payload, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  async deleteWorkApplication(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('work_applications').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 11. CUSTOM SOLUTION ORDERS
  async getCustomOrders(): Promise<CustomSolutionOrder[] | null> {
    try {
      const { data, error } = await supabase
        .from('custom_solution_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map(o => ({
        id: o.id,
        fullName: o.full_name,
        mobileNumber: o.mobile_number,
        whatsappNumber: o.whatsapp_number,
        email: o.email,
        businessName: o.business_name,
        businessCategory: o.business_category,
        locationCity: o.location_city,
        requiredSolution: o.required_solution,
        projectRequirements: o.project_requirements,
        budget: o.budget,
        expectedTimeline: o.expected_timeline,
        referenceUrl: o.reference_url,
        additionalNotes: o.additional_notes,
        status: o.status,
        adminNotes: o.admin_notes,
        createdAt: o.created_at
      }));
    } catch {
      return null;
    }
  },

  async saveCustomOrder(order: CustomSolutionOrder): Promise<boolean> {
    try {
      const payload = {
        id: order.id,
        full_name: order.fullName,
        mobile_number: order.mobileNumber,
        whatsapp_number: order.whatsappNumber,
        email: order.email,
        business_name: order.businessName,
        business_category: order.businessCategory,
        location_city: order.locationCity,
        required_solution: order.requiredSolution,
        project_requirements: order.projectRequirements,
        budget: order.budget,
        expected_timeline: order.expectedTimeline,
        reference_url: order.referenceUrl || null,
        additional_notes: order.additionalNotes || null,
        status: order.status || 'New Request',
        admin_notes: order.adminNotes || null,
        created_at: order.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('custom_solution_orders')
        .upsert(payload, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  async deleteCustomOrder(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('custom_solution_orders').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 12. GENERAL SETTINGS (SEO, Founder Profile, Brand Logo, Feature Toggles)
  async getSetting<T>(key: string): Promise<T | null> {
    try {
      // 1st attempt: query by 'id' column (matching schema.sql)
      const { data: data1, error: err1 } = await supabase
        .from('settings')
        .select('value')
        .eq('id', key)
        .maybeSingle();

      if (!err1 && data1) return data1.value as T;

      // 2nd attempt: query by 'key' column
      const { data: data2, error: err2 } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (!err2 && data2) return data2.value as T;

      return null;
    } catch {
      return null;
    }
  },

  async saveSetting<T>(key: string, value: T): Promise<boolean> {
    try {
      // 1. Try server-side proxy route
      if (typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/admin/save-setting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success) return true;
          }
        } catch (fetchErr) {
          console.warn('Server proxy save-setting notice:', fetchErr);
        }
      }

      // 2. Direct client-side Supabase attempt (1st: id column)
      const { error: err1 } = await supabase
        .from('settings')
        .upsert({
          id: key,
          value: value as any,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (!err1) return true;

      // 3. Direct client-side Supabase attempt (2nd: key column)
      const { error: err2 } = await supabase
        .from('settings')
        .upsert({
          key: key,
          value: value as any,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      return !err2;
    } catch {
      return false;
    }
  }
};
