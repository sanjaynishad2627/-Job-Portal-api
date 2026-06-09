import { Company } from '../model/company.model.js'

export const registerCompany = async (req, res, next) => {
    try {
        const { name, description } = req.body
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            })
        }

        const company = await Company.findOne({ name })
        if (company) {
            return res.status(400).json({
                message: "You can't register same company",
                success: false
            })
        }
        const createcompany = await Company.create({
            name,
            // description,
            userId: req.id
        })
        return res.status(201).json({
            message: "Company created Successfully",
            company: createcompany,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


//get Company

export const getCompany = async (req, res, next) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId })
        if (!companies) {
            return res.status(404).json({
                message: "companies not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Your companies",
            companies,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}


//get company by id

export const getCompanyById = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateCompany = async (req, res, next) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file

        if (!name || !description || !website || !location) {
            return res.status(400).json({
                message: "Something is missing"
            })
        }
        //idhar cloudinary ka setup hoga
        

       

        let updateData = { name, description, website, location }
         if (file) {
            updateData.logo = file.path
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Company information updated",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}