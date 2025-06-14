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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const jwt_1 = require("../../../utils/jwt");
const google_auth_library_1 = require("google-auth-library");
const googleAuth_1 = __importDefault(require("../services/googleAuth"));
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(CLIENT_ID);
class GoogleAuthController {
    static googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idToken, userType } = req.body;
                if (!idToken || !userType) {
                    res.status(400).json({ error: "Incomplete details" });
                    return;
                }
                const ticket = yield client.verifyIdToken({
                    idToken: idToken,
                    audience: CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    res.status(400).json({ error: "Invalid token" });
                    return;
                }
                const email = payload["email"] || null;
                const authId = payload["sub"] || null;
                if (!email || !authId) {
                    res.status(400).json({ error: "User data missing from token" });
                    return;
                }
                const existingUser = yield googleAuth_1.default.getExistingUser(email, authId);
                const userData = {
                    authId,
                    email,
                    avatar: payload["picture"] || "",
                    firstname: payload["given_name"] || "",
                    lastname: payload["family_name"] || "",
                    userType,
                };
                let user;
                if (!existingUser) {
                    user = yield googleAuth_1.default.registerUser(userData);
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
