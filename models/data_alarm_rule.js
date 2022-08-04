const { Schema, model } = require('mongoose');

const dataAlarmSchema = Schema({
    userId: {type: String, require: [true]},
    variable: {type: String, require: [true]},
    value: {type: Number, require: [true]},
    time: {type: Number, require: [true]}
});


module.exports = model('dataAlarm', dataAlarmSchema );