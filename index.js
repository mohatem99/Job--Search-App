import express from "express";
import { config } from "dotenv";
import connectionDb from "./db/connectionDb.js";
import { globalResponse } from "./src/middlewares/errorHandling.middleware.js";

import authRoutes from "./src/modules/Auth/auth.routes.js";
import userRoutes from "./src/modules/User/user.routes.js";

import companyRoutes from "./src/modules/Company/company.routes.js";

import jobRoutes from "./src/modules/Job/job.routes.js";
import ApiError from "./src/utils/errorClass.utils.js";
config();
connectionDb();
const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/companies", companyRoutes);
app.use("/jobs", jobRoutes);

app.use("*", (req, res, next) => {
  return next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalResponse);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`server up and running on port${PORT}`);
});
