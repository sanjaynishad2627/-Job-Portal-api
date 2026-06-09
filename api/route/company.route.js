import express from 'express'
import {isAuthenticated} from '../../middleware/isAuthenticated.js'
import { registerCompany ,getCompany,getCompanyById, updateCompany} from '../controllers/company.controller.js';
import { uploadPhoto } from '../../middleware/multer.js';


const router = express.Router()

router.post("/register",isAuthenticated,registerCompany)
router.get("/get",isAuthenticated,getCompany)
router.get('/get/:id',isAuthenticated,getCompanyById)
router.put('/update/:id',isAuthenticated, uploadPhoto.single('file') ,updateCompany)

export default router;  