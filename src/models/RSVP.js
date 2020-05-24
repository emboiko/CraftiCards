const mongoose = require("mongoose");

const RSVP_Schema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    author_email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    author_phone: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    qr: {
        type: Buffer,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    num_guests: {
        type: Number,
        default: 0
    },
    joined: [{
        party: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

const RSVP = mongoose.model("RSVP", RSVP_Schema);

module.exports = RSVP;