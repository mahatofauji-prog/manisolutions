-- ==============================================================================
-- MANI SOLUTION - COMPLETE SUPABASE POSTGRESQL SCHEMA SCRIPT
-- Project: MANI Solution Website (https://www.manisolution.com/)
-- Database: Supabase PostgreSQL (Public Schema)
-- ==============================================================================

-- 1. DIGITAL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.digital_settings (
    id TEXT PRIMARY KEY,
    enable_coupons BOOLEAN DEFAULT FALSE,
    raw_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DIGITAL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.digital_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DIGITAL PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.digital_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT,
    short_description TEXT,
    full_description TEXT,
    thumbnail_url TEXT,
    product_type TEXT DEFAULT 'Digital Download',
    price NUMERIC NOT NULL,
    compare_at_price NUMERIC,
    product_file_path TEXT,
    product_file_name TEXT,
    product_file_size TEXT,
    product_file_type TEXT,
    product_file_uploaded_at TIMESTAMPTZ,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_products_slug ON public.digital_products(slug);
CREATE INDEX IF NOT EXISTS idx_digital_products_status ON public.digital_products(status);

-- 4. DIGITAL ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.digital_orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_status TEXT DEFAULT 'Pending',
    access_status TEXT DEFAULT 'Pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    coupon_code TEXT,
    discount_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_orders_email ON public.digital_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_digital_orders_razorpay_order ON public.digital_orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_digital_orders_razorpay_payment ON public.digital_orders(razorpay_payment_id);

-- 5. DIGITAL ACCESS TABLE
CREATE TABLE IF NOT EXISTS public.digital_access (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    product_id TEXT,
    customer_email TEXT NOT NULL,
    access_status TEXT DEFAULT 'ACTIVE',
    download_token TEXT,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 10,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_access_token ON public.digital_access(download_token);
CREATE INDEX IF NOT EXISTS idx_digital_access_email ON public.digital_access(customer_email);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC NOT NULL,
    usage_limit INTEGER DEFAULT 100,
    usage_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PORTFOLIO SOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_solutions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    client TEXT,
    image_url TEXT,
    description TEXT,
    metrics TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    live_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BUSINESS AI SOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.business_ai_solutions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    short_description TEXT,
    full_description TEXT,
    icon TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. READY SOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.ready_solutions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    price TEXT,
    rating NUMERIC DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    image_url TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    demo_url TEXT,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. READY SOLUTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.ready_solution_requests (
    id TEXT PRIMARY KEY,
    solution_id TEXT,
    solution_title TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    business_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CUSTOM SOLUTION ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.custom_solution_orders (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    company_name TEXT,
    project_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    requirements TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. WEBSITE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.website_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WEBSITE TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.website_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    price NUMERIC NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    preview_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TEMPLATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.template_orders (
    id TEXT PRIMARY KEY,
    template_id TEXT,
    template_title TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    amount NUMERIC NOT NULL,
    payment_status TEXT DEFAULT 'Pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. WORK APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.work_applications (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role_applied TEXT,
    experience_years TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================

ALTER TABLE public.digital_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_ai_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ready_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ready_solution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_solution_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- REPEATABLE POLICIES (DROP IF EXISTS -> CREATE POLICY)
-- ==============================================================================

-- 1. Settings Policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.settings;
DROP POLICY IF EXISTS "Public Write Settings" ON public.settings;
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- 2. Digital Settings Policies
DROP POLICY IF EXISTS "Public Read Digital Settings" ON public.digital_settings;
DROP POLICY IF EXISTS "Public Write Digital Settings" ON public.digital_settings;
CREATE POLICY "Public Read Digital Settings" ON public.digital_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Digital Settings" ON public.digital_settings FOR ALL USING (true) WITH CHECK (true);

-- 3. Digital Categories Policies
DROP POLICY IF EXISTS "Public Read Digital Categories" ON public.digital_categories;
DROP POLICY IF EXISTS "Public Write Digital Categories" ON public.digital_categories;
CREATE POLICY "Public Read Digital Categories" ON public.digital_categories FOR SELECT USING (true);
CREATE POLICY "Public Write Digital Categories" ON public.digital_categories FOR ALL USING (true) WITH CHECK (true);

-- 4. Digital Products Policies
DROP POLICY IF EXISTS "Public Read Digital Products" ON public.digital_products;
DROP POLICY IF EXISTS "Public Write Digital Products" ON public.digital_products;
CREATE POLICY "Public Read Digital Products" ON public.digital_products FOR SELECT USING (true);
CREATE POLICY "Public Write Digital Products" ON public.digital_products FOR ALL USING (true) WITH CHECK (true);

-- 5. Digital Orders Policies
DROP POLICY IF EXISTS "Public Read Digital Orders" ON public.digital_orders;
DROP POLICY IF EXISTS "Public Insert Digital Orders" ON public.digital_orders;
DROP POLICY IF EXISTS "Public Update Digital Orders" ON public.digital_orders;
CREATE POLICY "Public Read Digital Orders" ON public.digital_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Digital Orders" ON public.digital_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Digital Orders" ON public.digital_orders FOR UPDATE USING (true);

-- 6. Digital Access Policies
DROP POLICY IF EXISTS "Public Read Digital Access" ON public.digital_access;
DROP POLICY IF EXISTS "Public Insert Digital Access" ON public.digital_access;
DROP POLICY IF EXISTS "Public Update Digital Access" ON public.digital_access;
CREATE POLICY "Public Read Digital Access" ON public.digital_access FOR SELECT USING (true);
CREATE POLICY "Public Insert Digital Access" ON public.digital_access FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Digital Access" ON public.digital_access FOR UPDATE USING (true);

-- 7. Coupons Policies
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Write Coupons" ON public.coupons;
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Write Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- 8. Portfolio Solutions Policies
DROP POLICY IF EXISTS "Public Read Portfolio Solutions" ON public.portfolio_solutions;
DROP POLICY IF EXISTS "Public Write Portfolio Solutions" ON public.portfolio_solutions;
CREATE POLICY "Public Read Portfolio Solutions" ON public.portfolio_solutions FOR SELECT USING (true);
CREATE POLICY "Public Write Portfolio Solutions" ON public.portfolio_solutions FOR ALL USING (true) WITH CHECK (true);

-- 9. Business AI Solutions Policies
DROP POLICY IF EXISTS "Public Read Business AI Solutions" ON public.business_ai_solutions;
DROP POLICY IF EXISTS "Public Write Business AI Solutions" ON public.business_ai_solutions;
CREATE POLICY "Public Read Business AI Solutions" ON public.business_ai_solutions FOR SELECT USING (true);
CREATE POLICY "Public Write Business AI Solutions" ON public.business_ai_solutions FOR ALL USING (true) WITH CHECK (true);

-- 10. Ready Solutions Policies
DROP POLICY IF EXISTS "Public Read Ready Solutions" ON public.ready_solutions;
DROP POLICY IF EXISTS "Public Write Ready Solutions" ON public.ready_solutions;
CREATE POLICY "Public Read Ready Solutions" ON public.ready_solutions FOR SELECT USING (true);
CREATE POLICY "Public Write Ready Solutions" ON public.ready_solutions FOR ALL USING (true) WITH CHECK (true);

-- 11. Ready Solution Requests Policies
DROP POLICY IF EXISTS "Public Read Ready Requests" ON public.ready_solution_requests;
DROP POLICY IF EXISTS "Public Insert Ready Requests" ON public.ready_solution_requests;
CREATE POLICY "Public Read Ready Requests" ON public.ready_solution_requests FOR SELECT USING (true);
CREATE POLICY "Public Insert Ready Requests" ON public.ready_solution_requests FOR INSERT WITH CHECK (true);

-- 12. Custom Solution Orders Policies
DROP POLICY IF EXISTS "Public Read Custom Orders" ON public.custom_solution_orders;
DROP POLICY IF EXISTS "Public Insert Custom Orders" ON public.custom_solution_orders;
CREATE POLICY "Public Read Custom Orders" ON public.custom_solution_orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Custom Orders" ON public.custom_solution_orders FOR INSERT WITH CHECK (true);

-- 13. Website Categories & Templates Policies
DROP POLICY IF EXISTS "Public Read Website Categories" ON public.website_categories;
CREATE POLICY "Public Read Website Categories" ON public.website_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Website Templates" ON public.website_templates;
CREATE POLICY "Public Read Website Templates" ON public.website_templates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Template Orders" ON public.template_orders;
CREATE POLICY "Public Insert Template Orders" ON public.template_orders FOR INSERT WITH CHECK (true);

-- 14. Enquiries & Work Applications Policies
DROP POLICY IF EXISTS "Public Insert Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public Read Enquiries" ON public.enquiries;
CREATE POLICY "Public Insert Enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Enquiries" ON public.enquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Work Applications" ON public.work_applications;
DROP POLICY IF EXISTS "Public Read Work Applications" ON public.work_applications;
CREATE POLICY "Public Insert Work Applications" ON public.work_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Work Applications" ON public.work_applications FOR SELECT USING (true);

-- ==============================================================================
-- OPTIONAL INITIAL SEED DATA (SAFE UPSERT WITH DOLLAR QUOTING)
-- ==============================================================================

INSERT INTO public.digital_categories (id, name, slug, display_order, status)
VALUES
    ('cat-ebooks-tools', 'E-Books / Tools', 'ebooks-tools', 1, 'published'),
    ('cat-business-software', 'Business Software', 'business-software', 2, 'published')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug;

INSERT INTO public.digital_products (
    id, name, slug, category, short_description, full_description,
    thumbnail_url, product_type, price, compare_at_price,
    status, is_featured, features, faqs
) VALUES (
    'dp-ai-business-grow',
    'AI से अपना Business Grow कैसे करें?',
    'ai-business-grow-guide',
    'E-Books / Tools',
    'Practical Hindi & English Actionable Blueprint for modern business transformation using Artificial Intelligence.',
    'A complete step-by-step master guide for entrepreneurs, small business owners, and creators looking to automate marketing, customer service, and daily operations using modern AI tools.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    'Digital Download',
    299,
    499,
    'published',
    true,
    $$["Step-by-step AI workflows for daily business", "Prompt engineering templates for marketing", "Top 50 curated business AI tools list", "Lifetime updates and immediate PDF download"]$$::jsonb,
    $$[{"question": "How do I download the E-book?", "answer": "Instant secure download is available immediately after successful payment verification."}, {"question": "Is this suitable for beginners?", "answer": "Yes, it is written in simple, actionable Hindi & English with clear screenshots."}]$$::jsonb
), (
    'dp-small-business-management-software',
    'Small Business Management Software',
    'small-business-management-software',
    'Business Software',
    'All-in-one ERP, CRM, Billing & Inventory tracking system built specifically for SMEs.',
    'Comprehensive management toolkit containing ready-to-use billing modules, client tracking, automated GST invoice templates, and real-time inventory management dashboards.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'Software / Tool',
    999,
    1999,
    'published',
    true,
    $$["Complete billing & GST invoice generator", "Customer management & leads pipeline", "Stock & inventory tracking dashboard", "Easy Excel/Cloud export and backup"]$$::jsonb,
    $$[{"question": "What are the system requirements?", "answer": "Works on any modern browser, Windows, Mac, or mobile devices."}, {"question": "Do I get updates?", "answer": "Yes, you receive all feature updates and documentation included."}]$$::jsonb
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    status = EXCLUDED.status,
    is_featured = EXCLUDED.is_featured,
    updated_at = NOW();
