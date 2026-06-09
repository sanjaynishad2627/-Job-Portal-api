
import { Application } from '../model/application.model.js'
import { Job } from '../model/job.model.js'

//user kitni apply kar chuka hai jobs
export const applyJob = async(req, res) => {
    try {
        // const { job, applicant } = req.body;
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "job id is required",
                success: false
            })
        }

        const existingApplication = await Application.findOne({
            job:jobId,
             applicant: userId
        })
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }

        //if the job exist 
        const cuurrentJob = await Job.findById(jobId)
        if (!cuurrentJob) {
            return res.status(404).json({
                message: "job not found",
                success: false
            })
        }

        //create a new application

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            
        })

//cuurrentJob.applications.push(newApplication._id) ka matlab hai:
// job document ke andar applications naam ka array field pehle se hai.
// Us array me newApplication._id add kiya ja raha hai.

        cuurrentJob.applications.push(newApplication._id);    
        await cuurrentJob.save()

        return res.status(201).json({
            message: "Job applied Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


//esme user ne kitni jobs par applied kiya hua hai
export const getAppliedJobs=async(req,res)=>{
    try {
         const userId = req.id;
          const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            option:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                option:{sort:{createdAt:-1}},
            }
          });

          if (!application) {
            return res.status(404).json({
                message:"no applicantion",
                success:false
            })
          }
       return res.status(200).json({
        application,
        success:true
       })
    } catch (error) {
        console.log(error)
    }
}

//admin dekheyga kitne user ne apply kiya hua hai job ke liye
export const getApplicant=async(req,res)=>{
 try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path:"applications",
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
    })

    if (!job) {
        return res.status(404).json({
            message:"job not found",
            success:false
        })
    }
    return res.status(200).json({
        job,
        success:true
    })
 } catch (error) {
  console.log(error)  
 }
}


//user ke liye but ye admin decide kareyga
export const updateStatus = async(req,res)=>{
try {
    const {status} = req.body;
    const applicantionId = req.params.id;  //mongo db ke aplication id se hum decide kareyge ki kya change krna hai
    if (!status) {
        return res.status(400).json({
            message:"status is required",
            success:false
        })
    }
    
    //find the application by applicantion id
    const application = await Application.findOne({_id:applicantionId})

    if(!application)
   return res.status(404).json({
message:"Application not found",
    success:false
})

//update the status
    application.status=status.toLowerCase();
    await application.save()

    return res.status(200).json({
        success:true,
        message:"status updated Successfully"
    })
} catch (error) {
    console.log(error)
}
}