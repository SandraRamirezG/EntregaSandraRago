const mongoose = require('mongoose');

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model(userCollection, userSchema);
