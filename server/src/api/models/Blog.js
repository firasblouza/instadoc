const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Medecine Generale",
        "Cardiologie", 
        "Neurologie",
        "Pediatrie",
        "Gynecologie",
        "Dermatologie",
        "Orthopedie",
        "Psychiatrie",
        "Chirurgie",
        "Radiologie",
        "Autres"
      ],
      default: "Autres"
    },
    tags: [{
      type: String,
      trim: true
    }],
    featuredImage: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    publishedAt: {
      type: Date,
      default: null
    },
    readTime: {
      type: Number,
      default: 0 // in minutes
    },
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      userName: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    seoTitle: {
      type: String,
      maxlength: 60
    },
    seoDescription: {
      type: String,
      maxlength: 160
    }
  },
  {
    timestamps: true
  }
);

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ publishedAt: -1 });

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Pre-save middleware to generate slug
blogSchema.pre('save', async function(next) {
  // Generate slug if title is modified or slug doesn't exist
  if (this.isModified('title') || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Check if slug already exists and add timestamp if needed
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingBlog = await this.constructor.findOne({ slug: slug });
      if (!existingBlog || existingBlog._id.toString() === this._id.toString()) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
