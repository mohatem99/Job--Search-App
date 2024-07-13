import bcrypt from "bcrypt";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../../../db/models/user.model.js";
import { errorHandler } from "../../middlewares/errorHandling.middleware.js";
import ApiError from "../../utils/errorClass.utils.js";
import sendMail from "../../services/sendMail.js";

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, status }
 * @description create new user
 */
export const signUp = errorHandler(async (req, res, next) => {
  // destructure req object
  const {
    email,
    password,
    firstName,
    lastName,
    mobileNumber,
    role,
    recoveryEmail,
    DOB,
  } = req.body;

  // check if the email is already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(new ApiError("Email already exists", 404));
  }

  // hashing the password

  let encryptedPassword = bcrypt.hashSync(password, 10);
  // save the user
  const user = await User.create({
    email,
    password: encryptedPassword,
    firstName,
    mobileNumber,
    lastName,
    role,
    recoveryEmail,
    DOB,
  });

  // send response

  res.status(201).json({
    status: "success",
    message: "Signup successfully done",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {  status ,token, user}
 * @description login user
 */
export const sigIn = errorHandler(async (req, res, next) => {
  // destructure req object
  const { email, password, recoveryEmail, mobileNumber } = req.body;
  // find email
  const user = await User.findOne({
    $or: [{ email }, { recoveryEmail }, { mobileNumber }],
  });
  // check email exist or password is the same db password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new ApiError("incorrect email or password", 401));
  }
  // create login token
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
  user.status = "online";
  await user.save();
  //send res
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {  status ,token, user}
 * @description forgot password generate otp and send email
 */
export const forgotPassword = errorHandler(async (req, res, next) => {
  // destructure req object
  const { email } = req.body;

  // find user if exist
  const user = await User.findOne({ email: req.body.email });
  // if not user exist
  if (!user) {
    return next(new ApiError(`No User for this email${email}`, 404));
  }
  // generate otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // hashing otp
  const encryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  // add expiration time(10 min)
  user.otpExpires = Date.now() + 10 * 60 * 100;

  // flag to verfiy
  user.otpVerified = false;
  user.encryptedOtp = encryptedOtp;
  await user.save();

  const confirmLink = `${req.protocol}://${req.headers.host}/auth/verfiy-otp`;

  const textMessage = `Hi ${user.email} , \n we received  a request to rest the password for your account on Job-Search App
    \n enter this otp ${otp} to complete the process on the link   ${confirmLink}`;
  // hadle email sent or not

  try {
    await sendMail({
      to: user.email,
      subject: "Your otp valid for 10 min",
      textMessage,
    });
  } catch (err) {
    user.encryptedOtp = undefined;
    user.otpExpires = undefined;
    user.otpVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error while sending email", 500));
  }

  // sending response
  res.status(200).json({
    status: "success",
    message: "otp sent to email successfully",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {  status ,token, user}
 * @description take otp to verify it
 */
export const verfiyOtp = errorHandler(async (req, res, next) => {
  // destructure otp
  const { otp } = req.body;

  // hash otp
  const encryptedBodyOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
  // find user by hashed otp
  const user = await User.findOne({
    encryptedOtp: encryptedBodyOtp,
    otpExpires: { $gt: Date.now() },
  });

  // check if user not exists

  if (!user) {
    return next(new ApiError("Invalid otp or expired"));
  }
  // verfied
  user.otpVerified = true;
  await user.save();

  // send response
  res.status(200).json({
    status: "Success",
    message: "Otp successfully verified ",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response {  status ,token, user}
 * @description take new Password
 */

export const resetPassword = errorHandler(async (req, res, next) => {
  // destructure request
  const { email, password } = req.body;

  // find the user
  const user = await User.findOne({ email });

  // check if user exists
  if (!user) {
    return next(new ApiError(`No User for this email${email}`, 404));
  }

  // check if  otp not verfied yet
  if (!user?.otpVerified) {
    return next(new ApiError("otp is not verified", 404));
  }
  // hash new password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  //save in db
  user.password = hashedPassword;

  user.encryptedOtp = undefined;
  user.otpExpires = undefined;
  user.otpVerified = undefined;
  await user.save();

  // generate new token
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });

  //send response
  res.status(200).json({
    status: "success",

    token,
  });
});
