"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.applicationSchema = joi_1.default.object({
    applicantId: joi_1.default.string().required(),
    jobPostingId: joi_1.default.string().required(),
    status: joi_1.default.string()
        .valid("pending", "reviewed", "accepted", "rejected")
        .optional(),
    coverLetter: joi_1.default.string().max(5000).allow(null, ""),
});
