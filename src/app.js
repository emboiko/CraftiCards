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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// } else {
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

removeExpiredRSVPs();

module.exports = app;