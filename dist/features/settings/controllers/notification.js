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
exports.NotificationController = void 0;
const companyProfile_1 = require("../../Recruiter/companyProfile/services/companyProfile");
const notification_1 = require("../services/notification");
const companyTeamService = new companyProfile_1.CompanyTeamService();
class NotificationController {
    static getNotificationSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const notificationSetting = notification_1.NotificationService.getNotification(userId);
                res.status(200).json({
                    success: true,
                    message: "Successful!",
                    data: notificationSetting,
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
    static updateNotificationSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const notificationSetting = notification_1.NotificationService.getNotification(userId);
                res.status(200).json({
                    success: true,
                    message: "Successful!",
                    data: notificationSetting,
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
exports.NotificationController = NotificationController;
