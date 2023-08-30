import React, {useState, useEffect} from 'react';
import MultiSelect from './formComponents/MultiSelect';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import programsService from '../../services/programs';
import '../../styles/App.css';
import '../../styles/CourseForm.css';

const CourseForm = ({missingCourses , setFormOpen, allPrograms}) => {

	const [courseData, setCourseData] = useState(null);
	const [formSent, setFormSent] = useState(false);
	const [formSentSuccess, setFormSentSuccess] = useState(false);

	useEffect(() => {

		const fetchData = async () => {
			var arr = [];
			var len = missingCourses.length;

			for (let i = 0; i < len; i++) {

				let courseName = '';

				try {
					const fetchedCourse = await programsService.getSisuCourse(missingCourses[i]);
					courseName = fetchedCourse;
				} catch (e) {
					console.log(e);
				}

				arr.push({
					code: missingCourses[i],
					name: courseName,
					onlineElements: []
				});
			}

			setCourseData(arr);
		};

		fetchData();

	}, [missingCourses]);

	const createFormRow = (course, index) => {

		const handleValueChange = (newValues) => {

			const updatedCourse = {...course, onlineElements: newValues};
			const newCourses = [
				...courseData.slice(0, index),
				updatedCourse,
				...courseData.slice(index + 1)
			];
			setCourseData(newCourses);
		};

		const handleNameChange = (newName) => {
			const updatedCourse = {...course, name: newName};
			const newCourses = [
				...courseData.slice(0, index),
				updatedCourse,
				...courseData.slice(index + 1)
			];
			setCourseData(newCourses);
		};

		const handleDelete = () => {
			const newCourses = [
				...courseData.slice(0, index),
				...courseData.slice(index + 1)
			];
			setCourseData(newCourses);
		};

		return (
			<div id='formContainer' key={course.code}>
				<p id='formCourseCode'>{course.code}</p>
				<div id='formRow' key={course.code}>
					<TextField
						label="Course name"
						type="text"
						placeholder="Course name"
						value={course.name}
						sx={{width:'450px'}}
						onChange={({ target }) => handleNameChange(target.value)}
					/>  
					<MultiSelect handleValueChange={handleValueChange}/>
					<IconButton onClick={() => handleDelete()}>
						<DeleteIcon />
					</IconButton>
				</div>
			</div>
		);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setFormSent(true);
		try {
			const programsToUpdate = [];
			// go through each course that will be added to the database
			courseData.forEach(course => {
				// for every course with online elements, find the programs that include the course
				if (course.onlineElements.length > 0) {
					const programsWithCourse = allPrograms.filter(program => {
						return program.courses.includes(course.code);
					});
					// go through all the programs that contain the course
					programsWithCourse.forEach(program => {
						// check if progam is already in the list of programs to update
						const programIndex = programsToUpdate.findIndex(prog => {
							return program.name === prog.name;
						});
						// if yes, increase value there
						if (programIndex !== -1) {
							programsToUpdate[programIndex].value += 1;
						} else {
							// if not, add and increase
							programsToUpdate.push({...program, value: program.value+1});
    
						}
					});
				}
			});
			// add new courses to the database
			const response = await programsService.addCourses(courseData);
			console.log(response);
			// Add all updated programs to the database
			programsToUpdate.forEach(async program => {
				console.log(program);
				const res = await programsService.updateProgramValue(program);
				console.log(res);
			});
			setFormSentSuccess(true);
			//navigate(0, { replace: true });

		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<h3>Add course data</h3>
			{courseData ?
				formSent ?
					formSentSuccess ?
						<Alert severity="success">Course data successfully added! Please reload this window</Alert>
						:
						<Alert severity="error">Error! Form could not be sent, please try again</Alert>
					:
					<form onSubmit={handleSubmit}>
						{
							courseData.map((course, index) => createFormRow(course, index))
						}
						<div id='buttonContainer'>
							<Button  size="small" variant="outlined" onClick={() => setFormOpen(false)} sx={{ml: 'auto'}}>
                        Go Back
							</Button>
							<Button  size="small" variant="contained" type='submit'>
                        Submit
							</Button>
						</div>
					</form>
				:
				<CircularProgress sx={{ color: 'grey.500' }}/>
			}
		</>
	);
};

export default CourseForm;