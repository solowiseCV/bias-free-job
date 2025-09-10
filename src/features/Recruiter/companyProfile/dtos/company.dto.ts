import { $Enums } from "@prisma/client";

export interface CompanyTeamDTO {
  companyName: string;
  description: string;
  industry: string;
  website?: string;
  location?: string;
  numberOfEmployees?: string;
  teamMembers?: { email: string; role: $Enums.TeamRole }[];
}

export interface TeamMember {
  email: string;
  role: $Enums.TeamRole;
}

export interface UpdateCompanyTeamDTO {
  companyName?: string;
  description?: string;
  industry?: string;
  website?: string;
  location?: string;
  numberOfEmployees?: string;
  teamMembers?: TeamMember[];
}

export interface HiredJobSeeker {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  bio: string | null;
  skills: string[];
  location: {
    city: string | null;
    country: string | null;
  } | null;
  hiredAt: Date;
  companyName: string;
}

export interface HiredJobSeekersResponse {
  totalHired: number;
  hiredJobSeekers: HiredJobSeeker[];
}
