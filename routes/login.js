const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const {User, validateRequest} = require('../models/user');

var router = express.Router();

router.post('/', async(req, res) => {
    var {error} = validateRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("No account is associated with this email address");

    if (user.nickname.toUpperCase() != req.body.nickname.toUpperCase())
        return res.status(400).send("Incorrect nickname");

    let isValid = await bcryptjs.compare(req.body.password, user.password);
    
    if (isValid) {
        const token = user.generateAuthToken();

        data = {
            "token": token,
            "email": user.email,
            "nickname": user.nickname,
            "profileImage": user.profileImage
        }
        res.send(data);
    }
    else{
        res.status(400).send("Invalid password")
    }
    
})

module.exports = router