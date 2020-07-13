const express = require("express");
const QRcode = require("qrcode");
const mongoose = require("mongoose");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const RSVP = require("../models/RSVP");
const { acceptEmail } = require("../email/email");

const rsvpRouter = new express.Router();

rsvpRouter.post("/rsvp", auth, upload.single("img"), async (req, res) => {
  const id = new mongoose.Types.ObjectId();
  const qr = await QRcode.toDataURL(`${process.env.URL}/rsvp/${id}`);

  let buffer;
  if (req.file) {
    buffer = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();
  }

  req.body.date = new Date(req.body.date);
  req.body.rsvp_by = new Date(req.body.rsvp_by);

  const rsvp = new RSVP({
    ...req.body,
    qr,
    id,
    owner: req.user._id,
    img: buffer
  });

  try {
    await rsvp.save();
    res.status(201).send(rsvp);
  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};

      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      return res.send(errors);
    }
    res.status(500).send("Server Error");
  }
});

rsvpRouter.get("/rsvp/:id", async (req, res) => {
  const rsvp = await RSVP.findOne({ id: req.params.id });
  if (!rsvp) return res.status(404).json({ message: "Not Found" });
  res.status(200).json(rsvp);
});

rsvpRouter.get("/rsvp/:id/qr", async (req, res) => {
  const rsvp = await RSVP.findOne({ id: req.params.id })
  if (!rsvp) return res.status(404).json({ message: "Not Found" });
  res.status(200).json({ qr: rsvp.qr });
});

rsvpRouter.get("/rsvp/:id/img", async (req, res) => {
  const rsvp = await RSVP.findOne({ id: req.params.id })
  if (!rsvp) return res.status(404).json({ message: "Not Found" });
  res.set("Content-Type", "image/png");
  res.status(200).send(rsvp.img);
});

rsvpRouter.patch("/rsvp/:id", auth, upload.single("img"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "author",
    "author_email",
    "author_phone",
    "title",
    "description",
    "location",
    "date",
    "rsvp_by",
    "time",
    "end_time",
    "img",
    "pin",
  ];

  const rsvp = await RSVP.findOne({ id: req.params.id, owner: req.user._id });
  if (!rsvp) return res.status(404).json({ message: "Not Found" });

  const valid = updates.every((update) => allowedUpdates.includes(update));
  if (!valid) return res.status(400).json({ message: "Invalid Updates" });

  try {
    updates.forEach((update) => rsvp[update] = req.body[update]);

    if (req.img) {
      const buffer = await sharp(req.img.buffer)
        .resize({ width: 500, height: 500 })
        .png()
        .toBuffer();

      rsvp.img = buffer;
    }

    await rsvp.save();
    res.status(200).json(rsvp);
  } catch (err) {
    res.status(500).send("Server Error");
  }

});

rsvpRouter.delete("/rsvp/:id", auth, async (req, res) => {
  const rsvp = await RSVP.findOneAndDelete({
    id: req.params.id,
    owner: req.user._id
  });
  if (!rsvp) return res.status(404).json({ message: "Not Found" });
  res.status(200).send();
});

rsvpRouter.get("/rsvps", auth, async (req, res) => {
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "rsvps",
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();

    res.status(200).json({ rsvps: req.user.rsvps });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

rsvpRouter.post("/rsvp/:id", async (req, res) => {
  try {
    const rsvp = await RSVP.findOne({ id: req.params.id });
    if (!rsvp) return res.status(404).json({ message: "Not Found" });

    let error;
    let invalidPin;

    if (rsvp.pin) {
      invalidPin = rsvp.pin !== req.body.pin.toUpperCase();
      if (invalidPin) error = "Invalid PIN";
    } else {
      invalidPin = false;
    }

    const invalidEmail = rsvp.joined.some((party) => party.email === req.body.email);
    if (invalidEmail) error = "Invalid Email";

    const today = new Date(Date.now());
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    let invalidDate = today > rsvp.rsvp_by;
    if (invalidDate) error = "RSVP By Date has already passed."

    if (invalidPin || invalidEmail || invalidDate) {
      return res.status(400).json({ error });
    }

    if (req.body.accepted === "Accept") {
      rsvp.num_guests += parseInt(req.body.party_size);
      rsvp.joined = rsvp.joined.concat({
        party: req.body.party,
        party_size: req.body.party_size,
        email: req.body.email
      });

      // acceptEmail(
      //   req.body.email,
      //   rsvp.author_email,
      //   rsvp.author_phone,
      //   rsvp.title,
      //   rsvp.description,
      //   rsvp.location,
      //   rsvp.date,
      //   rsvp.time,
      //   rsvp.end_time,
      //   rsvp.id
      // );
    } else {
      rsvp.declined = rsvp.declined.concat({
        party: req.body.party,
        email: req.body.email
      });
    }

    await rsvp.save();
    res.status(201).json({ message: "Submitted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = rsvpRouter;
