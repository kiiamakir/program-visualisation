import React, {useState, useEffect} from 'react';
import MultiSelect from './modal/formComponents/MultiSelect';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import programsService from '../services/programs';
import '../styles/App.css';
import '../styles/SuggestChangesForm.css';


const ModifyCourseForm = () => {

	const [formSent, setFormSent] = useState(false);
	const [formSentSuccess, setFormSentSuccess] = useState(false);
	const [user, setUser] = useState(null);

	const [courseCode, setCourseCode] = useState('');
	const [courseName, setCourseName] = useState('');
	const [onlineElements, setOnlineElements] = useState([]);

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
			console.log(onlineElements);
			const courseData = {
				code: courseCode,
				name: courseName,
				onlineElements: onlineElements,
			};
			const response = await programsService.updateCourse(courseData);
			console.log(response);

			setFormSentSuccess(true);

		} catch (e) {
			console.log(e);
		}
		setFormSent(true);
	};

	return (
		<div id='changeFormContainer'>
			<h2>Modify Course Data</h2>
			{user ?
				formSent ?
					formSentSuccess ?
						<Alert severity="success">Course data succesfully modified! This tab can be closed</Alert>
						:
						<Alert severity="error">Error! Form could not be sent, please try again</Alert>
					:
					<form onSubmit={handleSubmit}>
						<div>
							<TextField
								label="Course code"
								type="text"
								value={courseCode}
								sx={{width:'500px'}}
								onChange={({ target }) => setCourseCode(target.value)}
							/>  
						</div>
						<div>
							<TextField
								label="Course name"
								type="text"
								value={courseName}
								sx={{width:'500px'}}
								onChange={({ target }) => setCourseName(target.value)}
							/>  
						</div>
						<div>
							<MultiSelect handleValueChange={setOnlineElements}/>
						</div>
						<div id='buttonContainer'>
							<Button  size="small" variant="contained" type='submit'>
                        Submit
							</Button>
						</div>
					</form>
				: <p>This page is only accessible for Admins</p>
			}
		</div>
	);
};

export default ModifyCourseForm;