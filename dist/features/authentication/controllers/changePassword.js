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
exports.ChangePasswordController = void 0;
// import { AuthService } from "../services/authService";
const hash_1 = require("../../../utils/hash");
const changePassword_1 = require("../services/changePassword");
class ChangePasswordController {
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { currentPassword, newPassword } = req.body;
                const user = yield changePassword_1.ChangePasswordService.getUserById(userId);
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found" });
                    return;
                }
                const isMatch = yield (0, hash_1.comparePassword)(currentPassword, user.password);
                if (!isMatch) {
                    res
                        .status(400)
                        .json({ success: false, message: "Incorrect password incorrect" });
                    return;
                }
                yield changePassword_1.ChangePasswordService.updatePassword(userId, newPassword);
                res
                    .status(200)
                    .json({ success: true, message: "Password changed successfully" });
                return;
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
        });
    }
}
exports.ChangePasswordController = ChangePasswordController;
