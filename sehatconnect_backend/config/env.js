import dotenv from "dotenv";
dotenv.config();

console.log("✅ ENV LOADED:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING",
});
