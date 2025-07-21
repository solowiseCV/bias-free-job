const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export class GetJobSeekerService {
  static async getJobSeekerByUserId(userId: string) {
    return await prisma.jobSeeker.findUnique({
      where: { userId },
    });
  }

  static async getJobSeekerById(id: string) {
    return await prisma.jobSeeker.findUnique({
      where: { id },
    });
  }
}
