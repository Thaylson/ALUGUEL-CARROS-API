const pool = require('../config/db');


const createAluguel = async (req, res) => {
    try {
    const {
      carro_id,
      cliente_id,
      data_inicio,
      data_fim,
      valor_diaria
    } = req.body;

    const userId = req.user.id; // Obtém o ID do usuário autenticado a partir do token

    if (!carro_id || !cliente_id || !data_inicio || !data_fim || !valor_diaria) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const dias = Math.ceil((new Date(data_fim) - new Date(data_inicio)) / (1000 * 60 * 60 * 24)); // Calcula o número de dias
    if (dias <= 0) {
      return res.status(400).json({ error: 'A data de fim deve ser posterior à data de início' });
    }
    const valor_total = dias * valor_diaria;

    const resultado = await pool.query(
      'INSERT INTO alugueis (carro_id, cliente_id, data_inicio, data_fim, valor_diaria, valor_total, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [carro_id, cliente_id, data_inicio, data_fim, valor_diaria, valor_total, userId]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar aluguel:', err);
    res.status(500).json({ error: 'Erro ao criar aluguel', details: err.message });
  }
};

const baseSelect = `
  SELECT
    a.id AS aluguel_id,
    a.data_inicio,
    a.data_fim,
    a.valor_diaria,
    a.valor_total,

    c.id AS cliente_id,
    c.nome AS cliente_nome,

    ca.id AS carro_id,
    ca.modelo AS carro_modelo,
    ca.placa,

    u.id AS usuario_id,
    u.nome AS usuario_nome
  FROM alugueis a
  JOIN clientes c ON a.cliente_id = c.id
  JOIN carros ca ON a.carro_id = ca.id
  JOIN usuarios u ON a.usuario_id = u.id
`;

const listAlugueis = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isAdmin && !req.user.cliente_id) {
      return res.status(403).json({ error: 'Cliente não associado ao usuário' });
    }

    const query = isAdmin
      ? `${baseSelect} ORDER BY a.id;`
      : `${baseSelect} WHERE a.cliente_id = $1 ORDER BY a.id;`;
    const params = isAdmin ? [] : [req.user.cliente_id];

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar alugueis:', err);
    res.status(500).json({ error: 'Erro ao listar alugueis', details: err.message });
  }
}

const buscarAluguelPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const isAdmin = req.user && req.user.role === 'admin';

        if (!isAdmin && !req.user.cliente_id) {
          return res.status(403).json({ error: 'Cliente não associado ao usuário' });
        }

        const query = isAdmin
          ? `${baseSelect} WHERE a.id = $1`
          : `${baseSelect} WHERE a.id = $1 AND a.cliente_id = $2`;
        const params = isAdmin ? [id] : [id, req.user.cliente_id];

        const resultado = await pool.query(query, params);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Aluguel não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar aluguel por ID:', err);
        res.status(500).json({ error: 'Erro ao buscar aluguel por ID', details: err.message });
    }
};

module.exports = { 
  createAluguel,
  listAlugueis,
  buscarAluguelPorId
}; 