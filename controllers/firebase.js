require('dotenv').config()
const{response, json} = require('express');
const admin = require('firebase-admin');
const{initializeApp, applicationDefault} = require('firebase-admin/app');
const deviceApp = require('../models/deviceId');
const DataTemp = require('../models/data_temp');
const DataHeart = require('../models/data_heart');
const DataSpo2 = require('../models/data_spo2');
const DataNewAlert = require('../models/data_new_alert');
const { time } = require('console');

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



const save = async (req, res = response) => {
    
    try {
        
        
        if(req.headers.token != "A4xW0$1c56gR3T!kllI09ZX#31"){
            return res.status(404).json({
                ok: false,
                msg: "No found"
            });
        }
        
        const data = await req.body;
        // console.log('Webhook - enviado');
        //*recoge los datos de EMQX 
        var temperatura = 0;
        var heart = 0;
        var spO2 = 0;
        const splittedTopic = data.topic.split("/");
        // console.log(data);
        const variable = splittedTopic[1];
        
        
        if(variable == 'temp'){
        temperatura = data.payload.value;
        await DataTemp.create({
            userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
        }
        if(variable == 'heart'){
            heart = data.payload.value;
            await DataHeart.create({
                userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
        }
        if(variable == 'spo2'){
            spO2 = data.payload.value;
            await DataSpo2.create({
                userId: data.userId,
                variable: variable,
                value: data.payload.value,
                time: Date.now(),
            });
        }
        
        const statusNewAlert = await DataNewAlert.findOne({userId: data.userId}).sort({$natural:-1});
        
        const tokenDeviceId = await deviceApp.findOne({userId: data.userId});
        var deviceId = tokenDeviceId.deviceId;
        
        if(statusNewAlert.status){
            if(variable == 'temp'){
                var counter = statusNewAlert.counter + 10; 
                const result = await DataNewAlert.findOneAndUpdate({userId: data.userId}, {$set: {counter: counter}}, {sort: {_id:-1}});
                if(counter >= statusNewAlert.range){
                    var counterNumber = 0;
                    // const result = await DataNewAlert.findOneAndUpdate({userId: data.userId}, {$set: {counter: counterNumber}}, {sort: {_id:-1}});
                    const bodyNotification =  `Temperatura: ${temperatura}, Frecuencia C: ${heart}, Saturación: ${spO2}`;
                    sendPushNotificationsSave(deviceId,bodyNotification);
                    
                    await DataNewAlert.create({
                        userId: data.userId,
                        status: statusNewAlert.status,
                        range: statusNewAlert.range,
                        counter: counterNumber,
                        enfermedad: statusNewAlert.enfermedad,
                        medicamento: statusNewAlert.medicamento,
                        temperatura: temperatura,
                        frecuenciaC: heart,
                        spO2: spO2,
                        time: Date.now(),
                    });                
                }
            }
        }
        
        return res.json({
            ok: true,
            msg: 'Data save'
        });
        
    } catch (error) {
        console.log(error);
        console.log('error al guardar dato');
    }
}

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

//notificaciones de save
function sendPushNotificationsSave(registerToken, body){
    const message = {
        tokens: registerToken,
        notification:{
            title: 'Estado de salud',
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


module.exports = {alarma, save};


