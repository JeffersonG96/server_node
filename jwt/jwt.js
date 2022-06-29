const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

const payload = { uid };

return new Promise((resolve, reject) => {

    jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '168h' //time de token vivo
    }, (err, token) => {
       if(err) {
        //no se pudo crear token
        reject('No se pudo generar el JWT');
       } else {
        //tenemos token
        resolve( token );
       }
    });

});

}


module.exports = {
    generarJWT
}