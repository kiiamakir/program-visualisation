import React, {useEffect, useState} from 'react';
import '../../styles/OnlineElementStats.css';
import { elementColors, elementAmounts, elementSecondaryColors, elementHelperTexts } from './elementColors.js';
import ProgressBar from './ProgressBar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const OnlineElementStats = ({ courses }) => {

	const [onlineElementAmounts, setOnlineElementAmounts] = useState({});

	const onlineElements = Object.keys(elementColors);
	const numOfCourses = courses.length;

	useEffect(() => { 
		const newAmounts = JSON.parse(JSON.stringify(elementAmounts));
		courses.forEach(course => {
			course.onlineElements.forEach(elem => {
				newAmounts[elem] += 1;
			});
			setOnlineElementAmounts(newAmounts);
		});
	}, [courses]);

	return (
		<div id="statsContainer">
			{onlineElements.map(element => {
				const progress = (onlineElementAmounts[element] / numOfCourses) * 100;
				return (
					<div key={element} style={{ backgroundColor: elementColors[element] }} id="stats">
						<div id="flexContainer">
							<div><ProgressBar progress={progress.toFixed(0)} trackWidth={7} indicatorWidth={8} indicatorColor={elementSecondaryColors[element]} /></div>
							{elementHelperTexts[element] && (<div>
								<Tooltip title={<p style={{ fontSize: '14px' }}> {elementHelperTexts[element]} </p>} arrow>
									<IconButton>
										<InfoOutlinedIcon style={{color: elementSecondaryColors[element]}}/>
									</IconButton>
								</Tooltip>
							</div>)}
						</div>
						<div style={{ color: elementSecondaryColors[element] }} id="textContainer">
							<h4>{element}</h4>
							<p>{`${onlineElementAmounts[element]}/${numOfCourses} courses`}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default OnlineElementStats;