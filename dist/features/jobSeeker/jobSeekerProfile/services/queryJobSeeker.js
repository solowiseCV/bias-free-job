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
exports.SearchJobSeekerService = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class SearchJobSeekerService {
    static searchJobSeekers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role, skill, experienceLevel, workMode, jobType, industry, hasDisability, } = filters;
            return yield prisma.jobSeeker.findMany({
                where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (role && { interestedRoles: { has: role } })), (skill && { skills: { has: skill } })), (experienceLevel && { experienceLevel })), (workMode && { workMode })), (jobType && { jobType })), (industry && { industry })), (hasDisability !== undefined && {
                    hasDisability: hasDisability === "true",
                })),
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            lastname: true,
                            firstname: true,
                            avatar: true,
                        },
                    },
                },
            });
        });
    }
    static searchTalent() {
        return __awaiter(this, arguments, void 0, function* (filters = {
            page: 1,
            pageSize: 20,
        }) {
            var _a, _b, _c, _d;
            const page = filters.page || 1;
            const pageSize = filters.pageSize || 20;
            const normalize = (v) => {
                if (v === undefined || v === null)
                    return null;
                if (Array.isArray(v))
                    return v.filter((x) => x !== null && String(x).trim() !== "");
                if (typeof v === "string") {
                    const t = v.trim();
                    return t === "" ? null : [t];
                }
                return [v];
            };
            const roleArr = normalize(filters.role);
            const skillArr = normalize(filters.skill);
            const experienceLevel = filters.experienceLevel
                ? String(filters.experienceLevel).trim()
                : null;
            const workMode = filters.workMode ? String(filters.workMode).trim() : null;
            const jobType = filters.jobType ? String(filters.jobType).trim() : null;
            const industry = filters.industry ? String(filters.industry).trim() : null;
            const hasDisabilityRaw = filters.hasDisability;
            const hasDisability = hasDisabilityRaw === true || hasDisabilityRaw === "true"
                ? true
                : hasDisabilityRaw === false || hasDisabilityRaw === "false"
                    ? false
                    : null;
            const skip = Math.max(0, (Math.max(1, page) - 1) * pageSize);
            const pipeline = [];
            const matchOr = [];
            if (roleArr && roleArr.length)
                matchOr.push({ interestedRoles: { $in: roleArr } });
            if (skillArr && skillArr.length)
                matchOr.push({ skills: { $in: skillArr } });
            if (experienceLevel)
                matchOr.push({ experienceLevel });
            if (workMode)
                matchOr.push({ workMode });
            if (jobType)
                matchOr.push({ jobType });
            if (industry)
                matchOr.push({ industry });
            if (hasDisability !== null)
                matchOr.push({ hasDisability });
            let total = 0;
            let results = [];
            if (matchOr.length) {
                // Matching data pipeline
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
                addFieldsStage.$addFields.experienceLevelMatch = experienceLevel
                    ? {
                        $cond: [
                            {
                                $eq: [{ $ifNull: ["$experienceLevel", null] }, experienceLevel],
                            },
                            1,
                            0,
                        ],
                    }
                    : 0;
                addFieldsStage.$addFields.workModeMatch = workMode
                    ? {
                        $cond: [
                            { $eq: [{ $ifNull: ["$workMode", null] }, workMode] },
                            1,
                            0,
                        ],
                    }
                    : 0;
                addFieldsStage.$addFields.jobTypeMatch = jobType
                    ? { $cond: [{ $eq: [{ $ifNull: ["$jobType", null] }, jobType] }, 1, 0] }
                    : 0;
                addFieldsStage.$addFields.industryMatch = industry
                    ? {
                        $cond: [
                            { $eq: [{ $ifNull: ["$industry", null] }, industry] },
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
                    $project: {
                        _id: 1,
                        userId: 1,
                        "user.id": "$userDoc._id",
                        "user.firstname": "$userDoc.firstname",
                        "user.lastname": "$userDoc.lastname",
                        "user.email": "$userDoc.email",
                        "user.avatar": "$userDoc.avatar",
                        "user.othername": "$userDoc.othername",
                        "user.pronoun": "$userDoc.pronoun",
                        "user.phone_number": "$userDoc.phone_number",
                        interestedRoles: 1,
                        skills: 1,
                        experienceLevel: 1,
                        workMode: 1,
                        jobType: 1,
                        industry: 1,
                        hasDisability: 1,
                        profileCompletion: 1,
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
                    $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true },
                });
                pipeline.push({
                    $project: {
                        total: "$metadata.total",
                        results: 1,
                    },
                });
                const dbResult = yield prisma.$runCommandRaw({
                    aggregate: "JobSeeker",
                    pipeline,
                    cursor: {},
                });
                if (((_a = dbResult === null || dbResult === void 0 ? void 0 : dbResult.cursor) === null || _a === void 0 ? void 0 : _a.firstBatch) && dbResult.cursor.firstBatch.length) {
                    const first = dbResult.cursor.firstBatch[0];
                    total = (first === null || first === void 0 ? void 0 : first.total) || 0;
                    results = (first === null || first === void 0 ? void 0 : first.results) || [];
                }
                else if (Array.isArray(dbResult) && dbResult.length) {
                    total = ((_b = dbResult[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
                    results = ((_c = dbResult[0]) === null || _c === void 0 ? void 0 : _c.results) || [];
                }
            }
            // If no matches or no filters, fetch random data for 'other'
            if (!matchOr.length || results.length === 0) {
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
                        $project: {
                            _id: 1,
                            userId: 1,
                            "user.id": "$userDoc._id",
                            "user.firstname": "$userDoc.firstname",
                            "user.lastname": "$userDoc.lastname",
                            "user.email": "$userDoc.email",
                            "user.avatar": "$userDoc.avatar",
                            interestedRoles: 1,
                            skills: 1,
                            experienceLevel: 1,
                            workMode: 1,
                            jobType: 1,
                            industry: 1,
                            hasDisability: 1,
                            profileCompletion: 1,
                        },
                    },
                ];
                const randomResult = yield prisma.$runCommandRaw({
                    aggregate: "JobSeeker",
                    pipeline: randomPipeline,
                    cursor: {},
                });
                let randomResults = [];
                if (((_d = randomResult === null || randomResult === void 0 ? void 0 : randomResult.cursor) === null || _d === void 0 ? void 0 : _d.firstBatch) &&
                    randomResult.cursor.firstBatch.length) {
                    randomResults = randomResult.cursor.firstBatch;
                }
                else if (Array.isArray(randomResult) && randomResult.length) {
                    randomResults = randomResult;
                }
                // Transform random results to desired format without defaults
                const transformedOther = randomResults.map((item) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return ({
                        location: item.location || { city: null, country: null }, // Use existing data or null
                        experience: item.experience || [], // Use existing data or empty array
                        education: item.education || [], // Use existing data or empty array
                        certifications: item.certifications || [], // Use existing data or empty array
                        portfolio: item.portfolio || [], // Use existing data or empty array
                        id: ((_a = item._id) === null || _a === void 0 ? void 0 : _a.$oid) || null, // Convert to string ID or null
                        userId: ((_b = item.userId) === null || _b === void 0 ? void 0 : _b.$oid) || null, // Convert to string ID or null
                        bio: item.bio || null, // Use existing data or null
                        hasDisability: item.hasDisability || null,
                        interestedRoles: item.interestedRoles || [],
                        experienceLevel: item.experienceLevel || null,
                        workMode: item.workMode || null,
                        jobType: item.jobType || null,
                        skills: item.skills || [],
                        industry: item.industry || null,
                        resume: item.resume || null,
                        interests: item.interests || [],
                        profileCompletion: item.profileCompletion || null,
                        createdAt: item.createdAt || null,
                        updatedAt: item.updatedAt || null,
                        user: {
                            id: ((_d = (_c = item.user) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.$oid) || ((_e = item.userId) === null || _e === void 0 ? void 0 : _e.$oid) || null,
                            email: ((_f = item.user) === null || _f === void 0 ? void 0 : _f.email) || null,
                            lastname: ((_g = item.user) === null || _g === void 0 ? void 0 : _g.lastname) || null,
                            firstname: ((_h = item.user) === null || _h === void 0 ? void 0 : _h.firstname) || null,
                            avatar: ((_j = item.user) === null || _j === void 0 ? void 0 : _j.avatar) || null,
                        },
                    });
                });
                return {
                    page: Math.max(1, page),
                    limit: pageSize,
                    total: transformedOther.length,
                    other: transformedOther,
                };
            }
            // Transform matching results to desired format without defaults
            const transformedData = results.map((item) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return ({
                    location: item.location || { city: null, country: null }, // Use existing data or null
                    experience: item.experience || [], // Use existing data or empty array
                    education: item.education || [], // Use existing data or empty array
                    certifications: item.certifications || [], // Use existing data or empty array
                    portfolio: item.portfolio || [], // Use existing data or empty array
                    id: ((_a = item._id) === null || _a === void 0 ? void 0 : _a.$oid) || null, // Convert to string ID or null
                    userId: ((_b = item.userId) === null || _b === void 0 ? void 0 : _b.$oid) || null, // Convert to string ID or null
                    bio: item.bio || null, // Use existing data or null
                    hasDisability: item.hasDisability || null,
                    interestedRoles: item.interestedRoles || [],
                    experienceLevel: item.experienceLevel || null,
                    workMode: item.workMode || null,
                    jobType: item.jobType || null,
                    skills: item.skills || [],
                    industry: item.industry || null,
                    resume: item.resume || null,
                    interests: item.interests || [],
                    profileCompletion: item.profileCompletion || null,
                    createdAt: item.createdAt || null,
                    updatedAt: item.updatedAt || null,
                    user: {
                        id: ((_d = (_c = item.user) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.$oid) || ((_e = item.userId) === null || _e === void 0 ? void 0 : _e.$oid) || null,
                        email: ((_f = item.user) === null || _f === void 0 ? void 0 : _f.email) || null,
                        lastname: ((_g = item.user) === null || _g === void 0 ? void 0 : _g.lastname) || null,
                        firstname: ((_h = item.user) === null || _h === void 0 ? void 0 : _h.firstname) || null,
                        avatar: ((_j = item.user) === null || _j === void 0 ? void 0 : _j.avatar) || null,
                    },
                });
            });
            return {
                page: Math.max(1, page),
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
                data: transformedData,
            };
        });
    }
    static getFilter(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.findFirst({
                where: { userId },
            });
        });
    }
    static saveFilter(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyProfileId = filter.companyProfileId;
            if (!userId && !companyProfileId) {
                throw new Error("userId is required");
            }
            const companyProfile = yield prisma.companyProfile.findFirst({
                where: { userId },
            });
            if (companyProfile) {
                companyProfileId = companyProfile.id;
            }
            return yield prisma.filter.create({
                data: Object.assign(Object.assign({}, filter), { userId, companyProfileId: companyProfileId || undefined }),
            });
        });
    }
    static updateFilter(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.filter.update({
                where: { id },
                data: filter,
            });
        });
    }
}
exports.SearchJobSeekerService = SearchJobSeekerService;
