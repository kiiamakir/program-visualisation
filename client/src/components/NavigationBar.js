import React, {useState, useEffect} from 'react';
import '../styles/App.css';
import '../styles/NavigationBar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import loginService from '../services/login';
import programsService from '../services/programs';


const NavigationBar = () => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const userJSON = localStorage.getItem('user');
		if (userJSON) {
			const user = JSON.parse(userJSON);
			setUser(true);
			programsService.setToken(user.token);
		}
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({
				username, password,
			});
			localStorage.setItem('user', JSON.stringify(user));
			programsService.setToken(user.token);
			setUser(true);
			setUsername('');
			setPassword('');

		} catch (exception) {
			console.log('Wrong credentials');
		}
	};
	const handleLogout = () => {
		window.localStorage.removeItem('user');
		navigate(0, { replace: true });
	};

	return (
		<nav id='nav-bar'>
			<NavLink to='/'> 
        Aalto Program Visualization
			</NavLink>
			<div id='login-container'>
				{user ?
					<div id='button-container'>
						<Button  size="small"
							variant="contained"
							onClick={() => navigate('/modifyCourse')}
							sx={{color: '#243949', backgroundColor: 'white', ':hover': {bgcolor: '#dbdbdb', color: '#243949'}}}>
            Modify course data
						</Button> 
						<Button  size="small"
							variant="contained"
							onClick={handleLogout}
							sx={{color: '#243949', backgroundColor: 'white', ':hover': {bgcolor: '#dbdbdb', color: '#243949'}}}>
            Log out
						</Button>
					</div>
					:
					<form id='login-form' onSubmit={handleSubmit}>
						<TextField
							size="small"
							label="Username"
							type="email"
							value={username}
							sx={{ backgroundColor: 'white'}}
							onChange={({ target }) => setUsername(target.value)}
							variant="filled"
						/>
						<TextField
							size="small"
							label="Password"
							type="text"
							value={password}
							sx={{backgroundColor: 'white'}}
							onChange={({ target }) => setPassword(target.value)}
							variant="filled"
						/>
						<Button  size="small" variant="contained" type='submit'
							sx={{color: '#243949', backgroundColor: 'white', ':hover': {bgcolor: '#dbdbdb', color: '#243949'}}}>
            Login
						</Button> 
					</form>
				}
			</div>
		</nav>
	);
};

export default NavigationBar;