require('dotenv').config()
const{response, json} = require('express');
const admin = require('firebase-admin');
const{initializeApp, applicationDefault} = require('firebase-admin/app');
const deviceApp = require('../models/deviceId');

function initFirebasApp() {
initializeApp({
    credential: applicationDefault()
});
}

initFirebasApp();
////
const alarma = async(req, res = response) => {

    const data = await req.body;

    //*recoge los datos de EMQX 
    const splittedTopic = data.topic.split("/");
    const userId = splittedTopic[0];

    try {
        const tokenDeviceId = await deviceApp.findOne({userId: userId});

        var deviceId = tokenDeviceId.deviceId;
     
        sendPushNotifications(deviceId);
    
        //Guarda en mongooo
        // await dataAlarm.create({
        //         userId: data.userId,
        //         variable: variable,
        //         value: data.payload.value,
        //         time: Date.now()
        //     });
        
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
function sendPushNotifications(registerToken){
    const message = {
        tokens: registerToken,
        notification:{
            title: 'Es una notificacion',
            body: 'este es el body'
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

module.exports = alarma;


