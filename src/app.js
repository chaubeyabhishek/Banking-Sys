const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const accountRouter = require("./routes/accountroute");


app.use("/api/accounts",accountRouter);
app.use("/api/auth",authRouter);

module.exports = app;