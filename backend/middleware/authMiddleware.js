import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
      req.user = { id: decoded.id, email: decoded.email };
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};
export default authMiddleware;
