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
            const scheduleMandatory = require('../fixture/requisicoes/schedule/registerScheduleMandatory.json');
            const scheduleService = require('../../../service/scheduleService');
            const scheduleServiceMock = sinon.stub(scheduleService, 'registerSchedule');
            scheduleServiceMock.throws(new Error('Day and time are required.'));
           
            const respostaAgendamento = await request(app)
                .post('/schedules/register')
                .set('Authorization', `Bearer ${token}`)
                .send(scheduleMandatory);
                
            expect(respostaAgendamento.status).to.equal(400);
            expect(respostaAgendamento.body.message).to.equal('Day and time are required.');
        });


        afterEach(() => {
            sinon.restore();
        });
    });
});