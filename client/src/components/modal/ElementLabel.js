import React from 'react';
import '../../styles/CoursesTable.css';
import { elementColors, elementTextColors } from './elementColors.js';

const ElementLabel = ({ onlineElement }) => {

	return (
		<div style={{ backgroundColor: elementColors[onlineElement] }} id="elementLabelContainer">
			<p style={{ color: elementTextColors[onlineElement] }} id="elementText">
				{onlineElement}
			</p>
		</div>
	);
};

export default ElementLabel;