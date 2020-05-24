const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

//multer
//sharp
//emails

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
            cb(new Error("Please upload an image"));
        }

        cb(undefined, true);
    }
});

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        welcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send();
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

//////////

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
});

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const valid = updates.every((update) => allowedUpdates.includes(update));

    if (!valid) return res.status(400).send({ error: "Invalid Updates" });

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(202).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        cancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (err) {
        res.status(500).send();
    }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error();

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send();
    }
});


const userRouter = new express.Router();



module.exports = userRouter;
