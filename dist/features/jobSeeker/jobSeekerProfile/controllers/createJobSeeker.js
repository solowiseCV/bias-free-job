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
exports.CreateJobSeekerController = void 0;
const createJobSeeker_1 = require("../services/createJobSeeker");
const multer_1 = require("../../../../middlewares/multer");
const cloudinary_1 = __importDefault(require("../../../../configs/cloudinary"));
const cloudinary = (0, cloudinary_1.default)();
class CreateJobSeekerController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId) {
                    res.status(400).json({ error: "userId is required" });
                    return;
                }
                const dto = req.body;
                if (req.file) {
                    const fileData = {
                        originalname: req.file.originalname,
                        buffer: req.file.buffer,
                    };
                    const dataUri = (0, multer_1.getDataUri)(fileData);
                    const result = yield cloudinary.uploader.upload(dataUri.content, {
                        folder: "resume",
                        resource_type: "auto",
                    });
                    dto.resume = result.secure_url;
                }
                const result = yield createJobSeeker_1.JobSeekerService.upsertJobSeekerProfile(dto, userId);
                res
                    .status(200)
                    .json(Object.assign({ message: "Profile created successfully" }, result));
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.CreateJobSeekerController = CreateJobSeekerController;
