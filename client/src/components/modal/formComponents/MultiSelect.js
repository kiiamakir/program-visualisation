import React, { useState } from 'react';
import {
	OutlinedInput,
	InputLabel,
	MenuItem,
	Select,
	FormControl,
	Stack,
	Chip
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { elementColors } from '../elementColors.js';


const MultiSelect = ({ handleValueChange, currentlySelected=[] }) => {
	const [selectedElements, setSelectedElements] = useState(currentlySelected);

	return (
		<FormControl sx={{ m: 1, width: 500 }}>
			<InputLabel>Online Elements</InputLabel>
			<Select
				multiple
				value={selectedElements}
				onChange={(e) => {
					setSelectedElements(e.target.value);
					handleValueChange(e.target.value);
				}}
				input={<OutlinedInput label="Online Elements" />}
				renderValue={(selected) => (
					<Stack gap={1} direction="row" flexWrap="wrap">
						{selected.map((value) => (
							<Chip
								key={value}
								label={value}
								onDelete={() => {
									const newElements = selectedElements.filter((item) => item !== value);
									setSelectedElements(newElements);
									handleValueChange(newElements);
								}}
								deleteIcon={
									<CancelIcon
										onMouseDown={(event) => event.stopPropagation()}
									/>
								}
							/>
						))}
					</Stack>
				)}
			>
				{Object.keys(elementColors).map((name) => (
					<MenuItem
						key={name}
						value={name}
						sx={{ justifyContent: 'space-between' }}
					>
						{name}
						{selectedElements.includes(name) ? <CheckIcon color="info" /> : null}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default MultiSelect;