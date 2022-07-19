const mongoose  = require('mongoose');

const mongoUserName = "jeffersong";
const mongoPassword = "jg0411";
const mongoHost = "192.168.100.149";
const mongoPort = "27017";
const mongoDatabase = "proyect";

var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;

const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};

const dbConnection = async() => {

    try{

        // await mongoose.connect(process.env.DB_CONNEC, {
        await mongoose.connect(uri, options); 

        console.log('****** Conectado a Mongo******');
    
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos - Contactar con el admin');
    }
}

module.exports = {
    dbConnection
}