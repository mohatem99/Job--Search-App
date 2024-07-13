import express from "express";
import {
  allJobs,
  applyJob,
  createJob,
  deleteJob,
  updateJob,
  getJobsFilter,
  getJobsForCompany,
} from "./job.controller.js";

import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import auth from "../../middlewares/authentication.middlware.js";
import authorize from "../../middlewares/authorization.middleware.js";
import fileUpload from "../../utils/fileUpload.js";
import { createJobSchema, checkParamsObjectId } from "./jobSchema.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    authorize("Company_HR"),
    validationMiddleware(createJobSchema),
    createJob
  )
  .get(auth(), authorize("Company_HR", "User"), allJobs);
router.get(
  "/company-name",
  auth(),
  authorize("Company_HR", "User"),
  getJobsForCompany
);
router
  .route("/:id")
  .put(
    validationMiddleware(checkParamsObjectId),
    auth(),
    authorize("Company_HR"),
    updateJob
  )
  .delete(
    validationMiddleware(checkParamsObjectId),
    auth(),
    authorize("Company_HR"),
    deleteJob
  );

router.post(
  "/:id/apply",
  validationMiddleware(checkParamsObjectId),
  auth(),
  authorize("Company_HR", "User"),
  fileUpload("resume"),
  applyJob
);

router.get("/filter", auth(), authorize("Company_HR", "User"), getJobsFilter);
export default router;
