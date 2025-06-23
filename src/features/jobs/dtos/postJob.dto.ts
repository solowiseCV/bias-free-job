export interface JobPostingDTO {
  jobTitle: string;
  department?: string;
  companyLocation: string;
  workLocation: 'office' | 'hybrid' | 'remote';
  industry: string;
  companyFunction?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel?: 'entry-level' | 'mid-level' | 'senior-level';
  education?: string;
  monthlySalaryMin?: number;
  monthlySalaryMax?: number;
  jobDescription: string;
  requirements?: string;
  assessmentUrl?: string;
  assessmentFile?: Express.Multer.File;
  status?: 'active' | 'closed' | 'declined'; 
}

export interface UpdateJobPostingDTO {
  jobTitle?: string;
  department?: string;
  companyLocation?: string;
  workLocation?: 'office' | 'hybrid' | 'remote';
  industry?: string;
  companyFunction?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel?: 'entry-level' | 'mid-level' | 'senior-level';
  education?: string;
  monthlySalaryMin?: number;
  monthlySalaryMax?: number;
  jobDescription?: string;
  requirements?: string;
  assessmentUrl?: string;
  assessmentFile?: Express.Multer.File;
  status?: 'active' | 'closed' | 'declined'; 
}