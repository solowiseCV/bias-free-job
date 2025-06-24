"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataUri = exports.singleupload = void 0;
const multer_1 = __importDefault(require("multer"));
const parser_1 = __importDefault(require("datauri/parser"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF, JPEG, PNG, and JPG files are allowed"), false);
    }
};
// Single file upload middleware
exports.singleupload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("assessment");
// Convert file buffer to Data URI
const getDataUri = (file) => {
    const parser = new parser_1.default();
    const extName = path_1.default.extname(file.originalname).toString();
    const result = parser.format(extName, file.buffer);
    if (!result.content) {
        throw new Error("Failed to generate data URI");
    }
    return { content: result.content };
};
exports.getDataUri = getDataUri;
