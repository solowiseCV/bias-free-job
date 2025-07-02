"use strict";
// // src/features/interviews/services/interviewService.ts
// import { PrismaClient, Prisma, InterviewStatus } from "@prisma/client"; // Import InterviewStatus from Prisma
// import { InterviewDTO, UpdateInterviewDTO } from "../dtos/interview.dto";
// const prisma = new PrismaClient();
// export class InterviewService {
//   async createInterview(userId: string, data: InterviewDTO) {
//     try {
//       const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
//       if (!companyProfile) throw new Error("No company profile found for this user");
//       const jobPosting = await prisma.jobPosting.findUnique({ where: { id: data.jobPostingId } });
//       if (!jobPosting || jobPosting.companyProfileId !== companyProfile.id) {
//         throw new Error("Invalid job posting or unauthorized access");
//       }
//       const status = data.status || InterviewStatus.SCHEDULED; // Use enum value
//       const interview = await prisma.interview.create({
//         data: {
//           jobPostingId: data.jobPostingId,
//           candidateEmail: data.candidateEmail,
//           scheduledTime: new Date(data.scheduledTime),
//           status, // Now typed as InterviewStatus
//           notes: data.notes,
//         },
//       });
//       return {
//         id: interview.id,
//         jobPostingId: interview.jobPostingId,
//         candidateEmail: interview.candidateEmail,
//         scheduledTime: interview.scheduledTime,
//         status: interview.status,
//         notes: interview.notes,
//       };
//     } catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         if (error.code === "P2002") {
//           throw new Error("An interview for this candidate and job already exists.");
//         }
//         throw new Error(`Database error: ${error.message}`);
//       }
//       throw error;
//     }
//   }
//   async getInterviews(userId: string, jobPostingId?: string) {
//     try {
//       const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
//       if (!companyProfile) return { interviews: [], total: 0 };
//       const whereClause: Prisma.InterviewWhereInput = {
//         jobPosting: { companyProfileId: companyProfile.id },
//       };
//       if (jobPostingId) {
//         whereClause.jobPostingId = jobPostingId;
//       }
//       const [interviews, total] = await prisma.$transaction([
//         prisma.interview.findMany({
//           where: whereClause,
//           orderBy: { scheduledTime: "asc" },
//         }),
//         prisma.interview.count({ where: whereClause }),
//       ]);
//       return {
//         interviews,
//         total,
//       };
//     } catch (error) {
//       throw new Error(`Failed to fetch interviews: ${error instanceof Error ? error.message : "Unknown error"}`);
//     }
//   }
//   async updateInterview(userId: string, id: string, data: UpdateInterviewDTO) {
//     try {
//       const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
//       if (!companyProfile) throw new Error("No company profile found for this user");
//       const interview = await prisma.interview.findUnique({ where: { id } });
//       if (!interview) throw new Error("Interview not found");
//       if (!interview.jobPosting || interview.jobPosting.companyProfileId !== companyProfile.id) {
//         throw new Error("Unauthorized access to this interview");
//       }
//       const updatedInterview = await prisma.interview.update({
//         where: { id },
//         data: {
//           jobPostingId: data.jobPostingId,
//           candidateEmail: data.candidateEmail,
//           scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : undefined,
//           status: data.status, 
//           notes: data.notes,
//         },
//       });
//       return {
//         id: updatedInterview.id,
//         jobPostingId: updatedInterview.jobPostingId,
//         candidateEmail: updatedInterview.candidateEmail,
//         scheduledTime: updatedInterview.scheduledTime,
//         status: updatedInterview.status,
//         notes: updatedInterview.notes,
//       };
//     } catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         throw new Error(`Database error: ${error.message}`);
//       }
//       throw error;
//     }
//   }
//   async deleteInterview(userId: string, id: string) {
//     try {
//       const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
//       if (!companyProfile) throw new Error("No company profile found for this user");
//       const interview = await prisma.interview.findUnique({ where: { id } });
//       if (!interview) throw new Error("Interview not found");
//       if (!interview.jobPosting || interview.jobPosting.companyProfileId !== companyProfile.id) {
//         throw new Error("Unauthorized access to this interview");
//       }
//       await prisma.interview.delete({ where: { id } });
//       return { message: "Interview deleted successfully" };
//     } catch (error) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         throw new Error(`Database error: ${error.message}`);
//       }
//       throw error;
//     }
//   }
// }
