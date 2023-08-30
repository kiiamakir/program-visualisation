import React, {useState, useEffect} from 'react';
import MultiSelect from './modal/formComponents/MultiSelect';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import emailjs from 'emailjs-com';
import '../styles/App.css';
import '../styles/SuggestChangesForm.css';

const SERVICE_ID = 'service_9z4at8h';
const TEMPLATE_ID = 'template_lag9c7u';
const PUBLIC_KEY = 'crUeY3rReL-JVK1GL';

const SuggestChangesForm = () => {

	const [courseData, setCourseData]  = useState(null);
	const [formSent, setFormSent] = useState(false);
	const [formSentSuccess, setFormSentSuccess] = useState(false);
	const [sender, setSender] = useState(''); 
	const [comments, setComments] = useState('');

	useEffect(() => {
		emailjs.init(PUBLIC_KEY);
		const courseJSON = localStorage.getItem('courseData');
		if (courseJSON) {
			const course = JSON.parse(courseJSON);
			setCourseData(course);
		}
		window.localStorage.removeItem('courseData');
	}, []);

	const stringifyOnlineElements = () => {
		let str = '';
		courseData.onlineElements.map((item) => (
			str += `- ${item} \n`
        ));
		return str;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const data = {
				code: courseData.code,
				name: courseData.name,
				onlineElements: stringifyOnlineElements(),
				comments: comments,
				sender: sender
			};
			console.log(data);
			emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
				.then((result) => {
					setFormSentSuccess(true);
				}, (error) => {
					console.log(error.text);
				});
			setFormSent(true);

		} catch (e) {
			console.log(e);
		}
	};

	const handleValueChange = (newValue) => {

		const updatedCourse = {...courseData, onlineElements: newValue};
		setCourseData(updatedCourse);
	};

	const handleNameChange = (newName) => {
		const updatedCourse = {...courseData, name: newName};
		setCourseData(updatedCourse);
	};

	return (
		<div id='changeFormContainer'>
			<h2>Suggest changes to course data</h2>
			{courseData ?
				formSent ?
					formSentSuccess ?
						<Alert severity="success">Your suggestions have been sent! This tab can be closed</Alert>
						:
						<Alert severity="error">Error! Form could not be sent, please try again</Alert>
					:
					<>
						<h3>{courseData.code}</h3>
						<form onSubmit={handleSubmit}>
							<div>
								<TextField
									label="Course name"
									type="text"
									placeholder="Course name"
									value={courseData.name}
									sx={{width:'500px'}}
									onChange={({ target }) => handleNameChange(target.value)}
									required
								/>  
							</div>
							<div>
								<MultiSelect handleValueChange={handleValueChange} currentlySelected={courseData.onlineElements}/>
							</div>
							<div>
								<TextField
									label="Comments"
									multiline
									rows={4}
									sx={{width:'500px'}}
									helperText="Comment or suggest new online elements"
									value={comments}
									onChange={({ target }) => setComments(target.value)}
								/>
							</div>
							<div>
								<TextField
									label="Sender"
									type="text"
									value={sender}
									sx={{width:'500px'}}
									onChange={({ target }) => setSender(target.value)}
									required
									helperText="Please enter your name or email address"
								/>  
							</div>
							<div id='buttonContainer'>
								<Button  size="small" variant="contained" type='submit'>
                        Submit
								</Button>
							</div>
						</form>
					</>
				: <p>Error loading the course data</p>
			}
		</div>
	);
};

export default SuggestChangesForm;