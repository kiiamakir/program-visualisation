import React, { useEffect, useState } from 'react';
import CoursesTable from './CoursesTable';
import OnlineElementStats from './OnlineElementStats';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const CourseData = ({courses, missingCourses, setFormOpen}) => {

	const [user, setUser] = useState(false);

	useEffect(() => {
		const userJSON = localStorage.getItem('user');
		if (userJSON) {
			setUser(true);
		}
	}, []);

	if(courses.length > 0) {
		if(missingCourses.length > 0) {
			return (
				<>
					<Alert sx={{ margin: '20px 0px 10px 0px'}}severity="info" action={
						user &&
              ( <Button color="inherit" size="small" variant="outlined" onClick={() => setFormOpen(true)}>
                  Add course data
              </Button> )
					}>
                  This program is missing data from <strong>{missingCourses.length} courses</strong>
					</Alert>
					<div>
						<OnlineElementStats courses={courses} />  
						<CoursesTable courses={courses} />
					</div>
				</>
			);
		}
		return (
			<div>
				<OnlineElementStats courses={courses} />  
				<CoursesTable courses={courses} />
			</div>
		);
	} 
	return (
		<div className="errorContainer">
			<Alert sx={{ margin: '20px 0px'}}severity="error" action={
				user &&
              ( <Button color="inherit" size="small" variant="outlined" onClick={() => setFormOpen(true)}>
                Add course data
              </Button> )
			}>
                All course data is missing for this program
			</Alert>
		</div>
	);
    
};

export default CourseData;