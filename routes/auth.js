/* 
    Path: api/login
*/

const {Router} = require('express');
const {check} = require('express-validator'); 

const {crearUsuario, login, renewToken, webhook, alarmwebhook} = require('../controllers/auth');
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

//webhook - EMQX
router.post('/saver-webhook', webhook);

//TODO crear ruta para alarma 
router.post('/alarm-webhook', alarmwebhook);

//find
router.post('/find',findId);


//*Get MQTT Credentials






module.exports = router;