import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  createApiKey,
  getMe,
  login,
  refreshAccessToken,
  register,
  verifyEmail,
} from "../controllers/auth.controllers";
import {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
} from "../validators/auth.validators";
import authCheck from "../../middlewares/auth.middlewares";
import apiKeyCheck from "../../middlewares/apiKey.middlewares";
import { apiKeyLimiter, loginLimiter } from "../../utils/rateLimiter";
const router = Router();

router.route("/register").post(validateReq(registerValidator), register);

router
  .route("/verify-email/:token")
  .get(validateReq(verifyEmailValidator), verifyEmail);
router.route("/login").post(loginLimiter, validateReq(loginValidator), login);

router.route("/api-key").get(authCheck, createApiKey);

router.route("/refresh-token").get(refreshAccessToken);

router.use(authCheck, apiKeyCheck, apiKeyLimiter);

router.route("/me").get(getMe);

export default router;
