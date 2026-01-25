import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

    if (err) {
      return next(errorHandler(403, 'Forbidden'));
    }

    // ✅ Attach FULL user info (IMPORTANT)
    req.user = {
      _id: decoded._id || decoded.id,
      role: decoded.role,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  });
};
