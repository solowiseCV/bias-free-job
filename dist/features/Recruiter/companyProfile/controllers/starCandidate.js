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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateStarringController = void 0;
const staredCandidate_1 = __importDefault(require("../services/staredCandidate"));
const response_util_1 = __importDefault(require("../../../../utils/helpers/response.util"));
const candidateStarringService = new staredCandidate_1.default();
class CandidateStarringController {
    starCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyProfileId, jobSeekerId } = req.body;
                const starredCandidate = yield candidateStarringService.starCandidate(companyProfileId, jobSeekerId);
                new response_util_1.default(201, true, "Candidate starred successfully", res, starredCandidate);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res);
            }
        });
    }
    unstarCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyProfileId, jobSeekerId } = req.body;
                const starredCandidate = yield candidateStarringService.unstarCandidate(companyProfileId, jobSeekerId);
                new response_util_1.default(201, true, "Candidate unstarred successfully", res, starredCandidate);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res);
            }
        });
    }
    // Get all starred candidates
    getStarredCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyId = req.params.companyId;
                const starredCandidates = yield candidateStarringService.getStarredCandidates(companyId);
                new response_util_1.default(200, true, "Starred candidates fetched successfully", res, starredCandidates);
            }
            catch (err) {
                const status = err.statusCode || 500;
                new response_util_1.default(status, false, err.message, res);
            }
        });
    }
}
exports.CandidateStarringController = CandidateStarringController;
