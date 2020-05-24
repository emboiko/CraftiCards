const express = require("express");
const QRcode = require("qrcode");
const mongoose = require("mongoose");
const RSVP = require("../models/RSVP");

const rsvpRouter = new express.Router();

rsvpRouter.post("/rsvp", async (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const qr = await QRcode.toDataURL(`localhost:3000/rsvp/${id}`);

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

rsvpRouter.get("/rsvp/:id", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).send();
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send();
    }
});

rsvpRouter.patch("/rsvp/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "location",
        "time",
        "date",
        "description",
        "title",
        "author_phone",
        "author_email",
        "author",
    ];

    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) return res.status(400).send({ error: "Invalid Updates" });

    try {
        const rsvp = await RSVP.findOne({ id: req.params.id });
        if (!rsvp) return res.status(404).send();

        updates.forEach((update) => rsvp[update] = req.body[update]);

        await rsvp.save();
        res.status(202).send(rsvp);
    } catch (err) {
        res.status(400).send(err)
    }

});

rsvpRouter.delete("/rsvp/:id", async (req, res) => {
    try {
        const rsvp = await RSVP.findOneAndDelete({ id: req.params.id });
        if (!rsvp) return res.status(404).send();

        res.send();
    } catch (err) {
        res.status(400).send(err);
    }
});

rsvpRouter.post("/rsvp/:id", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).send();

        if (req.body.accepted) {
            rsvp.num_guests += req.body.num_guests;
            rsvp.joined = rsvp.joined.concat({ party: req.body.party });
        }

        await rsvp.save();
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send();
    }
});

rsvpRouter.get("/rsvp/:id/qr", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id });
        if (!rsvp) return res.status(404).send();

        res.render("qr", { qr: rsvp.qr }); //res.send?
    } catch (err) {
        res.status(400).send();
    }
});

module.exports = rsvpRouter;
