import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/userController.js";
import auth from "../middlewares/authMiddleware.js";
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.put("/update/:username", auth, upload.single("profile_pic"), updateUser);
router.delete("/delete/:username", auth, deleteUser);
router.get("/", auth, getUsers);
router.get("/:username", auth, getUser);

export default router;
