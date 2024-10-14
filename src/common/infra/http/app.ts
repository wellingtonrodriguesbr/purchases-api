import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { routes } from "./routes";
import { errorHandler } from "./middlewares/error-handler";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(error, req, res, next);
});
