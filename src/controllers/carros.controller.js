const carrosService = require('../services/carros.service.js');

async function getAllCarros(req, res) {
    try {
        const carros = await carrosService.getAllCarros();
        res.json(carros);
    } catch (err) {
        console.error('Erro ao buscar carros:', err);
        res.status(500).json({ error: 'Erro ao buscar carros', details: err.message });
    }
};

async function createCarro(req, res) {
    try {
        const carro = await carrosService.createCarro(req.body);
        res.status(201).json(carro);
    } catch (err) {
        console.error('Erro ao criar carro:', err);
        res.status(400).json({ error: 'Erro ao criar carro', details: err.message });
    }
}; 

module.exports = {
    getAllCarros,
    createCarro
};