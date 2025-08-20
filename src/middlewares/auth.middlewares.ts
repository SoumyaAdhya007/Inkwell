import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import User from "../models/user.models";
import { decodedUser } from "../types/express";
interface DecodeToken extends JwtPayload {
  id: string;
  role: string;
}
const authCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string =
      req.cookies.accessToken ||
      req.headers.authorization?.split(" ")[1] ||
      req.body.accessToken;
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized - Invalid access token.");
    }

    let decoded: DecodeToken;
    try {
      decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as DecodeToken;
    } catch {
      throw new ApiError(401, "Unauthorized - Invalid API Key");
    }
  
    const user = await User.findById(decoded.id).select(
      "-password -verificationToken -refreshToken -resetPasswordToken -verificationExpiry -refreshTokenExpiry -resetPasswordExpiry"
    );
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    req.user = user as decodedUser;
    next();
  }
);

export default authCheck;
