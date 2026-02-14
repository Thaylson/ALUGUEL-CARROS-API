const express = require('express');
const router = express.Router();
const carrosController  = require('../controllers/carros.controller');


router.get('/', carrosController.getAllCarros);
router.post('/', carrosController.createCarro);


module.exports = router;