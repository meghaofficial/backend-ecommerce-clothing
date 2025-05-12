const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
require("./Models/db");
const AuthRouter = require("./Routes/AuthRouter");

const app = express();
const PORT = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("hii");
});
app.use("/auth", AuthRouter);

app.listen(PORT, () => console.log(`listening to the port - ${PORT}`));