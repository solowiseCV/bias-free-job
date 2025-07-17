import { PrismaClient, JobPosting, Prisma } from "@prisma/client";
import {
  GetJobApplicationsDTO,
  GetUserApplicationsDTO,
  UpdateApplicationDTO,
} from "../dtos/postJob.dto";

const prisma = new PrismaClient();

export class JobApplicationService {
  async createJobApplication(userId: string, jobPostingId: string) {
    const applicantProfile = await prisma.jobSeeker.findFirst({
      where: { userId },
    });
    if (!applicantProfile) throw new Error("Applicant not found!");

    return prisma.application.create({
      data: {
        applicantId: applicantProfile.id,
        jobPostingId: jobPostingId,
      },
    });
  }

  async getApplicationsByApplicant({
    userId,
    page = 1,
    limit = 10,
  }: GetUserApplicationsDTO) {
    const applicantProfile = await prisma.jobSeeker.findFirst({
      where: { userId },
    });

    if (!applicantProfile) throw new Error("Applicant not found!");

    const applicantId = applicantProfile.id;

    const take = limit;
    const skip = (page - 1) * take;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { applicantId },
        skip,
        take,
        orderBy: { appliedAt: "desc" },
        include: {
          applicant: true,
        },
      }),
      prisma.application.count({
        where: { applicantId },
      }),
    ]);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / take),
    };
  }

  async getApplicationsByJobPosting({
    jobPostingId,
    page = 1,
    limit = 10,
  }: GetJobApplicationsDTO) {
    const take = limit;
    const skip = (page - 1) * take;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { jobPostingId },
        skip,
        take,
        orderBy: { appliedAt: "desc" },
        include: {
          applicant: true,
        },
      }),
      prisma.application.count({
        where: { jobPostingId },
      }),
    ]);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / take),
    };
  }

  async updateApplication(updatData: any) {
    const { id, data } = updatData;

    return await prisma.application.update({
      where: { id },
      data,
    });
  }

  async deleteApplication(applicantId: string, jobPostingId: string) {
    const data = await prisma.application.findFirst({
      where: {
        applicantId,
        jobPostingId,
      },
    });
    if (!data) return "Data not found";

    const id = data.id;
    return await prisma.application.delete({
      where: { id },
    });
  }
}
