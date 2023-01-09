import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

import dotenv from "dotenv";

dotenv.config();

import { TNODE_ENV } from "./constants/_.loader";
import {
  getCorsMiddleware,
  getHelmetMiddleware,
} from "./middlewares/guards/_.exporter";

export default class App {
  app: express.Application;
  isAppConnectStatus = false;

  constructor(MODE: TNODE_ENV, PORT: number, CorsAllowed: string[]) {
    this.app = express();

    this.setMiddleware(MODE, CorsAllowed);
    this.setRouter();
    this.runServer(MODE, PORT);
  }

  public setMiddleware(MODE: TNODE_ENV, CorsAllowed: string[]) {
    if (MODE === "dev") {
      this.app;
      this.app.use(morgan("dev"));
    } else if ((MODE = "prod")) {
      this.app.use(morgan("combined"));
    }

    this.app.use((req, res, next) => {
      if (this.isAppConnectStatus) {
        res.set("Connection", "close");
      }

      next();
    });

    this.app.use(getCorsMiddleware(CorsAllowed));
    this.app.use(getHelmetMiddleware());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compression());
  }

  public setRouter() {}

  public runServer(MODE: TNODE_ENV, PORT: number) {
    const appServer = this.app.listen(PORT, () => {
      if (MODE !== "test") {
        console.log(`Server is running on ${PORT} With ${MODE}`);
        if (MODE === "prod") {
          if (process.send) {
            process.send("ready");
          }
        }
      }
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal");
      this.isAppConnectStatus = true;

      appServer.close((err) => {
        console.log(`Server is shutdown from ${PORT}`);
        process.exit(err ? 1 : 0);
      });
    });
  }
}

// const app = express();
// const port = process.env.PORT;

// app.use(
//   cors({
//     origin: "*",
//     methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//   })
// );
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: false,
//   })
// );
// app.use(compression());
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.listen(port, () => {
//     console.log(`Listening on Port ${port}`)
// });
