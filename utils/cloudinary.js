import cloudinaryPkg from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const cloudinary = cloudinaryPkg.v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_SECRET
})

export default cloudinary;