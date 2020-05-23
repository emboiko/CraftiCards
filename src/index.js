const express = require("express");
const helmet = require("helmet");
const rsvpRouter = require("./routes/router");
require("./db/mongoose");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(rsvpRouter);

app.get("/", (req, res) => {
    res.json({
        "RSVme": "E.Boiko & R.Johnson"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// QR
// Authentication / middleware
// Sample Front-end
// Landing Page / Dev Page / Documentation
