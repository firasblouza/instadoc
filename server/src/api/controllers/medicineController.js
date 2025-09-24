const Medicine = require("../models/Medicine");

const getAllMedicines = async (req, res) => {
  try {
    console.log("Fetching all medicines...");
    const medicines = await Medicine.find({}).exec();
    console.log("Found medicines:", medicines.length);
    res.status(200).json(medicines);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Error while fetching medicines" });
  }
};

const getMedicineById = async (req, res) => {
  const id = req.params.id;
  try {
    const medicine = await Medicine.findById(id).exec();
    if (medicine) {
      res.status(200).json(medicine);
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching medicine" });
  }
};

const createMedicine = async (req, res) => {
  const contentType = req.headers["content-type"];
  let medicineData = {};

  console.log("Content-Type:", contentType);
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);

  if (contentType.includes("multipart/form-data")) {
    if (req.body && req.body.medicine) {
      medicineData = JSON.parse(req.body.medicine);
    }
  } else if (contentType.includes("application/json")) {
    medicineData = req.body;
  }

  console.log("Parsed medicine data:", medicineData);

  // Handle image upload
  if (req.files && req.files["medicineImage"]) {
    medicineData.medicineImage = req.files["medicineImage"][0].filename;
  }

  try {
    const newMedicine = await Medicine.create(medicineData);
    res.status(201).json({
      message: "Medicine created successfully",
      medicine: newMedicine
    });
  } catch (err) {
    console.error("Error creating medicine:", err);
    if (err.code === 11000) {
      res.status(409).json({ message: "Medicine with this name already exists" });
    } else {
      res.status(500).json({ message: "Error while creating medicine", error: err.message });
    }
  }
};

const updateMedicineById = async (req, res) => {
  const id = req.params.id;
  const contentType = req.headers["content-type"];
  let medicineData = {};

  if (contentType.includes("multipart/form-data")) {
    if (req.body && req.body.medicine) {
      medicineData = JSON.parse(req.body.medicine);
    }
  } else if (contentType.includes("application/json")) {
    medicineData = req.body;
  }

  // Handle image upload
  if (req.files && req.files["medicineImage"]) {
    medicineData.medicineImage = req.files["medicineImage"][0].filename;
  }

  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { $set: medicineData },
      { new: true }
    );
    if (updatedMedicine) {
      res.status(200).json({
        message: "Medicine updated successfully",
        medicine: updatedMedicine
      });
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Medicine with this name already exists" });
    } else {
      res.status(500).json({ message: "Error while updating medicine" });
    }
  }
};

const deleteMedicineById = async (req, res) => {
  const id = req.params.id;
  try {
    // Soft delete by setting isActive to false
    const deletedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (deletedMedicine) {
      res.status(200).json({ message: "Medicine deleted successfully" });
    } else {
      res.status(404).json({ message: "Medicine not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting medicine" });
  }
};

const getMedicinesByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const medicines = await Medicine.find({ 
      category: category,
      isActive: true 
    }).exec();
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching medicines by category" });
  }
};

const searchMedicines = async (req, res) => {
  const { q } = req.query;
  try {
    const medicines = await Medicine.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { manufacturer: { $regex: q, $options: "i" } }
          ]
        }
      ]
    }).exec();
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Error while searching medicines" });
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicineById,
  deleteMedicineById,
  getMedicinesByCategory,
  searchMedicines
};
