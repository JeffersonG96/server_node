const mongoose  = require('mongoose');

const mongoUserName = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.LOCALHOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDatabase = process.env.MONGO_DATABASE;

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