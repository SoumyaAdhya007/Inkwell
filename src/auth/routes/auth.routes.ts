import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  createApiKey,
  getMe,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controllers";
import {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
} from "../validators/auth.validators";
import authCheck from "../../middlewares/auth.middlewares";
const router = Router();

router.route("/register").post(validateReq(registerValidator), register);

router
  .route("/verify-email/:token")
  .get(validateReq(verifyEmailValidator), verifyEmail);
router.route("/login").post(validateReq(loginValidator), login);

router.route("/api-key").get(authCheck, createApiKey);

router.route("/me").get(authCheck, getMe);

export default router;
