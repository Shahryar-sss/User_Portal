const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this.id}, 'PrivateKey');
    return token;
} 

const User = new mongoose.model('User', userSchema, 'Users');

function validateRequest(body) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        nickname: Joi.string().required()
    }

    return Joi.validate(body, schema);
};

module.exports.User = User;
module.exports.validateRequest = validateRequest;