// Purpose : Handles authentication for both users and doctors

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const handleAuth = async (req, res) => {
  // Get the email and password from the request body
  const { email, password } = req.body;

  // If the email or password is missing, return 400
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  // Check if the email belongs to a user or a doctor first
  const user = await User.findOne({ email }).exec();

  if (!user) {
    // If it's not for a user, check if it's for a doctor
    const doctor = await Doctor.findOne({ email }).exec();
    // If it's not for a doctor, return 404
    if (!doctor) {
      return res.status(404).json({ message: "Email does not exist" });
    } else {
      // If it's for a doctor, check if the password is correct
      const validatePassword = await bcrypt.compare(password, doctor.password);
      // If it's not correct, return 401
      if (!validatePassword) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        // If it's correct, assign a JWT token to the doctor

        const accessToken = jwt.sign(
          {
            UserInfo: {
              email: doctor.email,
              role: doctor.role
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );

        const refreshToken = jwt.sign(
          {
            UserInfo: {
              email: doctor.email,
              role: doctor.role
            }
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        // Update the refresh token in the database
        const updateRefreshToken = await Doctor.findOneAndUpdate(
          { email: doctor.email },
          { refreshToken }
        );

        // Send the access token and refresh token to the client, currently just logging them
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          maxAge: 1000 * 60 * 60 * 24
        });

        res
          .status(200)
          .json({ message: "Logged in successfully", accessToken });

        console.log(
          `Doctor ${doctor.firstName} ${doctor.lastName} logged in successfully`
        );
      }
    }
    // If it's for a user, check if the password is correct
  } else {
    const validatePassword = await bcrypt.compare(password, user.password);
    // If it's not correct, return 401
    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid password" });
    } else {
      // If it's correct, assign a JWT token to the user
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
            role: user.role
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      const refreshToken = jwt.sign(
        {
          UserInfo: {
            email: user.email,
            role: user.role
          }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Update the refresh token in the database
      const updateRefreshToken = await User.findOneAndUpdate(
        { email: user.email },
        { refreshToken }
      );

      // Send the access token and refresh token to the client, currently just logging them

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24
      });

      res.status(200).json({ message: "Logged in successfully", accessToken });

      console.log(
        `User ${user.firstName} ${user.lastName} logged in successfully`
      );
    }
  }
};

module.exports = { handleAuth };
