const express = require("express");
const QRcode = require("qrcode");
const RSVP = require("../models/RSVP");
const mongoose = require("mongoose");

const rsvpRouter = new express.Router();

rsvpRouter.post("/rsvp", async (req, res) => {
    let id = new mongoose.Types.ObjectId();

    let qr;
    try {
        qr = await QRcode.toDataURL(`localhost:3000/rsvp/${id}`);
    } catch (err) {
        console.log(err);
    }

    const rsvp = new RSVP({
        ...req.body,
        qr,
        id
    });

    try {
        await rsvp.save();
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send(err);
    }
});

rsvpRouter.post("/rsvp/:id", (req, res) => {
    //Not sure yet. This route might go away.
    //Might use this for accept/decline, and remove bottom two routes.
});

rsvpRouter.get("/rsvp/:id", (req, res) => {
    //View RSVP
});
rsvpRouter.patch("/rsvp/:id", (req, res) => {
    //Edit RSVP
});
rsvpRouter.delete("/rsvp/:id", (req, res) => {
    //Delete RSVP => Automatic after event date expires or nanually
});

rsvpRouter.get("/rsvp/:id/qr", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id });

        // res.set("Content-Type", "image/png");
        // res.send(rsvp.qr);

        res.render("qr", { qr: rsvp.qr });
    } catch (err) {
        console.log(err);
    }
});

rsvpRouter.post("/rsvp/:id/accept", () => {
    //Get the recipient's name / party name
    //Add users to list of accepted people
});
rsvpRouter.post("/rsvp/:id/decline", () => {
    //yadayada
});

module.exports = rsvpRouter;
