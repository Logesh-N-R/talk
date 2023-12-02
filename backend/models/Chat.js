
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    iv:{
        type: String,
        required: true
    },
    messageFrom: {
        type: String,
        required: true
    },
    messageTo: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['group', 'private'],
        required: true
    },
    room: {
        type: String,
        required: true
    }
   
}, { timestamps: true })

module.exports = mongoose.model("Chat", chatSchema)