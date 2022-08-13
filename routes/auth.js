/* 
    Path: api/login
*/

const {Router} = require('express');
const {check} = require('express-validator'); 

const {crearUsuario, login, renewToken, webhook, receive_deviceId} = require('../controllers/auth');
const alarma = require('../controllers/firebase');
const newSubscribe = require('../controllers/subscribe');
const createAlarmRule = require('../emqx/alarms');
const { findId } = require('../emqx/find_Id');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
//Validar campos
router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    validarCampos
] ,crearUsuario );

//login
router.post('/', [
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),   
], login)

//validar JWT
router.get('/renew', validarJWT, renewToken);

//find
router.post('/find',findId);

//subscribe
router.post('/subscribe',validarJWT,newSubscribe);

//webhook - EMQX
router.post('/saver-webhook', webhook);

//alarma
router.post('/alarm-webhook', alarma);

//receive deviceId
router.post('/receive-deviceId',validarJWT, receive_deviceId);

//*Get MQTT Credentials






module.exports = router;