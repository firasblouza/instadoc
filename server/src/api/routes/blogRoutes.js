const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/blogController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");

// Public routes
router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/related/:slug", getRelatedBlogs);

// Protected routes (require authentication)
router.use(verifyJWT);

// Like/Unlike blog
router.patch("/:id/like", toggleLike);

// Add comment
router.post("/:id/comment", addComment);

// Admin routes (require admin role)
router.get("/admin/all", verifyRole("admin"), getAllBlogsAdmin);
router.get("/admin/stats", verifyRole("admin"), getBlogStats);
router.post("/admin/create", upload.single('featuredImage'), verifyRole("admin"), createBlog);
router.put("/admin/:id", upload.single('featuredImage'), verifyRole("admin"), updateBlog);
router.delete("/admin/:id", verifyRole("admin"), deleteBlog);

module.exports = router;
