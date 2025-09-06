import {
  FilterDTO,
  Filters,
} from "../../../jobSeeker/jobSeekerProfile/dtos/jobSeekerDto";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export class FilterService {
  static async getFilter(companyProfileId: string) {
    return await prisma.filter.findMany({
      where: { companyProfileId },
    });
  }

  static async saveFilter(filter: FilterDTO, userId: string) {
    let companyProfileId = filter.companyProfileId;

    if (!userId && !companyProfileId) {
      throw new Error("User or Profile Id is required is required");
    }

    if (!companyProfileId) {
      const companyProfile = await prisma.companyProfile.findFirst({
        where: { userId },
      });

      if (companyProfile) {
        companyProfileId = companyProfile.id;
      } else {
        throw new Error("Company Profile not found");
      }
    }

    return await prisma.filter.create({
      data: {
        ...filter,
        userId,
        companyProfileId: companyProfileId || undefined,
      },
    });
  }

  static async updateFilter(companyProfileId: string, filter: any) {
    return await prisma.filter.update({
      where: { companyProfileId },
      data: filter,
    });
  }
}
