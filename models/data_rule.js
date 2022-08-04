const { Schema, model } = require('mongoose');

const DataSchema = Schema({
    userId: {type: String, require: [true]},
    variable: {type: String, require: [true]},
    value: {type: Number, require: [true]},
    time: {type: Number, require: [true]}
});


module.exports = model('Data', DataSchema );