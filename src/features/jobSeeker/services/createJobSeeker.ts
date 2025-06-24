const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { JobSeekerDto } from "../dtos/createJobSeekerDto";

export class JobSeekerService {
  static async upsertJobSeekerProfile(data: JobSeekerDto, userId: string) {
    return await prisma.jobSeeker.upsert({
      where: { userId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...data,
      },
    });
  }
}
