
const { Schema, model } = require('mongoose');

const saverRuleSchema = Schema({
    userId: {type: String, require: [true]},
    dId: {type: String, require: [true]},
    emqxRuleId: {type: String, require: [true]},
    status: {type: String, require: [true]}
});

// const saverRule = mongoose.model('saverRule', saverRuleSchema);

module.exports= model('saverRule', saverRuleSchema );