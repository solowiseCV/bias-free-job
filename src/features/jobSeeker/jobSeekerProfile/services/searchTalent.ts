import {
  PrismaClient,
  EmploymentType,
  ExperienceLevel,
  WorkLocation,
} from "@prisma/client";
import { TalentFilters } from "../dtos/talentDTO";

const prisma = new PrismaClient();

const DEFAULT_DAILY_AVAILABILITY = {
  Sun: { available: false, times: [] },
  Mon: { available: false, times: [] },
  Tue: { available: false, times: [] },
  Wed: { available: false, times: [] },
  Thu: { available: false, times: [] },
  Fri: { available: false, times: [] },
  Sat: { available: false, times: [] },
};

interface JobSeekerResponse {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    lastname: string;
    firstname: string;
    othername: string | null;
    pronoun: string | null;
    phone_number: string | null;
    avatar: string | null;
  };
  bio?: string | null;
  location?: { city: string | null; country: string | null } | null;
  hasDisability: boolean | null;
  interestedRoles: string[];
  experienceLevel: ExperienceLevel | null;
  workMode: WorkLocation | null;
  jobType: EmploymentType | null;
  skills: string[];
  industry: string | null;
  experience?: any[];
  education?: any[];
  certifications?: any[];
  portfolio?: any[];
  resume?: string | null;
  interests?: string[];
  profileCompletion: number | null;
  dailyAvailability?: typeof DEFAULT_DAILY_AVAILABILITY;
  createdAt: string | null;
  updatedAt: string | null;
  matchScore?: number;
}
interface SearchTalentResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data?: JobSeekerResponse[];
}

export class TalentService {
  static async searchTalent(
    filters: TalentFilters = { page: 1, pageSize: 20 }
  ): Promise<SearchTalentResponse> {
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 20);
    const skip = (page - 1) * pageSize;

    const normalize = (v: any): string[] | null => {
      if (v === undefined || v === null) return null;
      if (Array.isArray(v))
        return v.filter((x) => x && String(x).trim() !== "").map(String);
      const trimmed = String(v).trim();
      return trimmed ? [trimmed] : null;
    };

    const roleArr = normalize(filters.role);
    const skillArr = normalize(filters.skill);
    const experienceLevelArr = normalize(filters.experienceLevel);
    const workModeArr = normalize(filters.workMode);
    const jobTypeArr = normalize(filters.jobType);
    const industryArr = normalize(filters.industry);
    const hasDisability =
      filters.hasDisability === "true" || filters.hasDisability === true
        ? true
        : filters.hasDisability === "false" || filters.hasDisability === false
        ? false
        : null;
    const salaryRange = filters.salaryRange || null;

    const pipeline: any[] = [];
    const matchOr: any[] = [];

    // Initial match to ensure a valid JobSeeker profile (userId exists and is linked)
    pipeline.push({
      $match: {
        userId: { $exists: true, $ne: null }, // Ensures a userId is present
      },
    });

    if (roleArr && roleArr.length)
      matchOr.push({ interestedRoles: { $in: roleArr } });
    if (skillArr && skillArr.length)
      matchOr.push({ skills: { $in: skillArr } });
    if (experienceLevelArr && experienceLevelArr.length)
      matchOr.push({ experienceLevel: { $in: experienceLevelArr } });
    if (workModeArr && workModeArr.length)
      matchOr.push({ workMode: { $in: workModeArr } });
    if (jobTypeArr && jobTypeArr.length)
      matchOr.push({ jobType: { $in: jobTypeArr } });
    if (industryArr && industryArr.length)
      matchOr.push({ industry: { $in: industryArr } });
    if (hasDisability !== null) matchOr.push({ hasDisability });

    if (matchOr.length) {
      pipeline.push({ $match: { $or: matchOr } });

      const addFieldsStage: any = { $addFields: {} };
      addFieldsStage.$addFields.roleMatches =
        roleArr && roleArr.length
          ? {
              $size: {
                $ifNull: [
                  { $setIntersection: ["$interestedRoles", roleArr] },
                  [],
                ],
              },
            }
          : 0;
      addFieldsStage.$addFields.skillMatches =
        skillArr && skillArr.length
          ? {
              $size: {
                $ifNull: [{ $setIntersection: ["$skills", skillArr] }, []],
              },
            }
          : 0;
      addFieldsStage.$addFields.experienceLevelMatch =
        experienceLevelArr && experienceLevelArr.length
          ? {
              $cond: [
                {
                  $in: [
                    { $ifNull: ["$experienceLevel", null] },
                    experienceLevelArr,
                  ],
                },
                1,
                0,
              ],
            }
          : 0;
      addFieldsStage.$addFields.workModeMatch =
        workModeArr && workModeArr.length
          ? {
              $cond: [
                { $in: [{ $ifNull: ["$workMode", null] }, workModeArr] },
                1,
                0,
              ],
            }
          : 0;
      addFieldsStage.$addFields.jobTypeMatch =
        jobTypeArr && jobTypeArr.length
          ? {
              $cond: [
                { $in: [{ $ifNull: ["$jobType", null] }, jobTypeArr] },
                1,
                0,
              ],
            }
          : 0;
      addFieldsStage.$addFields.industryMatch =
        industryArr && industryArr.length
          ? {
              $cond: [
                { $in: [{ $ifNull: ["$industry", null] }, industryArr] },
                1,
                0,
              ],
            }
          : 0;
      addFieldsStage.$addFields.hasDisabilityMatch =
        hasDisability !== null
          ? {
              $cond: [
                { $eq: [{ $ifNull: ["$hasDisability", null] }, hasDisability] },
                1,
                0,
              ],
            }
          : 0;

      if (salaryRange && salaryRange.length) {
        matchOr.push({
          $or: salaryRange.map((range) => ({
            $and: [
              { "jobPostings.monthlySalaryMin": { $gte: range.min } },
              { "jobPostings.monthlySalaryMax": { $lte: range.max } },
              { "jobPostings.currency": range.currency },
            ],
          })),
        });
      }

      pipeline.push(addFieldsStage);
      pipeline.push({
        $addFields: {
          matchScore: {
            $add: [
              "$roleMatches",
              "$skillMatches",
              "$experienceLevelMatch",
              "$workModeMatch",
              "$jobTypeMatch",
              "$industryMatch",
              "$hasDisabilityMatch",
            ],
          },
        },
      });
      pipeline.push({ $match: { $expr: { $gt: ["$matchScore", 0] } } });

      // Ensure a valid user exists after lookup
      pipeline.push({
        $lookup: {
          from: "User",
          localField: "userId",
          foreignField: "_id",
          as: "userDoc",
        },
      });
      pipeline.push({
        $match: {
          "userDoc.0": { $exists: true }, // Ensures at least one user document is linked
        },
      });
      pipeline.push({
        $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true },
      });

      pipeline.push({
        $lookup: {
          from: "Interview",
          localField: "_id",
          foreignField: "applicantId",
          as: "interviews",
        },
      });

      pipeline.push({
        $addFields: {
          hasQualifyingInterview: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $in: ["$$interview.status", ["scheduled", "completed"]],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      });

      pipeline.push({
        $project: {
          _id: 1,
          userId: 1,
          hasDisability: 1,
          interestedRoles: 1,
          experienceLevel: 1,
          workMode: 1,
          jobType: 1,
          skills: 1,
          industry: 1,
          profileCompletion: 1,
          bio: { $cond: ["$hasQualifyingInterview", "$bio", null] },
          location: { $cond: ["$hasQualifyingInterview", "$location", null] },
          experience: { $cond: ["$hasQualifyingInterview", "$experience", []] },
          education: { $cond: ["$hasQualifyingInterview", "$education", []] },
          certifications: {
            $cond: ["$hasQualifyingInterview", "$certifications", []],
          },
          portfolio: { $cond: ["$hasQualifyingInterview", "$portfolio", []] },
          resume: { $cond: ["$hasQualifyingInterview", "$resume", null] },
          interests: { $cond: ["$hasQualifyingInterview", "$interests", []] },
          dailyAvailability: {
            $cond: [
              "$hasQualifyingInterview",
              { $ifNull: ["$dailyAvailability", DEFAULT_DAILY_AVAILABILITY] },
              DEFAULT_DAILY_AVAILABILITY,
            ],
          },
          createdAt: { $toString: "$createdAt" },
          updatedAt: { $toString: "$updatedAt" },
          user: {
            id: "$userDoc._id",
            email: "$userDoc.email",
            lastname: "$userDoc.lastname",
            firstname: "$userDoc.firstname",
            othername: "$userDoc.othername",
            pronoun: "$userDoc.pronoun",
            phone_number: "$userDoc.phone_number",
            avatar: "$userDoc.avatar",
          },
          matchScore: 1,
        },
      });

      pipeline.push({
        $sort: { matchScore: -1, profileCompletion: -1, _id: 1 },
      });

      pipeline.push({
        $facet: {
          metadata: [{ $count: "total" }],
          results: [{ $skip: skip }, { $limit: pageSize }],
        },
      });

      pipeline.push({
        $unwind: {
          path: "$metadata",
          preserveNullAndEmptyArrays: true,
        },
      });

      pipeline.push({
        $project: {
          total: { $ifNull: ["$metadata.total", 0] },
          results: 1,
        },
      });

      const dbResult: any = await prisma.$runCommandRaw({
        aggregate: "JobSeeker",
        pipeline,
        cursor: {},
      });

      let total = 0;
      let results: any[] = [];

      if (dbResult?.cursor?.firstBatch?.length) {
        const first = dbResult.cursor.firstBatch[0];
        total = first?.total || 0;
        results = first?.results || [];
      }

      const transformedData = results.map((item: any) => ({
        id: item._id?.$oid || item._id,
        userId: item.userId?.$oid || item.userId,
        bio: item.bio ?? null,
        location: item.location ?? null,
        hasDisability: item.hasDisability ?? null,
        interestedRoles: item.interestedRoles || [],
        experienceLevel: item.experienceLevel ?? null,
        workMode: item.workMode ?? null,
        jobType: item.jobType ?? null,
        skills: item.skills || [],
        industry: item.industry ?? null,
        experience: item.experience || [],
        education: item.education || [],
        certifications: item.certifications || [],
        portfolio: item.portfolio || [],
        resume: item.resume ?? null,
        interests: item.interests || [],
        profileCompletion: item.profileCompletion ?? null,
        dailyAvailability: item.dailyAvailability || DEFAULT_DAILY_AVAILABILITY,
        createdAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
        user: {
          id:
            item.user?.id?.$oid ||
            item.userId?.$oid ||
            item.user?.id ||
            item.userId,
          email: item.user?.email ?? null,
          lastname: item.user?.lastname ?? null,
          firstname: item.user?.firstname ?? null,
          othername: item.user?.othername ?? null,
          pronoun: item.user?.pronoun ?? null,
          phone_number: item.user?.phone_number ?? null,
          avatar: item.user?.avatar ?? null,
        },
        matchScore: item.matchScore,
      }));

      return {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        data: transformedData,
      };
    } else {
      const randomPipeline = [
        { $match: { userId: { $exists: true, $ne: null } } }, // Ensure valid JobSeeker profile
        { $sample: { size: pageSize } },
        {
          $lookup: {
            from: "User",
            localField: "userId",
            foreignField: "_id",
            as: "userDoc",
          },
        },
        {
          $match: {
            "userDoc.0": { $exists: true }, // Ensure a user exists
          },
        },
        {
          $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "Interview",
            localField: "_id",
            foreignField: "applicantId",
            as: "interviews",
          },
        },
        {
          $addFields: {
            hasQualifyingInterview: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$interviews",
                      as: "interview",
                      cond: {
                        $in: ["$$interview.status", ["scheduled", "completed"]],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            hasDisability: 1,
            interestedRoles: 1,
            experienceLevel: 1,
            workMode: 1,
            jobType: 1,
            skills: 1,
            industry: 1,
            profileCompletion: 1,
            bio: { $cond: ["$hasQualifyingInterview", "$bio", null] },
            location: { $cond: ["$hasQualifyingInterview", "$location", null] },
            experience: {
              $cond: ["$hasQualifyingInterview", "$experience", []],
            },
            education: { $cond: ["$hasQualifyingInterview", "$education", []] },
            certifications: {
              $cond: ["$hasQualifyingInterview", "$certifications", []],
            },
            portfolio: { $cond: ["$hasQualifyingInterview", "$portfolio", []] },
            resume: { $cond: ["$hasQualifyingInterview", "$resume", null] },
            interests: { $cond: ["$hasQualifyingInterview", "$interests", []] },
            dailyAvailability: {
              $cond: [
                "$hasQualifyingInterview",
                { $ifNull: ["$dailyAvailability", DEFAULT_DAILY_AVAILABILITY] },
                DEFAULT_DAILY_AVAILABILITY,
              ],
            },
            createdAt: { $toString: "$createdAt" },
            updatedAt: { $toString: "$updatedAt" },
            user: {
              id: "$userDoc._id",
              email: "$userDoc.email",
              lastname: "$userDoc.lastname",
              firstname: "$userDoc.firstname",
              othername: "$userDoc.othername",
              pronoun: "$userDoc.pronoun",
              phone_number: "$userDoc.phone_number",
              avatar: "$userDoc.avatar",
            },
          },
        },
      ];

      const randomResult: any = await prisma.$runCommandRaw({
        aggregate: "JobSeeker",
        pipeline: randomPipeline,
        cursor: {},
      });

      const randomResults = randomResult?.cursor?.firstBatch || [];

      const transformedOther = randomResults.map((item: any) => ({
        id: item._id?.$oid || item._id,
        userId: item.userId?.$oid || item.userId,
        bio: item.bio ?? null,
        location: item.location ?? null,
        hasDisability: item.hasDisability ?? null,
        interestedRoles: item.interestedRoles || [],
        experienceLevel: item.experienceLevel ?? null,
        workMode: item.workMode ?? null,
        jobType: item.jobType ?? null,
        skills: item.skills || [],
        industry: item.industry ?? null,
        experience: item.experience || [],
        education: item.education || [],
        certifications: item.certifications || [],
        portfolio: item.portfolio || [],
        resume: item.resume ?? null,
        interests: item.interests || [],
        profileCompletion: item.profileCompletion ?? null,
        dailyAvailability: item.dailyAvailability || DEFAULT_DAILY_AVAILABILITY,
        createdAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
        user: {
          id:
            item.user?.id?.$oid ||
            item.userId?.$oid ||
            item.user?.id ||
            item.userId,
          email: item.user?.email ?? null,
          lastname: item.user?.lastname ?? null,
          firstname: item.user?.firstname ?? null,
          othername: item.user?.othername ?? null,
          pronoun: item.user?.pronoun ?? null,
          phone_number: item.user?.phone_number ?? null,
          avatar: item.user?.avatar ?? null,
        },
      }));

      return {
        page,
        pageSize,
        total: randomResults.length,
        totalPages: Math.ceil(randomResults.length / pageSize),
        data: transformedOther,
      };
    }
  }
}
