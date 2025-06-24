const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { JobSeekerDto } from "../dtos/createJobSeekerDto";

export class UpdateJobSeekerService {
  static async updateSeeker(id: string, data: JobSeekerDto) {
    return await prisma.jobSeeker.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
