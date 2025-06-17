const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
require("./Models/db");
const AuthRouter = require("./Routes/AuthRouter");
const UserRouter = require("./Routes/UserRouter");
const AdminRouter = require("./Routes/AdminRouter");
const CategoryRouter = require("./Routes/CategoryRouter");
const ProductRouter = require("./Routes/ProductRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://ecommerce-clothing-woad.vercel.app/products",
    credentials: true,
  })
);
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("hii");
});
app.use("/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api", [CategoryRouter, ProductRouter]);

app.listen(PORT, () => console.log(`listening to the port - ${PORT}`));