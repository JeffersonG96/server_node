
/*
path: /api/datachart
*/

const {Router} = require('express');
const { getMedicalHistory } = require('../controllers/medical_history');
const { newAlert } = require('../controllers/new_alert');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//historial clínico
router.get('/medical_history', validarJWT,getMedicalHistory);

//new alert
router.post('/new_alert', validarJWT,newAlert);

module.exports = router;