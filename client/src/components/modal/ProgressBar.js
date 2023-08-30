import React from 'react';
import '../../styles/OnlineElementStats.css';

const makeTransparent = (hexColor) => {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);
	return `rgba( ${r}, ${g}, ${b}, 0.3 )`;
};

const ProgressBar = (props) => {
	let {
		size = 80,
		progress = 0,
		trackWidth = 10,
		indicatorWidth = 10,
		indicatorColor = '#07c',
		trackColor = makeTransparent(indicatorColor),
		indicatorCap = 'round',
		label = 'Loading...',
		spinnerMode = false,
		spinnerSpeed = 1
	} = props;
  
	const center = size / 2,
		radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
		dashArray = 2 * Math.PI * radius,
		dashOffset = (dashArray * ((100 - progress) / 100)).toFixed(0);
  
	let hideLabel = (size < 10 || !label.length || spinnerMode) ? true : false;
  
	return (
		<>
			<div
				className="svg-pi-wrapper"
				style={{ width: size, height: size }}
			>
				<svg
					className="svg-pi" 
					style={{ width: size, height: size }}
				>
					<circle
						className="svg-pi-track"
						cx={center}
						cy={center}
						fill="transparent"
						r={radius}
						stroke={trackColor}
						strokeWidth={trackWidth}
					/>
					<circle
						className={`svg-pi-indicator ${
							spinnerMode ? 'svg-pi-indicator--spinner' : ''
						}`}
						style={{ animationDuration: spinnerSpeed * 1000 }}
						cx={center}
						cy={center}
						fill="transparent"
						r={radius}
						stroke={indicatorColor}
						strokeWidth={indicatorWidth}
						strokeDasharray={dashArray}
						strokeDashoffset={dashOffset}
						strokeLinecap={indicatorCap}
					/>
				</svg>
  
				{!hideLabel && (
					<div 
						className="svg-pi-label" 
						style={{ color: indicatorColor }}
					>
  
						{!spinnerMode && (
							<span className="svg-pi-label__progress">
								{`${
									progress > 100 ? 100 : progress
								} %`}
							</span>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default ProgressBar;