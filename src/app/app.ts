import express, { Express } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "../middlewares/error.middlewares";
import AdminRouter from "../admin/routes/admin.routes";
import AuthRouter from "../auth/routes/auth.routes";
import CategoriesRouter from "../categories/routes/category.routes";
import PostsRouter from "../posts/routes/post.routes";
function app(): Express {
  const app: Express = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/admin", AdminRouter);
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/categories", CategoriesRouter);
  app.use("/api/v1/posts", PostsRouter);
  app.use(errorMiddleware);
  return app;
}

export default app;
