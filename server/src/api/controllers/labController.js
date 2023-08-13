const Lab = require("../models/Lab");

const getAllLabs = async (req, res) => {
  // Parameters for the pagination
  const page = parseInt(req.query.page) || 1;
  const limit = 10 || req.query.limit;
  const skip = (page - 1) * limit;
  try {
    const labs = await Lab.find({}).skip(skip).limit(limit).exec();
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
  const { name, location, city, email, phoneNumber } = req.body;
  if (!name || !location || !city || !email || !phoneNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const createLab = await Lab.create({
      name,
      address: {
        location,
        city
      },
      contact: {
        email,
        phoneNumber
      }
    });
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
  const { name, address, contact } = req.body;
  const { location, city } = address;
  const { email, phoneNumber } = contact;
  if (!name || !location || !city || !email || !phoneNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newLabObj = {
      name,
      address: {
        location,
        city
      },
      contact: {
        email,
        phoneNumber
      }
    };
    const updateLab = await Lab.findByIdAndUpdate(labId, newLabObj).exec();
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
