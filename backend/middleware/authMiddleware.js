import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes with JWT verification
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_clothing_store_jwt_key_2026'
      );

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('User account no longer exists');
      }

      if (!req.user.isActive) {
        res.status(403);
        throw new Error('Your user account has been deactivated. Please contact Admin.');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid or expired token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, missing authorization header');
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};
