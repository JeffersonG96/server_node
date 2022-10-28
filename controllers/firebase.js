require('dotenv').config()
const{response, json} = require('express');
const admin = require('firebase-admin');
const{initializeApp, applicationDefault} = require('firebase-admin/app');
const deviceApp = require('../models/deviceId');
const DataTemp = require('../models/data_temp');
const DataHeart = require('../models/data_heart');
const DataSpo2 = require('../models/data_spo2');

function initFirebasApp() {
initializeApp({
    credential: applicationDefault()
});
}

initFirebasApp();
////
const alarma = async(req, res = response) => {

    if(req.headers.token != "A4xW0$1c56gR3T!kllI09ZX#31"){
        return res.status(404).json({
            ok: false,
            msg: "No found"
        });
    }

    try {

    const data = await req.body;
    //*recoge los datos de EMQX 
    const splittedTopic = data.topic.split("/");
    console.log(splittedTopic);
    const variable = splittedTopic[1];
    console.log(data);
    console.log(data.userId);

        const tokenDeviceId = await deviceApp.findOne({userId: data.userId});

        var deviceId = tokenDeviceId.deviceId;
        
        //*Body NOticications
        if (variable == 'status'){
            var body = 'Se detecto una caída'
            sendPushNotifications(deviceId, body);

        }
        if (variable == 'temp'){
            var body = 'Temperatura corporal elevada'
            sendPushNotifications(deviceId, body);
        //Guarda en mongooo
            await DataTemp.create({
            userId: data.userId,
            variable: variable,
            value: data.payload.value,
            time: Date.now(),
            });
        }
        if (variable == 'heart'){
            var body = 'Frecuencia cardiaca alterada'
            sendPushNotifications(deviceId, body);

            //Guarda en mongooo
            await DataHeart.create({
            userId: data.userId,
            variable: variable,
            value: data.payload.value,
            time: Date.now(),
            });
        }
        if (variable == 'spo2'){
            var body = 'Saturación de oxígeno inestable'
            sendPushNotifications(deviceId, body);

            //Guarda en mongooo
            await DataSpo2.create({
            userId: data.userId,
            variable: variable,
            value: data.payload.value,
            time: Date.now(),
            });
        }
        
        
        return res.json({
            ok: true,
            msg: 'Alarma recibida'
        });
        
    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: 'no se pudo enviar la notificación'
        });
    }

}
//


//enviar a un token
function sendPushNotifications(registerToken, body){
    const message = {
        tokens: registerToken,
        notification:{
            title: 'Alerta',
            body: body
        }
    }
    sendMessage(message);
}

//send messages differents tokens 
function sendMessage(message){
    admin.messaging().sendMulticast(message).then((response) =>{
        console.log('Notificacion enviada al usuario', response);
    }).catch((error)=>{
        console.log('Error al enviar la notificacion', error);
    })
}


// function counterMessage(){

// } 



module.exports = alarma;


