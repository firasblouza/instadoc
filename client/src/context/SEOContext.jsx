import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import useAccessToken from '../hooks/useAccessToken';

const SEOContext = createContext();

export const SEOProvider = ({ children }) => {
  const [seoData, setSeoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [seoCache, setSeoCache] = useState({}); // Cache to prevent repeated API calls
  const { accessToken } = useAccessToken();

  const fetchPageSEO = useCallback(async (pageName) => {
    // Check cache first
    if (seoCache[pageName]) {
      return seoCache[pageName];
    }

    try {
      const response = await axios.get(`/seo/page/${pageName}`);
      const seoData = response.data.data;
      
      // Cache the result
      if (seoData) {
        setSeoCache(prev => ({ ...prev, [pageName]: seoData }));
      }
      
      return seoData;
    } catch (error) {
      console.error(`Error fetching SEO for page ${pageName}:`, error);
      return null;
    }
  }, [seoCache]);

  const updatePageTitle = (title) => {
    if (title) {
      document.title = title;
    }
  };

  const updateMetaTags = (seoData) => {
    if (!seoData) return;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoData.description || '');
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', seoData.description || '');
      document.head.appendChild(metaDescription);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', (seoData.keywords || []).join(', '));
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', (seoData.keywords || []).join(', '));
      document.head.appendChild(metaKeywords);
    }

    // Update Open Graph tags
    const ogTags = {
      'og:title': seoData.title,
      'og:description': seoData.description,
      'og:image': seoData.image,
      'og:type': 'website',
      'og:site_name': 'InstaDoc'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (ogTag) {
          ogTag.setAttribute('content', content);
        } else {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          ogTag.setAttribute('content', content);
          document.head.appendChild(ogTag);
        }
      }
    });

    // Update Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': seoData.title,
      'twitter:description': seoData.description,
      'twitter:image': seoData.image
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) {
        let twitterTag = document.querySelector(`meta[name="${name}"]`);
        if (twitterTag) {
          twitterTag.setAttribute('content', content);
        } else {
          twitterTag = document.createElement('meta');
          twitterTag.setAttribute('name', name);
          twitterTag.setAttribute('content', content);
          document.head.appendChild(twitterTag);
        }
      }
    });
  };

  const setPageSEO = useCallback(async (pageName, customTitle = null, customDescription = null, customImage = null) => {
    try {
      setLoading(true);
      const seoData = await fetchPageSEO(pageName);
      
      if (seoData) {
        const finalSeoData = {
          ...seoData,
          title: customTitle || seoData.title,
          description: customDescription || seoData.description,
          image: customImage || seoData.image
        };

        // Only update if the data has actually changed
        const currentTitle = document.title;
        const currentDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
        
        if (currentTitle !== finalSeoData.title || currentDescription !== finalSeoData.description) {
          setSeoData(finalSeoData);
          updatePageTitle(finalSeoData.title);
          updateMetaTags(finalSeoData);
        }
      }
    } catch (error) {
      console.error('Error setting page SEO:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchPageSEO]);

  const addSchemaMarkup = useCallback((schemaData) => {
    if (!schemaData) return;

    // Remove existing schema markup
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Add new schema markup
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }, []);

  const addCanonicalUrl = useCallback((url) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
  }, []);

  const addGoogleAnalytics = (trackingId) => {
    if (!trackingId) return;

    // Remove existing GA script
    const existingGA = document.querySelector('script[src*="googletagmanager.com"]');
    if (existingGA) {
      existingGA.remove();
    }

    // Add Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', trackingId);
  };

  const addGoogleTagManager = (gtmId) => {
    if (!gtmId) return;

    // Add GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    // Add GTM noscript
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  };

  const value = {
    seoData,
    loading,
    setPageSEO,
    addSchemaMarkup,
    addCanonicalUrl,
    addGoogleAnalytics,
    addGoogleTagManager,
    updatePageTitle,
    updateMetaTags
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
};

export default SEOContext;
