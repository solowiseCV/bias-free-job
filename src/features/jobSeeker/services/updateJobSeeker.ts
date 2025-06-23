import { PrismaClient } from "@prisma/client";
import { CreateJobSeekerDto } from "../dtos/createJobSeekerDto";

const prisma = new PrismaClient();

export class UpdateJobSeekerService {
  static async updateSeeker(id: string, data: CreateJobSeekerDto) {
    return await prisma.jobSeeker.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
}
