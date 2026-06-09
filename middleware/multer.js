import multer from "multer";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";


// PHOTO → CLOUDINARY
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Job-portal/photos",
    allowed_formats: ["jpg", "jpeg", "png","webp"],
  },
});

export const uploadPhoto = multer({ storage: imageStorage });


// RESUME → LOCAL STORAGE
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadResume = multer({
  storage: resumeStorage,

  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});