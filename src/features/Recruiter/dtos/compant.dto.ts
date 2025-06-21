export interface CompanyTeamDTO {
  companyName: string;
  description: string;
  industry: string;
  website?: string;
  location?: string;
  numberOfEmployees?: string;
  teamMembers: { email: string; role: string }[];
}