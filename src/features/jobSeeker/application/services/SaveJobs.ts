import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SaveJobService {
  // Create a saved job entry
  async saveJob(userId: string, jobPostingId: string) {
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobPostingId: {
          userId,
          jobPostingId,
        },
      },
    });

    if (existingSavedJob) {
      throw new Error("Job already saved by this user");
    }

    // Create the saved job entry
    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobPostingId,
      },
      include: {
        jobPosting: true,
      },
    });

    return savedJob;
  }

  // Get all saved jobs for a user
  async getSavedJobs(userId: string) {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        jobPosting: true,
      },
    });

    return savedJobs;
  }

  // Delete a saved job entry
  async deleteSavedJob(id: string) {
    return await prisma.savedJob.delete({
      where: {
        id,
      },
    });
  }

  // Optional: Get a specific saved job by userId and jobPostingId
  async getSavedJob(id: string) {
    const savedJob = await prisma.savedJob.findUnique({
      where: {
        id,
      },
      include: {
        jobPosting: true,
      },
    });

    return savedJob;
  }
}

export default new SaveJobService();
