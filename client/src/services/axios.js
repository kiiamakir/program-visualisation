import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || '3001';

export default axios.create({
	baseURL: `${BACKEND_URL}:${BACKEND_PORT}`
});