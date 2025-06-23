import { PrismaClient } from "@prisma/client";
import { CreateJobSeekerDto } from "../dtos/createJobSeekerDto";

const prisma = new PrismaClient();

export class DeleteJobSeekerService {
  static async deleteSeeker(id: string) {
    return await prisma.jobSeeker.delete({
      where: { id },
    });
  }
}
