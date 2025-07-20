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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class GoogleAuthService {
}
_a = GoogleAuthService;
GoogleAuthService.getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma.user.findUnique({
        where: { email },
    });
    return existingUser;
});
GoogleAuthService.getExistingUser = (authId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const conditions = [{ email }];
    if (authId) {
        conditions.push({ authId });
    }
    const existingUser = yield prisma.user.findFirst({
        where: {
            OR: conditions,
        },
    });
    return existingUser;
});
GoogleAuthService.registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create({
        data: Object.assign(Object.assign({}, data), { createdAt: new Date(Date.now()) }),
    });
});
exports.default = GoogleAuthService;
// module.exports = new GoogleAuthService();
