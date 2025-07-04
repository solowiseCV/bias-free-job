export interface JobSeekerDto {
  bio?: string;
  location?: {
    city?: string;
    state?: string;
  };
  hasDisability?: boolean;
  interestedRoles?: string[];
  experienceLevel?: "entry_level" | "mid_level" | "senior_level";
  workMode?: "office" | "hybrid" | "remote";
  jobType?: "full_time" | "part_time" | "contract" | "internship";
  skills?: string[];
  industry?: string;
  resume?: string;

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

  interests?: string[];
}
