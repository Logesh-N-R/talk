const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {
        type: String,
        trim:true
    },
    isGrp: {
        type: Boolean,
        default:false
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    latestMsg:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    grpAmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    roomStatus: {
        type: String,
        enum: ['active','inactive'],
        default:"active",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema)
