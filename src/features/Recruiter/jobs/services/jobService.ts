import { PrismaClient, JobPosting, Prisma } from "@prisma/client";
import { JobPostingDTO, UpdateJobPostingDTO } from "../dtos/postJob.dto";

const prisma = new PrismaClient();

export class JobPostingService {
  async createJobPosting(userId: string, data: JobPostingDTO) {
    const companyProfile = await prisma.companyProfile.findFirst({
      where: { userId },
    });

    if (!companyProfile)
      throw new Error("No company profile found for this user");

    const existingJob = await prisma.jobPosting.findFirst({
      where: {
        companyProfileId: companyProfile.id,
        jobTitle: data.jobTitle,
        companyLocation: data.companyLocation,
        industry: data.industry,
      },
    });

    if (existingJob) {
      throw new Error(
        "A job with the same title, location, and industry already exists for this company"
      );
    }

    return prisma.jobPosting.create({
      data: {
        companyProfileId: companyProfile.id,
        jobTitle: data.jobTitle,
        department: data.department,
        companyLocation: data.companyLocation,
        workLocation: data.workLocation,
        industry: data.industry,
        companyFunction: data.companyFunction,
        currency: data.currency || "NGN",
        deadline: data.deadline || new Date().toISOString(),
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        education: data.education,
        monthlySalaryMin: data.monthlySalaryMin,
        monthlySalaryMax: data.monthlySalaryMax,
        jobDescription: data.jobDescription,
        requirements: data.requirements,
        assessment: data.assessmentUrl,
        status: data.status || "active",
      },
    });
  }

  async getJobPostings(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    industry?: string,
    location?: string,
    status?: string,
    bestMatches?: string
  ) {
    const companyProfile = await prisma.companyProfile.findFirst({
      where: { userId },
    });
    if (!companyProfile) return { jobs: [], total: 0 };

    const whereClause: Prisma.JobPostingWhereInput = {
      companyProfileId: companyProfile.id,
    };

    // Apply filters
    if (search) {
      whereClause.jobTitle = { contains: search, mode: "insensitive" };
    }
    if (industry) {
      whereClause.industry = { contains: industry, mode: "insensitive" };
    }
    if (location) {
      whereClause.companyLocation = { contains: location, mode: "insensitive" };
    }
    if (status) {
      whereClause.status = status;
    }
    if (bestMatches === "true") {
      whereClause.status = "active";
    }

    

    const take = limit ? parseInt(limit as any) : 10;
    const skip = page ? (parseInt(page as any) - 1) * take : 0;

    const orderBy: Prisma.JobPostingOrderByWithRelationInput[] =
      bestMatches === "true"
        ? [{ createdAt: "desc" }, { monthlySalaryMax: "desc" }]
        : [{ createdAt: "desc" }];


      const [jobs, total] = await prisma.$transaction([
      prisma.jobPosting.findMany({
        where: whereClause,
        take,
        skip,
        orderBy,
        include: {
          companyProfile: { select: { companyName: true } },
          applications: true,
          interviews: true,
        },
      }),
      prisma.jobPosting.count({ where: whereClause }),
    ]);

    return {
      jobs: jobs.map(
        (job: JobPosting & { companyProfile: { companyName: string }, applications: any[], interviews: any[] }) => {
          // Calculate best matches as applications with status 'accepted' or 'hired'
          const bestMatches = job.applications
            ? job.applications.filter((app: any) => app.status === 'accepted' || app.status === 'hired').length
            : 0;
          return {
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
            postedOn: job.createdAt,
            
            totalApplications: job.applications ? job.applications.length : 0,
            peopleInterviewed: job.interviews ? job.interviews.length : 0,
            applications: job.applications || [],
            interviews: job.interviews || [],
            bestMatches,
          };
        }
      ),
      total,
      page: page || 1,
      limit: take,
    };
  }

  





async getJobPostingById(id: string) {
    const jobPosting = await prisma.jobPosting.findUnique({ 
      where: { id },
      include: { companyProfile: { select: { companyName: true } } },
    });
    if (!jobPosting) throw new Error("Job posting not found");
    return {
      id: jobPosting.id,
      jobTitle: jobPosting.jobTitle,
      companyName: jobPosting.companyProfile.companyName,
      companyLocation: jobPosting.companyLocation,
      workLocation: jobPosting.workLocation,
      industry: jobPosting.industry,
      employmentType: jobPosting.employmentType,
      monthlySalaryMin: jobPosting.monthlySalaryMin,
      monthlySalaryMax: jobPosting.monthlySalaryMax,
      status: jobPosting.status,
      jobDescription: jobPosting.jobDescription,
      requirements: jobPosting.requirements,
      assessmentUrl: jobPosting.assessment,
    };
  }
  async updateJobPosting(id: string, data: Partial<UpdateJobPostingDTO>) {
    const jobPosting = await prisma.jobPosting.findUnique({ where: { id } });
    if (!jobPosting) throw new Error("Job posting not found");

    return prisma.jobPosting.update({
      where: { id },
      data,
    });
  }

  async deleteJobPosting(userId: string, id: string) {
    const companyProfile = await prisma.companyProfile.findFirst({
      where: { userId },
    });
    if (!companyProfile)
      throw new Error("No company profile found for this user");

    const jobPosting = await prisma.jobPosting.findUnique({ where: { id } });
    if (!jobPosting) throw new Error("Job posting not found");
    if (jobPosting.companyProfileId !== companyProfile.id)
      throw new Error("Unauthorized to delete this job posting");

    return prisma.jobPosting.delete({
      where: { id },
    });
  }
}
