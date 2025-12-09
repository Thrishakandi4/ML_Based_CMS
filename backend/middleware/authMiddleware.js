import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Protect middleware
 * allowedRoles: array of allowed roles, empty = any authenticated user
 */
export const protect = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      req.user = { id: decoded.id, role: decoded.role };

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    });
  };
};
