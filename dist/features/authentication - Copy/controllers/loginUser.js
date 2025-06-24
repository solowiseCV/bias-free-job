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
exports.LoginController = void 0;
const jwt_1 = require("../../../utils/jwt");
const registerUser_1 = require("../services/registerUser");
const hash_1 = require("../../../utils/hash");
class LoginController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield registerUser_1.AuthService.getUserByEmail(email);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User Email or Password incorrect!",
                    });
                    return;
                }
                if (!user.password ||
                    (user.password && !(yield (0, hash_1.comparePassword)(password, user.password)))) {
                    res.status(404).json({
                        success: false,
                        message: "User Email or Password incorrect!",
                    });
                    return;
                }
                const token = jwt_1.tokenService.generateToken(user.id);
                res.status(200).json({
                    success: true,
                    message: "Login successful!",
                    data: user,
                    token,
                });
                return;
            }
            catch (err) {
                res.status(500).json({
                    success: false,
                    message: err.message,
                });
                return;
            }
        });
    }
}
exports.LoginController = LoginController;
