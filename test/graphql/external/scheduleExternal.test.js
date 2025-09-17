const request = require('supertest');   
const { expect } = require('chai');
require('dotenv').config();

describe('Schedule Controller', () => {
    describe('POST /schedule', () => {

        beforeEach(async () => {
            const loginUser = require('../fixture/requisicoes/login/loginUser.json');
            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(loginUser);
            token = respostaLogin.body.data.login.token;
        });

        it('Quando informo dia e horário tenho sucesso', async () => {
            const registerSchedule = require('../fixture/requisicoes/schedule/registerSchedule.json')
            const respostaAgendamento = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(registerSchedule);
            expect(respostaAgendamento.status).to.equal(200);
            expect(respostaAgendamento.body.data.registerSchedule).to.equal('Schedule registered successfully.');
        });
        

        const registerScheduleMandatory = require('../fixture/requisicoes/schedule/registerScheduleMandatory.json')
        registerScheduleMandatory.forEach(teste => {
            it(`Validar a obrigatoriedade dos campos quando: ${teste.nomeDoTeste}`, async () => {
                const respostaAgendamento = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(teste.registerSchedule);

            expect(respostaAgendamento.body.errors[0].message).to.equal(teste.mensagemEsperada);
            })
        });
    });
});