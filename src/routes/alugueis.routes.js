const { Router } = require('express');
const { createAluguel, listAlugueis, buscarAluguelPorId } = require( '../controllers/alugueis.controller');
const {authenticateToken} = require( '../middlewares/auth.middleware');
const { adminOnly } = require( '../middlewares/adm.middleware');

const router = Router();

router.post('/', authenticateToken, adminOnly, createAluguel);
router.get('/', authenticateToken, listAlugueis);
router.get('/:id', authenticateToken, buscarAluguelPorId);
module.exports = router;