
/*
path: /api/datachart
*/

const {Router} = require('express');
const { getDataChart } = require('../controllers/data_chart');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getDataChart);

module.exports = router;