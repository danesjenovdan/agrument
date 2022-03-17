import axios from 'axios';

export const api = axios.create();
export const dash = axios.create({ baseURL: '/api/dash' });
