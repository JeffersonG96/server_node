const { response } = require("express");
const DataNewAlert = require("../models/data_new_alert");


const getMedicalHistory = async(req, res = response) => {

try {
      
    const uId = req.uid;
    const medicalHistory = await DataNewAlert.find({userId: uId}).sort({createdAt: 'desc'}).limit(100)
    
    if(medicalHistory){
        res.json({
            ok: true,
            medicalHistory:medicalHistory 
        });
        return;
    }
    
    res.json({
        ok: false,
        medicalHistory:medicalHistory 
    });
    
} catch (error) {
    console.log('Error, no es posible obtener los datos de medical history');
    console.log(error);
}
}

module.exports = {
    getMedicalHistory,
}