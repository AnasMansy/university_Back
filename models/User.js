const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'faculty', 'staff'] },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
