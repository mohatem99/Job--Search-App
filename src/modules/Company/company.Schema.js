import Joi from "joi";

export const createComapnySchema = {
  body: Joi.object({
    companyEmail: Joi.string().email().required(),
    description: Joi.string().optional(),

    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    companyName: Joi.string().min(3).max(30).required(),
    numberOfEmployees: Joi.object({
      min: Joi.number().integer().min(1).required().messages({
        "number.base": "Min must be a number",
        "number.integer": "Min must be an integer",
        "number.min": "Min must be at least 1",
        "any.required": "Min is required",
      }),
      max: Joi.number().integer().min(Joi.ref("min")).required().messages({
        "number.base": "Max must be a number",
        "number.integer": "Max must be an integer",
        "number.min": "Max must be greater than or equal to min",
        "any.required": "Max is required",
      }),
    })
      .optional()
      .messages({
        "any.required": "numberOfEmployees is required",
      }),
  }),
};
export const checkParamsObjectId = {
  params: Joi.object({
    id: Joi.string().hex().length(24),
  }),
};
