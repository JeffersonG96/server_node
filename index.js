const express = require('express');
const path = require('path');
require('dotenv').config();

//DB Config
require('./database/config').dbConnection();

//App de Expess
const app = express();

//Lectura y parseo de body
app.use(express.json());

//Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket.js');


//path público 
const publicPath = path.resolve( __dirname, 'public' );
app.use(express.static(publicPath));

//Me routes
app.use('/api/login', require('./routes/auth'));
app.use('/api/datachart', require('./routes/data_chart'));
app.use('/api/data', require('./routes/data'));



//Port
server.listen(process.env.PORT, (err) => {
    if(err) throw new Error(err);

    console.log('Servidor Corriendo en Puerto:', process.env.PORT)
})