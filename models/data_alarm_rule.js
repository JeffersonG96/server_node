const { Schema, model } = require('mongoose');

const DataSchema = Schema({
    userId: {type: String, require: [true]},
    dId: {type: String, require: [true]},
    emqxRuleId: {type: String, require: [true]},
    variableFullName: {type: String},
    variable: {type: String},
    value: {type: Number},
    condition: {type: String},
    triggerTime: {type: Number},
    status: {type: Boolean},
    counter: {type: Number, default:0}, 
    time: {type: Number}
});


module.exports = model('Data', DataSchema );