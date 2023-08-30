import React, {useEffect, useState} from 'react';
import '../styles/Modal.css';
import CourseData from './modal/CourseData';
import CourseForm from './modal/CourseForm';
import programsService from '../services/programs';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function Modal({ setModalOpen, programCourses, programName, allPrograms }) {

	const [courses, setCourses] = useState(null);
	const [missingCourses, setMissingCourses] = useState(null);
	const [courseHasData, setCourseHasData] = useState(true);
	const [formOpen, setFormOpen] = useState(false);

	const fetchCourses = async (courses) => {
		const courseObjects = [];
		const missingCourseObjects = [];
		for (let i = 0; i < courses.length; i++) {
			try {
				const fetchedCourse = await programsService.getCourse(courses[i]);
				courseObjects.push(fetchedCourse);
			} catch (e) {
				missingCourseObjects.push(courses[i]);
			}
		}
		setCourses(courseObjects);
		setMissingCourses(missingCourseObjects);
	};

	useEffect(() => {
		console.log(programCourses);
		try {
			fetchCourses(programCourses);
		} catch {
			setCourseHasData(false);
		}
	}, [programCourses]);

	return (
		<div className="modalBackground">
			<div className="modalContainer">
				<div className="closeBtn">
					<button
						onClick={() => setModalOpen(false)}
					>
            &times;
					</button>
				</div>
				<div className="title">
					{<h1>{programName}</h1>}
				</div>
				{ formOpen ?
					<CourseForm missingCourses={missingCourses} setFormOpen={setFormOpen} allPrograms={allPrograms}/>
					:
					courseHasData ? 
						courses ?
							<CourseData courses={courses} missingCourses={missingCourses} setFormOpen={setFormOpen}/>
							: 
							<div style={{ margin: '80px' }}>
								<CircularProgress sx={{ color: 'grey.500' }}/>
							</div>
						: 
						<div className="errorContainer">
							<Alert severity="error">Program data not found</Alert>
						</div>
				}
			</div>
		</div>
	);
}

export default Modal;