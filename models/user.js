const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: Number
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
