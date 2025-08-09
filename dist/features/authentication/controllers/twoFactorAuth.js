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
exports.disable2FA = exports.enable2FA = exports.verify2FA = exports.generate2FA = void 0;
const twoFactorAuth_1 = require("../services/twoFactorAuth");
const response_util_1 = __importDefault(require("../../../utils/helpers/response.util"));
const twoFAService = new twoFactorAuth_1.TwoFactorAuthService();
const generate2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const result = yield twoFAService.generateSecret(userId);
        new response_util_1.default(200, true, "2FA secret generated successfully", res, {
            qr: result.qr,
            otpauth_url: result.otpauth_url,
            base32: result.base32,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to generate 2FA" });
    }
});
exports.generate2FA = generate2FA;
const verify2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { code } = req.body;
        if (!code) {
            new response_util_1.default(400, false, "Code is required", res);
        }
        const valid = yield twoFAService.verifyCode(userId, code);
        new response_util_1.default(200, true, "2FA code verification successful", res, { valid });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to verify 2FA" });
    }
});
exports.verify2FA = verify2FA;
const enable2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { code } = req.body;
        if (!code) {
            new response_util_1.default(400, false, "Code is required", res);
            // res.status(400).json({ error: "Code is required" });
            return;
        }
        yield twoFAService.enable2FA(userId, code);
        new response_util_1.default(200, true, "2FA enabled successfully", res, { enabled: true });
        // res.status(201).json({ enabled: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Failed to enable 2FA" });
    }
});
exports.enable2FA = enable2FA;
const disable2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { code } = req.body;
        if (!code) {
            new response_util_1.default(400, false, "Code is required", res);
            //  res.status(400).json({ error: "Code is required" });
            return;
        }
        yield twoFAService.disable2FA(userId, code);
        new response_util_1.default(200, true, "2FA disabled successfully", res, { disabled: true });
        // res.status(200).json({ disabled: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "Failed to disable 2FA" });
    }
});
exports.disable2FA = disable2FA;
