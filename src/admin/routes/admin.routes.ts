import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";

import authCheck from "../../middlewares/auth.middlewares";
import adminCheck from "../../middlewares/admin.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
import {
  approvePostByIdValidator,
  rejectPostByIdValidator,
} from "../validators/admin.validators";
import {
  approvePostById,
  getAllPendingPosts,
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

export default router;
