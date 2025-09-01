import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";

import authCheck from "../../middlewares/auth.middlewares";
import adminCheck from "../../middlewares/admin.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
import {
  approvePostByIdValidator,
  getPostReviewLogByPostIdValidator,
  rejectPostByIdValidator,
} from "../validators/admin.validators";
import {
  approvePostById,
  getAllPendingPosts,
  getAllPostReviewLogs,
  getPostReviewLogByPostId,
  rejectPostById,
} from "../controllers/admin.controllers";

const router = Router();
router.use(authCheck, adminCheck, apiKeyCheck);

router.route("/posts").get(getAllPendingPosts);

router
  .route("/posts/:id/approve")
  .put(validateReq(approvePostByIdValidator), approvePostById);

router
  .route("/posts/:id/reject")
  .put(validateReq(rejectPostByIdValidator), rejectPostById);

router.route("/posts/reviewlogs").get(getAllPostReviewLogs);

router
  .route("/posts/reviewlogs/:id")
  .get(
    validateReq(getPostReviewLogByPostIdValidator),
    getPostReviewLogByPostId
  );

export default router;
