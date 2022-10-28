const{response, json} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../jwt/jwt');
const deviceApp = require('../models/deviceId');
const DataTemp = require('../models/data_temp');
const DataHeart = require('../models/data_heart');
const DataSpo2 = require('../models/data_spo2');



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
    
    if(req.headers.token != "A4xW0$1c56gR3T!kllI09ZX#31"){
        return res.status(404).json({
            ok: false,
            msg: "No found"
        });
    }
    
    // console.log("ESte es el token =>", req.headers.token);
    const data = await req.body;
    // console.log('Webhook - enviado');
    //*recoge los datos de EMQX 
    const splittedTopic = data.topic.split("/");
    console.log(data);
    const variable = splittedTopic[1];

    if(variable == 'temp'){
        await DataTemp.create({
                userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
    }
    if(variable == 'heart'){
        await DataHeart.create({
                userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
    }
    if(variable == 'spo2'){
        await DataSpo2.create({
                userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
    }
    
    return res.json({
        ok: true,
        msg: 'Data save'
    });

}


//*alarma
const receive_deviceId = async(req, res = response) => {

    const data = await req.body;
    const deviceId = data.deviceId;
    const userId = data.uid;
    
    try {
        var token = await deviceApp.find({type: "user", userId: userId});
    
        if(token ==0 ) {
            newDeviceId = {
                userId: userId,
                deviceId: deviceId,
                type: "user",
                time: Date.now()
            };
            
            console.log('creado token en db');
            const result = await deviceApp.create(newDeviceId);
            console.log(result);
            return res.json({
                ok: true,
                msg: 'deviceId creado'
            });
        }
        
        //update new token to device
        const updatedb = await deviceApp.updateOne({ userId: userId},{ $addToSet: { deviceId: deviceId} })
        if (updatedb.modifiedCount == 1 && updatedb.matchedCount == 1){
            console.log('token device en base de datos');
            return res.json({
                ok: true,
                msg: 'Token listo para notificacion (update)'
            });  
        } 
        console.log('token registrado en base de datos');
    
        return res.json({
            ok: false,
            msg: 'Dispositivo ya registrado'
        });
        
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'No found'
        }); 
        
    }

}

module.exports = {
    crearUsuario,
    login,
    renewToken,
    webhook,
    receive_deviceId
}