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

const router = Router();

router.route("/").get(authCheck, apiKeyCheck, getAllCategories);

router
  .route("/:id")
  .get(
    authCheck,
    apiKeyCheck,
    validateReq(getCategoryByIdValidator),
    getCategoryById
  );

router.use(authCheck, adminCheck, apiKeyCheck);
router.route("/").post(validateReq(createCategoryValidator), createCategory);

router
  .route("/:id")
  .put(validateReq(updateCategoryByIdValidator), updateCategoryById);

router
  .route("/:id")
  .delete(validateReq(deleteCategoryByIdValidator), deleteCategoryById);

export default router;
