import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategory,
  getCategories,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", auth, createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategory);
router.delete("/delete/:slug", auth, deleteCategory);

export default router;
