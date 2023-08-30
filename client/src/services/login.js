import axios from './axios';

const login = async (credentials) => {
	const response = await axios.post('/api/login', credentials);
	return response.data;
};
  
const loginService = {
	login
};
export default loginService;