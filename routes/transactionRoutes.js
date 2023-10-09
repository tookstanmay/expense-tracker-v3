import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController";

const router = express.Router();

router.post("/createTransaction", createCategoryController);

router.post("/deleteTransaction", deleteCategoryController);

export default router;
