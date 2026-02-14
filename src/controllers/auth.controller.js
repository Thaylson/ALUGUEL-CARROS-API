const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    const {nome, email, senha} = req.body;
    try {
        //verificar se o usuário já existe
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({error: 'Usuário já existe'});
        }
        //hash da senha
        const hashsenha = await bcrypt.hash(senha, 10);
        //inserir usuário no banco   
        const newUser = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, hashsenha]
        );
        const { senha: _senha, ...userSafe } = newUser.rows[0];
        res.status(201).json(userSafe);
    }catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({error: 'Erro ao registrar usuário', details: err.message});
    }   
};

exports.login = async (req, res) => {
    const {email, senha} = req.body;

    try {
        //verificar se o usuário existe
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (resultado.rows.length === 0) {
            return res.status(400).json({error: 'Email ou senha inválidos'});
        }

        const user = resultado.rows[0];

        //verificar a senha
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida){
            return res.status(400).json({error: 'Email ou senha inválidos'});
        }
        //gerar token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                cliente_id: user.cliente_id
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({token});
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({error: 'Erro ao fazer login', details: err.message});
    }
};
