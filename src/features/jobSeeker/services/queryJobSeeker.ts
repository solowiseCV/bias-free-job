const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export class SearchJobSeekerService {
  static async searchJobSeekers(filters: any) {
    const {
      role,
      skill,
      experienceLevel,
      workMode,
      jobType,
      industry,
      hasDisability,
    } = filters;

    return await prisma.jobSeeker.findMany({
      where: {
        ...(role && { interestedRoles: { has: role } }),
        ...(skill && { skills: { has: skill } }),
        ...(experienceLevel && { experienceLevel }),
        ...(workMode && { workMode }),
        ...(jobType && { jobType }),
        ...(industry && { industry }),
        ...(hasDisability !== undefined && {
          hasDisability: hasDisability === "true",
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            lastname: true,
            firstname: true,
            avatar: true,
          },
        },
      },
    });
  }
}
