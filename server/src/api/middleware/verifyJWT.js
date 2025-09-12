// Middleware to verify JWT token from the client and assign the email and role to the request object

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // Unauthorized
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    // Handle both token structures: direct and UserInfo nested
    const userInfo = decoded.UserInfo || decoded;
    req.email = userInfo.email;
    req.id = userInfo.id;
    req.role = userInfo.role;
    next();
  });
};

module.exports = verifyJWT;
