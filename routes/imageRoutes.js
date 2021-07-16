import express from "express";
import multer from "multer";
import auth from "../middlewares/authMiddleware.js";
import {
  uploadImage,
  deleteImage,
  getImage,
  getImages,
  updateImage,
} from "../controllers/imageController.js";
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/upload", auth, upload.single("image"), uploadImage);
router.delete("/delete/:slug", auth, deleteImage);
router.get("/:slug", getImage);
router.get("/", getImages);
router.put("/update/:slug", auth, upload.single("image"), updateImage);

export default router;
