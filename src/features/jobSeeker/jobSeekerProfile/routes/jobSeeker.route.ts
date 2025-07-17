import express from "express";
import { DeleteJobSeekerController } from "../controllers/deleteJobSeeker";
import { QueryJobSeekerController } from "../controllers/queryJobSeeker";
import { UpdateJobSeekerController } from "../controllers/updateJobSeeker";
import { authMiddleware } from "../../../../middlewares/authMiddleware";

import { GetJobSeekerController } from "../controllers/getJobSeeker";
import { CreateJobSeekerController } from "../controllers/createJobSeeker";
import { singleupload } from "../../../../middlewares/multer";

const router = express.Router();

router.post(
  "/create/:userId",
  authMiddleware,
  singleupload,
  CreateJobSeekerController.create
);

router.get(
  "/profile/:id",
  authMiddleware,
  GetJobSeekerController.getSeekerById
);

router.get(
  "/user/:userId",
  authMiddleware,
  GetJobSeekerController.getSeekerByUSerId
);

router.patch(
  "/profile/:id",
  singleupload,
  authMiddleware,
  UpdateJobSeekerController.updateSeeker
);

router.delete(
  "/profile/:id",
  authMiddleware,
  DeleteJobSeekerController.deleteSeeker
);

router.get("/search", QueryJobSeekerController.querySeeker);

export default router;
