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
exports.PORT = void 0;
const app_1 = require("./app");
const client_1 = require("@prisma/client");
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
exports.PORT = process.env.PORT || 9871;
const prisma = new client_1.PrismaClient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.$connect();
        logger_middleware_1.default.info("Connected to MongoDB");
        app_1.httpServer.listen(exports.PORT, () => {
            logger_middleware_1.default.info(`Listening on port ${exports.PORT}`);
        });
    }
    catch (err) {
        logger_middleware_1.default.error("Failed to start server:", err);
    }
}))();
// import app from "./app";
// import logger from "./middlewares/logger.middleware";
// export const PORT = process.env.PORT || 9871;
// (async () => {
//   logger.info(`Attempting to run server on port ${PORT}`);
//   app.listen(PORT, () => {
//     logger.info(`Listening on port ${PORT}`);
//   });
// })();
