import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import Routes
import UserRouter from "./routes/user.routes.js";
import ProductRouter from "./routes/product.routes.js";
import AdminRouter from "./routes/admin.routes.js";
import OrderRouter from "./routes/admin.routes.js";
import CartRouter from "./routes/cart.routes.js";

// Routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/order", OrderRouter);
app.use("/api/v1/cart", CartRouter);

export { app };
