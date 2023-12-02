const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {
        type: String,
    },
    roomType: {
        type: String,
        enum: ['group','private'],
        default:"private",
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    members:{
      type:[{type:String}],
      required:true
    },
    roomStatus: {
        type: String,
        enum: ['active','inactive'],
        default:"active",
        required: true
    },
    roomId: {
        type: String,
        default:new mongoose.Types.ObjectId,
        unique: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema)
