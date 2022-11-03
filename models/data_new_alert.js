const { Schema, model } = require('mongoose');

const DataNewAlertSchema = Schema({
    userId: {type: String, require: [true]},
    status: {type: Boolean, require: [true]},
    range: {type: Number, require: [true]},
    counter:{type: Number, require:[true] },
    enfermedad: {type: String, require: [true]},
    medicamento: {type: String, require: [true]},
    temperatura: {type: Number, require: [true]},
    frecuenciaC: {type: Number, require: [true]},
    spO2: {type: Number, require: [true]},
    time: {type: Number, require: [true]},
},
{
    timestamps: true,
}
);

DataNewAlertSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    return object;
});


module.exports = model('DataNewAlert', DataNewAlertSchema );