import express from "express";
import upload from "../middleware/upload.js";
import { 
  uploadDoctorPhoto, 
  uploadHealthworkerPhoto,
  uploadPatientPhoto 
 
} from "../controllers/uploadController.js";
// uploadPatientPhoto 
const router = express.Router();

// Upload routes (use param :id for profile)
router.post("/doctor/:id", upload.single("photo"), uploadDoctorPhoto);
router.post("/healthworker/:id", upload.single("photo"), uploadHealthworkerPhoto);
router.post("/patient/:id", upload.single("photo"), uploadPatientPhoto);

export default router;
