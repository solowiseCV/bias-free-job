import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { hashPassword } from "../../../utils/hash";

export class PasswordResetService {
  static async updatePassword(userId: string, newPassword: string) {
    const hashed = await hashPassword(newPassword);
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }
}
