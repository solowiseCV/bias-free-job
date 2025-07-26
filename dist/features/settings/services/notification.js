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
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    static getNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSetting = yield prisma.notificationSetting.findUnique({
                where: { userId },
            });
            if (existingSetting)
                return existingSetting;
            const newSetting = yield prisma.notificationSetting.create({
                data: {
                    userId,
                },
            });
            return newSetting;
        });
    }
    static updateNotification(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.notificationSetting.update({
                where: { userId },
                data,
            });
        });
    }
}
exports.NotificationService = NotificationService;
