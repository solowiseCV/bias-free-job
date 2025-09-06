"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyTeamSchema = exports.companyTeamSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.companyTeamSchema = joi_1.default.object({
    companyName: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    industry: joi_1.default.string().required(),
    website: joi_1.default.string().uri().optional(),
    location: joi_1.default.string().optional(),
    numberOfEmployees: joi_1.default.string().optional(),
    teamMembers: joi_1.default.array()
        .items(joi_1.default.object({
        email: joi_1.default.string().email().required(),
        role: joi_1.default.string().required(),
    }))
        .min(1)
        .optional(),
});
exports.updateCompanyTeamSchema = exports.companyTeamSchema.fork(Object.keys(exports.companyTeamSchema.describe().keys), (schema) => schema.optional());
