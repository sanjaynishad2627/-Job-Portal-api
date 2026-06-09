import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "recruiter"],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: { type: [String] },
        resume: { type: String },
        resumeOriginalName: { type: String },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        profilePhoto: {
            type: String,
            default: ""
        }
    },

    //save job icon ke  liye
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }
    ],

 //for Password Reset
    resetOtp:{
        type:String,
    },
    otpExpires:{
        type:Date
    },
    isOtpVerifed:{
        type:Boolean,
        default:false
    }


}, { timestamps: true })



userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", userSchema)



