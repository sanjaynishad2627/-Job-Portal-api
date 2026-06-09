import { Job } from '../model/job.model.js'

//admin post kareyga job
export const postJobs = async (req, res) => {
    try {
        const { title, description, requirement, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        if (!title || !description || !requirement || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirement: requirement.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        })
        return res.status(201).json({
            message: "New job created Successfully",
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//student ke liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }
        const jobs = await Job.find(query).populate({
            path: "company"                //company ki phle sirf id mil rhi thi populate ki  wajh se unse compnay ki id ko replace kar diya user ki sari info se
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "jobs not found",
                success: false
            })
        };
        return res.status(200).json({
            job: jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//studen ke liye
export const getAllJobsById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("applications");
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


//admin kitne job create kara hai abhi tk

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
              path:'company',
              createdAt:-1
        })                                                     //idhar hamne ye esliye diya hai taki pata lg paye ki admin ne kitne job create ki hai

        if (!jobs) {
            return res.status(404).json({
                message: "JOb not found",
                success: true
            })
        }
        return res.status(200).json({
            jobs, 
            success: true
        })

        
    } catch (error) {
        console.log(error)
    }
}


//admin update the jobs

export const updateJob = async(req,res)=>{
    try {
           const { title, description, requirement, salary, location, jobType, experience, position, companyId } = req.body;

           let updateJobData = {title, description, requirement, salary, location, jobType, experience, position } 

           const job = await Job.findByIdAndUpdate(req.params.id,updateJobData,{ returnDocument: 'after' })
           if (!job) {
             return res.status(404).json({
                message:"Job not found",
                success:false
             })
           }
           return res.status(200).json({
            message:"Job Information Updated",
            success:true
           })
    } catch (error) {
        console.log(error)
    }
}