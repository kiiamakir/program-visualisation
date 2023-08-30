import axios from './axios';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const getAllPrograms = async () => {
	const response = await axios.get('');
	return response.data;
};

const getProgram = async (courseName) => {
	const response = await axios.get(`/api/programs/${courseName}`);
	return response.data;
};

const getCourse = async (course) => {
	const response = await axios.get(`/api/courses/${course}`);
	return response.data;
};

const getSisuCourse = async (course) => {
	const response = await axios.get(`/api/courses/sisu/${course}`);
	return response.data;
};

const addCourses = async (courses) => {
	const config = {
		headers: { Authorization: token },
	};
	const response = await axios.post('/api/courses/', courses, config);
	return response.data;
};

const updateProgramValue = async (program) => {
	const response = await axios.post('/api/programs/updateValue', program);
	return response.data;
};

const updateCourse = async (course) => {
	const config = {
		headers: { Authorization: token },
	};
	const response = await axios.post('/api/courses/updateCourse', course, config);
	return response.data;
};

const programsService = {
	getAllPrograms,
	getProgram,
	getCourse,
	getSisuCourse,
	addCourses,
	updateProgramValue,
	setToken,
	updateCourse
};
export default programsService;