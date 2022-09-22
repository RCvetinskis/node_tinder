const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routes/mainRouter");
const http = require("http").createServer(app);
const session = require("express-session");
require("dotenv").config();
require("./modules/sockets")(http);

mongoose
  .connect(process.env.MONGO_KEY)
  .then((res) => {
    console.log("CONNECTED");
  })
  .catch((e) => {
    console.log("ERROR");
  });

http.listen(4000);
app.use(express.json());

// session
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET, POST",
  })
);

app.use(
  session({
    secret: "dasd23e2edasd",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", mainRouter);
