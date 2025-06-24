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
const company_1 = require("../services/company");
const companyDetails_validation_1 = require("../../../validations/companyDetails.validation");
const companyTeamService = new company_1.CompanyTeamService();
class CompanyTeamController {
    createCompanyTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = companyDetails_validation_1.companyTeamSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const result = yield companyTeamService.createCompanyTeam(req.user.userId, req.body);
            res.status(201).json(Object.assign({ message: 'Company profile and team created successfully' }, result));
        });
    }
}
exports.CompanyTeamController = CompanyTeamController;
