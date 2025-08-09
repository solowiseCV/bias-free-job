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
exports.CompanyTeamController = void 0;
const companyProfile_1 = require("../services/companyProfile");
const companyDetails_validation_1 = require("../../../../validations/companyDetails.validation");
const response_util_1 = __importDefault(require("../../../../utils/helpers/response.util"));
const companyTeamService = new companyProfile_1.CompanyTeamService();
class CompanyTeamController {
    createCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = companyDetails_validation_1.companyTeamSchema.validate(req.body);
            if (error) {
                new response_util_1.default(400, false, "Validation error", res, error.details[0].message);
                return;
            }
            try {
                const result = yield companyTeamService.createCompanyTeam(req.user.userId, req.body);
                new response_util_1.default(201, true, "Company profile and team created successfully", res, result);
                return;
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    if (error.message.includes('already exists')) {
                        new response_util_1.default(409, false, "Company profile already exists", res);
                        return;
                    }
                    new response_util_1.default(500, false, "An unexpected server error occurred", res);
                    return;
                }
                res.status(500).json({ error: 'An unexpected server error occurred.' });
                return;
            }
        });
    }
    getCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield companyTeamService.getCompanyTeam(req.user.userId);
                new response_util_1.default(200, true, "Company team details retrieved successfully", res, result);
                return;
            }
            catch (error) {
                console.error('Error in getCompanyTeam:', error);
                if (error instanceof Error) {
                    new response_util_1.default(404, false, "Company profile not found", res, error.message);
                    return;
                }
                new response_util_1.default(500, false, "An unexpected server error occurred", res);
                return;
            }
        });
    }
    getAllCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield companyTeamService.getAllCompanies();
                new response_util_1.default(200, true, "All companies retrieved successfully", res, companies);
                return;
            }
            catch (error) {
                console.error('Error in getAllCompanies:', error);
                if (error instanceof Error) {
                    new response_util_1.default(500, false, "Failed to retrieve companies", res, error.message);
                    return;
                }
                new response_util_1.default(500, false, "An unexpected server error occurred", res);
                return;
                return;
            }
        });
    }
    updateCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = companyDetails_validation_1.updateCompanyTeamSchema.validate(req.body);
            if (error) {
                new response_util_1.default(400, false, "Validation error", res, error.details[0].message);
                return;
            }
            try {
                const result = yield companyTeamService.updateCompanyTeam(req.user.userId, req.body);
                new response_util_1.default(200, true, "Company profile and team updated successfully", res, result);
                return;
            }
            catch (error) {
                console.error('Error in updateCompanyTeam:', error);
                if (error instanceof Error) {
                    new response_util_1.default(404, false, "Company profile not found", res, error.message);
                    return;
                }
                new response_util_1.default(500, false, "An unexpected server error occurred", res);
                return;
            }
        });
    }
    deleteCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield companyTeamService.deleteCompanyTeam(req.user.userId);
                new response_util_1.default(200, true, "Company profile and team deleted successfully", res, result);
                return;
            }
            catch (error) {
                console.error('Error in deleteCompanyTeam:', error);
                if (error instanceof Error) {
                    new response_util_1.default(404, false, "Company profile not found", res, error.message);
                    return;
                }
                new response_util_1.default(500, false, "An unexpected server error occurred", res);
                return;
            }
        });
    }
}
exports.CompanyTeamController = CompanyTeamController;
