import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import User from "../models/user.models";

const authCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    interface Decode extends JwtPayload {
      id: string;
      role: string;
    }
    interface User {
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
    }
    const accessToken: string =
      req.cookies.accessToken ||
      req.headers.authorization?.split(" ")[1] ||
      req.body.accessToken;
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized - Invalid access token.");
    }
    const decode = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as Decode;
    if (!decode) {
      throw new ApiError(401, "Unauthorized - Invalid access token.");
    }
    const user = await User.findById(decode.id).select(
      "-password -verificationToken -refreshToken -resetPasswordToken -verificationExpiry -refreshTokenExpiry -resetPasswordExpiry"
    );
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    req.user = user;
    next();
  }
);

export default authCheck;
