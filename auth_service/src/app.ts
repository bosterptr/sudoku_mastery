import "reflect-metadata";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import healthCheck from "./entry-points/healthCheck";
import authRoutes from "./entry-points/router";
import { handleError } from "./middleware/errors";
import morgan from "morgan";
import cors from "cors";
const app = express();

app
  .disable("etag")
  .use(morgan("combined"))
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials:true
    })
  )
  .use(helmet())
  .use(helmet.hidePoweredBy())
  .set("trust proxy", true)
  .use(express.json())
  .use(cookieParser(`${process.env.COOKIE_PARSER_SECRET}`))
  .use("/auth", authRoutes)
  .use(healthCheck)
  .use(handleError);

export default app;
