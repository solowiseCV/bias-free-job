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
exports.TwoFactorAuthService = void 0;
const client_1 = require("@prisma/client");
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const prisma = new client_1.PrismaClient();
class TwoFactorAuthService {
    generateSecret(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const secret = speakeasy_1.default.generateSecret({ name: `BiasFreeJob (${userId})` });
                yield prisma.user.update({
                    where: { id: userId },
                    data: { twoFactorSecret: secret.base32, twoFactorEnabled: false },
                });
                const qr = yield qrcode_1.default.toDataURL(secret.otpauth_url);
                return { otpauth_url: secret.otpauth_url, qr, base32: secret.base32 };
            }
            catch (error) {
                throw new Error('Failed to generate 2FA secret');
            }
        });
    }
    verifyCode(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findUnique({ where: { id: userId } });
                if (!(user === null || user === void 0 ? void 0 : user.twoFactorSecret))
                    return false;
                return speakeasy_1.default.totp.verify({
                    secret: user.twoFactorSecret,
                    encoding: 'base32',
                    token: code,
                    window: 2,
                });
            }
            catch (error) {
                throw new Error('Failed to verify 2FA code');
            }
        });
    }
    enable2FA(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = yield this.verifyCode(userId, code);
            if (!valid)
                throw new Error('Invalid 2FA code');
            yield prisma.user.update({
                where: { id: userId },
                data: { twoFactorEnabled: true },
            });
            return true;
        });
    }
    disable2FA(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = yield this.verifyCode(userId, code);
            if (!valid)
                throw new Error('Invalid 2FA code');
            yield prisma.user.update({
                where: { id: userId },
                data: { twoFactorEnabled: false, twoFactorSecret: null },
            });
            return true;
        });
    }
}
exports.TwoFactorAuthService = TwoFactorAuthService;
