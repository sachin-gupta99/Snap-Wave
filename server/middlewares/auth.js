const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (!token) {
    return res.json({
      status: "failed",
      message: "Access denied",
    });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
  } catch (error) {
    res.json({
      status: "failed",
      message: "Invalid token",
    });
  }
  next();
};

exports.isAuthenticated = isAuthenticated;
