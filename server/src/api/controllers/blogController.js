const Blog = require("../models/Blog");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Get all published blogs with pagination and filtering
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = { status: 'published' };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName profileImage')
      .select('title slug excerpt category tags featuredImage publishedAt readTime views likeCount author authorName')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles"
    });
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('author', 'firstName lastName profileImage specialty')
      .populate('likes', 'firstName lastName')
      .populate('comments.user', 'firstName lastName profileImage');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'article"
    });
  }
};

// Get related blogs
const getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    const currentBlog = await Blog.findOne({ slug });
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: currentBlog._id },
      status: 'published',
      $or: [
        { category: currentBlog.category },
        { tags: { $in: currentBlog.tags } }
      ]
    })
      .populate('author', 'firstName lastName profileImage')
      .select('title slug excerpt category featuredImage publishedAt readTime views authorName')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: relatedBlogs
    });
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles similaires"
    });
  }
};

// Create new blog (Admin only)
const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      seoTitle,
      seoDescription
    } = req.body;

    const authorId = req.UserInfo.id;

    // Get author information
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Auteur non trouvé"
      });
    }

    // Truncate fields to meet model constraints
    const truncatedExcerpt = excerpt ? excerpt.substring(0, 300) : '';
    const truncatedSeoTitle = seoTitle ? seoTitle.substring(0, 60) : '';
    const truncatedSeoDescription = seoDescription ? seoDescription.substring(0, 160) : '';

    const blogData = {
      title,
      content,
      excerpt: truncatedExcerpt,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: authorId,
      authorName: `${author.firstName} ${author.lastName}`,
      status: status || 'draft',
      seoTitle: truncatedSeoTitle,
      seoDescription: truncatedSeoDescription
    };

    // Handle featured image upload
    if (req.file) {
      blogData.featuredImage = req.file.filename;
    }

    // Set published date if status is published
    if (blogData.status === 'published') {
      blogData.publishedAt = new Date();
    }

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      success: true,
      message: "Article créé avec succès",
      data: blog
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'article"
    });
  }
};

// Update blog (Admin only)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      seoTitle,
      seoDescription
    } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;
    blog.status = status || blog.status;
    blog.seoTitle = seoTitle || blog.seoTitle;
    blog.seoDescription = seoDescription || blog.seoDescription;

    // Handle featured image update
    if (req.file) {
      // Delete old image if exists
      if (blog.featuredImage) {
        const oldImagePath = path.join(__dirname, '../../uploads', blog.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      blog.featuredImage = req.file.filename;
    }

    // Set published date if status changed to published
    if (blog.status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Article mis à jour avec succès",
      data: blog
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'article"
    });
  }
};

// Delete blog (Admin only)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    // Delete featured image if exists
    if (blog.featuredImage) {
      const imagePath = path.join(__dirname, '../../uploads', blog.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article supprimé avec succès"
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'article"
    });
  }
};

// Like/Unlike blog
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: isLiked ? "Article retiré des favoris" : "Article ajouté aux favoris",
      data: {
        isLiked: !isLiked,
        likeCount: blog.likes.length
      }
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des favoris"
    });
  }
};

// Add comment to blog
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article non trouvé"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    const comment = {
      user: userId,
      userName: `${user.firstName} ${user.lastName}`,
      content: content.trim()
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({
      success: true,
      message: "Commentaire ajouté avec succès",
      data: comment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout du commentaire"
    });
  }
};

// Get blog statistics (Admin only)
const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentBlogs = await Blog.find()
      .populate('author', 'firstName lastName')
      .select('title status publishedAt views')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalViews: totalViews[0]?.totalViews || 0,
        categoryStats,
        recentBlogs
      }
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques"
    });
  }
};

// Get all blogs for admin management
const getAllBlogsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des articles"
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  getBlogStats,
  getAllBlogsAdmin
};
