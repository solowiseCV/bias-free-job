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
exports.QueryJobSeekerController = void 0;
const queryJobSeeker_1 = require("../services/queryJobSeeker");
class QueryJobSeekerController {
    static querySeeker(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield queryJobSeeker_1.SearchJobSeekerService.searchJobSeekers(req.query);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    static searchTalent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = Object.assign(Object.assign({}, req.query), { page: Number(req.query.page) || 1, pageSize: Number(req.query.pageSize) || 20 });
                const result = yield queryJobSeeker_1.SearchJobSeekerService.searchTalent(filters);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.QueryJobSeekerController = QueryJobSeekerController;
