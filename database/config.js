const mongoose  = require('mongoose');

const dbConnection = async() => {

    try{

        await mongoose.connect(process.env.DB_CONNEC); 

        console.log('MongoDB en linea');
    
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos - Contactar con el admin');
    }
}

module.exports = {
    dbConnection
}