const { Schema, model } = require('mongoose');

const DataTempSchema = Schema({
    userId: {type: String, require: [true]},
    variable: {type: String, require: [true]},
    value: {type: Number, require: [true]},
    send: {type: Boolean, require: [false]},
    time: {type: Number, require: [true]},
},{
    timestamps: true,
});

DataTempSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    return object;
});


module.exports = model('DataTemp', DataTempSchema );