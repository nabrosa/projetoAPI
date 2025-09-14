const request = require('supertest');   
const { expect } = require('chai');

describe('Schedule Controller', () => {
    describe('POST /schedule', () => {

        beforeEach(async () => {
            const loginUser = require('../fixture/requisicoes/login/loginUser.json');
            const respostaLogin = await request('http://localhost:4000/graphql')
                .post('')
                .send(loginUser);
            token = respostaLogin.body.data.login.token;
        });

        it('Quando informo dia e horário recebo 201', async () => {
            const registerSchedule = require('../fixture/requisicoes/schedule/registerSchedule.json')
            const respostaAgendamento = await request("http://localhost:4000/graphql")
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(registerSchedule);
            expect(respostaAgendamento.status).to.equal(200);
            expect(respostaAgendamento.body.data.registerSchedule).to.equal('Schedule registered successfully.');
        });
        

        const registerScheduleMandatory = require('../fixture/requisicoes/schedule/registerScheduleMandatory.json')
        registerScheduleMandatory.forEach(teste => {
            it(`Validar a obrigatoriedade dos campos quando: ${teste.nomeDoTeste}`, async () => {
                const respostaAgendamento = await request("http://localhost:4000/graphql")
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(teste.registerSchedule);

            expect(respostaAgendamento.body.errors[0].message).to.equal(teste.mensagemEsperada);
            })
        });
    });
});