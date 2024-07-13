import Joi from "joi";
import JoiDate from "@joi/date";

// Extend Joi with the date extension
const ExtendedJoi = Joi.extend(JoiDate);

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().optional(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
        "any.required": "You need to provide a password",
        "string.min": "Password should have a minimum length of 3 characters",
      }),
    mobileNumber: Joi.string().length(11).required(),
    role: Joi.string().valid("User", "Company_HR"),
    status: Joi.string().valid("online", "offline"),
    DOB: ExtendedJoi.date().format("YYYY-MM-DD").utc().required(),
  }),
};

export const sigInSchema = {
  body: Joi.object({
    email: Joi.string().email().optional(),
    mobileNumber: Joi.string().length(11).optional(),
    password: Joi.string().required(),
    recoveryEmail: Joi.string().email().optional(),
  }),
};

export const forgotSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const verfiyOtpSchema = {
  body: Joi.object({
    otp: Joi.string().length(6).required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
        "any.required": "You need to provide a password",
        "string.min": "Password should have a minimum length of 3 characters",
      }),
  }),
};
