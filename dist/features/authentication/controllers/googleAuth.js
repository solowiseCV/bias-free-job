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
const googleAuth_1 = __importDefault(require("../services/googleAuth"));
const getJobSeeker_1 = require("../../jobSeeker/jobSeekerProfile/services/getJobSeeker");
const companyProfile_1 = require("../../Recruiter/companyProfile/services/companyProfile");
const companyTeamService = new companyProfile_1.CompanyTeamService();
class GoogleAuthController {
    static googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, userType } = req.body;
                let profile = null;
                const existingUserByEmail = yield googleAuth_1.default.getUserByEmail(email);
                let user;
                if (!existingUserByEmail) {
                    if (!userType) {
                        res.status(200).json({
                            success: false,
                            message: "User type is required",
                        });
                        return;
                    }
                    const { given_name, family_name, sub, picture } = req.body;
                    const userData = {
                        authId: sub,
                        email,
                        avatar: picture,
                        firstname: given_name,
                        lastname: family_name,
                        userType,
                    };
                    user = yield googleAuth_1.default.registerUser(userData);
                }
                else {
                    user = existingUserByEmail;
                    if (existingUserByEmail.userType === "job_seeker") {
                        profile = yield getJobSeeker_1.GetJobSeekerService.getJobSeekerByUserId(existingUserByEmail.id);
                    }
                    else {
                        profile = yield companyTeamService.getCompanyTeam(existingUserByEmail.id);
                    }
                }
                const { id, lastname, firstname } = user;
                const token = jwt_1.tokenService.generateToken(user.id, user.userType);
                const data = { id, email, lastname, firstname, userType: user.userType };
                res.cookie("userType", userType, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    message: "Successful!",
                    data: { user: data, profile },
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
