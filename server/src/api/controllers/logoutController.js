// Purpose : Handles logout and deletes the refresh token from the database

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const handleLogout = async (req, res) => {
  // On client side, delete the accessToken
  // On server side, delete the refreshToken from the database
  const cookies = req.cookies; // Get the cookies from the request
  if (!cookies?.jwt) return res.sendStatus(204); // If the cookie is missing, return 204 (No Content)
  const refreshToken = cookies.jwt; // Get the refresh token from the cookie

  // Check if the refreshToken belongs to a user or a doctor first
  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    // If it's not for a user, check if it's for a doctor
    const doctor = await Doctor.findOne({ refreshToken }).exec();
    // If we did have a cookie, but it's not for a doctor nor a user, clear the cookie and return 204
    if (!doctor) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true
      });
      return res.sendStatus(204);
    }
    doctor.refreshToken = ""; // Delete the refresh token from the doctor
    await doctor.save(); // Save the changes to database
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" }); // Clear the cookie
    res.sendStatus(204); // Return 204
    console.log(`Doctor ${doctor.email} logged out`);
  } else {
    user.refreshToken = ""; // Delete the refresh token from the user
    await user.save(); // Save the changes to database
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // Clear the cookie
    res.sendStatus(204); // Return 204
    console.log(`User ${user.email} logged out`);
  }
};

module.exports = { handleLogout };
