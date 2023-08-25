// Purpose: Handles the refresh token request from the client and returns a new access token

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const handleRefreshToken = async (req, res) => {
  // Get the email and password from the request body
  const cookies = req.cookies;

  // If the email or password is missing, return 400
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  // Check if the email belongs to a user or a doctor first
  const user = await User.findOne({ refreshToken }).exec();
  console.log(user);
  if (!user) {
    // If it's not for a user, check if it's for a doctor
    const doctor = await Doctor.findOne({ refreshToken }).exec();
    // If it's not for a doctor, return 403
    if (!doctor) {
      return res.sendStatus(403); // Forbidden
    } else {
      // If it's for a doctor, Evaluate the refresh token and assign a new JWT token to the doctor
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || decoded.UserInfo.email !== doctor.email)
            return res.sendStatus(403); // Forbidden
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
            { expiresIn: "15m" }
          );
          res.json({ role: doctor.role, accessToken });
        }
      );
    }
    // If it's for a user, Evaluate the refresh token and assign a new JWT token to the user
  } else {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log("last before forbid");
        if (err || decoded.UserInfo.email !== user.email)
          return res.sendStatus(403); // Forbidden
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
          { expiresIn: "15m" }
        );
        res.json({ role: user.role, accessToken });
      }
    );
  }
};

module.exports = { handleRefreshToken };
