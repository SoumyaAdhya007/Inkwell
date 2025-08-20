import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { userRolesEnum } from "../utils/constants";

const adminCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user.role !== userRolesEnum.admin) {
      throw new ApiError(
        403,
        "Forbidden - You do not have permission to access this resource."
      );
    }
    next();
  }
);

export default adminCheck;
