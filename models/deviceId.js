const { Schema, model } = require('mongoose');

const deviceAppSchema = Schema({
    userId: {type: String, require: [true]},
    deviceId: {type:Array},
    type: {type: String, require: [true]},
    time: {type: Number},
});


module.exports = model('deviceApp', deviceAppSchema );