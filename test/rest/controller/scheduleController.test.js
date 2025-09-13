const request = require('supertest');   
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../app');

const scheduleService = require('../../../service/scheduleService');

describe('Schedule Controller', () => {
    describe('POST /schedule', () => {

        beforeEach(async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json');
            const respostaLogin = await request(app)
                .post('/users/login')
                .send(postLogin);
            token = respostaLogin.body.token;
        });


        it('Mock: Quando não informo dia e horário recebo 400', async () => {
            const scheduleService = require('../../../service/scheduleService');
            const scheduleServiceMock = sinon.stub(scheduleService, 'registerSchedule');
            scheduleServiceMock.throws(new Error('Day and time are required.'));
           
            const respostaAgendamento = await request(app)
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    day: "",
                    time: ""
                });
            expect(respostaAgendamento.status).to.equal(400);
            expect(respostaAgendamento.body.message).to.equal('Day and time are required.');
        });


        it('Mock: Quando informo dia e horário já agendados recebo 409', async () => {
            const scheduleService = require('../../../service/scheduleService');
            const scheduleServiceMock = sinon.stub(scheduleService, 'registerSchedule');
            scheduleServiceMock.throws(new Error('Day and time are required.'));
            
            const respostaAgendamento = await request(app)
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    day: "30/09/2025",
                    time: "12:00"
                });
        
            expect(respostaAgendamento.status).to.equal(409);
            expect(respostaAgendamento.body.message).to.equal('Schedule already exists for this user at this time.');
        });

        afterEach(() => {
            sinon.restore();
        });
    });
});