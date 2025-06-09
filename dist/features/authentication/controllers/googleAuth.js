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
exports.GoogleAuthController = void 0;
const jwt_1 = require("../../../utils/jwt");
class GoogleAuthController {
    static googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const firstname = req.body.firstname;
                const lastname = req.body.lastname;
                const authId = req.body.authId;
                const picture = req.body.picture;
                const existingUser = yield GoogleAuthService.getExistingUser(email, authId);
                let user;
                const userData = {
                    email,
                    lastname,
                    firstname,
                    authId,
                    avatar: picture,
                    username: "",
                    fullname: "",
                    password: null,
                };
                if (!existingUser) {
                    user = yield GoogleAuthService.registerUser(userData);
                }
                else {
                    user = existingUser;
                }
                const token = jwt_1.tokenService.generateToken(user.id);
                res.status(200).json({
                    success: true,
                    message: "Registration successful!",
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
exports.GoogleAuthController = GoogleAuthController;
