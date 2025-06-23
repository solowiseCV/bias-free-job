// services/jobseeker.service.ts

import { PrismaClient } from "@prisma/client";
import { CreateJobSeekerDto } from "../dtos/createJobSeekerDto";

const prisma = new PrismaClient();

export class JobSeekerService {
  static async upsertJobSeekerProfile(
    data: CreateJobSeekerDto,
    userId: string
  ) {
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
