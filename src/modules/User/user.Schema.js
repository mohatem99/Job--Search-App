import Joi from "joi";
import JoiDate from "@joi/date";

// Extend Joi with the date extension
const ExtendedJoi = Joi.extend(JoiDate);

export const updateUserSchema = {
  body: Joi.object({
    email: Joi.string().email().optional(),
    mobileNumber: Joi.string().length(11).optional(),

    recoveryEmail: Joi.string().email().optional(),
    firstName: Joi.string().min(3).max(30).optional(),
    lastName: Joi.string().min(3).max(30).optional(),
    DOB: ExtendedJoi.date().format("YYYY-MM-DD").utc().optional(),
  }),
};

export const getUSerSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/
      )
      .required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
};
