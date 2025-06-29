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
const WishlistRouter = require("./Routes/WishlistRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: [
      "http://localhost:5173",
      "https://ecommerce-clothing-5ysl-iv277p28l-meghaofficials-projects.vercel.app",
      "https://ecommerce-clothing-5ysl-7z8xhighp-meghaofficials-projects.vercel.app",
      "https://ecommerce-clothing-lbp1g66q8-meghaofficials-projects.vercel.app",
    ],
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
app.use("/api", [CategoryRouter, ProductRouter, WishlistRouter]);

app.listen(PORT, () => console.log(`listening to the port - ${PORT}`));
