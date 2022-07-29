const { Schema, model } = require('mongoose');

const authEmqxSchema = Schema({
    userId: {type: String, require: [true]},
    username: {type: String, require: [true]},
    password: {type: String, require: [true]},
    publish: {type:Array},
    subscribe: {type:Array},
    type: {type: String, require: [true]},
    time: {type: Number},
    updateTime: {type: Number}
});


module.exports = model('EmqxAuthRule', authEmqxSchema );