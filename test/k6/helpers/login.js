// Função de login reutilizável
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
