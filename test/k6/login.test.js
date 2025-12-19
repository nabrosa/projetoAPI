
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { baseUrl } from './helpers/baseUrl.js';

export let options = {
	thresholds: {
		http_req_duration: ['p(90)<15']
	},
    stages: [
		{ duration: '5s', target: 5 },
		{ duration: '10s', target: 10 },
		{ duration: '5s', target: 0 }
	]
};

const users = new SharedArray('users', function () {
	return JSON.parse(open('./data/login.test.data.json'));
});

export default function () {
	group('Login de usuário existente', function () {
		const user = users[__VU % users.length];
		const payload = JSON.stringify({ username: user.username, password: user.password });
		const res = http.post(`${baseUrl()}/users/login`, payload, { headers: { 'Content-Type': 'application/json' } });
		check(res, {
			'login status 200': (r) => r.status === 200,
			'login tem token': (r) => r.json('token') !== undefined
		});
	});
	sleep(1);
}
