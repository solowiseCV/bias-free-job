import { PrismaClient, JobPosting, Prisma } from '@prisma/client';
import { JobPostingDTO, UpdateJobPostingDTO } from '../dtos/postJob.dto';

const prisma = new PrismaClient();

export class JobPostingService {
  async createJobPosting(userId: string, data: JobPostingDTO) {
    const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
    if (!companyProfile) throw new Error('No company profile found for this user');

    return prisma.jobPosting.create({
      data: {
        companyProfileId: companyProfile.id,
        jobTitle: data.jobTitle,
        department: data.department,
        companyLocation: data.companyLocation,
        workLocation: data.workLocation,
        industry: data.industry,
        companyFunction: data.companyFunction,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        education: data.education,
        monthlySalaryMin: data.monthlySalaryMin,
        monthlySalaryMax: data.monthlySalaryMax,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        assessment: data.assessmentUrl,
        status: data.status || 'active', 
      },
    });
  }

  async getJobPostings(userId: string, page?: number, limit?: number, search?: string, industry?: string, location?: string, status?: string, bestMatches?: string) {
    const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
    if (!companyProfile) return { jobs: [], total: 0 };

    const whereClause: Prisma.JobPostingWhereInput = { companyProfileId: companyProfile.id };

    // Apply filters
    if (search) {
      whereClause.jobTitle = { contains: search, mode: 'insensitive' };
    }
    if (industry) {
      whereClause.industry = { contains: industry, mode: 'insensitive' };
    }
    if (location) {
      whereClause.companyLocation = { contains: location, mode: 'insensitive' };
    }
    if (status) {
      whereClause.status = status;
    }
    if (bestMatches === 'true') {
      whereClause.status = 'active'; 
    }

    const take = limit ? parseInt(limit as any) : 10;
    const skip = page ? (parseInt(page as any) - 1) * take : 0;

    const orderBy: Prisma.JobPostingOrderByWithRelationInput[] = bestMatches === 'true'
      ? [{ createdAt: 'desc' }, { monthlySalaryMax: 'desc'  }] 
      : [{ createdAt: 'desc' }]; 

    const [jobs, total] = await prisma.$transaction([
      prisma.jobPosting.findMany({
        where: whereClause,
        take,
        skip,
        orderBy,
        include: { companyProfile: { select: { companyName: true } } },
      }),
      prisma.jobPosting.count({ where: whereClause }),
    ]);

    return {
      jobs: jobs.map((job: JobPosting & { companyProfile: { companyName: string } }) => ({
        id: job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyProfile.companyName,
        companyLocation: job.companyLocation,
        workLocation: job.workLocation,
        industry: job.industry,
        employmentType: job.employmentType,
        monthlySalaryMin: job.monthlySalaryMin,
        monthlySalaryMax: job.monthlySalaryMax,
        status: job.status,
      })),
      total,
      page: page || 1,
      limit: take,
    };
  }

  async updateJobPosting(id: string, data: Partial<UpdateJobPostingDTO>) {
    const jobPosting = await prisma.jobPosting.findUnique({ where: { id } });
    if (!jobPosting) throw new Error('Job posting not found');

    return prisma.jobPosting.update({
      where: { id },
      data,
    });
  }

  async deleteJobPosting(userId: string, id: string) {
    const companyProfile = await prisma.companyProfile.findFirst({ where: { userId } });
    if (!companyProfile) throw new Error('No company profile found for this user');

    const jobPosting = await prisma.jobPosting.findUnique({ where: { id } });
    if (!jobPosting) throw new Error('Job posting not found');
    if (jobPosting.companyProfileId !== companyProfile.id) throw new Error('Unauthorized to delete this job posting');

    return prisma.jobPosting.delete({
      where: { id },
    });
  }
}