import ApiError from "../utils/errorClass.utils.js";
import { errorHandler } from "./errorHandling.middleware.js";

/**
 * @param {Array} roles - Array of allowed roles based on the router
 * @returns  {Function} - Middleware function
 * @description - Middleware function to check if the user role is allowed to access the route
 */
const authorize = (...roles) => {
  return errorHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route"),
        403
      );
    }

    next();
  });
};

export default authorize;
