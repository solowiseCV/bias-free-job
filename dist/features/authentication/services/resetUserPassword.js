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
exports.PasswordResetService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const hash_1 = require("../../../utils/hash");
class PasswordResetService {
    static updatePassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashed = yield (0, hash_1.hashPassword)(newPassword);
            return prisma.user.update({
                where: { id: userId },
                data: { password: hashed },
            });
        });
    }
}
exports.PasswordResetService = PasswordResetService;
