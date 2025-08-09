"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.paginationSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    firstname: zod_1.z.string().min(1, "First name is required").max(50, "First name too long").optional(),
    lastname: zod_1.z.string().min(1, "Last name is required").max(50, "Last name too long").optional(),
    email: zod_1.z.string().email("Invalid email format").optional(),
    phone_number: zod_1.z.string().optional(),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/, "Page must be a number").transform(Number).pipe(zod_1.z.number().min(1, "Page must be at least 1")).optional().default(1),
    limit: zod_1.z.string().regex(/^\d+$/, "Limit must be a number").transform(Number).pipe(zod_1.z.number().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100")).optional().default(10),
});
exports.userIdSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
});
