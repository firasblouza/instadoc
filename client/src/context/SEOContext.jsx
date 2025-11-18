import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';
import useAccessToken from '../hooks/useAccessToken';

const SEOContext = createContext();

export const SEOProvider = ({ children }) => {
  const [seoData, setSeoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [seoCache, setSeoCache] = useState({}); // Cache to prevent repeated API calls

  const fetchPageSEO = useCallback(async (pageName) => {
    try {
      console.log(`🔍 Fetching SEO for page: ${pageName}`);
      const response = await api.get(`/seo/page/${pageName}`);
      const seoData = response.data.data;
      
      console.log(`📊 SEO data for ${pageName}:`, seoData);
      
      // Cache the result
      if (seoData) {
        setSeoCache(prev => ({ ...prev, [pageName]: seoData }));
      }
      
      return seoData;
    } catch (error) {
      console.error(`Error fetching SEO for page ${pageName}:`, error);
      
      // Return fallback SEO data based on page
      const fallbackSEO = getFallbackSEO(pageName);
      console.log(`🔄 Using fallback SEO for ${pageName}:`, fallbackSEO);
      
      // Cache the fallback
      setSeoCache(prev => ({ ...prev, [pageName]: fallbackSEO }));
      
      return fallbackSEO;
    }
  }, []);

  const getFallbackSEO = (pageName) => {
    const fallbacks = {
      home: {
        title: "InstaCure - Plateforme de Télémédecine",
        description: "InstaCure est votre plateforme de télémédecine en Tunisie. Consultez des médecins qualifiés en ligne, trouvez des médicaments et laboratoires, et gérez votre santé facilement.",
        keywords: "télémédecine, consultation médicale, médecin en ligne, santé, Tunisie, InstaCure"
      },
      doctors: {
        title: "Médecins - InstaCure",
        description: "Découvrez nos médecins qualifiés sur InstaCure. Trouvez le spécialiste qu'il vous faut pour votre consultation médicale en ligne.",
        keywords: "médecins, spécialistes, consultation médicale, télémédecine"
      },
      medicines: {
        title: "Médicaments - InstaCure",
        description: "Consultez notre catalogue de médicaments sur InstaCure. Informations détaillées et prix des médicaments disponibles.",
        keywords: "médicaments, pharmacie, prix, catalogue, santé"
      },
      labs: {
        title: "Laboratoires - InstaCure",
        description: "Trouvez les laboratoires d'analyses médicales près de chez vous. Informations de contact et localisation des laboratoires partenaires.",
        keywords: "laboratoires, analyses médicales, examens, santé"
      },
      blog: {
        title: "Blog Santé - InstaCure",
        description: "Découvrez nos articles de santé et conseils médicaux sur le blog InstaCure. Restez informé sur votre santé.",
        keywords: "blog santé, conseils médicaux, articles santé, bien-être"
      },
      contact: {
        title: "Contact - InstaCure",
        description: "Contactez l'équipe InstaCure pour toute question ou assistance. Nous sommes là pour vous aider.",
        keywords: "contact, support, assistance, aide"
      }
    };
    
    return fallbacks[pageName] || fallbacks.home;
  };

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
      'og:site_name': 'InstaCure'
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
      console.log(`🎯 Setting SEO for page: ${pageName}`);
      console.log(`🎯 Custom title: ${customTitle}`);
      console.log(`🎯 Custom description: ${customDescription}`);
      
      const seoData = await fetchPageSEO(pageName);
      
      // Always ensure we have SEO data (either from API or fallback)
      const finalSeoData = {
        ...seoData,
        title: customTitle || seoData?.title || getFallbackSEO(pageName).title,
        description: customDescription || seoData?.description || getFallbackSEO(pageName).description,
        image: customImage || seoData?.image || getFallbackSEO(pageName).image
      };

      console.log(`🎯 Final SEO data:`, finalSeoData);

      // Always update SEO data to ensure it's applied
      setSeoData(finalSeoData);
      updatePageTitle(finalSeoData.title);
      updateMetaTags(finalSeoData);
      
      console.log(`✅ SEO data applied for ${pageName}`);
    } catch (error) {
      console.error('Error setting page SEO:', error);
      
      // Even if there's an error, apply fallback SEO
      const fallbackData = getFallbackSEO(pageName);
      setSeoData(fallbackData);
      updatePageTitle(fallbackData.title);
      updateMetaTags(fallbackData);
      console.log(`🔄 Applied fallback SEO for ${pageName}`);
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

  const clearSEOCache = useCallback(() => {
    console.log('🧹 Clearing SEO cache');
    setSeoCache({});
  }, []);

  const value = {
    seoData,
    loading,
    setPageSEO,
    addSchemaMarkup,
    addCanonicalUrl,
    addGoogleAnalytics,
    addGoogleTagManager,
    updatePageTitle,
    updateMetaTags,
    clearSEOCache
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
