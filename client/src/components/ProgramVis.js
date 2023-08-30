import React, { useEffect, useState } from 'react';
import CirclePack from './CirclePack';
import programsService from '../services/programs';
import CircularProgress from '@mui/material/CircularProgress';
import programData from './programData';
import '../styles/ProgramVis.css';

const ProgramVis = () => {

	const [programs, setPrograms] = useState(null);
	const [programsList, setProgamsList] = useState(null);

	useEffect(() => {

		var root = JSON.parse(JSON.stringify(programData));
		var programs = [];

		const eachRecursive = async (obj) => {
			if (obj.hasOwnProperty('children')) {
				Promise.all(await obj['children'].map(async child => await eachRecursive(child)));

				return root;
    
			} else {
				const programData = await programsService.getProgram(obj['name']);
				programs.push(programData);
				obj['value'] = programData.value / programData.courses.length;
				obj['courses'] = programData.courses;
			}
		};
		const x = async () => {
			const res = await eachRecursive(root);

			setTimeout(() => {
				setPrograms(res);
				setProgamsList(programs);
			}, 10000);

		};
      
		x();
        
	}, []);

	return (
		<div>
			{programs ?
				<CirclePack programData={programs} programsList={programsList} />
				: 
				<div id='progress-container'>
					<CircularProgress sx={{ color: 'grey.500' }}/>
				</div>
			}
		</div>

	);

};

export default ProgramVis;