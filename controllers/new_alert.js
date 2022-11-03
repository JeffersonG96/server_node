const { response } = require("express");
const DataNewAlert = require("../models/data_new_alert");

const DataTemp = require('../models/data_temp');
const DataHeart = require('../models/data_heart');
const DataSpo2 = require('../models/data_spo2');


const newAlert = async(req, res = response) => {

    try { 
        const uId = await req.uid;
        const body = await req.body;
        
        const dataTemp = await DataTemp.findOne({userId: uId}).sort({$natural:-1});
        const dataHeart = await DataHeart.findOne({userId: uId}).sort({$natural:-1});
        const dataSpo2 = await DataSpo2.findOne({userId: uId}).sort({$natural:-1});
        
        await DataNewAlert.create({
            userId: uId,
            status: body.status,
            range: body.range,
            counter: body.counter,
            enfermedad: body.enfermedad,
            medicamento: body.medicamento,
            temperatura: dataTemp.value,
            frecuenciaC: dataHeart.value,
            spO2: dataSpo2.value,
            time: Date.now(),
        });
        
        res.json({
            ok: true,
            msg: "Datos Guardados",
            uId: uId,
            bodyAlert: body
        });
    } catch (error) {
       console.log('NO fue posible crear una alerta'); 
       console.log(error); 
    }

}

module.exports = {
   newAlert,
}