import express from "express";
import {
  deletUser,
  getProfile,
  updateUser,
  getUser,
  recoverEmailUsers,
  updatePassword,
} from "./user.controller.js";
import auth from "../../middlewares/authentication.middlware.js";

import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  getUSerSchema,
  updateUserSchema,
  updatePasswordSchema,
} from "./user.Schema.js";

const router = express.Router();
router
  .route("/")
  .put(auth(), updateUser)
  .get(auth(), getProfile)
  .delete(auth(), deletUser);
router.get("/:id", auth(), validationMiddleware(getUSerSchema), getUser);
router.put(
  "/changePassword",
  auth(),
  validationMiddleware(updatePasswordSchema),
  updatePassword
);

router.get("/recover-email/:email", auth(), recoverEmailUsers);

export default router;
