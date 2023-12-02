const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default:"https://guelph.bigbrothersbigsisters.ca/wp-content/uploads/sites/185/2022/04/Neutral-placeholder-profile-300x300.jpg"
    },
    lastSeen: {
        type: Date,
        default: new Date(),
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline','typing'],
        default:"offline",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)
