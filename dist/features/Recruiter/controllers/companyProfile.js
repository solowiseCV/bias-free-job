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
exports.CompanyTeamController = void 0;
const companyProfile_1 = require("../services/companyProfile");
const companyDetails_validation_1 = require("../../../validations/companyDetails.validation");
const companyTeamService = new companyProfile_1.CompanyTeamService();
class CompanyTeamController {
    createCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = companyDetails_validation_1.companyTeamSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            try {
                const result = yield companyTeamService.createCompanyTeam(req.user.userId, req.body);
                res.status(201).json(Object.assign({ message: 'Company profile and team created successfully' }, result));
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes('already exists')) {
                        res.status(409).json({ error: error.message });
                        return;
                    }
                    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
                    return;
                }
                res.status(500).json({ error: 'An unexpected server error occurred.' });
                return;
            }
        });
    }
    // async getCompanyTeam(req: Request, res: Response) {
    //   try {
    //     const result = await companyTeamService.getCompanyTeam(req.user.userId);
    //     return res.status(200).json(result);
    //   } catch (error) {
    //     console.error('Error in getCompanyTeam:', error);
    //     if (error instanceof Error) {
    //       return res.status(404).json({ error: error.message });
    //     }
    //     return res.status(500).json({ error: 'An unexpected server error occurred.' });
    //   }
    // }
    updateCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = companyDetails_validation_1.updateCompanyTeamSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            try {
                const result = yield companyTeamService.updateCompanyTeam(req.user.userId, req.body);
                return res.status(200).json(Object.assign({ message: 'Company profile and team updated successfully' }, result));
            }
            catch (error) {
                console.error('Error in updateCompanyTeam:', error);
                if (error instanceof Error) {
                    return res.status(500).json({ error: error.message });
                }
                return res.status(500).json({ error: 'An unexpected server error occurred.' });
            }
        });
    }
    deleteCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield companyTeamService.deleteCompanyTeam(req.user.userId);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in deleteCompanyTeam:', error);
                if (error instanceof Error) {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'An unexpected server error occurred.' });
            }
        });
    }
}
exports.CompanyTeamController = CompanyTeamController;
