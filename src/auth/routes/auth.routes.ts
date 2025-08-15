import { Router } from "express";
import validateReq from "../../middlewares/validationRequest.middlewares";
import {
  createApiKey,
  getMe,
  login,
  register,
} from "../controllers/auth.controllers";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validators";
const router = Router();

router.route("/register").post(validateReq(registerValidator), register);

router.route("/login").post(validateReq(loginValidator), login);

router.route("/api-key").post(createApiKey);

router.route("/me").get(getMe);

export default router;
