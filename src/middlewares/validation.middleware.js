import ApiError from "../utils/errorClass.utils.js";
import { errorHandler } from "./errorHandling.middleware.js";

const reqKeys = ["body", "query", "params", "headers"];

/**
 * @param {object} schema - Joi schema object
 * @returns  {Function} - Middleware function
 * @description - Middleware function to validate the request data against the schema
 */

export const validationMiddleware = (schema) => (req, res, next) => {
  for (const key of reqKeys) {
    const validationResult = schema[key]?.validate(req[key], {
      abortEarly: false,
    });

    if (!validationResult?.error) {
      console.log(validationResult?.error);
      return next();
    } else {
      let errMessages = validationResult?.error?.details.map(
        (err) => err.message
      );

      next(new ApiError(errMessages, 400));
    }
  }
};

// export const validationMiddleware = (schema) => {
//   return (req, res, next) => {
//     // Initialize validation errors array
//     const validationErrors = [];

//     for (const key of reqKeys) {
//       // Validate the request data against the schema of the same key
//       const validationResult = schema[key]?.validate(req[key], {
//         abortEarly: false,
//       });

//       // If there is an error, push the error details to the validationErrors array
//       if (validationResult?.error) {
//         console.log(validationErrors?.error);
//         validationErrors.push(validationResult?.error?.details);
//       }
//     }

//     // If there are validation errors, return the error response  with the validation errors
//     validationErrors.length
//       ? next(new ApiError(validationErrors, 400))
//       : next();
//   };
// };
