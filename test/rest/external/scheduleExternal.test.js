const request = require('supertest');   
const { expect } = require('chai');

describe('Schedule Controller', () => {
    describe('POST /schedule', () => {

        beforeEach(async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json');
            const respostaLogin = await request('http://localhost:3002')
                .post('/users/login')
                .send(postLogin);
            token = respostaLogin.body.token;
        });
        

        it('Quando não informo horário recebo 400', async () => {
            const respostaAgendamento = await request("http://localhost:3002")
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    day: "01/10/2025",
                    time: ""
                });

            expect(respostaAgendamento.status).to.equal(400);
            expect(respostaAgendamento.body.message).to.equal('Day and time are required.');
        });


        it('Quando informo dia e horário recebo 201', async () => {
            const respostaAgendamento = await request("http://localhost:3002")
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    day: "01/10/2025",
                    time: "11:00"
                });

            expect(respostaAgendamento.status).to.equal(201);
            expect(respostaAgendamento.body.message).to.equal('Schedule registered successfully.');
        });
    });
});