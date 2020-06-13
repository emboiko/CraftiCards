const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const rsvpRouter = require("./routes/rsvpRouter");
const userRouter = require("./routes/userRouter");
const removeExpiredRSVPs = require("./utils/expire");
require("./db/mongoose");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(rsvpRouter);
app.use(userRouter);
app.set("view engine", "ejs");

removeExpiredRSVPs();

module.exports = app;