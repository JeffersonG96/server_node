const { response } = require("express");
const data = require("../models/data_rule");

const getDataChart = async(req, res = response) => {

    const uId = req.uid;
    
    const dataSave30 = await data.find({userId: uId}).sort({createdAt: 'desc'}).limit(100)

    res.json({
        ok: true,
        msg: dataSave30
    });

}

module.exports = {
    getDataChart,
}