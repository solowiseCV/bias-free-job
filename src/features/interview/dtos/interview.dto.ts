export interface InterviewDTO {
  jobPostingId: string;
  candidateEmail: string;
  scheduledTime: string; 
  status?: string;
  notes?: string;
}

export interface UpdateInterviewDTO {
  jobPostingId?: string;
  candidateEmail?: string;
  scheduledTime?: string;
  status?: string;
  notes?: string;
}