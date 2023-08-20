const bcrypt = require("bcrypt");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");

const handleSignup = async (req, res) => {
  const { email, password, firstName, lastName, role, dateOfBirth } =
    JSON.parse(req.body.userData);
  console.log(JSON.parse(req.body.userData));

  if (!email || !password || !firstName || !lastName || !role || !dateOfBirth) {
    return res.status(400).json({ message: "Please fill in all fields1" });
  }
  if (role === "doctor") {
    const { speciality, idNumber, idType, licenseNumber } = JSON.parse(
      req.body.userData
    );

    const licenseImage = req.files["licenseImage"][0].filename;
    const profileImage = req.files["profileImage"][0].filename;
    const idImage = req.files["idImage"][0].filename;

    if (
      !speciality ||
      !idNumber ||
      !idType ||
      !idImage ||
      !licenseNumber ||
      !licenseImage ||
      !profileImage
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check for duplicate Email.

    const docEmailCheck = await Doctor.findOne({ email }).exec();
    if (docEmailCheck)
      return res.status(409).json({ message: "Email already exists" });

    // Hash the password
    const docHashedPw = await bcrypt.hash(password, 10);

    // Create and store the new doctor || Role is set to doctor by default
    try {
      const newDoctor = await Doctor.create({
        email,
        password: docHashedPw,
        dateOfBirth,
        firstName,
        lastName,
        idType,
        idNumber,
        idImage: req.files["idImage"][0].filename,
        profileImage: req.files["profileImage"][0].filename,
        licenseNumber,
        licenseImage: req.files["licenseImage"][0].filename,
        speciality
      });
      console.log(newDoctor);
      res.status(201).json({
        message: `Account created successfully`
      });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    // Check for duplicate Email.

    const userEmailCheck = await User.findOne({ email }).exec();
    if (userEmailCheck)
      return res.status(409).json({ message: "Email already exists" });

    const userHashedPw = await bcrypt.hash(password, 10);

    // Create and store the new user || Role is set to user by default
    const newUser = await User.create({
      email,
      password: userHashedPw,
      dateOfBirth,
      firstName,
      lastName
    });
    console.log(newUser);
    res.status(201).json({
      message: "Account created successfuly"
    });
  }
};

module.exports = { handleSignup };
