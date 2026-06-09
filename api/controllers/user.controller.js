import { User } from '../model/user.model.js'
import { gentoken } from '../../utils/gen.token.js'
import getDataUri from '../../utils/datauri.js';
import cloudinary from '../../utils/cloudinary.js'
import { sendOtpMail, sendRegistrationEmail } from '../../email/emailservice.js';

export const register = async (req, res, next) => {
    try {
        const { fullName, email, password, role, phoneNumber } = req.body;

        let profilePhoto = "";

        if (req.file) {
            profilePhoto = req.file.path;
        }
        if (!fullName || !email || !password || !role || !phoneNumber) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        };

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User Already exist"
            })
        }

        const createUser = await User.create({
            fullName, email, password, role, phoneNumber, profile: {
                profilePhoto
            }
        })

        await sendRegistrationEmail(createUser.email,createUser.fullName)
        return res.status(201).json({
            message: "Register Successfully",
            success: true,
            data:createUser
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        };

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        //check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            })
        }
        const auhttoken = await gentoken(user._id)
        return res.cookie("token", auhttoken, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        }).status(200).json({
            message: `Welcome back ${user.fullName}`,
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
                savedJobs:user.savedJobs
            },
            success: true,
            user
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.clearCookie("token").json({
            message: "Logout Successfully",
            success: true
        })
    } catch (error) {
        console.log(error.message)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const userId = req.id;

        console.log(req.file)
         let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // const profilePhoto = req.file?.path;
        // if (file) {
        //     user.profile.profilePhoto = file.path;
        // }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",")
        }
        

        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray


if (file) {
  user.profile.resume = `http://localhost:8000/uploads/resumes/${file.filename}`;

  user.profile.resumeOriginalName = file.originalname;
}


        await user.save()

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        })
    } catch (error) {
        console.log(error.message)
    }
}


///save wale ki liye api



//save Job
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const user = await User.findById(userId);

        if (!user.savedJobs.includes(jobId)) {
            user.savedJobs.push(jobId);
            await user.save();
        }

        return res.status(200).json({
            message: "Job saved successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//unsaveJob 
export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const user = await User.findById(userId);

        user.savedJobs = user.savedJobs.filter(
            (id) => id.toString() !== jobId
        );

        await user.save();

        return res.status(200).json({
            message: "Job removed from saved",
            success: true
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//getSaved Jobs

export const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.id).populate({
            path:'savedJobs',
            populate:{
                path:'company'
            }
        });

        return res.status(200).json({
            savedJobs: user.savedJobs,
            success: true,
            message:"Fetching success"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//forget password



export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerifed = false;

    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({
      message: "Otp send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(404).json({
        message: "Invalid OTP",
      });
    }
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    ((user.otpExpires = undefined), await user.save());
    return res.status(200).json({
      message: "Opt verified Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `verified otp error ${error}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerifed) {
      return res.status(404).json({
        message: "OTP is verification is required",
      });
    }
    console.log(email, password, "reset");

    user.password = password;
    user.isOtpVerifed = false;

    await user.save();
    return res.status(200).json({
      message: "Reset Password Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `reset Password error ${error}`,
    });
  }
};
