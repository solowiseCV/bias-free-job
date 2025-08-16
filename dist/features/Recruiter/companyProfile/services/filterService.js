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
exports.FilterService = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class FilterService {
    static getFilter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.findUnique({
                where: { id },
            });
        });
    }
    static saveFilter(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyProfileId = filter.companyProfileId;
            if (!userId && !companyProfileId) {
                throw new Error("userId is required");
            }
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (companyProfile) {
                companyProfileId = companyProfile.id;
            }
            return yield prisma.filter.create({
                data: Object.assign(Object.assign({}, filter), { userId, companyProfileId: companyProfileId || undefined }),
            });
        });
    }
    static updateFilter(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.update({
                where: { id },
                data: filter,
            });
        });
    }
}
exports.FilterService = FilterService;
