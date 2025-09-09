"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const teamMembership_controller_1 = require("./teamMembership.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multer_1 = require("../../middlewares/multer");
const router = (0, express_1.Router)();
router.get("/allUsers", controller_1.UserController.allUsers);
// router.use(authMiddleware);
router.get("/userDetails/:userId", authMiddleware_1.authMiddleware, controller_1.UserController.getCurrentUser);
router.get("/all", controller_1.UserController.getAllUsers);
router.patch("/updateUser/:userId", authMiddleware_1.authMiddleware, multer_1.singleupload, controller_1.UserController.updateUser);
router.delete("/deleteUser/:userId", authMiddleware_1.authMiddleware, controller_1.UserController.deleteUser);
// Team membership routes
router.get("/team-memberships", teamMembership_controller_1.TeamMembershipController.getUserTeamMemberships);
// Get all team members for a specific hiring team
router.get("/hiring-team/:hiringTeamId/members", teamMembership_controller_1.TeamMembershipController.getHiringTeamMembers);
// Add a user to a hiring team (user must exist)
router.post("/hiring-team/:hiringTeamId/members", teamMembership_controller_1.TeamMembershipController.addUserToTeam);
// Create a team member (by email - user doesn't need to exist yet)
router.post("/hiring-team/:hiringTeamId/members/create", teamMembership_controller_1.TeamMembershipController.createTeamMember);
// Remove a user from a hiring team
router.delete("/hiring-team/:hiringTeamId/members/:userId", teamMembership_controller_1.TeamMembershipController.removeUserFromTeam);
// Update team member role
router.patch("/hiring-team/:hiringTeamId/members/:userId/role", teamMembership_controller_1.TeamMembershipController.updateTeamMemberRole);
// Update team member access
router.patch("/hiring-team/:hiringTeamId/members/:userId/access", teamMembership_controller_1.TeamMembershipController.updateTeamMemberAccess);
// Remove team member access (disable without deleting)
router.patch("/hiring-team/:hiringTeamId/members/:userId/remove-access", teamMembership_controller_1.TeamMembershipController.removeTeamMemberAccess);
// Restore team member access
router.patch("/hiring-team/:hiringTeamId/members/:userId/restore-access", teamMembership_controller_1.TeamMembershipController.restoreTeamMemberAccess);
// Check if user is a member of a specific hiring team
router.get("/hiring-team/:hiringTeamId/membership", teamMembership_controller_1.TeamMembershipController.checkTeamMembership);
exports.default = router;
