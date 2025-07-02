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
exports.AuthController = void 0;
const jwt_1 = require("../../../utils/jwt");
const registerUser_1 = require("../services/registerUser");
const hash_1 = require("../../../utils/hash");
const signup_validation_1 = require("../../../validations/signup.validation");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = signup_validation_1.signinSchema.validate(req.body);
                if (error) {
                    res.status(400).json({ error: error.details[0].message });
                    return;
                }
                const { email, firstname, lastname, password, userType } = req.body;
                const existingUser = yield registerUser_1.AuthService.getUserByEmail(email);
                if (existingUser) {
                    res
                        .status(500)
                        .json({ success: false, message: "Email already in use!" });
                    return;
                }
                const hashedPassword = yield (0, hash_1.hashPassword)(password);
                const userData = {
                    email,
                    lastname,
                    firstname,
                    password: hashedPassword,
                    userType,
                };
                const user = yield registerUser_1.AuthService.registerUser(userData);
                const data = {
                    email,
                    lastname,
                    firstname,
                    userType,
                };
                const token = jwt_1.tokenService.generateToken(user.id);
                res.cookie("userType", user.userType, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    message: "Registration successful!",
                    data,
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
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield registerUser_1.AuthService.getUserUsers();
                res.status(200).json(users);
            }
            catch (err) {
                res.status(500).json({
                    message: err.message,
                });
                return;
            }
        });
    }
}
exports.AuthController = AuthController;
