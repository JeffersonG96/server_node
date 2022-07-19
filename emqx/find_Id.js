const { response } = require("express");
const axios  = require('axios');
const Usuario = require('../models/usuario');
const saverRule = require('./saver_rule');

global.saverResource=null;
global.alarmResource=null;

const auth = {
    auth: {
        // nombre: 'emqx_api',
        username: 'admin',
        password: 'jg0411'
    }
};

const findId = async(req, res=response ) => {

    listResource();

    const uid = req.body;
    const _id = uid.uid;
    const userId = uid.uid;
    

    // console.log(_id);
    //BUSCAR EN BASE DE DATOS

try {
    const existeId = await Usuario.findById({_id});
    const ruleId = await saverRule.findOne({ userId});

    if(existeId && ruleId){
        console.log('****YA EXISTE REGLA EN ESTE USUARIO******');
        res.json({
            ok: true,
            msg: 'La regla esta creada para este usuario',
        });
        return;

    } else {

        const caract = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const long = caract.length;

        let resul = [];
        for(let i =0; i<8; i++){
            resul[i] = caract.charAt(Math.floor(Math.random() * long));
        }

        const dId = resul.join('');

        //*Crear Regla en EMQX
        createSaverRule(_id,dId,true);
        console.log('***/**CREO UNA REGLA**/***');
        res.json({
            ok: true,
            msg: 'Regla creada correctamente'
        });
    }

} catch (error) {
    console.log(error);
    console.log('No se pudo crearla regla');
    return res.status(400).json({
        ok: false,
        msg: 'No esta conectado al broker'
    });

}

}


//crea la regla
async function createSaverRule(userId, dId, status) {

    try {

    const url = "http://192.168.100.149:8085/api/v4/rules";

    const topic = userId + "/" + dId + "/+/sdata";

    const rawsql ="SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";

    var newRule = {
        rawsql: rawsql,
        actions: [
            {
            name: "data_to_webserver",
            params: {
                $resource: global.alarmResource.id,
                payload_tmpl: '{"userId": "' + userId + '","payload":${payload}, "topic":"${topic}"  }'
            }
        }
    ],
    description: "SAVER-RULE",
    enabled: status
    };

    //*Guardar regla en emqx
    const res = await axios.post(url, newRule, auth);
    if(res.status === 200 && res.data.data){
        console.log(res.data.data);

        await saverRule.create({
            userId: userId,
            dId: dId,
            emqxRuleId: res.data.data.id,
            status: status
        });
        return true;
    } else {
        return false;
    }

} catch (error) {
    console.log(error);
    console.log('No se pudo crear rule saver');
    return false;
}

}

/////////////////////////////////////////

async function listResource() {

try {

    const url = "http://192.168.100.149:8085/api/v4/resources/";

    const res = await axios.get(url, auth);
    const size = res.data.data.length;

    console.log('*****Conectado a la API RESOURCE*****');

    if (res.status ===200){
    if (size == 0) {
        console.log('crear emqx webhook resource');
        //funcion
        createResource();
    } else if (size == 2){

        res.data.data.forEach( resource => {
            if(resource.description == "alarm-webhook"){
                global.alarmResource=resource;
                console.log('****ALARM RESOURCE****');
                // console.log(global.alarmResource.id);
            }

            if(resource.description == "saver-webhook"){
                global.saverResource=resource;
                // console.log(global.saverResource.id);
                console.log('**!!**SAVER RESOURCE**!!**');
                console.log(global.saverResource);
            }

        });


    } else {
        function prinWarning() {
            console.log('Eliminar todo WEBHOOK en EMQX y reinica Node')
            setTimeout(() => {
                prinWarning();
            }, 1000);
        }
        prinWarning();
    }

}//if res.status=200

} catch (err) {
console.log(err)
console.log('Error al conectar al conectar con la API EMQX RESOUCE ');
}
}


//*CREAR RESOURCE
async function createResource() {
    try {

        const url = "http://192.168.100.149:8085/api/v4/resources"

        const data1 = {
            "type": "web_hook",
            "description": "alarm-webhook",
         "config": {
            "url": "http://192.168.100.149:3000/api/login/alarm-webhook",
            "method": "POST",
            // "headers": {
            //    " token": "121212"
            // },
        }

        }//data1

        const data2 = {
            "type": "web_hook",
            "description": "saver-webhook",
         "config": {
            "url": "http://192.168.100.149:3000/api/login/saver-webhook",
            "method": "POST",
            // "headers": {
            //    " token": "121212"
            // },
        }

        }//data2

        const res1 = await axios.post (url, data1, auth);
        if (res1.status === 200){
            console.log('!!!alarm creado!!!');

        }

        const res2 = await axios.post (url, data2, auth);
        if (res2.status === 200){
            console.log('!!saver creado!!!');

        }


    } catch (error) {
    console.log(error);
      console.log('***Error al crear webhook - resources');
    }


    }//createResource




module.exports = {
    findId
}