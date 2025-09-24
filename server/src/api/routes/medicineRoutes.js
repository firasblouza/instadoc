const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");

// Public routes
router.get("/", (req, res, next) => {
  console.log("📥 GET /medicines request received");
  next();
}, medicineController.getAllMedicines);
router.get("/search", medicineController.searchMedicines);
router.get("/category/:category", medicineController.getMedicinesByCategory);
router.get("/:id", medicineController.getMedicineById);

// Admin routes
router.post("/", upload.fields([{ name: "medicineImage" }]), verifyRole("admin"), medicineController.createMedicine);
router.put("/:id", upload.fields([{ name: "medicineImage" }]), verifyRole("admin"), medicineController.updateMedicineById);
router.delete("/:id", verifyRole("admin"), medicineController.deleteMedicineById);

module.exports = router;
