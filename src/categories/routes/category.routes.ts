import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  createCategoryValidator,
  deleteCategoryByIdValidator,
  getCategoryByIdValidator,
  updateCategoryByIdValidator,
} from "../validators/category.validators";
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category.controllers";
import authCheck from "../../middlewares/auth.middlewares";
import adminCheck from "../../middlewares/admin.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
import { apiKeyLimiter } from "../../utils/rateLimiter";

const router = Router();

router.use(authCheck, apiKeyCheck, apiKeyLimiter);
router.route("/").get(getAllCategories);

router
  .route("/:id")
  .get(validateReq(getCategoryByIdValidator), getCategoryById);

router.use(authCheck, adminCheck, apiKeyCheck, apiKeyLimiter);
router.route("/").post(validateReq(createCategoryValidator), createCategory);

router
  .route("/:id")
  .put(validateReq(updateCategoryByIdValidator), updateCategoryById);

router
  .route("/:id")
  .delete(validateReq(deleteCategoryByIdValidator), deleteCategoryById);

export default router;
