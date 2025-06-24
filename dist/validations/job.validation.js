"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobPostingSchema = exports.jobPostingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.jobPostingSchema = joi_1.default.object({
    jobTitle: joi_1.default.string().required(),
    department: joi_1.default.string().optional(),
    companyLocation: joi_1.default.string().required(),
    workLocation: joi_1.default.string().valid('office', 'hybrid', 'remote').required(),
    industry: joi_1.default.string().required(),
    companyFunction: joi_1.default.string().optional(),
    employmentType: joi_1.default.string().valid('full-time', 'part-time', 'contract', 'internship').required(),
    experienceLevel: joi_1.default.string().valid('entry-level', 'mid-level', 'senior-level').optional(),
    education: joi_1.default.string().optional(),
    monthlySalaryMin: joi_1.default.number().min(0).optional(),
    monthlySalaryMax: joi_1.default.number().min(joi_1.default.ref('monthlySalaryMin')).optional(),
    jobDescription: joi_1.default.string().required(),
    requirements: joi_1.default.string().optional(),
    assessment: joi_1.default.alternatives().try(joi_1.default.string().uri().optional(), // For URL
    joi_1.default.string().optional() // For file path (validated in controller)
    ),
});
exports.updateJobPostingSchema = joi_1.default.object({
    jobTitle: joi_1.default.string().optional(),
    department: joi_1.default.string().optional(),
    companyLocation: joi_1.default.string().optional(),
    workLocation: joi_1.default.string().valid('office', 'hybrid', 'remote').optional(),
    industry: joi_1.default.string().optional(),
    companyFunction: joi_1.default.string().optional(),
    employmentType: joi_1.default.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
    experienceLevel: joi_1.default.string().valid('entry-level', 'mid-level', 'senior-level').optional(),
    education: joi_1.default.string().optional(),
    monthlySalaryMin: joi_1.default.number().min(0).optional(),
    monthlySalaryMax: joi_1.default.number().min(joi_1.default.ref('monthlySalaryMin')).optional(),
    jobDescription: joi_1.default.string().optional(),
    requirements: joi_1.default.string().optional(),
    assessment: joi_1.default.alternatives().try(joi_1.default.string().uri().optional(), joi_1.default.string().optional()),
}).min(0);
