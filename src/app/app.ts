import express, { Express } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "../middlewares/error.middlewares";

function app(): Express {
  const app: Express = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.json({
      headers: req.headers,
      cookies: req.cookies,
    });
  });

  app.use(errorMiddleware);
  return app;
}

export default app;
