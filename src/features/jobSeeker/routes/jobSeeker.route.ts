import express from "express";
import { DeleteobSeekerController } from "../controllers/deleteJobSeeker";
import { QueryJobSeekerController } from "../controllers/queryJobSeeker";
import { UpdateJobSeekerController } from "../controllers/updateJobSeeker";
import { authMiddleware } from "../../../middlewares/authMiddleware";

import { GetJobSeekerController } from "../controllers/getJobSeeker";
import { CreateJobSeekerController } from "../controllers/createJobSeeker";

const router = express.Router();

router.post("/:userid", authMiddleware, CreateJobSeekerController.create);

router.get("/:id", authMiddleware, GetJobSeekerController.getSeekerById);

router.get(
  "/user/:userid",
  authMiddleware,
  GetJobSeekerController.getSeekerByUSerId
);

router.patch("/:id", authMiddleware, UpdateJobSeekerController.updateSeeker);

router.delete(
  "/:userid",
  authMiddleware,
  DeleteobSeekerController.deleteSeeker
);

router.post("/search", QueryJobSeekerController.querySeeker);

export default router;
