const SEO = require("../models/SEO");

// Get current SEO settings
const getSEOSettings = async (req, res) => {
  try {
    let seoSettings = await SEO.findOne({ isActive: true });
    
    // If no SEO settings exist, create default ones
    if (!seoSettings) {
      seoSettings = new SEO({
        siteTitle: "InstaDoc - Plateforme de Télémédecine",
        siteDescription: "InstaDoc est votre plateforme de télémédecine moderne. Consultez des médecins qualifiés, gérez vos médicaments et laboratoires en ligne.",
        siteKeywords: ["télémédecine", "médecins en ligne", "consultation médicale", "santé digitale"],
        homeTitle: "InstaDoc - Consultation Médicale en Ligne",
        homeDescription: "Consultez des médecins qualifiés depuis chez vous. Plateforme de télémédecine sécurisée et moderne.",
        doctorsTitle: "Médecins Qualifiés - InstaDoc",
        doctorsDescription: "Découvrez notre équipe de médecins qualifiés et spécialisés. Consultation en ligne sécurisée.",
        medicinesTitle: "Catalogue des Médicaments - InstaDoc",
        medicinesDescription: "Informations détaillées sur les médicaments. Prix et descriptions pour tous les traitements.",
        labsTitle: "Laboratoires Partenaires - InstaDoc",
        labsDescription: "Trouvez les laboratoires partenaires près de chez vous. Analyses et examens médicaux.",
        blogTitle: "Blog Médical - Conseils et Actualités",
        blogDescription: "Articles médicaux rédigés par des professionnels. Conseils santé et actualités médicales.",
        contactTitle: "Contact - InstaDoc",
        contactDescription: "Contactez notre équipe InstaDoc. Support client et assistance technique.",
        isActive: true
      });
      await seoSettings.save();
    }

    res.status(200).json({
      success: true,
      data: seoSettings
    });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des paramètres SEO"
    });
  }
};

// Get SEO settings for a specific page
const getPageSEO = async (req, res) => {
  try {
    const { page } = req.params;
    const seoSettings = await SEO.findOne({ isActive: true });
    
    if (!seoSettings) {
      return res.status(404).json({
        success: false,
        message: "Paramètres SEO non trouvés"
      });
    }

    let pageSEO = {
      title: seoSettings.siteTitle,
      description: seoSettings.siteDescription,
      keywords: seoSettings.siteKeywords,
      image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
    };

    // Get page-specific SEO
    switch (page) {
      case 'home':
        pageSEO = {
          title: seoSettings.homeTitle || seoSettings.siteTitle,
          description: seoSettings.homeDescription || seoSettings.siteDescription,
          keywords: seoSettings.homeKeywords?.length > 0 ? seoSettings.homeKeywords : seoSettings.siteKeywords,
          image: seoSettings.homeImage || seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'about':
        pageSEO = {
          title: seoSettings.aboutTitle || `${seoSettings.siteTitle} - À propos`,
          description: seoSettings.aboutDescription || seoSettings.siteDescription,
          keywords: seoSettings.aboutKeywords?.length > 0 ? seoSettings.aboutKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'doctors':
        pageSEO = {
          title: seoSettings.doctorsTitle || `${seoSettings.siteTitle} - Médecins`,
          description: seoSettings.doctorsDescription || seoSettings.siteDescription,
          keywords: seoSettings.doctorsKeywords?.length > 0 ? seoSettings.doctorsKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'medicines':
        pageSEO = {
          title: seoSettings.medicinesTitle || `${seoSettings.siteTitle} - Médicaments`,
          description: seoSettings.medicinesDescription || seoSettings.siteDescription,
          keywords: seoSettings.medicinesKeywords?.length > 0 ? seoSettings.medicinesKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'labs':
        pageSEO = {
          title: seoSettings.labsTitle || `${seoSettings.siteTitle} - Laboratoires`,
          description: seoSettings.labsDescription || seoSettings.siteDescription,
          keywords: seoSettings.labsKeywords?.length > 0 ? seoSettings.labsKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'blog':
        pageSEO = {
          title: seoSettings.blogTitle || `${seoSettings.siteTitle} - Blog`,
          description: seoSettings.blogDescription || seoSettings.siteDescription,
          keywords: seoSettings.blogKeywords?.length > 0 ? seoSettings.blogKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
      case 'contact':
        pageSEO = {
          title: seoSettings.contactTitle || `${seoSettings.siteTitle} - Contact`,
          description: seoSettings.contactDescription || seoSettings.siteDescription,
          keywords: seoSettings.contactKeywords?.length > 0 ? seoSettings.contactKeywords : seoSettings.siteKeywords,
          image: seoSettings.openGraph?.defaultImage || seoSettings.siteLogo
        };
        break;
    }

    res.status(200).json({
      success: true,
      data: pageSEO
    });
  } catch (error) {
    console.error("Error fetching page SEO:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des paramètres SEO de la page"
    });
  }
};

// Update SEO settings (Admin only)
const updateSEOSettings = async (req, res) => {
  try {
    let updateData = {};
    
    // Handle different content types
    const contentType = req.headers["content-type"];
    
    if (contentType && contentType.includes("multipart/form-data")) {
      // Extract data from FormData
      updateData = { ...req.body };
      
      // Parse JSON fields if they exist
      const jsonFields = ['socialMedia', 'schemaMarkup', 'openGraph'];
      jsonFields.forEach(field => {
        if (updateData[field] && typeof updateData[field] === 'string') {
          try {
            updateData[field] = JSON.parse(updateData[field]);
          } catch (e) {
            console.log(`Could not parse ${field} JSON:`, e.message);
            // Don't delete the field, just leave it as string for now
          }
        }
      });
      
      // Handle array fields
      if (updateData.additionalMetaTags !== undefined) {
        if (typeof updateData.additionalMetaTags === 'string') {
          if (updateData.additionalMetaTags.trim() === '') {
            updateData.additionalMetaTags = [];
          } else {
            try {
              updateData.additionalMetaTags = JSON.parse(updateData.additionalMetaTags);
            } catch (e) {
              console.log("Could not parse additionalMetaTags JSON:", e.message);
              updateData.additionalMetaTags = [];
            }
          }
        }
        // Filter out invalid entries (empty objects or objects without required fields)
        if (Array.isArray(updateData.additionalMetaTags)) {
          updateData.additionalMetaTags = updateData.additionalMetaTags.filter(tag => 
            tag && (tag.name || tag.content || tag.property)
          );
        }
      } else {
        // If field is not provided, don't include it in the update
        delete updateData.additionalMetaTags;
      }
    } else {
      updateData = req.body;
    }
    
    // Handle file uploads
    if (req.files) {
      if (req.files.siteLogo) {
        updateData.siteLogo = req.files.siteLogo[0].filename;
      }
      if (req.files.siteFavicon) {
        updateData.siteFavicon = req.files.siteFavicon[0].filename;
      }
      if (req.files.homeImage) {
        updateData.homeImage = req.files.homeImage[0].filename;
      }
      if (req.files.defaultImage) {
        updateData.openGraph = {
          ...updateData.openGraph,
          defaultImage: req.files.defaultImage[0].filename
        };
      }
    }

    // Handle keywords as strings (convert from comma-separated to array)
    const keywordFields = [
      'siteKeywords', 'homeKeywords', 'aboutKeywords', 'doctorsKeywords',
      'medicinesKeywords', 'labsKeywords', 'blogKeywords', 'contactKeywords'
    ];
    
    keywordFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        updateData[field] = updateData[field]
          .split(',')
          .map(keyword => keyword.trim())
          .filter(keyword => keyword.length > 0);
      }
    });

    // Additional meta tags already handled above

    // Handle schema markup
    const schemaFields = ['organization', 'website', 'medicalBusiness'];
    schemaFields.forEach(field => {
      if (updateData.schemaMarkup && updateData.schemaMarkup[field] && typeof updateData.schemaMarkup[field] === 'string') {
        try {
          updateData.schemaMarkup[field] = JSON.parse(updateData.schemaMarkup[field]);
        } catch (error) {
          // If parsing fails, keep as string
        }
      }
    });

    // Filter out MongoDB internal fields that shouldn't be updated
    const fieldsToExclude = ['_id', '__v', 'createdAt', 'updatedAt', 'isActive'];
    fieldsToExclude.forEach(field => {
      delete updateData[field];
    });
    
    // Filter out empty strings and convert them to undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '' || updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    // Clean data ready for save
    
    let seoSettings = await SEO.findOne({ isActive: true });
    
    if (seoSettings) {
      // Update existing settings
      Object.assign(seoSettings, updateData);
      try {
        await seoSettings.save();
      } catch (saveError) {
        console.error("Error saving existing SEO settings:", saveError);
        // Try to create new settings if update fails
        seoSettings = new SEO(updateData);
        await seoSettings.save();
      }
    } else {
      // Create new settings
      seoSettings = new SEO(updateData);
      await seoSettings.save();
    }

    res.status(200).json({
      success: true,
      message: "Paramètres SEO mis à jour avec succès",
      data: seoSettings
    });
  } catch (error) {
    console.error("Error updating SEO settings:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des paramètres SEO"
    });
  }
};

// Generate sitemap
const generateSitemap = async (req, res) => {
  try {
    const seoSettings = await SEO.findOne({ isActive: true });
    const baseUrl = seoSettings?.canonicalUrl || `${req.protocol}://${req.get('host')}`;
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/doctors</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/medicines</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/labs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du sitemap"
    });
  }
};

// Generate robots.txt
const generateRobotsTxt = async (req, res) => {
  try {
    const seoSettings = await SEO.findOne({ isActive: true });
    const baseUrl = seoSettings?.canonicalUrl || `${req.protocol}://${req.get('host')}`;
    
    const robotsTxt = seoSettings?.robotsTxt || `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    res.set('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt);
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du robots.txt"
    });
  }
};

// Reset SEO settings to defaults
const resetSEOSettings = async (req, res) => {
  try {
    // Deactivate current settings
    await SEO.updateMany({ isActive: true }, { isActive: false });
    
    // Create new default settings
    const defaultSEO = new SEO({
      siteTitle: "InstaDoc - Plateforme de Télémédecine",
      siteDescription: "InstaDoc est votre plateforme de télémédecine moderne. Consultez des médecins qualifiés, gérez vos médicaments et laboratoires en ligne.",
      siteKeywords: ["télémédecine", "médecins en ligne", "consultation médicale", "santé digitale"],
      homeTitle: "InstaDoc - Consultation Médicale en Ligne",
      homeDescription: "Consultez des médecins qualifiés depuis chez vous. Plateforme de télémédecine sécurisée et moderne.",
      doctorsTitle: "Médecins Qualifiés - InstaDoc",
      doctorsDescription: "Découvrez notre équipe de médecins qualifiés et spécialisés. Consultation en ligne sécurisée.",
      medicinesTitle: "Catalogue des Médicaments - InstaDoc",
      medicinesDescription: "Informations détaillées sur les médicaments. Prix et descriptions pour tous les traitements.",
      labsTitle: "Laboratoires Partenaires - InstaDoc",
      labsDescription: "Trouvez les laboratoires partenaires près de chez vous. Analyses et examens médicaux.",
      blogTitle: "Blog Médical - Conseils et Actualités",
      blogDescription: "Articles médicaux rédigés par des professionnels. Conseils santé et actualités médicales.",
      contactTitle: "Contact - InstaDoc",
      contactDescription: "Contactez notre équipe InstaDoc. Support client et assistance technique.",
      isActive: true
    });
    
    await defaultSEO.save();

    res.status(200).json({
      success: true,
      message: "Paramètres SEO réinitialisés avec succès",
      data: defaultSEO
    });
  } catch (error) {
    console.error("Error resetting SEO settings:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réinitialisation des paramètres SEO"
    });
  }
};

// Get SEO analytics/suggestions
const getSEOAnalytics = async (req, res) => {
  try {
    const seoSettings = await SEO.findOne({ isActive: true });
    
    if (!seoSettings) {
      return res.status(404).json({
        success: false,
        message: "Paramètres SEO non trouvés"
      });
    }

    const analytics = {
      completeness: {
        general: {
          title: !!seoSettings.siteTitle,
          description: !!seoSettings.siteDescription,
          keywords: seoSettings.siteKeywords?.length > 0,
          logo: !!seoSettings.siteLogo,
          favicon: !!seoSettings.siteFavicon
        },
        pages: {
          home: {
            title: !!seoSettings.homeTitle,
            description: !!seoSettings.homeDescription,
            keywords: seoSettings.homeKeywords?.length > 0,
            image: !!seoSettings.homeImage
          },
          doctors: {
            title: !!seoSettings.doctorsTitle,
            description: !!seoSettings.doctorsDescription,
            keywords: seoSettings.doctorsKeywords?.length > 0
          },
          medicines: {
            title: !!seoSettings.medicinesTitle,
            description: !!seoSettings.medicinesDescription,
            keywords: seoSettings.medicinesKeywords?.length > 0
          },
          labs: {
            title: !!seoSettings.labsTitle,
            description: !!seoSettings.labsDescription,
            keywords: seoSettings.labsKeywords?.length > 0
          },
          blog: {
            title: !!seoSettings.blogTitle,
            description: !!seoSettings.blogDescription,
            keywords: seoSettings.blogKeywords?.length > 0
          },
          contact: {
            title: !!seoSettings.contactTitle,
            description: !!seoSettings.contactDescription,
            keywords: seoSettings.contactKeywords?.length > 0
          }
        }
      },
      suggestions: []
    };

    // Generate suggestions
    if (!seoSettings.siteLogo) {
      analytics.suggestions.push("Ajoutez un logo pour améliorer le branding");
    }
    if (!seoSettings.siteFavicon) {
      analytics.suggestions.push("Ajoutez un favicon pour une meilleure expérience utilisateur");
    }
    if (!seoSettings.googleAnalytics?.trackingId) {
      analytics.suggestions.push("Configurez Google Analytics pour suivre les performances");
    }
    if (!seoSettings.schemaMarkup?.organization) {
      analytics.suggestions.push("Ajoutez le Schema Markup pour l'organisation");
    }

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Error fetching SEO analytics:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des analyses SEO"
    });
  }
};

module.exports = {
  getSEOSettings,
  getPageSEO,
  updateSEOSettings,
  generateSitemap,
  generateRobotsTxt,
  resetSEOSettings,
  getSEOAnalytics
};
