import express from 'express'
import path from 'path'
import { getSavedJobs, login, logout, register, saveJob, unsaveJob, updateProfile,sendOtp,verifyOtp,resetPassword } from '../controllers/user.controller.js'
import { isAuthenticated } from '../../middleware/isAuthenticated.js'
import { uploadPhoto,uploadResume } from '../../middleware/multer.js'

const router = express.Router()

router.post('/register',uploadPhoto.single('profilePhoto'),register)
router.post('/login',login)
router.post('/profile/update',isAuthenticated,uploadResume.single('resume'), updateProfile)
router.get('/logout',logout)

///save jobs

router.post("/save-job/:id", isAuthenticated, saveJob);
router.delete("/unsave-job/:id", isAuthenticated, unsaveJob);
router.get("/saved-jobs", isAuthenticated, getSavedJobs);


//forget password
router.post('/sendotp',sendOtp);
router.post('/verifyotp',verifyOtp);
router.post('/resetpassword',resetPassword);


export default router;