
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { baseUrl } from './helpers/baseUrl.js';
import { login } from './helpers/login.js';
import { dateFormat } from './helpers/randomDate.js';
import { timeFormat } from './helpers/randomTime.js';
import { randomPassword } from './helpers/randomPassword.js';
import faker from "k6/x/faker";

export let options = {
	vus: 100,
	duration: '25s',
	thresholds: {
		http_req_duration: ['p(90)<20']
	}
};

const schedulesRegisterTrend = new Trend('schedules_register_duration');

export default function () {
	let username, password, token;

	group('Registrar usuário', function () {
        username = `${faker.person.firstName()}_${__VU}_${__ITER}`;
		password = randomPassword();
		const payload = JSON.stringify({ username, password });
		const res = http.post(`${baseUrl()}/users/register`, payload, { headers: { 'Content-Type': 'application/json' } });
		check(res, {
			'register status 201': (r) => r.status === 201
		});
	});

	group('Login do usuário', function () {
		const loginRes = login(username, password);
		check(loginRes, {
			'login tem token': (r) => r && r.token
		});
		token = loginRes.token;
	});

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
		const res = http.post(`${baseUrl()}/schedules/register`, payload, params);
		schedulesRegisterTrend.add(res.timings.duration);
		check(res, {
			'agendamento status 201': (r) => r.status === 201
		});
	});

	sleep(1);
}
