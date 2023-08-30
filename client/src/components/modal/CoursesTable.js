import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ElementLabel from './ElementLabel';
import '../../styles/CoursesTable.css';

const CoursesTable = ({ courses }) => {

	const [search, setSearch] = useState('');
	const [coursesToShow, setCoursesToShow] = useState(courses);

	useEffect(() => {
		setCoursesToShow(search === '' ? courses : courses.filter(c => c.code.includes(search) || c.name.includes(search)));
	}, [search, courses]);

	const handleIconPress = (course) => {
		localStorage.setItem('courseData', JSON.stringify(course));
		window.open(`/suggestChanges/${course.code}`, '_blank');
	};
  
	return (
		<div style={{ height: 'max-content'}}>
			<div id="headerContainer">
				<h2>Courses</h2>
				<div>
					<input id='searchInput'
						type="text"
						placeholder="Search by course code or name"
						onChange={({ target }) => setSearch(target.value)}
					/>
				</div>
			</div>
			<TableContainer >
				<Table sx={{ minWidth: 650 }}>
					<TableBody>
						{coursesToShow.map((course) => (
							<TableRow
								key={course.code}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									<div id='tableCellContainer'>
										<p id='courseCode'>{course.code}</p>
										<p id='courseName'>{course.name}</p>
									</div>
								</TableCell>
								<TableCell>
									<div id='onlineElementsContainer'>
										{ course.onlineElements.map(element =>
											<ElementLabel key={element} onlineElement={element} />
										)}
									</div>
								</TableCell>
								<TableCell>
									<Tooltip title={<p style={{ fontSize: '12px' }}> Suggest changes</p>}>
										<IconButton onClick={() => handleIconPress(course)} size="large">
											<FeedbackOutlinedIcon />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);

};

export default CoursesTable;