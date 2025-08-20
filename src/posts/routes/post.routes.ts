import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  createPostValidator,
  deletePostByIdValidator,
  getPostByIdValidator,
  getUserPostByIdValidator,
  updatePostByIdValidator,
} from "../validators/post.validators";
import {
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  getUserPostById,
  updatePostById,
} from "../controllers/post.controllers";
import authCheck from "../../middlewares/auth.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
const router = Router();
router.route("/").get(getAllPosts);
router
  .route("/:userId/:id")
  .get(validateReq(getUserPostByIdValidator), getUserPostById);
router.use(authCheck,apiKeyCheck);
router.route("/").post(validateReq(createPostValidator), createPost);

router.route("/:id").get(validateReq(getPostByIdValidator), getPostById);

router.route("/:id").put(validateReq(updatePostByIdValidator), updatePostById);

router
  .route("/:id")
  .delete(validateReq(deletePostByIdValidator), deletePostById);

export default router;
