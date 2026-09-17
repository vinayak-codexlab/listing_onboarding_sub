import express from "express";
import morgan from "morgan";
import routes from "./routes/routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./swagger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

setupSwagger(app);
routes(app);
app.use(errorHandler);

export default app;

