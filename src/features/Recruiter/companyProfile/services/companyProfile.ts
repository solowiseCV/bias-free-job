import { PrismaClient, Prisma } from '@prisma/client';
import { hiringTeamMailOptionSendEmail } from '../../../../utils/mail'; 
import { CompanyTeamDTO, UpdateCompanyTeamDTO } from '../dtos/compant.dto'; 
import { transporter } from '../../../../utils/nodemailer';

const prisma = new PrismaClient();

export class CompanyTeamService {
  async createCompanyTeam(userId: string, data: CompanyTeamDTO) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Check for existing company profile with the same userId
        const existingProfile = await tx.companyProfile.findFirst({ where: { userId } });
        if (existingProfile) {
          throw new Error('A company profile already exists for this user.');
        }

        const companyProfile = await tx.companyProfile.create({
          data: {
            userId,
            companyName: data.companyName,
            description: data.description,
            industry: data.industry,
            website: data.website,
            location: data.location,
            numberOfEmployees: data.numberOfEmployees,
          },
        });

        const hiringTeam = await tx.hiringTeam.create({
          data: {
            companyProfileId: companyProfile.id,
          },
        });

        await tx.teamMember.createMany({
          data: data.teamMembers.map((member) => ({
            hiringTeamId: hiringTeam.id,
            email: member.email,
            role: member.role,
          })),
        });

        return {
          companyProfileId: companyProfile.id,
          hiringTeamId: hiringTeam.id,
          teamMembers: data.teamMembers,
          companyName: data.companyName,
        };
      }, {
        timeout: 15000,
      });

      // Send emails after transaction success
      await Promise.all(result.teamMembers.map(async (member: any) => {
        const isExistingUser = await prisma.user.findUnique({ where: { email: member.email } });
        const mailOptions = await hiringTeamMailOptionSendEmail(
          member.email,
          result.companyName,
          !!isExistingUser
        );
        await transporter.sendMail(mailOptions);
      }));

      return {
        companyProfileId: result.companyProfileId,
        hiringTeamId: result.hiringTeamId,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
      
          throw new Error('A company profile with this user ID already exists. Please use a different user or update the existing profile.');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error; 
    }
  }


  // async getCompanyTeam(userId: string) {
  //   try {
  //     const companyProfile = await prisma.companyProfile.findFirst({
  //       where: { userId },
  //       include: {
  //         hiringTeams: {
  //           include: {
  //             teamMembers: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!companyProfile) {
  //       throw new Error('No company profile found for this user.');
  //     }

  //  return {
  //     companyProfileId: companyProfile.id,
  //     companyName: companyProfile.companyName,
  //     description: companyProfile.description,
  //     industry: companyProfile.industry,
  //     website: companyProfile.website,
  //     location: companyProfile.location,
  //     numberOfEmployees: companyProfile.numberOfEmployees,
  //     hiringTeamId: companyProfile.hiringTeam?.id,
  //     teamMembers: companyProfile.hiringTeam?.teamMembers || [],
  //   };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error(`Failed to fetch company team: ${error.message}`);
  //     }
  //     throw new Error('Unexpected error while fetching company team.');
  //   }
  // }

  

  async updateCompanyTeam(userId: string, data: UpdateCompanyTeamDTO) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const companyProfile = await tx.companyProfile.findFirst({ where: { userId } });
        if (!companyProfile) {
          throw new Error('No company profile found for this user.');
        }

        const updatedProfile = await tx.companyProfile.update({
          where: { id: companyProfile.id },
          data: {
            companyName: data.companyName,
            description: data.description,
            industry: data.industry,
            website: data.website,
            location: data.location,
            numberOfEmployees: data.numberOfEmployees,
          },
        });

        const hiringTeam = await tx.hiringTeam.findFirst({ where: { companyProfileId: companyProfile.id } });
        if (hiringTeam && data.teamMembers) {
          // Delete existing team members
          await tx.teamMember.deleteMany({ where: { hiringTeamId: hiringTeam.id } });
          // Create new team members
          await tx.teamMember.createMany({
            data: data.teamMembers.map((member) => ({
              hiringTeamId: hiringTeam.id,
              email: member.email,
              role: member.role,
            })),
          });
        }

        return {
          companyProfileId: updatedProfile.id,
          companyName: updatedProfile.companyName,
        };
      }, {
        timeout: 15000,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteCompanyTeam(userId: string) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const companyProfile = await tx.companyProfile.findFirst({ where: { userId } });
        if (!companyProfile) {
          throw new Error('No company profile found for this user.');
        }

        // Delete team members
        const hiringTeam = await tx.hiringTeam.findFirst({ where: { companyProfileId: companyProfile.id } });
        if (hiringTeam) {
          await tx.teamMember.deleteMany({ where: { hiringTeamId: hiringTeam.id } });
          await tx.hiringTeam.delete({ where: { id: hiringTeam.id } });
        }

        // Delete company profile
        await tx.companyProfile.delete({ where: { id: companyProfile.id } });

        return { message: 'Company team deleted successfully' };
      }, {
        timeout: 15000,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

}