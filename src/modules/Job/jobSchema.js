import Joi from "joi";

export const createJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().min(3).max(30).required(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: Joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: Joi.string().min(10).max(300).required(),
    technicalSkills: Joi.array().items(Joi.string().required()).required(),
    softSkills: Joi.array().items(Joi.string().required()).required(),
  }),
};

export const checkParamsObjectId = {
  params: Joi.object({
    id: Joi.string().hex().length(24),
  }),
};
