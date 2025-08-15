import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (reqHandler: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(reqHandler(req, res, next)).catch((error) => next(error));
};

export default asyncHandler;
