import { Request, Response, NextFunction } from "express";
import { ZodType, ZodRawShape } from "zod";
import ApiError from "../utils/ApiError";
interface Schema {
  headers?: ZodType<any>;
  body?: ZodType<any>;
  cookies?: ZodType<any>;
  params?: ZodType<any>;
  query?: ZodType<any>;
}
const validateReq = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let errors: Record<string, string>[] = [];
    if (schema.headers) {
      const validate = schema.headers.safeParse(req.headers);
      if (validate.success) {
        (req as any).validatedHeaders = validate.data;
      } else {
        validate.error.issues.map((iss) => {
          errors.push({
            [iss.path.join(".")]: iss.message,
          });
        });
      }
    }
    if (schema.body) {
      const validate = schema.body.safeParse(req.body);
      if (validate.success) {
        req.body = validate.data;
      } else {
        validate.error.issues.map((iss) => {
          errors.push({
            [iss.path.join(".")]: iss.message,
          });
        });
      }
    }
    if (schema.cookies) {
      const validate = schema.cookies.safeParse(req.cookies);
      if (validate.success) {
        req.cookies = validate.data;
      } else {
        validate.error.issues.map((iss) => {
          errors.push({
            [iss.path.join(".")]: iss.message,
          });
        });
      }
    }
    if (schema.query) {
      const validate = schema.query.safeParse(req.query);
      if (validate.success) {
        (req as any).query = validate.data;
      } else {
        validate.error.issues.map((iss) => {
          errors.push({
            [iss.path.join(".")]: iss.message,
          });
        });
      }
    }
    if (errors.length > 0) {
      throw new ApiError(422, "Received invalid data.", errors);
    }
    return next();
  };
};
export default validateReq;
