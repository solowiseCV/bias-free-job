"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruiterOnlyMiddleware = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ success: false, message: "Token required" });
        return;
    }
    try {
        const payload = jwt_1.tokenService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (_b) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
const recruiterOnlyMiddleware = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized: User not found in request" });
        return;
    }
    if (req.user.userType !== "recruiter") {
        res.status(403).json({ success: false, message: "Forbidden: Only recruiters are allowed" });
        return;
    }
    next();
};
exports.recruiterOnlyMiddleware = recruiterOnlyMiddleware;
