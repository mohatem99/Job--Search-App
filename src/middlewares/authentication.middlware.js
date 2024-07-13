import jwt from "jsonwebtoken";
import User from "../../db/models/user.model.js";
import ApiError from "../utils/errorClass.utils.js";
import { errorHandler } from "./errorHandling.middleware.js";

const auth = () => {
  return errorHandler(async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return next(new ApiError("You are not login please login first", 401));
    }

    if (!token.startsWith("Bearer")) {
      return next(new ApiError("Invalid token", 400));
    }

    let originalToken = token.split(" ")[1];

    // verfiy token

    const decoded = jwt.verify(originalToken, "jobSearch@@ex@m");

    if (!decoded?.userId) {
      return next(new ApiError("Invalid token payload", 401));
    }
    //  Check if user exists
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return next(
        new ApiError("The user belongs to this token doesnt exist", 401)
      );
    }

    req.user = currentUser;
    next();
  });
};

export default auth;
