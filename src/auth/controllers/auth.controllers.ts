import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { Request, Response, CookieOptions } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import env from "../../config/env.config";
import User from "../../models/user.models";
import ApiKey from "../../models/apiKey.models";
import { StringValue } from "ms";

const cookieOption = (maxAge: number): CookieOptions => {
  return {
    maxAge,
    httpOnly: true,
    secure: env.NODE_ENV !== "development",
    sameSite: "lax",
  };
};
const generateAccessAndRefreshToken = async (id: Schema.Types.ObjectId) => {
  const user = await User.findById(id);
  const accessToken = user?.generateAccessToken();
  const refreshToken = user?.generateRefreshToken();
  return { accessToken, refreshToken };
};
const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(409, "A user with this email already exists.");
  }
  const newUser = await User.create({ name, email, password });

  res
    .status(201)
    .json(new ApiResponse(201, "User register successfully", newUser));
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashToken,
    verificationExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(410, "Invalid verification token or expired.");
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpiry = undefined;
  await user.save();
  res.status(200).json(new ApiResponse(200, "Email Verified"));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid credentials.");
  }
  if (!user.isVerified) {
    throw new ApiError(400, "Please verify email first before login.");
  }
  const accessToken = user?.generateAccessToken();
  const refreshToken = user?.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  res
    .cookie("accessToken", accessToken, cookieOption(24 * 60 * 60 * 1000))
    .cookie(
      "refreshToken",
      refreshToken,
      cookieOption(10 * 24 * 60 * 60 * 1000)
    )
    .json(
      new ApiResponse(200, "Login Successfully", {
        user,
        accessToken,
        refreshToken,
      })
    );
});

const createApiKey = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const key = jwt.sign({ userId }, env.APIKEY_TOKEN_SECRET, {
    expiresIn: env.APIKEY_TOKEN_EXPIRY as StringValue,
  });
  const newApiKey = await ApiKey.create({
    userId,
    name: "My New Api Key",
    key,
    keyExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
  res
    .status(201)
    .json(new ApiResponse(201, "New Api Key Generated.", newApiKey));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const decode = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as {
    id: string;
  };

  if (!decode) {
    throw new ApiError(401, "Unauthorized - Invalid refresh token.");
  }

  const user = await User.findById(decode.id);

  if (!user) {
    throw new ApiError(401, "Unauthorized - Invalid refresh token.");
  }
  if (
    user.refreshToken !== refreshToken ||
    !user.refreshTokenExpiry ||
    user.refreshTokenExpiry.getTime() < Date.now()
  ) {
    throw new ApiError(401, "Unauthorized - Invalid or expired refresh token");
  }
  const newAccessToken = user?.generateAccessToken();
  const newRefreshToken = user?.generateRefreshToken();
  user.refreshToken = newRefreshToken;
  user.refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  await user.save();
  res
    .cookie("accessToken", newAccessToken, cookieOption(24 * 60 * 60 * 1000))
    .cookie(
      "refreshToken",
      newRefreshToken,
      cookieOption(10 * 24 * 60 * 60 * 1000)
    )
    .json(
      new ApiResponse(200, "Access Token Generated Successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
    );
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json(new ApiResponse(200, "User details fetched.", user));
});

export {
  register,
  verifyEmail,
  login,
  createApiKey,
  refreshAccessToken,
  getMe,
};
