import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class GetJobSeekerService {
  static async getJobSeekerByUserId(userId: string) {
    return await prisma.jobSeeker.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  static async getJobSeekerById(id: string) {
    return await prisma.jobSeeker.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
}
