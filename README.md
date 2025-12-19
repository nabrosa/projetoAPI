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


##----------------------------------------------------------------------------


## Testes de Performance com k6

Este projeto utiliza o **k6** para execução de testes de performance em APIs


## Conceitos de Teste de Performance Aplicados (k6)
🔹 Thresholds
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js e demontra o uso do conceito de Thresholds, validando que o teste passará se 90% dos usuários executar em até 2000ms.

   thresholds: {
		http_req_duration: ['p(90)<2000']
	}


🔹 Checks
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js e confere se a execução da requisição retornou 201.

      check(res, {
			'register status 201': (r) => r.status === 201
		});


🔹 Helpers
As funções utilitárias que podem ser chamadas nos testes para não ter que ficar repetindo código, estão na pasta helpers. Um exemplo é código abaixo que está armazenado no arquivo test/k6/helpers/login.js, e no teste que usará esta função de login, é necessário importá-la e chamar a função passando username e passaword.

   import http from 'k6/http';
   import { check } from 'k6';
   import { baseUrl } from './baseUrl.js';

   export function login(username, password) {
      const url = `${baseUrl()}/users/login`;
      const payload = JSON.stringify({ username, password });
      const params = { headers: { 'Content-Type': 'application/json' } };
      const res = http.post(url, payload, params);
      check(res, { 'login status 200': (r) => r.status === 200 });
      return res.json();
   }


🔹 Trends
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js e demonstra o conceito de trends, na primeira linha cria uma métrica customizada do tipo Trend chamada 'schedulesRegisterTrend'. Na segunda linha vai adicionar à métrica o tempo total da requisição HTTP em milissegundos.

   //antes do group
   const schedulesRegisterTrend = new Trend('schedules_register_duration');
   ...
   //no group 'Registrar agendamento' após fazer a requisição
   schedulesRegisterTrend.add(res.timings.duration);


🔹 Faker
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js e tem como objetivo gerar um nome fake para o campo 'username' no registro de usuário.

   username = `${faker.person.firstName()}_${__VU}_${__ITER}`;


🔹 Variável de Ambiente
O código abaixo está armazenado no arquivo test/k6/hekpers/baseUrl.js, e demonstra o uso de variável de ambiente. É uma função que usa a URL que veio da variável de ambiente __ENV.BASE_URL, mas se não encontrar usa http://localhost:3003.
   
   export function baseUrl() {
       return __ENV.BASE_URL || 'http://localhost:3003';
   }


🔹 Stages
O código abaixo está armazenado no arquivo test/k6/login.test.js, e nele é definida a carga de usuários virtuais, em um determinado tempo durante a execução, com o objetivo de controlar a quantidade de usuários ao longo do tempo.

   export let options = {
      stages: [
         { duration: '5s', target: 5 },// subir para 5 VUs em 5 segundos
         { duration: '10s', target: 10 },// aumentar até 10 VUs em 10 segundos
         { duration: '5s', target: 0 }// reduzir para 0 VUs em 5 segundos
      ]
   };


🔹 Reaproveitamento de Resposta
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js, e representa o reaproveitamento de resposta, nele é feito o registro de agendamento passando no Authorization o token obtido no group Login do usuário.

   group('Registrar agendamento', function () {
      const formattedDate = dateFormat();
      const formattedTime = timeFormat();
      const payload = JSON.stringify({ day: formattedDate, time: formattedTime });
		const params = {
		   headers: {
			   'Content-Type': 'application/json',
			   'Authorization': `Bearer ${token}`
		   }
	   };
   ...
   });


🔹 Uso de Token de Autenticação
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js, e no comando "token = loginRes.token;" o token apresentado na resposta do login é salvo na variável 'token'.

   group('Login do usuário', function () {
		const loginRes = login(username, password);
		check(loginRes, {
			'login tem token': (r) => r && r.token
		});
		token = loginRes.token;
	});


🔹 Data-Driven Testing
O código abaixo está armazenado no arquivo test/k6/login.test.js, nele é criado um array do tipo SharedArray (estrutura de dados especial do k6, para compartilhar dados entre VUs) que retorna os dados de um json, e no teste permite a automação selecionar um usuário do arquivo json. Ao obter um usuário, monta o payload que será usado na requisição do login.

   const users = new SharedArray('users', function () {
	   return JSON.parse(open('./data/login.test.data.json'));
   });

   export default function () {
      group('Login de usuário existente', function () {
         const user = users[__VU % users.length];
         console.log(user);
         const payload = JSON.stringify({ username: user.username, password: user.password });
         const res = http.post(`${baseUrl()}/users/login`, payload, { headers: { 'Content-Type': 'application/json' } });
         ...
      });
   }


🔹 Groups
O código abaixo está armazenado no arquivo test/k6/agendarConsulta.test.js, e agrupa as ações do teste Login de usuário, para organizar o script por "assunto" e ficar mais legível.

	group('Login do usuário', function () {
		const loginRes = login(username, password);
		check(loginRes, {
			'login tem token': (r) => r && r.token
		});
		token = loginRes.token;
	});