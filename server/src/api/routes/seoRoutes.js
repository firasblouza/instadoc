const express = require("express");
const router = express.Router();
const {
  getSEOSettings,
  getPageSEO,
  updateSEOSettings,
  generateSitemap,
  generateRobotsTxt,
  resetSEOSettings,
  getSEOAnalytics
} = require("../controllers/seoController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");

// Public routes
router.get("/page/:page", getPageSEO);
router.get("/sitemap.xml", generateSitemap);
router.get("/robots.txt", generateRobotsTxt);

// Protected routes (require authentication)
router.use(verifyJWT);

// Get current SEO settings
router.get("/", getSEOSettings);

// Admin routes (require admin role)
router.put("/", upload.fields([
  { name: 'siteLogo', maxCount: 1 },
  { name: 'siteFavicon', maxCount: 1 },
  { name: 'homeImage', maxCount: 1 },
  { name: 'defaultImage', maxCount: 1 }
]), verifyRole("admin"), updateSEOSettings);

router.post("/reset", verifyRole("admin"), resetSEOSettings);
router.get("/analytics", verifyRole("admin"), getSEOAnalytics);

module.exports = router;
