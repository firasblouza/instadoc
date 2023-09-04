const Lab = require("../models/Lab");

const getAllLabs = async (req, res) => {
  // Parameters for the pagination
  const page = parseInt(req.query.page) || 1;
  const limit = 10 || req.query.limit;
  const skip = (page - 1) * limit;
  try {
    const labs = await Lab.find({}).exec();
    if (labs) {
      res.status(200).json(labs);
    } else {
      res.status(404).json({ message: "No labs found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching labs" });
  }
};

const addLab = async (req, res) => {
  let labData = {};
  if (req.body && req.body.lab) {
    labData = JSON.parse(req.body.lab);
  }
  // Append the uploaded image to the lab object
  if (req.files && req.files["labImage"]) {
    labData.labImage = req.files["labImage"][0].filename;
  }

  const { name, address, contact, labImage } = labData;
  const { location, city } = address;
  const { email, phoneNumber } = contact;

  if (!name || !location || !city || !email || !phoneNumber || !labImage) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const createLab = await Lab.create(labData);
    if (createLab) {
      res.status(200).json({ message: "Lab added successfully" });
    } else {
      res.status(404).json({ message: "Error while adding lab" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while adding lab" });
  }
};

const getLabById = async (req, res) => {
  const labId = req.params.id;
  try {
    const foundLab = await Lab.findById(labId).exec();
    if (foundLab) {
      res.status(200).json(foundLab);
    } else {
      res.status(404).json({ message: "No lab found with this id" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching lab" });
  }
};

const modifyLabById = async (req, res) => {
  const labId = req.params.id;
  const contentType = req.headers["content-type"];

  let labData = {};

  if (contentType && contentType.includes("multipart/form-data")) {
    if (req.body && req.body.lab) {
      labData = JSON.parse(req.body.lab);
      console.log("This is lab data : " + labData);
    }
  }
  console.log(labData);
  if (req.files && req.files["labImage"]) {
    labData.labImage = req.files["labImage"][0].filename;
    console.log(labData.labImage);
  }

  try {
    const updateLab = await Lab.findByIdAndUpdate(
      labId,
      { $set: labData },
      { new: true }
    ).exec();
    if (updateLab) {
      res.status(200).json({ message: "Lab updated successfully" });
    } else {
      res.status(404).json({ message: "No lab found with this ID" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating lab" });
  }
};

const deleteLabById = async (req, res) => {
  const labId = req.params.id;
  try {
    const deleteLab = await Lab.findByIdAndDelete(labId).exec();
    if (deleteLab) {
      res.status(200).json({ message: "Lab deleted successfully" });
    } else {
      res.status(404).json({ message: "No lab found with this ID" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting lab" });
  }
};

module.exports = {
  getAllLabs,
  getLabById,
  modifyLabById,
  deleteLabById,
  addLab
};
