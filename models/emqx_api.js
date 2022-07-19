
const axios  = require('axios');


const auth = {
    auth: {
        // nombre: 'emqx_api',
        username: 'admin',
        password: 'jg0411'
    }
};

global.saverResource=null;
global.alarmResource=null;


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
                console.log(global.alarmResource);
            }

            if(resource.description == "saver-webhook"){
                global.saverResource=resource;
                console.log('****SAVER RESOURCE****');
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


async function createResource() {
try {
 
    const url = "http://192.168.100.149:8085/api/v4/resources"

    const data1 = {
        "type": "web_hook",
        "description": "alarm-webhook",
     "config": {
        "url": "http://192.168.100.149:3000/api/login/alarm-webhook",
        "method": "POST",
        "headers": {
           " token": "121212"
        },}

    }//data1

    const data2 = {
        "type": "web_hook",
        "description": "saver-webhook",
     "config": {
        "url": "http://192.168.100.149:3000/api/login/saver-webhook",
        "method": "POST",
        "headers": {
           " token": "121212"
        },}

    }//data2

    const res1 = await axios.post (url, data1, auth);
    if (res1.status === 200){
        console.log('!!!alarm creado!!!');
    }

    const res2 = await axios.post (url, data2, auth);
    if (res2.status === 200){
        console.log('!!saver creado!!!');
    }

    setTimeout(() => {
        console.log('****RESOURCES CREADO - WEBHOOK')
        listResource();
    }, 1000);
    
} catch (error) {
console.log(error);
  console.log('***Error al crear webhook - resources');  
}
   

}//createResource


setTimeout(() => {
    listResource();
}, 1000)

module.exports = listResource;