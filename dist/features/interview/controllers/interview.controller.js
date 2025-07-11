"use strict";
// import { Request, Response } from "express";
// import { InterviewService } from "../services/interview.service";
// import { interviewSchema, updateInterviewSchema } from "../../../validations/interview.validation"; 
// const interviewService = new InterviewService();
// export class InterviewController {
//   async createInterview(req: Request, res: Response) {
//     const { error } = interviewSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     try {
//       const result = await interviewService.createInterview(req.user.userId, req.body);
//       res.status(201).json({ message: "Interview created successfully", ...result });
//     } catch (error) {
//       console.error("Error in createInterview:", error);
//       if (error instanceof Error) {
//         if (error.message.includes("already exists")) {
//           return res.status(409).json({ error: error.message });
//         }
//         return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
//       }
//       return res.status(500).json({ error: "An unexpected server error occurred." });
//     }
//   }
// async getInterviews(req: Request, res: Response) {
//   const { jobPostingId } = req.query;
//   try {
//     const result = await interviewService.getInterviews(req.user.userId, jobPostingId as string | undefined);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getInterviews:", error);
//     if (error instanceof Error) {
//       return res.status(500).json({ error: error.message });
//     }
//     return res.status(500).json({ error: "An unexpected server error occurred." });
//   }
// }
// async updateInterview(req: Request, res: Response) {
//   const { error } = updateInterviewSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
//   try {
//     const result = await interviewService.updateInterview(req.user.userId, req.params.id, req.body);
//     res.status(200).json({ message: "Interview updated successfully", ...result });
//   } catch (error) {
//     console.error("Error in updateInterview:", error);
//     if (error instanceof Error) {
//       return res.status(500).json({ error: error.message });
//     }
//     return res.status(500).json({ error: "An unexpected server error occurred." });
//   }
// }
// async deleteInterview(req: Request, res: Response) {
//   try {
//     const result = await interviewService.deleteInterview(req.user.userId, req.params.id);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in deleteInterview:", error);
//     if (error instanceof Error) {
//       return res.status(404).json({ error: error.message });
//     }
//     return res.status(500).json({ error: "An unexpected server error occurred." });
//   }
// }
// }
