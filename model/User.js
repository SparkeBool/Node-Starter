const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 50,
        lowercase: true,
        required: true
    },

    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 50,
        lowercase: true,
        required: true
    },

    phone:{
        type: String,
        trim: true,
        unique: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },

    avatar: String,
    password:{
        type: String,
        trim: true,
        minLength: 8,
        maxLength: 255,
        required: true
    }, 
    isActivate:{
        type: Boolean,
        default: false
    },
    activationToken: String,
    activationTokenExpires: String



});

const User = mongoose.model("User", userSchema);

module.exports = User;