const express = require("express");
const router = new express.Router();

app.post("/rsvp/:id", (req, res) => {
    //Create an RSVP event
    //Create a unique ID, store in DB
    //Create a QR code, encode URL for RSVP
});
app.get("/rsvp/:id", (req, res) => {
    //Get the RSVP event
    //Get RSVP details
    //Title
    //Description
    //Location, Date, Time
    //Get RSVPers
});
app.patch("/rsvp/:id", (req, res) => {
    //Edit RSVP details
});
app.delete("/rsvp/:id", (req, res) => {
    //Delete RSVP => Automatic after event date expires or nanually
});

app.post("/rsvp/:id/accept", () => {
    //Get the recipient's name / party name
    //Add users to list of accepted people
});
app.post("/rsvp/:id/decline", () => {
    //yadayada
});

module.exports = router;
