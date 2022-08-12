const{response, json} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const EmqxAuthRule = require('../models/emqx_auth')

const newSubscribe = async ( req, res=response) => {

    const {email, uid} = req.body;
    console.log( req.body);
    
    const emailDB = await Usuario.findOne({email});
    console.log(emailDB._id);
    const userId = emailDB._id;
    const result = await EmqxAuthRule.findOne(userId)
    console.log(result);
    
    if (!emailDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Email no registrado'
        });  
    } 
    
    const updatedb = await EmqxAuthRule.updateOne({ userId: userId},{ $addToSet: { subscribe: uid + "/#"} })
    console.log(updatedb);
    if (updatedb.modifiedCount == 1 && updatedb.matchedCount == 1){
        return res.json({
            ok: true,
            msg: 'Email subscrito al topico'
        });  
    } 
    
//
    return res.json({
        ok: false,
        msg: 'Verifique el correo'
    })

}



module.exports = newSubscribe;