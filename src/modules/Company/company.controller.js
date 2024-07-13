import slugify from "slugify";

import Application from "../../../db/models/application.model.js";
import Company from "../../../db/models/company.model.js";
import Job from "../../../db/models/job.model.js";
import { errorHandler } from "../../middlewares/errorHandling.middleware.js";
import ApiError from "../../utils/errorClass.utils.js";

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description create new job
 */
export const createCompany = errorHandler(async (req, res, next) => {
  //  destructure request body
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  console.log(req.body);
  const company = await Company.create({
    slug: slugify(companyName),
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHr: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: company,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description update Company
 */

export const updateCompany = errorHandler(async (req, res, next) => {
  // destructure  id
  const { id } = req.params;
  // destructure request object
  const { description, industry } = req.body;
  const company = await Company.findByIdAndUpdate(
    id,
    { description, industry },
    { new: true }
  );
  // check if not exists
  if (!company) {
    return next(new ApiError(`No company for this id ${id}`, 404));
  }

  // return response;

  res.status(200).json({
    status: "success",
    data: company,
  });
});
/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description delete Company and its jobs
 */
export const deleteCompany = errorHandler(async (req, res, next) => {
  // destructure id
  const { id } = req.params;
  // check if exists
  const exist = await Company.findById(id);
  // if allowed or not
  if (exist.companyHr.toString() != req.user._id.toString()) {
    return next(new ApiError(" You are not allowed ", 403));
  }

  // find the company
  const company = await Company.findByIdAndDelete(id);
  // check if exists
  if (!company) {
    return next(new ApiError(`No company for this id ${id}`, 404));
  }
  // find the jobs for this company
  const jobs = await Job.find({ companyId: id });
  // loop over every job and delete its application
  for (const key of jobs) {
    const app = await Application.deleteMany({ jobId: key._id });
  }

  // retun response

  res.status(200).json({
    status: "success",
    message: "Company is deleted successfully",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description get company
 */

export const getCompany = errorHandler(async (req, res, next) => {
  // destructure id
  const { id } = req.params;
  // find company

  let company = await Company.findById(id);
  //finsd jobs
  const jobs = await Job.find({ companyId: id });
  // return response
  res.status(200).json({
    status: "success",
    data: { company, jobs },
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description search Company  by name
 */
export const srearchCompany = errorHandler(async (req, res, next) => {
  // destructure name
  const { name } = req.query;

  const company = await Company.find({ companyName: new RegExp(name, "i") });

  // check if exists
  if (!company) {
    return next(new ApiError("no company found", 401));
  }

  // return response
  res.status(200).json({
    status: "success",
    data: company,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description get for company its jobs
 */

export const companyJobApplication = errorHandler(async (req, res, next) => {
  // destruct params
  const { jobId, companyId } = req.params;
  const company = await Company.findById(companyId);

  if (company.companyHr.toString() != req.user._id.toString()) {
    return next(new ApiError("You are not allowed to access this route"), 403);
  }
  const applications = await Application.find({ jobId }).populate({
    path: "userId",
    select: "- _id",
  });

  // return response
  res.status(200).json({
    message: "success",
    data: applications,
  });
});
