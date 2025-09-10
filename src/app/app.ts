import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "../middlewares/error.middlewares";
import AdminRouter from "../admin/routes/admin.routes";
import AuthRouter from "../auth/routes/auth.routes";
import CategoriesRouter from "../categories/routes/category.routes";
import PostsRouter from "../posts/routes/post.routes";
import HealthCheckRouter from "../healthCheck/routes/healthCheck.routes";
import ApiResponse from "../utils/ApiResponse";

function app(): Express {
  const app: Express = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Inkwell is a blog publishing platform where user posts must be approved by an admin before being published.`
        )
      );
  });

  app.use("/api/v1/admin", AdminRouter);
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/categories", CategoriesRouter);
  app.use("/api/v1/posts", PostsRouter);
  app.use("/api/v1/healthcheck", HealthCheckRouter);
  app.use(errorMiddleware);
  return app;
}

export default app;
