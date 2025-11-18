import { useEffect } from 'react';
import { useSEO } from '../context/SEOContext';
import { useLocation } from 'react-router-dom';

const usePageSEO = (pageName, customTitle = null, customDescription = null, customImage = null) => {
  const { setPageSEO, addCanonicalUrl, addSchemaMarkup } = useSEO();
  const location = useLocation();

  useEffect(() => {
    // Set page SEO
    setPageSEO(pageName, customTitle, customDescription, customImage);

    // Add canonical URL
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    addCanonicalUrl(canonicalUrl);

    // Add page-specific schema markup if needed
    if (pageName === 'home') {
      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "InstaCure",
        "url": window.location.origin,
        "logo": `${window.location.origin}/uploads/logo.png`,
        "description": "Plateforme de télémédecine moderne",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-XXX-XXX-XXXX",
          "contactType": "customer service"
        }
      };
      addSchemaMarkup(organizationSchema);
    }
  }, [pageName, customTitle, customDescription, customImage, location.pathname]);
};

export default usePageSEO;
