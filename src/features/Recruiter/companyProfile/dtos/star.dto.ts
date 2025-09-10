export interface StarredCandidateResponse {
  id: string;
  jobSeekerId: string;
  firstname: string;
  lastname: string;
  email: string;
  bio: string | null;
  skills: string[];
  location: {
    city: string | null;
    country: string | null;
  } | null;
  starredAt: Date;
}
