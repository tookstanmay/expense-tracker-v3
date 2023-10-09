import express from 'express'
import { createCategoryController, deleteCategoryController } from '../controllers/categoryController.js'

const router = express.Router()
router.post('/createCategory', createCategoryController)

router.post('/deleteCategory', deleteCategoryController)
export default router