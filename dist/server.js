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
const app_1 = __importDefault(require("./app"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
exports.PORT = process.env.PORT || 9871;
(() => __awaiter(void 0, void 0, void 0, function* () {
    logger_middleware_1.default.info(`Attempting to run server on port ${exports.PORT}`);
    app_1.default.listen(exports.PORT, () => {
        logger_middleware_1.default.info(`Listening on port ${exports.PORT}`);
    });
}))();
