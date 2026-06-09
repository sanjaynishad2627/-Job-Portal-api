import express from 'express'
import {isAuthenticated} from '../../middleware/isAuthenticated.js'
import { getAllJobs, postJobs,getAdminJobs ,getAllJobsById,updateJob} from '../controllers/job.controller.js'

const router =  express.Router()


router.post("/post",isAuthenticated,postJobs)
router.get("/get",isAuthenticated,getAllJobs)
router.get("/getAdminJobs",isAuthenticated,getAdminJobs)
router.get("/get/:id",isAuthenticated,getAllJobsById)
router.get('/update/:id',isAuthenticated,updateJob)

export default router;