const bcrypt = require("bcrypt");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multer");

const handleSignup = async (req, res) => {
  const { email, password, firstName, lastName, role, dateOfBirth, phoneNumber } =
    JSON.parse(req.body.userData);

  if (!email || !password || !firstName || !lastName || !role || !dateOfBirth) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs" });
  }
  if (role === "doctor") {
    const { speciality, idNumber, idType, licenseNumber } = JSON.parse(
      req.body.userData
    );

    const licenseImage = req.files["licenseImage"][0].filename;
    const profileImage = req.files["profileImage"][0].filename;
    const idImage = req.files["idImage"][0].filename;
    const cvImage = req.files["cvImage"][0].filename;

    if (
      !speciality ||
      !idNumber ||
      !idType ||
      !idImage ||
      !licenseNumber ||
      !licenseImage ||
      !profileImage ||
      !cvImage
    ) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    // Check for duplicate Email.

    const docEmailCheck = await Doctor.findOne({ email }).exec();
    if (docEmailCheck)
      return res.status(409).json({ message: "Cette adresse email existe déjà" });

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
        phoneNumber,
        idType,
        idNumber,
        idImage: req.files["idImage"][0].filename,
        profileImage: req.files["profileImage"][0].filename,
        licenseNumber,
        licenseImage: req.files["licenseImage"][0].filename,
        cvImage: req.files["cvImage"][0].filename,
        speciality
      });
      // Create welcome notification for doctor
      try {
        await Notification.create({
          userId: newDoctor._id,
          title: "Bienvenue sur InstaCure",
          message: "Votre compte médecin a été créé avec succès. Votre profil est en cours de vérification.",
          type: "welcome",
          priority: "medium",
          actionUrl: "/dashboard"
        });
      } catch (notifError) {
        console.error("Error creating welcome notification:", notifError);
      }

      res.status(201).json({
        message: `Compte créé avec succès`
      });
    } catch (err) {
      res.status(500).json({ message: "Une erreur s'est produite" });
    }
  } else {
    // Check for duplicate Email.

    const userEmailCheck = await User.findOne({ email }).exec();
    if (userEmailCheck)
      return res.status(409).json({ message: "Cette adresse email existe déjà" });

    const userHashedPw = await bcrypt.hash(password, 10);

    // Handle profile image for patients
    let profileImagePath = null;
    if (req.files && req.files["profileImage"] && req.files["profileImage"][0]) {
      profileImagePath = req.files["profileImage"][0].filename;
    }

    // Create and store the new user || Role is set to user by default
    const newUser = await User.create({
      email,
      password: userHashedPw,
      dateOfBirth,
      firstName,
      lastName,
      phoneNumber,
      profileImage: profileImagePath
    });

    // Create welcome notification for patient
    try {
      await Notification.create({
        userId: newUser._id,
        title: "Bienvenue sur InstaCure",
        message: "Votre compte patient a été créé avec succès. Découvrez toutes nos fonctionnalités!",
        type: "welcome",
        priority: "medium",
        actionUrl: "/dashboard"
      });
    } catch (notifError) {
      console.error("Error creating welcome notification:", notifError);
    }

    res.status(201).json({
      message: "Compte créé avec succès"
    });
  }
};

module.exports = { handleSignup };
