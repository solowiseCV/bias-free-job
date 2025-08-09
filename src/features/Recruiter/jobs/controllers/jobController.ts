import { Request, Response } from "express";
import { JobPostingService } from "../services/jobService";
import {
  jobPostingSchema,
  updateJobPostingSchema,
} from "../../../../validations/job.validation";
import { getDataUri, FileData } from "../../../../middlewares/multer";
import configureCloudinary from "../../../../configs/cloudinary";
import { JobPostingDTO, UpdateJobPostingDTO } from "../dtos/postJob.dto";
import { BadRequestError } from "../../../../lib/appError";
import CustomResponse from "../../../../utils/helpers/response.util";
import { PrismaClient } from "@prisma/client";
const jobPostingService = new JobPostingService();
const cloudinary = configureCloudinary();
const prisma = new PrismaClient();
export class JobPostingController {
  async createJobPosting(req: Request, res: Response) {
    // Validate required assessment input
    if (!req.file && !req.body.assessmentUrlInput && !req.body.assessment) {
      res.status(400).json({ error: "Assessment is required (URL or file)" });
      return;
    }

    // Validate request body against schema
    const { error } = jobPostingSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    let assessmentUrl: string | undefined;

    // Determine assessment URL from input or file upload
    if (req.body.assessmentUrlInput) {
      assessmentUrl = req.body.assessmentUrlInput;
    } else if (req.body.assessment) {
      assessmentUrl = req.body.assessment;
    }

    // Handle file upload if present
    if (req.file) {
      try {
        if (!req.file.buffer || !req.file.originalname) {
          throw new Error("Invalid file data");
        }
        const fileUri = getDataUri(req.file);
        const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
          folder: "job_assessments", // Changed to match assessment context
          resource_type: "auto", // Allow auto-detection of file type
          // Removed image-specific transformations to support various file types
        });
        assessmentUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        //  res.status(400).json({ error: "Failed to upload assessment to Cloudinary" });
        new CustomResponse(
          400,
          true,
          "Failed to upload assessment to Cloudinary",
          res,
          uploadError
        );
        return;
      }
    }

    // Prepare data for service
    const data: JobPostingDTO = {
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      companyLocation: req.body.companyLocation,
      workLocation: req.body.workLocation,
      industry: req.body.industry,
      companyFunction: req.body.companyFunction,
      employmentType: req.body.employmentType,
      experienceLevel: req.body.experienceLevel,
      education: req.body.education,
      monthlySalaryMin: req.body.monthlySalaryMin
        ? parseFloat(req.body.monthlySalaryMin)
        : undefined,
      monthlySalaryMax: req.body.monthlySalaryMax
        ? parseFloat(req.body.monthlySalaryMax)
        : undefined,
      jobDescription: req.body.jobDescription,
      requirements: req.body.requirements,
      assessmentUrl,
      status: req.body.status,
    };

    // Create job posting
    try {
      const jobPosting = await jobPostingService.createJobPosting(
        req.user.id,
        data
      );
      new CustomResponse(
        201,
        true,
        "Job created successfully",
        res,
        jobPosting
      );
    } catch (err: any) {
      const status = err.statusCode || 500;
      // res.status(status).json({ error: err.message });
      new CustomResponse(status, true, err.message, res, err);
    }
  }

  async getJobPostings(req: Request, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
      industry,
      location,
      status,
      bestMatches,
    } = req.query;

    try {
      const jobPostings = await jobPostingService.getJobPostings(
        req.user.id,
        parseInt(page as string),
        parseInt(limit as string),
        search as string,
        industry as string,
        location as string,
        status as string,
        bestMatches as string
      );
      new CustomResponse(
        200,
        true,
        "Job postings retrieved successfully",
        res,
        jobPostings
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAllJobs(req: Request, res: Response) {
    try {
      const jobPostings = await jobPostingService.getJobs();
      console.log(jobPostings);
      new CustomResponse(
        200,
        true,
        "Job postings retrieved successfully",
        res,
        jobPostings
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getJobPostingById(req: Request, res: Response) {
    try {
      const jobPosting = await jobPostingService.getJobPostingById(
        req.params.id
      );
      if (!jobPosting) {
        throw new BadRequestError("Job posting not found");
      }
      new CustomResponse(
        200,
        true,
        "Job posting retrieved successfully",
        res,
        jobPosting
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // async updateJobPosting(req: Request, res: Response) {

  //   const { error } = updateJobPostingSchema.validate(req.body);

  //   if (error) {
  //     res.status(400).json({ error: error.details[0].message });
  //     return;
  //   }

  //   let assessmentUrl: string | undefined;

  //   if (req.body.assessmentUrlInput) {
  //     assessmentUrl = req.body.assessmentUrlInput;
  //   } else if (req.body.assessment) {
  //     assessmentUrl = req.body.assessment;
  //   }

  //   if (req.file) {
  //     try {
  //       const fileData: FileData = {
  //         originalname: req.file.originalname,
  //         buffer: req.file.buffer,
  //       };
  //       const dataUri = getDataUri(fileData);
  //       const result = await cloudinary.uploader.upload(dataUri.content, {
  //         folder: "job_assessments",
  //         resource_type: "auto",
  //       });
  //       assessmentUrl = result.secure_url;
  //     } catch (uploadErr) {
  //       // res.status(500).json({ error: "Failed to upload file to Cloudinary" });
  //       new CustomResponse(
  //         500,
  //         true,
  //         "Failed to upload file to Cloudinary",
  //         res,
  //         uploadErr
  //       );
  //       return;
  //     }
  //   } else {
  //     assessmentUrl = req.body.assessmen;
  //   }

  //   const data: Partial<UpdateJobPostingDTO> = {
  //     jobTitle: req.body.jobTitle,
  //     department: req.body.department,
  //     companyLocation: req.body.companyLocation,
  //     workLocation: req.body.workLocation,
  //     industry: req.body.industry,
  //     companyFunction: req.body.companyFunction,
  //     employmentType: req.body.employmentType,
  //     experienceLevel: req.body.experienceLevel,
  //     education: req.body.education,
  //     monthlySalaryMin: req.body.monthlySalaryMin
  //       ? parseFloat(req.body.monthlySalaryMin)
  //       : undefined,
  //     monthlySalaryMax: req.body.monthlySalaryMax
  //       ? parseFloat(req.body.monthlySalaryMax)
  //       : undefined,
  //     jobDescription: req.body.jobDescription,
  //     requirements: req.body.requirements,
  //     assessment: assessmentUrl,
  //     status: req.body.status,
  //   };

  //   // Filter out undefined values to ensure only provided fields are updated
  //   const updateData = Object.fromEntries(
  //     Object.entries(data).filter(([_, value]) => value !== undefined)
  //   );

  //   try {
  //     const jobPosting = await jobPostingService.updateJobPosting(
  //       req.params.id,
  //       updateData
  //     );
  //     res.status(200).json(jobPosting);
  //   } catch (err: any) {
  //     res.status(400).json({ error: err.message });
  //   }
  // }

  async updateJobPosting(req: Request, res: Response) {
    const { error } = updateJobPostingSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    let assessmentUrl: string | undefined;

    try {
      if (req.body.assessmentUrlInput) {
        assessmentUrl = req.body.assessmentUrlInput;
      } else if (req.file) {
        const fileData: FileData = {
          originalname: req.file.originalname,
          buffer: req.file.buffer,
        };
        const dataUri = getDataUri(fileData);
        const result = await cloudinary.uploader.upload(dataUri.content, {
          folder: "job_assessments",
          resource_type: "auto",
        });
        assessmentUrl = result.secure_url;
      } else if (req.body.assessment) {
        assessmentUrl = req.body.assessment;
      }
    } catch (uploadErr) {
      new CustomResponse(
        500,
        true,
        "Failed to upload file to Cloudinary",
        res,
        uploadErr
      );
    }

    const data: Partial<UpdateJobPostingDTO> = {
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      companyLocation: req.body.companyLocation,
      workLocation: req.body.workLocation,
      industry: req.body.industry,
      companyFunction: req.body.companyFunction,
      employmentType: req.body.employmentType,
      experienceLevel: req.body.experienceLevel,
      education: req.body.education,
      monthlySalaryMin: req.body.monthlySalaryMin
        ? parseFloat(req.body.monthlySalaryMin)
        : undefined,
      monthlySalaryMax: req.body.monthlySalaryMax
        ? parseFloat(req.body.monthlySalaryMax)
        : undefined,
      jobDescription: req.body.jobDescription,
      requirements: req.body.requirements,
      assessment: assessmentUrl,
      status: req.body.status,
      currency: req.body.currency,
    };

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    try {
      const jobPosting = await jobPostingService.updateJobPosting(
        req.params.id,
        updateData
      );
      res.status(200).json(jobPosting);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteJobPosting(req: Request, res: Response) {
    try {
      const jobPosting = await jobPostingService.deleteJobPosting(
        req.user.id,
        req.params.id
      );
      // res
      // .status(200)
      // .json({ message: "Job posting deleted successfully", jobPosting });
      new CustomResponse(
        200,
        true,
        "Job posting deleted successfully",
        res,
        jobPosting
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getJobs(req: Request, res: Response) {
    try {
      const jobPosting = await jobPostingService.getJobs();
      // res
      // .status(200)
      // .json({ message: "Job posting deleted successfully", jobPosting });
      new CustomResponse(
        200,
        true,
        "Job posting deleted successfully",
        res,
        jobPosting
      );
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
