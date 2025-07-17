export interface JobApplicationDTO {
  userId: string;
  jobPostingId: string;
}

export interface GetUserApplicationsDTO {
  userId: string;
  page?: number;
  limit?: number;
}
export interface GetJobApplicationsDTO {
  jobPostingId: string;
  page?: number;
  limit?: number;
}

export interface UpdateApplicationDTO {
  id: string;
  data: Partial<{
    status: "pending" | "reviewing" | "accepted" | "rejected";
    coverLetter: string;
  }>;
}
