const request = require('supertest');   
const { expect } = require('chai');
require('dotenv').config();

describe('Schedule Controller', () => {
    describe('POST /schedule', () => {

        beforeEach(async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json');
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/users/login')
                .send(postLogin);
            token = respostaLogin.body.token;
        });
        

        it('Quando não informo horário recebo 400', async () => {
            const scheduleNoHour = require('../fixture/requisicoes/schedule/registerScheduleMandatoryHour.json');
            const respostaAgendamento = await request(process.env.BASE_URL_REST)
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send(scheduleNoHour);

            expect(respostaAgendamento.status).to.equal(400);
            expect(respostaAgendamento.body.message).to.equal('Day and time are required.');
        });


        it('Quando informo dia e horário recebo 201', async () => {
            const scheduleSuccess = require('../fixture/requisicoes/schedule/registerScheduleSuccess.json');
            const respostaAgendamento = await request(process.env.BASE_URL_REST)
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send(scheduleSuccess);

            expect(respostaAgendamento.status).to.equal(201);
            expect(respostaAgendamento.body.message).to.equal('Schedule registered successfully.');
        });
    });
});