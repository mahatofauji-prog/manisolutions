import React, { useEffect, useState } from 'react';
import { PageView, DigitalProduct } from '../types';
import { seoStorage, subscribeToSeoSettings } from '../services/seoStorage';
import { digitalProductsStorage } from '../services/digitalProductsStorage';

interface SeoHeadProps {
  currentPage: PageView;
  selectedDigitalProduct?: DigitalProduct | null;
  selectedSolutionSlug?: string | null;
  selectedIndustryId?: string | null;
  selectedBusinessAiSlug?: string | null;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  currentPage,
  selectedDigitalProduct,
  selectedSolutionSlug,
  selectedIndustryId,
  selectedBusinessAiSlug,
}) => {
  const [seoConfigs, setSeoConfigs] = useState(() => seoStorage.getAll());

  useEffect(() => {
    const handleUpdate = () => {
      setSeoConfigs(seoStorage.getAll());
    };
    return subscribeToSeoSettings(handleUpdate);
  }, []);

  useEffect(() => {
    // Determine mapping key for PageSeoConfig
    let seoKey = currentPage as string;
    if (currentPage === 'service-website') seoKey = 'service-website';
    else if (currentPage === 'service-software') seoKey = 'service-software';
    else if (currentPage === 'service-app') seoKey = 'service-app';
    else if (currentPage === 'service-ai-automation') seoKey = 'service-ai-automation';

    let config = seoStorage.getForPage(seoKey);

    // Dynamic digital product overrides
    let activeProduct: DigitalProduct | null = selectedDigitalProduct || null;
    if (!activeProduct && currentPage === 'digital-product-detail' && typeof window !== 'undefined') {
      const path = window.location.pathname;
      const slug = path.replace('/product/', '').replace('/digital-products/', '').replace('/', '');
      if (slug) {
        activeProduct = digitalProductsStorage.getBySlug(slug) || null;
      }
    }

    let pageTitle = config.title;
    let metaDesc = config.metaDescription;
    let canonicalUrl = config.canonicalUrl;
    let ogTitle = config.ogTitle || pageTitle;
    let ogDesc = config.ogDescription || metaDesc;
    let ogImage = config.ogImage || 'https://www.manisolution.com/logo.png';
    let isNoIndex = config.robotsNoIndex || currentPage === 'admin';

    if (currentPage === 'digital-product-detail' && activeProduct) {
      pageTitle = `${activeProduct.name} | Digital ${activeProduct.category} | MANI Solution`;
      metaDesc = `Explore ${activeProduct.name} by MANI Solution. ${activeProduct.shortDescription}`;
      canonicalUrl = `https://www.manisolution.com/product/${activeProduct.slug}`;
      ogTitle = pageTitle;
      ogDesc = metaDesc;
      ogImage = activeProduct.thumbnailUrl || 'https://www.manisolution.com/logo.png';
    }

    // Update document title
    document.title = pageTitle;

    // Helper to create or set meta tags
    const setMetaTag = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Meta Description & Keywords
    setMetaTag('name', 'description', metaDesc);
    setMetaTag('name', 'keywords', 'MANI Solution, MANI Solutions, Modern Advancement for New India, Website Development Services in India, Custom ERP Development India, Software Development Services India, Digital Products India, Business Management Software');

    // Canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // Robots meta tag
    if (isNoIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // OpenGraph Tags
    setMetaTag('property', 'og:type', currentPage === 'digital-product-detail' ? 'product' : 'website');
    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'MANI Solution');
    setMetaTag('property', 'og:image', ogImage);

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', ogTitle);
    setMetaTag('name', 'twitter:description', ogDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // JSON-LD Structured Data Injection
    let schemaScript = document.getElementById('mani-jsonld-schema') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'mani-jsonld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const graphNodes: any[] = [
      {
        "@type": "Organization",
        "@id": "https://www.manisolution.com/#organization",
        "name": "MANI Solution",
        "legalName": "Modern Advancement for New India",
        "alternateName": ["MANI Solutions", "manisolution", "MANI — Modern Advancement for New India"],
        "url": "https://www.manisolution.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.manisolution.com/logo.png"
        },
        "description": "MANI Solution provides professional website development, custom ERP software, mobile applications, digital products and AI automation for businesses across India.",
        "founder": {
          "@type": "Person",
          "name": "Hariom Mahato",
          "jobTitle": "Founder & Lead Technologist"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9678377275",
          "contactType": "customer service",
          "email": "manisolutions24x7@gmail.com",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"]
        },
        "sameAs": [
          "https://www.linkedin.com/in/mani-solution-a300ba344",
          "https://www.facebook.com/share/1DXiLYyXZd/"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.manisolution.com/#website",
        "url": "https://www.manisolution.com/",
        "name": "MANI Solution",
        "description": "Digital Solutions Provider in India — Website Development, Custom ERP & Software Solutions",
        "publisher": { "@id": "https://www.manisolution.com/#organization" }
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": pageTitle,
        "description": metaDesc,
        "isPartOf": { "@id": "https://www.manisolution.com/#website" }
      }
    ];

    // Add Product Schema if viewing a digital product
    if (currentPage === 'digital-product-detail' && activeProduct) {
      graphNodes.push({
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": activeProduct.name,
        "description": activeProduct.shortDescription || activeProduct.fullDescription,
        "image": activeProduct.thumbnailUrl,
        "category": activeProduct.category,
        "brand": {
          "@type": "Brand",
          "name": "MANI Solution"
        },
        "offers": {
          "@type": "Offer",
          "price": activeProduct.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "seller": { "@id": "https://www.manisolution.com/#organization" }
        }
      });

      // Breadcrumb Schema for Product
      graphNodes.push({
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.manisolution.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Digital Products",
            "item": "https://www.manisolution.com/digital-products"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": activeProduct.name,
            "item": canonicalUrl
          }
        ]
      });
    }

    // Add Service Schema for Service Pages
    if (currentPage === 'service-website' || currentPage === 'service-software' || currentPage === 'service-app' || currentPage === 'service-ai-automation' || currentPage === 'services') {
      graphNodes.push({
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        "name": config.pageName,
        "description": metaDesc,
        "provider": { "@id": "https://www.manisolution.com/#organization" },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
      });
    }

    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graphNodes
    });

  }, [currentPage, selectedDigitalProduct, selectedSolutionSlug, selectedIndustryId, selectedBusinessAiSlug, seoConfigs]);

  return null;
};
