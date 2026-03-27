import express from "express";
import router from "./routes/agent.routes";

import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/agent", router);

app.use(errorHandler);