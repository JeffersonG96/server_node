const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    online:{
        type: Boolean,
        require: false
    },

});

//Ocultar contraseña en body
UsuarioSchema.method('toJSON', function() {
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports = model('Usuario', UsuarioSchema );
