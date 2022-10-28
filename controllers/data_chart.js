const { response } = require("express");
const DataTemp = require("../models/data_temp");
const DataHeart = require("../models/data_heart");
const DataSpo2 = require("../models/data_spo2");

const getDataChart = async(req, res = response) => {

    const uId = req.uid;
    
    const dataTemp = await DataTemp.find({userId: uId}).sort({createdAt: 'desc'}).limit(100)
    const dataHeart = await DataHeart.find({userId: uId}).sort({createdAt: 'desc'}).limit(110)
    const dataSpo2 = await DataSpo2.find({userId: uId}).sort({createdAt: 'desc'}).limit(100)

    res.json({
        ok: true,
        temp: dataTemp,
        heart: dataHeart,
        spo2: dataSpo2
    });

}

module.exports = {
    getDataChart,
}