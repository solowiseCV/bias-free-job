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
    static getFilter(companyProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.findMany({
                where: { companyProfileId },
            });
        });
    }
    static saveFilter(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyProfileId = filter.companyProfileId;
            if (!userId && !companyProfileId) {
                throw new Error("User or Profile Id is required is required");
            }
            if (!companyProfileId) {
                const companyProfile = yield prisma.companyProfile.findFirst({
                    where: { userId },
                });
                if (companyProfile) {
                    companyProfileId = companyProfile.id;
                }
                else {
                    throw new Error("Company Profile not found");
                }
            }
            return yield prisma.filter.create({
                data: Object.assign(Object.assign({}, filter), { userId, companyProfileId: companyProfileId || undefined }),
            });
        });
    }
    static updateFilter(companyProfileId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.update({
                where: { companyProfileId },
                data: filter,
            });
        });
    }
}
exports.FilterService = FilterService;
