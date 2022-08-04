const { Schema, model } = require('mongoose');

const alarmRuleSchema = Schema({
    userId: {type: String, require: [true]},
    dId: {type: String, require: [true]},
    emqxRuleId: {type: String, require: [true]},
    status: {type: String, require: [true]}
});


module.exports= model('alarmRule', alarmRuleSchema );