import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { routes } from "./routes";
import { errorHandler } from "./middlewares/error-handler";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerJSDocOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Purchases API Documentation",
      version: "1.0.0",
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(error, req, res, next);
});
