const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema(
  {
    // General Website SEO
    siteTitle: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60
    },
    siteDescription: {
      type: String,
      required: false,
      trim: true,
      maxlength: 160
    },
    siteKeywords: [{
      type: String,
      trim: true
    }],
    siteLogo: {
      type: String,
      default: null
    },
    siteFavicon: {
      type: String,
      default: null
    },
    
    // Homepage SEO
    homeTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    homeDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    homeKeywords: [{
      type: String,
      trim: true
    }],
    homeImage: {
      type: String,
      default: null
    },
    
    // About Page SEO
    aboutTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    aboutDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    aboutKeywords: [{
      type: String,
      trim: true
    }],
    
    // Doctors Page SEO
    doctorsTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    doctorsDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    doctorsKeywords: [{
      type: String,
      trim: true
    }],
    
    // Medicines Page SEO
    medicinesTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    medicinesDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    medicinesKeywords: [{
      type: String,
      trim: true
    }],
    
    // Labs Page SEO
    labsTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    labsDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    labsKeywords: [{
      type: String,
      trim: true
    }],
    
    // Blog Page SEO
    blogTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    blogDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    blogKeywords: [{
      type: String,
      trim: true
    }],
    
    // Contact Page SEO
    contactTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    contactDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    contactKeywords: [{
      type: String,
      trim: true
    }],
    
    // Technical SEO
    canonicalUrl: {
      type: String,
      trim: true
    },
    robotsTxt: {
      type: String,
      default: `User-agent: *
Allow: /

Sitemap: https://InstaCure.com/sitemap.xml`
    },
    
    // Social Media SEO
    socialMedia: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Analytics
    googleAnalytics: {
      trackingId: {
        type: String,
        trim: true
      },
      gtmId: {
        type: String,
        trim: true
      }
    },
    googleSearchConsole: {
      verificationCode: {
        type: String,
        trim: true
      }
    },
    
    // Schema Markup
    schemaMarkup: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Additional Meta Tags
    additionalMetaTags: [{
      name: {
        type: String,
        required: false,
        trim: true
      },
      content: {
        type: String,
        required: false,
        trim: true
      },
      property: {
        type: String,
        trim: true
      }
    }],
    
    // Open Graph Defaults
    openGraph: {
      defaultImage: {
        type: String,
        default: null
      },
      imageWidth: {
        type: Number,
        default: 1200
      },
      imageHeight: {
        type: Number,
        default: 630
      },
      imageAlt: {
        type: String,
        default: null
      }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one SEO document exists
seoSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model("SEO", seoSchema);
