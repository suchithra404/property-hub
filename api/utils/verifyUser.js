import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// ===============================
// VERIFY TOKEN (LOGIN CHECK)
// ===============================
export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    // Attach user info
    req.user = {
      _id: decoded._id || decoded.id,
      id: decoded._id || decoded.id,
      role: decoded.role, // user | admin | superadmin
      email: decoded.email,
      username: decoded.username,
      isAdmin: decoded.isAdmin,
    };

    next();
  });
};

// ===============================
// VERIFY ADMIN
// (admin OR superadmin)
// ===============================
export const verifyAdmin = (req, res, next) => {
  try {
    if (
      req.user?.role === "admin" ||
      req.user?.role === "superadmin" ||
      req.user?.isAdmin === true
    ) {
      next();
    } else {
      return next(errorHandler(403, "Admin access only"));
    }
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

// ===============================
// VERIFY SUPERADMIN (OPTIONAL 🔥)
// ===============================
export const verifySuperAdmin = (req, res, next) => {
  try {
    if (req.user?.role === "superadmin") {
      next();
    } else {
      return next(errorHandler(403, "SuperAdmin access only"));
    }
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
