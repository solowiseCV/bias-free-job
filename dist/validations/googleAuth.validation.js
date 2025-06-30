"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyTeamSchema = exports.googleAuthSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.googleAuthSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    picture: joi_1.default.string().optional(),
    given_name: joi_1.default.string().required(),
    family_name: joi_1.default.string().required(),
    sub: joi_1.default.string().required(),
    userType: joi_1.default.string().valid("job_seeker", "recruiter").required().messages({
        "any.only": "userType must be either 'job_seeker', or 'recruiter' .",
    }),
});
exports.updateCompanyTeamSchema = exports.googleAuthSchema.fork(Object.keys(exports.googleAuthSchema.describe().keys), (schema) => schema.optional());
