"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDTO = void 0;
const zod_1 = require("zod");
// DTO for updating user
exports.UpdateUserDTO = zod_1.z.object({
    firstname: zod_1.z.string().min(1, "First name is required").optional(),
    lastname: zod_1.z.string().min(1, "Last name is required").optional(),
    avatar: zod_1.z.string().url("Invalid avatar URL").optional(),
    email: zod_1.z.string().email("Invalid email format").optional(),
    phone_number: zod_1.z.string().optional(),
});
