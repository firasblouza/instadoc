// Purpose : Handles authentication for both users and doctors

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const handleAuth = async (req, res) => {
  // Get the email and password from the request body
  const { email, password, rememberMe } = req.body;
  let accessTokenDuration;

  // If the email or password is missing, return 400
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  if (rememberMe) {
    accessTokenDuration = "5h";
  } else {
    accessTokenDuration = "1h";
  }
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
              id: doctor._id,
              email: doctor.email,
              fullName: `${doctor.firstName} ${doctor.lastName}`,
              role: doctor.role
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: accessTokenDuration }
        );

        const refreshToken = jwt.sign(
          {
            UserInfo: {
              id: doctor._id,
              email: doctor.email,
              fullName: `${doctor.firstName} ${doctor.lastName}`,
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
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
          message: "Logged in successfully",
          role: doctor.role,
          accessToken
        });

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
            id: user._id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenDuration }
      );

      const refreshToken = jwt.sign(
        {
          UserInfo: {
            id: user._id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
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
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000
      });
      res.status(200).json({
        message: "Logged in successfully",
        role: user.role,
        accessToken
      });

      console.log(
        `User ${user.firstName} ${user.lastName} logged in successfully`
      );
    }
  }
};

module.exports = { handleAuth };
