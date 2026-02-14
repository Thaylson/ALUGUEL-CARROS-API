const pool = require('../config/db.js');

exports.findAll = async () => {
    const res = await pool.query('SELECT * FROM carros');
    return res.rows;
};

exports.create = async ({ modelo, marca, ano, placa, categoria }) => {
    const res = await pool.query(
        `INSERT INTO carros (modelo, marca, ano, placa, categoria)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [modelo, marca, ano, placa, categoria]
    );
    return res.rows[0];
};
