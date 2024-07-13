import express from "express";
import {
  signUp,
  sigIn,
  forgotPassword,
  verfiyOtp,
  resetPassword,
} from "./auth.controller.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  sigInSchema,
  signUpSchema,
  forgotSchema,
  verfiyOtpSchema,
  resetPasswordSchema,
} from "./auth.Schema.js";
import { errorHandler } from "../../middlewares/errorHandling.middleware.js";

const router = express.Router();

router.post("/signup", validationMiddleware(signUpSchema), signUp);
router.post("/signin", validationMiddleware(sigInSchema), sigIn);
router.post(
  "/forgot-password",
  validationMiddleware(forgotSchema),
  forgotPassword
);

router.post("/verfiy-otp", validationMiddleware(verfiyOtpSchema), verfiyOtp);
router.put(
  "/resetPassword",
  validationMiddleware(resetPasswordSchema),
  resetPassword
);
export default router;
