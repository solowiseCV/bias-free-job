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
exports.DeleteJobSeekerController = void 0;
const deleteJobSeeker_1 = require("../services/deleteJobSeeker");
class DeleteJobSeekerController {
    static deleteSeeker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileId = req.params.id;
                yield deleteJobSeeker_1.DeleteJobSeekerService.deleteSeeker(profileId);
                res.status(200).json({ message: "Profile deleted successfully" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.DeleteJobSeekerController = DeleteJobSeekerController;
