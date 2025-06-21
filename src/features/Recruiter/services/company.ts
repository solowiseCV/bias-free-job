import { PrismaClient } from '@prisma/client';
import { hiringTeamMailOptionSendEmail } from '../../../utils/mail'; 
import nodemailer from 'nodemailer';
import { CompanyTeamDTO } from '../dtos/compant.dto';
import { transporter } from '../../../utils/nodemailer';

const prisma = new PrismaClient();


export class CompanyTeamService {
  async createCompanyTeam(userId: string, data: CompanyTeamDTO) {
    const result = await prisma.$transaction(async (tx) => {
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
  }
}
