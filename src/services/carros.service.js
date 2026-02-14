const carrosRepository = require('../repositories/carros.repository.js');

exports.getAllCarros = async () => {
    return await carrosRepository.findAll();
};


exports.createCarro = async (carroData) => {
    if (!carroData.modelo || !carroData.placa) {
        throw new Error('Modelo e placa são obrigatórios'); 
    }
    return await carrosRepository.create(carroData);
};