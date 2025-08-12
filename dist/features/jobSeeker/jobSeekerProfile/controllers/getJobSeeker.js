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
exports.GetJobSeekerController = void 0;
const getJobSeeker_1 = require("../services/getJobSeeker");
class GetJobSeekerController {
    static getSeekerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield getJobSeeker_1.GetJobSeekerService.getJobSeekerById(id);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    static getSeekerByUSerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const result = yield getJobSeeker_1.GetJobSeekerService.getJobSeekerByUserId(userId);
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    static getAllJobSeeker(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield getJobSeeker_1.GetJobSeekerService.getAllJobSeeker();
                res.status(200).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.GetJobSeekerController = GetJobSeekerController;
