export interface CompanyTeamDTO {
  companyName: string;
  description: string;
  industry: string;
  website?: string;
  location?: string;
  numberOfEmployees?: string;
  teamMembers: { email: string; role: string }[];
}

export interface TeamMember {
  email: string;
  role: string;
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