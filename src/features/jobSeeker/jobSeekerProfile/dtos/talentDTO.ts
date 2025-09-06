import {
  PrismaClient,
  EmploymentType,
  ExperienceLevel,
  WorkLocation,
} from "@prisma/client";

export interface TalentFilters {
  page?: number;
  pageSize?: number;
  role?: string | string[];
  skill?: string | string[];
  experienceLevel?: ExperienceLevel | ExperienceLevel[];
  workMode?: WorkLocation | WorkLocation[];
  jobType?: EmploymentType | EmploymentType[];
  industry?: string | string[];
  hasDisability?: string | boolean;
  salaryRange?: { min: number; max: number; currency: string }[];
}
