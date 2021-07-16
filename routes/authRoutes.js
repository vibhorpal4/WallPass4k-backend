import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", auth, forgotPassword);
router.put("/resetpassword/:resetToken", auth, resetPassword);
export default router;
