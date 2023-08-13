const jwt = require("jsonwebtoken");

const verifyRole = (requiredRole) => (req, res, next) => {
  // Get the JWT Token from the Cookie
  const reqHeader = req.headers["authorization"];
  const token = reqHeader && reqHeader.split(" ")[1];

  // check if the token exists
  if (token) {
    try {
      // Verify the token and decode it's payload
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // Check if the decoded token has the required role
      if (
        decodedToken.UserInfo.role == requiredRole ||
        decodedToken.UserInfo.role == "admin"
      ) {
        // Store the decoded token in case we need it
        req.UserInfo = decodedToken.UserInfo;
        // Proceed
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You don't have permissions for this request" });
      }
    } catch (err) {
      // If the token is invalid, return a 401 unautherized token
      return res
        .status(401)
        .json({ message: "Authentication failed, please login. 1" });
    }
  } else {
    res.status(401).json({ message: "Authentication failed, please login. 2" });
  }
};

module.exports = verifyRole;
