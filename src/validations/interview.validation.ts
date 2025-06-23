import Joi from "joi";

export const interviewSchema = Joi.object({
  jobPostingId: Joi.string().required(),
  candidateEmail: Joi.string().email().required(),
  scheduledTime: Joi.date().required(),
  status: Joi.string().valid("scheduled", "completed", "cancelled").optional(),
  notes: Joi.string().optional().allow(null),
});

export const updateInterviewSchema = interviewSchema.fork(Object.keys(interviewSchema.describe().keys), (schema) =>
  schema.optional()
);