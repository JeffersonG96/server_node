const{response, json} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../jwt/jwt');
const Data = require('../models/data_rule');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

    //Busca email en la base de datos
    const existeEmail = await Usuario.findOne({ email });
    console.log(existeEmail);  
    if(existeEmail){ 
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya está registrado'
        });
    }

    const usuario = new Usuario(req.body);  //filtra todo en el modelo

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    //Grabar en base de datos
    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id);

    
    res.json({
        ok: true,
        usuario,
        token
    });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador'
        });
    }

}

const login = async (req, res = response) => {

    const{email, password} = req.body;

try {

    const usuarioDB = await Usuario.findOne({email});
    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Email no encontrado'
        });  
    } 

    //validar password
    const validPassword = bcrypt.compareSync (password, usuarioDB.password);
    if(!validPassword) {
        return res.status(400).json({
            ok: false,
            msg: 'La contraseña no es válida'
        });
    }

    //Generar JWT
    const token = await generarJWT(usuarioDB.id);
    res.json({
        ok: true,
        usuario: usuarioDB,
        token
    });

    
} catch (error) {
    console.log(error);
    return res.status(500).json({
        ok: false,
        msg: 'Contacte al administrador'
    });
}

}

const renewToken = async(req, res=response) => {

    const uid = req.uid;
    //generar new JWT, 
    const token = await generarJWT(uid);

    //obtener el usuario por medio de uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}


//* webhook - EMQX
const webhook = async (req, res = response) => {
    
    console.log("ESte es el token =>", req.headers.token);
    const data = await req.body;

    // if(req.headers.token != "121212"){
    //     return res.status(404).json({
    //         ok: false,
    //         msg: 'No found'
    //     }); 
    // }

    console.log('Webhook - enviado');
    //*recoge los datos de EMQX 

    const splittedTopic = data.topic.split("/");
    const dId = splittedTopic[1]
    const variable = splittedTopic[2];
    console.log(data);

    await Data.create({
            userId: data.userId,
            dId: dId,
            variable: variable,
            value: data.payload.value,
            time: Date.now()
        });
    
    res.json({
        ok: true,
        msg: 'Alarma enviada'
    });

}


module.exports = {
    crearUsuario,
    login,
    renewToken,
    webhook
}