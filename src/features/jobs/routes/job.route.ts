import { Router } from 'express';
import { JobPostingController } from '../controllers/jobController';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { singleupload } from '../../../middlewares/multer';
import { JobSeekerController } from '../controllers/fetchJobs';

const jobsRoutes = Router();
const controller = new JobPostingController();
const jobSeekerController= new JobSeekerController();

jobsRoutes.post('/postJob',authMiddleware, singleupload, controller.createJobPosting);
jobsRoutes.get('/alljobs',authMiddleware, controller.getJobPostings);
jobsRoutes.get('/seekersjobs', jobSeekerController.getAllJobs);
jobsRoutes.patch('/update/:id', authMiddleware,singleupload, controller.updateJobPosting);
jobsRoutes.delete('/delete/:id', authMiddleware,singleupload, controller.deleteJobPosting);

export default jobsRoutes;