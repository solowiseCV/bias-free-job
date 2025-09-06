"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const DEFAULT_DAILY_AVAILABILITY = {
    Sun: { available: false, times: [] },
    Mon: { available: false, times: [] },
    Tue: { available: false, times: [] },
    Wed: { available: false, times: [] },
    Thu: { available: false, times: [] },
    Fri: { available: false, times: [] },
    Sat: { available: false, times: [] },
};
class TalentService {
    static searchTalent() {
        return __awaiter(this, arguments, void 0, function* (filters = { page: 1, pageSize: 20 }) {
            var _a, _b, _c;
            const page = Math.max(1, filters.page || 1);
            const pageSize = Math.max(1, filters.pageSize || 20);
            const skip = (page - 1) * pageSize;
            const normalize = (v) => {
                if (v === undefined || v === null)
                    return null;
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
            const hasDisability = filters.hasDisability === "true" || filters.hasDisability === true
                ? true
                : filters.hasDisability === "false" || filters.hasDisability === false
                    ? false
                    : null;
            const salaryRange = filters.salaryRange || null;
            const pipeline = [];
            const matchOr = [];
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
            if (hasDisability !== null)
                matchOr.push({ hasDisability });
            let total = 0;
            let results = [];
            if (matchOr.length) {
                const addFieldsStage = { $addFields: {} };
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
                pipeline.push({ $match: { $or: matchOr } });
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
                pipeline.push({
                    $lookup: {
                        from: "User",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDoc",
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
                const dbResult = yield prisma.$runCommandRaw({
                    aggregate: "JobSeeker",
                    pipeline,
                    cursor: {},
                });
                if ((_b = (_a = dbResult === null || dbResult === void 0 ? void 0 : dbResult.cursor) === null || _a === void 0 ? void 0 : _a.firstBatch) === null || _b === void 0 ? void 0 : _b.length) {
                    const first = dbResult.cursor.firstBatch[0];
                    total = (first === null || first === void 0 ? void 0 : first.total) || 0;
                    results = (first === null || first === void 0 ? void 0 : first.results) || [];
                }
            }
            if (!matchOr.length || !results.length) {
                const randomPipeline = [
                    { $match: {} },
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
                const randomResult = yield prisma.$runCommandRaw({
                    aggregate: "JobSeeker",
                    pipeline: randomPipeline,
                    cursor: {},
                });
                const randomResults = ((_c = randomResult === null || randomResult === void 0 ? void 0 : randomResult.cursor) === null || _c === void 0 ? void 0 : _c.firstBatch) || [];
                const transformedOther = randomResults.map((item) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
                    return ({
                        id: ((_a = item._id) === null || _a === void 0 ? void 0 : _a.$oid) || item._id,
                        userId: ((_b = item.userId) === null || _b === void 0 ? void 0 : _b.$oid) || item.userId,
                        bio: (_c = item.bio) !== null && _c !== void 0 ? _c : null,
                        location: (_d = item.location) !== null && _d !== void 0 ? _d : null,
                        hasDisability: (_e = item.hasDisability) !== null && _e !== void 0 ? _e : null,
                        interestedRoles: item.interestedRoles || [],
                        experienceLevel: (_f = item.experienceLevel) !== null && _f !== void 0 ? _f : null,
                        workMode: (_g = item.workMode) !== null && _g !== void 0 ? _g : null,
                        jobType: (_h = item.jobType) !== null && _h !== void 0 ? _h : null,
                        skills: item.skills || [],
                        industry: (_j = item.industry) !== null && _j !== void 0 ? _j : null,
                        experience: item.experience || [],
                        education: item.education || [],
                        certifications: item.certifications || [],
                        portfolio: item.portfolio || [],
                        resume: (_k = item.resume) !== null && _k !== void 0 ? _k : null,
                        interests: item.interests || [],
                        profileCompletion: (_l = item.profileCompletion) !== null && _l !== void 0 ? _l : null,
                        dailyAvailability: item.dailyAvailability || DEFAULT_DAILY_AVAILABILITY,
                        createdAt: (_m = item.createdAt) !== null && _m !== void 0 ? _m : null,
                        updatedAt: (_o = item.updatedAt) !== null && _o !== void 0 ? _o : null,
                        user: {
                            id: ((_q = (_p = item.user) === null || _p === void 0 ? void 0 : _p.id) === null || _q === void 0 ? void 0 : _q.$oid) ||
                                ((_r = item.userId) === null || _r === void 0 ? void 0 : _r.$oid) ||
                                ((_s = item.user) === null || _s === void 0 ? void 0 : _s.id) ||
                                item.userId,
                            email: (_u = (_t = item.user) === null || _t === void 0 ? void 0 : _t.email) !== null && _u !== void 0 ? _u : null,
                            lastname: (_w = (_v = item.user) === null || _v === void 0 ? void 0 : _v.lastname) !== null && _w !== void 0 ? _w : null,
                            firstname: (_y = (_x = item.user) === null || _x === void 0 ? void 0 : _x.firstname) !== null && _y !== void 0 ? _y : null,
                            othername: (_0 = (_z = item.user) === null || _z === void 0 ? void 0 : _z.othername) !== null && _0 !== void 0 ? _0 : null,
                            pronoun: (_2 = (_1 = item.user) === null || _1 === void 0 ? void 0 : _1.pronoun) !== null && _2 !== void 0 ? _2 : null,
                            phone_number: (_4 = (_3 = item.user) === null || _3 === void 0 ? void 0 : _3.phone_number) !== null && _4 !== void 0 ? _4 : null,
                            avatar: (_6 = (_5 = item.user) === null || _5 === void 0 ? void 0 : _5.avatar) !== null && _6 !== void 0 ? _6 : null,
                        },
                    });
                });
                return {
                    page,
                    pageSize,
                    total: randomResults.length,
                    totalPages: Math.ceil(randomResults.length / pageSize),
                    other: transformedOther,
                };
            }
            const transformedData = results.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
                return ({
                    id: ((_a = item._id) === null || _a === void 0 ? void 0 : _a.$oid) || item._id,
                    userId: ((_b = item.userId) === null || _b === void 0 ? void 0 : _b.$oid) || item.userId,
                    bio: (_c = item.bio) !== null && _c !== void 0 ? _c : null,
                    location: (_d = item.location) !== null && _d !== void 0 ? _d : null,
                    hasDisability: (_e = item.hasDisability) !== null && _e !== void 0 ? _e : null,
                    interestedRoles: item.interestedRoles || [],
                    experienceLevel: (_f = item.experienceLevel) !== null && _f !== void 0 ? _f : null,
                    workMode: (_g = item.workMode) !== null && _g !== void 0 ? _g : null,
                    jobType: (_h = item.jobType) !== null && _h !== void 0 ? _h : null,
                    skills: item.skills || [],
                    industry: (_j = item.industry) !== null && _j !== void 0 ? _j : null,
                    experience: item.experience || [],
                    education: item.education || [],
                    certifications: item.certifications || [],
                    portfolio: item.portfolio || [],
                    resume: (_k = item.resume) !== null && _k !== void 0 ? _k : null,
                    interests: item.interests || [],
                    profileCompletion: (_l = item.profileCompletion) !== null && _l !== void 0 ? _l : null,
                    dailyAvailability: item.dailyAvailability || DEFAULT_DAILY_AVAILABILITY,
                    createdAt: (_m = item.createdAt) !== null && _m !== void 0 ? _m : null,
                    updatedAt: (_o = item.updatedAt) !== null && _o !== void 0 ? _o : null,
                    user: {
                        id: ((_q = (_p = item.user) === null || _p === void 0 ? void 0 : _p.id) === null || _q === void 0 ? void 0 : _q.$oid) ||
                            ((_r = item.userId) === null || _r === void 0 ? void 0 : _r.$oid) ||
                            ((_s = item.user) === null || _s === void 0 ? void 0 : _s.id) ||
                            item.userId,
                        email: (_u = (_t = item.user) === null || _t === void 0 ? void 0 : _t.email) !== null && _u !== void 0 ? _u : null,
                        lastname: (_w = (_v = item.user) === null || _v === void 0 ? void 0 : _v.lastname) !== null && _w !== void 0 ? _w : null,
                        firstname: (_y = (_x = item.user) === null || _x === void 0 ? void 0 : _x.firstname) !== null && _y !== void 0 ? _y : null,
                        othername: (_0 = (_z = item.user) === null || _z === void 0 ? void 0 : _z.othername) !== null && _0 !== void 0 ? _0 : null,
                        pronoun: (_2 = (_1 = item.user) === null || _1 === void 0 ? void 0 : _1.pronoun) !== null && _2 !== void 0 ? _2 : null,
                        phone_number: (_4 = (_3 = item.user) === null || _3 === void 0 ? void 0 : _3.phone_number) !== null && _4 !== void 0 ? _4 : null,
                        avatar: (_6 = (_5 = item.user) === null || _5 === void 0 ? void 0 : _5.avatar) !== null && _6 !== void 0 ? _6 : null,
                    },
                    matchScore: item.matchScore,
                });
            });
            return {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
                data: transformedData,
            };
        });
    }
}
exports.TalentService = TalentService;
