import Joi from 'joi';

export const jobPostingSchema = Joi.object({
  jobTitle: Joi.string().required(),
  department: Joi.string().optional(),
  companyLocation: Joi.string().required(),
  workLocation: Joi.string().valid('office', 'hybrid', 'remote').required(),
  
  industry: Joi.string().required(),
  companyFunction: Joi.string().optional(),
  employmentType: Joi.string().valid('full_time', 'part_time', 'contract', 'internship').required(),
  experienceLevel: Joi.string().valid('entry_level', 'mid_level', 'senior+level').optional(),
  education: Joi.string().optional(),
  monthlySalaryMin: Joi.number().min(0).optional(),
  monthlySalaryMax: Joi.number().min(Joi.ref('monthlySalaryMin')).optional(),
  currency : Joi.string().optional(),
  deadline : Joi.string().optional(),
  jobDescription: Joi.string().required(),
  requirements: Joi.string().optional(),
   assessment: Joi.alternatives().try(
    Joi.string().uri().optional(), 
    Joi.string().optional() 
  ),
  assessmentUrlInput: Joi.string().optional() 
});

export const updateJobPostingSchema = Joi.object({
  jobTitle: Joi.string().optional(),
  department: Joi.string().optional(),
  companyLocation: Joi.string().optional(),
  workLocation: Joi.string().valid('office', 'hybrid', 'remote').optional(),
  industry: Joi.string().optional(),
  companyFunction: Joi.string().optional(),
  employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
  experienceLevel: Joi.string().valid('entry-level', 'mid-level', 'senior-level').optional(),
  education: Joi.string().optional(),
  monthlySalaryMin: Joi.number().min(0).optional(),
  monthlySalaryMax: Joi.number().min(Joi.ref('monthlySalaryMin')).optional(),
  jobDescription: Joi.string().optional(),
  requirements: Joi.string().optional(),
   assessment: Joi.alternatives().try(
    Joi.string().uri().optional(), 
    Joi.string().optional() 
  ),
  assessmentUrlInput: Joi.string().optional() 

}).min(0); 