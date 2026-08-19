const jwt = require("jsonwebtoken");


const authenticationMiddleware = async (req, res, next) => {
  console.log("authmiddleware");

  const SECRET_KEY = process.env.JWT_SECRET;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Access denied. No token provided.");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    console.log("token", token);
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    console.log("Token verified. User:", req.user);

    next();


  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    } else if (error.statusCode === 401) {
      return res.status(401).json({ message: error.message });
    } 

    console.log("Token verification error:", error);
    res.status(500).json({ message: "Server error during token verification." });
  }
}

module.exports = authenticationMiddleware;