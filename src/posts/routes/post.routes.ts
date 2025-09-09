import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  checkSlugAvailabilityValidator,
  createPostValidator,
  deletePostByIdValidator,
  getPostByIdValidator,
  getUserPostByIdValidator,
  updatePostByIdValidator,
  updateSlugByPostIdValidator,
} from "../validators/post.validators";
import {
  checkSlugAvailability,
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  getUserPostById,
  updatePostById,
  updateSlugByPostId,
} from "../controllers/post.controllers";
import authCheck from "../../middlewares/auth.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
import { apiKeyLimiter, globalLimiter } from "../../utils/rateLimiter";
const router = Router();

router.route("/").get(globalLimiter, getAllPosts);
router
  .route("/:userId/:id")
  .get(validateReq(getUserPostByIdValidator), getUserPostById);

router.use(authCheck, apiKeyCheck, apiKeyLimiter);

router.route("/").post(validateReq(createPostValidator), createPost);

router
  .route("/slug")
  .get(validateReq(checkSlugAvailabilityValidator), checkSlugAvailability);

router
  .route("/slug/:id")
  .patch(validateReq(updateSlugByPostIdValidator), updateSlugByPostId);

router.route("/:id").get(validateReq(getPostByIdValidator), getPostById);

router.route("/:id").put(validateReq(updatePostByIdValidator), updatePostById);

router
  .route("/:id")
  .delete(validateReq(deletePostByIdValidator), deletePostById);

export default router;
