"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSeekerController = void 0;
const fetchJobs_1 = require("../services/fetchJobs");
const jobSeekerService = new fetchJobs_1.JobSeekerService();
class JobSeekerController {
    getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search, industry, location, status, bestMatches } = req.query;
            try {
                const jobs = yield jobSeekerService.getAllJobs(parseInt(page), parseInt(limit), search, industry, location, status, bestMatches);
                res.status(200).json(jobs);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.JobSeekerController = JobSeekerController;
