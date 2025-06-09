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
exports.PasswordResetController = void 0;
const jwt_1 = require("../../../utils/jwt");
const resetUserPassword_1 = require("../services/resetUserPassword");
class PasswordResetController {
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            try {
                const payload = jwt_1.tokenService.verifyToken(token);
                yield resetUserPassword_1.PasswordResetService.updatePassword(payload.userId, newPassword);
                res
                    .status(200)
                    .json({ success: true, message: "Password reset successful" });
                return;
            }
            catch (err) {
                res
                    .status(400)
                    .json({ success: false, message: "Invalid or expired token" });
                return;
            }
        });
    }
}
exports.PasswordResetController = PasswordResetController;
