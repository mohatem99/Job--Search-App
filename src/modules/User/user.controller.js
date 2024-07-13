import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../db/models/user.model.js";
import { errorHandler } from "../../middlewares/errorHandling.middleware.js";
import ApiError from "../../utils/errorClass.utils.js";

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { user, status }
 * @description update user
 */
export const updateUser = errorHandler(async (req, res, next) => {
  //destruct id from request user the logged in user

  //destruct id from request object
  const { email, firstName, lastName, mobileNumber, DOB, recoveryEmail } =
    req.body;

  console.log(req.user._id);
  // find the user and update then return new updated user
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { email, firstName, lastName, mobileNumber, DOB, recoveryEmail },
    { new: true }
  );

  // check user exists for Id
  if (!user) {
    return next(new ApiError(`No user for this id ${id}`));
  }

  //send response
  res.status(200).json({
    status: "success",
    user,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, status }
 * @description delete user
 */
export const deletUser = errorHandler(async (req, res, next) => {
  // find the logged in user then delete
  const user = await User.findByIdAndDelete(req.user._id);
  //check if user exists or not
  if (!user) {
    return next(new ApiError(`No user for this id ${req.user._id}`, 404));
  }

  // send response

  res.status(200).json({
    status: "success",
    message: "User Account deleted successfully",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { User, status }
 * @description Return user logged in data
 */
export const getProfile = errorHandler(async (req, res, next) => {
  // find the user data
  const user = await User.findById(req.user._id);
  // check if user exists
  if (!user) {
    return next(new ApiError(`No User for this Id${req.user._id}`, 404));
  }

  // send res
  res.status(200).json({
    status: "success",
    data: user,
  });
});
/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { User, status }
 * @description Return user data by req params id
 */
export const getUser = errorHandler(async (req, res, next) => {
  // destructure req params
  const { id } = req.params;
  console.log(id);
  //find the user
  const user = await User.findById(id);
  //check user exists
  if (!user) {
    return next(new ApiError(`No User for this Id${req.user._id}`, 404));
  }

  //send response
  res.status(200).json({
    status: "success",
    data: user,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { User, status }
 * @description Return users by recovery email
 */
export const recoverEmailUsers = errorHandler(async (req, res, next) => {
  // destructure requset params
  const { email } = req.params;
  // find userss
  const users = await User.find({ recoveryEmail: email });
  //send response
  res.status(200).json({
    status: "success",
    data: users,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { User, status }
 * @description update logged in user password
 */

export const updatePassword = errorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: bcrypt.hashSync(req.body.password, +process.env.SALT_ROUNDS),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  // 2) Generate token
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
  //send response
  res.status(200).json({ data: user, token });
});
