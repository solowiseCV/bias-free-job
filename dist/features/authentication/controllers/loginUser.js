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
const getJobSeeker_1 = require("../../jobSeeker/jobSeekerProfile/services/getJobSeeker");
const login_validation_1 = require("../../../validations/login.validation");
const companyProfile_1 = require("../../Recruiter/companyProfile/services/companyProfile");
const twoFactorAuth_1 = require("../services/twoFactorAuth");
const teamMembership_service_1 = require("../../users/teamMembership.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const companyTeamService = new companyProfile_1.CompanyTeamService();
const twoFAService = new twoFactorAuth_1.TwoFactorAuthService();
class LoginController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = login_validation_1.loginSchema.validate(req.body);
                if (error) {
                    res.status(400).json({ error: error.details[0].message });
                    return;
                }
                const { email, password } = req.body;
                let profile = null;
                let hiringTeams = [];
                const user = yield registerUser_1.AuthService.getUserByEmail(email);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User Email incorrect!",
                    });
                    return;
                }
                if (!user.password ||
                    (user.password && !(yield (0, hash_1.comparePassword)(password, user.password)))) {
                    res.status(404).json({
                        success: false,
                        message: "User  Password incorrect!",
                    });
                    return;
                }
                if (user.userType === "job_seeker") {
                    profile = yield getJobSeeker_1.GetJobSeekerService.getJobSeekerByUserId(user.id);
                }
                else {
                    // Attempt to get company team, but handle absence gracefully
                    const companyProfile = yield prisma.companyProfile.findFirst({
                        where: { userId: user.id },
                        include: { hiringTeam: { include: { teamMembers: true } } },
                    });
                    profile = companyProfile
                        ? {
                            companyProfileId: companyProfile.id,
                            companyName: companyProfile.companyName || "",
                            description: companyProfile.description || "",
                            industry: companyProfile.industry || "",
                            website: companyProfile.website || "",
                            location: companyProfile.location || "",
                            numberOfEmployees: companyProfile.numberOfEmployees || "",
                            hiringTeam: companyProfile.hiringTeam || null,
                        }
                        : null;
                }
                // Get all hiring team memberships for the user
                try {
                    hiringTeams = yield teamMembership_service_1.TeamMembershipService.getUserTeamMemberships(user.id);
                }
                catch (error) {
                    console.warn("Failed to get hiring team memberships:", error);
                    hiringTeams = [];
                }
                const token = jwt_1.tokenService.generateToken(user.id, user.userType);
                res.cookie("userType", user.userType, {
                    httpOnly: true,
                    secure: true,
                    // process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                const userData = {
                    id: user.id,
                    email: user.email,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    avatar: user.avatar,
                    userType: user.userType,
                };
                res.status(200).json({
                    success: true,
                    message: "Login successful!",
                    data: { userData, profile, hiringTeams, newUser: false },
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
