// @ts-nocheck
import { PrismaClient, Prisma } from "@prisma/client";
import { StarredCandidateResponse } from "../dtos/star.dto";

const prisma = new PrismaClient();

export class CandidateStarringService {
  async starCandidate(
    companyProfileId: string,
    jobSeekerId: string
  ): Promise<StarredCandidateResponse> {
    try {
      const starredCandidate = await prisma.starredCandidate.create({
        data: {
          companyProfileId,
          jobSeekerId,
        },
        include: {
          jobSeeker: {
            include: {
              user: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return {
        id: starredCandidate.id,
        jobSeekerId: starredCandidate.jobSeekerId,
        firstname: starredCandidate.jobSeeker.user.firstname,
        lastname: starredCandidate.jobSeeker.user.lastname,
        email: starredCandidate.jobSeeker.user.email,
        bio: starredCandidate.jobSeeker.bio,
        skills: starredCandidate.jobSeeker.skills,
        location: starredCandidate.jobSeeker.location,
        starredAt: starredCandidate.starredAt,
      };
    } catch (error) {
      console.error("Error starring candidate:", error);
      throw new Error("Failed to star candidate");
    }
  }

  async unstarCandidate(companyProfileId: string, jobSeekerId: string) {
    return await prisma.starredCandidate.delete({
      where: {
        companyProfileId,
        jobSeekerId,
      },
    });
  }

  // Get all starred candidates for a company
  async getStarredCandidates(
    companyId: string
  ): Promise<StarredCandidateResponse[]> {
    try {
      const starredCandidates = await prisma.starredCandidate.findMany({
        where: {
          companyProfileId: companyId,
        },
        include: {
          jobSeeker: {
            include: {
              user: {
                select: {
                  firstname: true,
                  lastname: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          starredAt: "desc",
        },
      });

      return starredCandidates.map((candidate: any) => ({
        id: candidate.id,
        jobSeekerId: candidate.jobSeekerId,
        firstname: candidate.jobSeeker.user.firstname,
        lastname: candidate.jobSeeker.user.lastname,
        email: candidate.jobSeeker.user.email,
        bio: candidate.jobSeeker.bio,
        skills: candidate.jobSeeker.skills,
        location: candidate.jobSeeker.location,
        avatar: candidate.jobSeeker.avatar,
        starredAt: candidate.starredAt,
      }));
    } catch (error) {
      console.error("Error fetching starred candidates:", error);
      throw new Error("Failed to fetch starred candidates");
    }
  }
}

export default CandidateStarringService;
