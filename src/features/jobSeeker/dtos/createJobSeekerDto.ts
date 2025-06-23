// dto/create-jobseeker.dto.ts

import { ExperienceLevel, WorkMode, JobType } from "@prisma/client";

export interface CreateJobSeekerDto {
  bio?: string;
  location?: {
    city?: string;
    state?: string;
  };
  hasDisability?: boolean;
  interestedRoles?: string[];
  experienceLevel?: ExperienceLevel;
  workMode?: WorkMode;
  jobType?: JobType;
  skills?: string[];
  industry?: string;

  experience?: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    currentlyWorking?: boolean;
    description?: string;
  }>;

  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    grade?: string;
    description?: string;
  }>;

  certifications?: Array<{
    title: string;
    authority: string;
    issueDate: Date;
    expirationDate?: Date;
    credentialID?: string;
    credentialURL?: string;
  }>;

  portfolio?: Array<{
    title: string;
    description?: string;
    link?: string;
    technologies?: string[];
  }>;

  resume?: {
    fileName: string;
    url: string;
    uploadedAt?: Date;
  };

  interests?: string[];
}
