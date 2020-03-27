const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const {User, validateRequest} = require('../models/user');

var router = express.Router();

router.get('/', (req,res) => {
    res.render('register');
})

router.post('/', async (req, res) => {
    var {error} = validateRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("Already registered. Please sign in");

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        password: hashedPassword,
        nickname: req.body.nickname
    });

    try {
        await user.save();
        res.send("Registered !");
    } catch (e) {
        console.log(e);
    }
})

module.exports = router