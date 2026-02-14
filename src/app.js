const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors(
    { origin: "http://127.0.0.1:5500" }
));
app.use(express.json());

const carrosRouter = require('./routes/carros.routes.js');
const clientesRouter = require('./routes/clientes.routes.js');
const alugueisRouter = require('./routes/alugueis.routes.js');
const authRouter = require('./routes/auth.routes.js');


app.use('/auth', authRouter);// Added authentication routes

app.get('/', (req, res) => {
    res.send('API de Aluguel de Carros funcionando!');
});

app.use('/carros', carrosRouter);
app.use('/clientes', clientesRouter);
app.use('/alugueis', alugueisRouter);


module.exports = app;