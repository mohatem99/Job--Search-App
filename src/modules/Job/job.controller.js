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
export const createJob = errorHandler(async (req, res, next) => {
  // destructure request object
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  console.log("hiiiiiiii");
  console.log(req.user);
  // get company
  const company = await Company.findOne({ companyHr: req.user._id });
  console.log(company);
  // save the job
  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user._id,
    companyId: company._id,
  });

  // return res
  res.status(201).json({
    status: "success",
    data: job,
  });
});
/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description update  job
 */
export const updateJob = errorHandler(async (req, res, next) => {
  // get id from params
  const { id } = req.params;
  //destructure request object
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  // find the job if not return null
  const job = await Job.findByIdAndUpdate(
    id,
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );
  // check if job doest exist
  if (!job) {
    return next(new ApiError(`No job for this id ${id}`, 404));
  }
  // return res
  res.status(200).json({
    status: "success",
    data: job,
  });
});
/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description detelte the job and its applications
 */
export const deleteJob = errorHandler(async (req, res, next) => {
  // get id from params
  const { id } = req.params;

  //find the job
  const job = await Job.findByIdAndDelete(id);

  // check id exists
  if (!job) {
    return next(new ApiError(`No job for this id ${id}`, 404));
  } //then delete all job applications
  await Application.deleteMany({ jobId: id });

  //return response
  res.status(200).json({
    status: "success",
    message: "Job is deleted successfully",
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description return all the jobs with company details
 */
export const allJobs = errorHandler(async (req, res, next) => {
  // find all jobs
  const jobs = await Job.find().populate({
    path: "companyId",
    select: "companyName description address companyEmail",
  });
  //return response
  res.status(200).json({
    status: "success",
    data: jobs,
  });
});
/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description return all the jobs for specific company by name
 */

export const getJobsForCompany = errorHandler(async (req, res, next) => {
  // destructure query
  const { name } = req.query;

  // find company
  let company = await Company.findOne({ companyName: name });

  // check if company exists
  if (!company) {
    return next(new ApiError(`company  not found ${name}`, 404));
  }

  const jobs = await Job.find({ companyId: company._id });

  // return response

  res.status(200).json({
    status: "success",
    data: jobs,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description return all the jobs the match filter
 */
export const getJobsFilter = errorHandler(async (req, res, next) => {
  // destructure the filter
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  // handle filter object
  let filters = {};
  if (workingTime) filters.workingTime = workingTime;
  if (jobLocation) filters.jobLocation = jobLocation;
  if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
  if (jobTitle) filters.jobTitle = new RegExp(jobTitle, "i");
  if (technicalSkills)
    filters.technicalSkills = { $in: technicalSkills.split(",") };

  const jobs = await Job.find(filters);

  // return response
  res.status(200).json({
    status: "success",
    data: jobs,
  });
});

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description apply to job
 */

export const applyJob = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { userTechSkills, userSoftSkills } = req.body;

  const application = await Application.create({
    jobId: id,
    userId: req.user.id,
    userTechSkills,
    userSoftSkills,
    userResume: req.file.filename,
  });

  res.status(201).json({
    message: "success",
    data: application,
  });
});
