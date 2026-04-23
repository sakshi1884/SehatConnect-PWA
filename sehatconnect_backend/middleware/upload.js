import multer from "multer";

// Store files temporarily before uploading to cloudinary
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "sehatconnect/doctors/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

export default upload;
