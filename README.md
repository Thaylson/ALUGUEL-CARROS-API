# Aluguel Carros API

Projeto de estudo de um sistema de aluguel de carros. Inclui uma API REST construída em Node.js (Express), persistência em PostgreSQL e autenticação com JWT. Também conta com um front-end web simples para testar as funcionalidades. O foco é praticar modelagem relacional, SQL, rotas REST, controle de acesso por roles (admin/cliente) e integração front-end ↔ API.

## Tecnologias
- Node.js
- Express
- PostgreSQL
- JWT

## Requisitos
- Node.js 18+ (ou superior)
- PostgreSQL

## Instalacao
1) Clone o repositorio
2) Instale as dependencias
```
npm install
```

## Configuracao
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

Exemplo:
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=senha
DB_NAME=aluguel-carro
DB_PORT=5432
PORT=3000
JWT_SECRET=uma_chave_segura
JWT_EXPIRES_IN=1d
```

## Execucao
```
npm start
```

## Rotas principais
- `POST /auth/login`
- `GET /carros`
- `POST /carros`
- `GET /alugueis`
- `POST /alugueis`

## Frontend
Abra o arquivo [frontend/index.html](frontend/index.html) no navegador para usar a interface basica.

## Observacoes
- O arquivo `.env` nao deve ser commitado.
- Use o `.env.example` como referencia.

## Próximos passos
- CRUD completo de clientes
- Interface admin completa
- Validação de payload
- Controle de disponibilidade de carros
- Logs e rate limit no login
