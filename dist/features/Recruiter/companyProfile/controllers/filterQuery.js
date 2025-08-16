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
exports.CompanyFilterController = void 0;
const companyProfile_1 = require("../services/companyProfile");
const filterService_1 = require("../services/filterService");
const companyTeamService = new companyProfile_1.CompanyTeamService();
class CompanyFilterController {
    getFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield filterService_1.FilterService.getFilter(id);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    saveFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.body;
                const userId = req.user.userId;
                const result = yield filterService_1.FilterService.saveFilter(filters, userId);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    updateFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const filters = Object.assign(Object.assign({}, req.query), { page: Number(req.query.page) || 1, pageSize: Number(req.query.pageSize) || 20 });
                const result = yield filterService_1.FilterService.updateFilter(id, filters);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.CompanyFilterController = CompanyFilterController;
