import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import ApiKey from "../models/apiKey.models";
interface DecodeKey extends JwtPayload {
  userId: string;
}

function getApiKeyFromHeader(req: Request): string | undefined {
  const header = req.headers["x-api-key"];
  if (!header) return;

  const headerValue = Array.isArray(header) ? header[0] : header;
  if (headerValue.startsWith("Bearer ")) {
    return headerValue.split(" ")[1];
  }
  return headerValue;
}

const apiKeyCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey: string =
      req.cookies.apiKey || getApiKeyFromHeader(req) || req.body.apiKey;

    if (!apiKey) {
      throw new ApiError(401, "Unauthorized - Invalid API Key");
    }

    let decoded: DecodeKey;
    try {
      decoded = jwt.verify(apiKey, env.APIKEY_TOKEN_SECRET) as DecodeKey;
    } catch {
      throw new ApiError(401, "Unauthorized - Invalid API Key");
    }
    const key = await ApiKey.findOne({
      key: apiKey,
      userId: decoded.userId,
      keyExpiry: { $gt: Date.now() },
    });

    if (!key) {
      throw new ApiError(401, "Unauthorized - Invalid API Key or expired");
    }
    if (key.useCount >= key.limit) {
      throw new ApiError(401, "Unauthorized - API Key reached its limit");
    }

    key.useCount = key.useCount + 1;
    key.lastUsed = Date.now();
    await key.save();

    next();
  }
);

export default apiKeyCheck;
