const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
