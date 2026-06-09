import mongoose from "mongoose";

export const db=async()=>{
    try {
        const data = await mongoose.connect(process.env.MONGO_URI)
        console.log("DataBase connected successfully")
    } catch (error) {
         console.log(error.message)
    }
}