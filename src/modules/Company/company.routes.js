import express from "express";
import {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  srearchCompany,
  companyJobApplication,
} from "./company.controller.js";
import auth from "../../middlewares/authentication.middlware.js";
import authorize from "../../middlewares/authorization.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { createComapnySchema, checkParamsObjectId } from "./company.Schema.js";
const router = express.Router();

router.post(
  "/",
  auth(),
  authorize("Company_HR"),
  validationMiddleware(createComapnySchema),
  createCompany
);

router.get("/search", auth(), authorize("Company_HR", "User"), srearchCompany);

router
  .route("/:id")
  .put(
    auth(),
    authorize("Company_HR"),
    validationMiddleware(checkParamsObjectId),
    updateCompany
  )
  .get(
    auth(),
    authorize("Company_HR"),
    validationMiddleware(checkParamsObjectId),
    getCompany
  )
  .delete(
    auth(),
    authorize("Company_HR"),
    validationMiddleware(checkParamsObjectId),
    deleteCompany
  );

router.get(
  "/:companyId/jobs/:jobId",
  auth(),
  authorize("Company_HR"),
  companyJobApplication
);
export default router;
