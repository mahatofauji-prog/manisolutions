import React, { useEffect } from 'react';
import { PageView } from '../types';

interface SeoHeadProps {
  currentPage: PageView;
  selectedSolutionSlug?: string | null;
  selectedIndustryId?: string | null;
  selectedBusinessAiSlug?: string | null;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  currentPage,
  selectedSolutionSlug,
  selectedIndustryId,
  selectedBusinessAiSlug,
}) => {
  useEffect(() => {
    let pageTitle = 'MANI Solution | Digital Solutions, Software & Web Development';
    let metaDesc = 'MANI Solution, founded by Mr. Hariom Mahato, provides professional websites, custom software, mobile applications, AI solutions, automation and digital solutions for modern businesses.';
    let canonicalUrl = 'https://www.manisolution.com/';
    let isNoIndex = false;

    switch (currentPage) {
      case 'home':
        pageTitle = 'MANI Solution | Digital Solutions, Software & Web Development';
        canonicalUrl = 'https://www.manisolution.com/';
        break;
      case 'about':
        pageTitle = 'About MANI Solution | Founder Hariom Mahato & Digital Solutions';
        metaDesc = 'Learn about MANI Solution, a digital solutions company founded by Hariom Mahato. Modern Advancement for New India delivering web, app, and custom software.';
        canonicalUrl = 'https://www.manisolution.com/about';
        break;
      case 'services':
      case 'service-website':
      case 'service-app':
      case 'service-software':
      case 'service-ai-automation':
        pageTitle = 'Digital Services & Custom Software | MANI Solution';
        metaDesc = 'MANI Solution offers professional website development, mobile apps, custom software, and Business AI automation solutions.';
        canonicalUrl = 'https://www.manisolution.com/services';
        break;
      case 'solutions':
        pageTitle = 'Industry Digital Solutions & Custom Software | MANI Solution';
        metaDesc = 'Tailored digital solutions by MANI Solution for retail, healthcare, schools, real estate, gyms, restaurants, and growing businesses across India.';
        canonicalUrl = 'https://www.manisolution.com/solutions';
        break;
      case 'ready-solutions':
        pageTitle = 'Ready Business Software & Management Systems | MANI Solution';
        metaDesc = 'Explore pre-built business software solutions by MANI Solution: POS billing, restaurant QR menus, school portals, and gym management apps.';
        canonicalUrl = 'https://www.manisolution.com/ready-solutions';
        break;
      case 'contact':
        pageTitle = 'Contact MANI Solution | Get Custom Software & Website Quote';
        metaDesc = 'Get in touch with MANI Solution. Discuss your website, mobile app, or custom software requirements directly with our technical team.';
        canonicalUrl = 'https://www.manisolution.com/contact';
        break;
      case 'work-with-us':
        pageTitle = 'Work With Us & Career Opportunities | MANI Solution';
        metaDesc = 'Join or partner with MANI Solution (Modern Advancement for New India). Explore career opportunities, freelancing, and technical partnerships.';
        canonicalUrl = 'https://www.manisolution.com/work-with-us';
        break;
      case 'admin':
        pageTitle = 'Admin Management Portal | MANI Solution';
        metaDesc = 'MANI Solution Admin Portal.';
        canonicalUrl = 'https://www.manisolution.com/solution011253';
        isNoIndex = true;
        break;
      default:
        pageTitle = 'MANI Solution | Digital Solutions, Software & Web Development';
        canonicalUrl = 'https://www.manisolution.com/';
        break;
    }

    // Update document title
    document.title = pageTitle;

    // Update meta description
    let descElement = document.querySelector('meta[name="description"]');
    if (descElement) {
      descElement.setAttribute('content', metaDesc);
    }

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // Handle robots meta tag (noindex for admin route)
    let robotsElement = document.querySelector('meta[name="robots"]');
    if (!robotsElement) {
      robotsElement = document.createElement('meta');
      robotsElement.setAttribute('name', 'robots');
      document.head.appendChild(robotsElement);
    }
    if (isNoIndex) {
      robotsElement.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsElement.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // Dynamic Google JSON-LD Organization Schema Injection
    let schemaScript = document.getElementById('mani-organization-schema') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'mani-organization-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MANI Solution",
      "alternateName": "Modern Advancement for New India",
      "url": "https://www.manisolution.com",
      "logo": "https://www.manisolution.com/logo.png",
      "founder": {
        "@type": "Person",
        "name": "Hariom Mahato",
        "jobTitle": "Founder",
        "sameAs": [
          "https://www.linkedin.com/in/mani-solution-a300ba344"
        ]
      },
      "foundingDate": "2024",
      "sameAs": [
        "https://www.linkedin.com/in/mani-solution-a300ba344",
        "https://www.facebook.com/share/1DXiLYyXZd/"
      ],
      "description": "MANI Solution (Modern Advancement for New India) is a premier digital solutions company founded by Hariom Mahato. We design ready-to-launch website templates, custom software systems, and AI automation tools for Indian businesses."
    };

    schemaScript.textContent = JSON.stringify(schemaData);

    return () => {
      // Cleanup schema if leaving or unmounting (optional, but keep it for indexability)
    };
  }, [currentPage, selectedSolutionSlug, selectedIndustryId, selectedBusinessAiSlug]);

  return null;
};
