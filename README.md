# API de Agendamento de Consultas

Esta API permite o registro e login de usuários, consulta de usuários cadastrados e registro de solicitações de agendamento de consulta, protegendo o endpoint de agendamento com autenticação JWT.

## Tecnologias
- Node.js
- Express
- JWT (jsonwebtoken)
- Swagger (documentação)

## Instalação

1. Clone o repositório ou copie os arquivos para seu ambiente.
2. Instale as dependências:
   ```
npm install express jsonwebtoken swagger-ui-express
   ```
## Configuração
Crie um arquivo .env na raiz do projeto com as propriedades BASE_URL_REST e BASE_URL_GRAPHQL, contendo a URL desses serviços.

## Como rodar a API

1. Inicie o servidor:
   ```
node server.js
   ```
2. Acesse a documentação Swagger em: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)

## Endpoints

### Registro de Usuário
- **POST** `/users/register`
  - Body: `{ "username": "string", "password": "string" }`

### Login
- **POST** `/users/login`
  - Body: `{ "username": "string", "password": "string" }`
  - Retorna: `{ "token": "JWT" }`

### Listar Usuários
- **GET** `/users`

### Registrar Agendamento de Consulta
- **POST** `/schedules/register`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "day": "string", "time": "string" }`

## Regras de Negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Para registrar agendamento, é necessário estar autenticado (JWT).
- Não é permitido agendar o mesmo dia/horário para o mesmo usuário.

## Observações
- O banco de dados é em memória (os dados são perdidos ao reiniciar o servidor).
- A API foi estruturada para facilitar testes automatizados (Supertest).
