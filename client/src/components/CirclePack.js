import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import '../styles/circlePacking.css';
import Modal from './Modal';

const CirclePack = ({programData, programsList}) => {

	const [modalOpen, setModalOpen] = useState(false);
	const [programCourses, setProgramCourses] = useState([]);
	const [programName, setProgramName] = useState('');

	const svgRef = useRef();

	useEffect(() => {
		var margin = 20,
			diameter = 950,

			root = programData;
    
		var color = d3.scaleLinear()
			.domain([0,3])
			.range([ '#40809c', '#b1d4e6'])
			.interpolate(d3.interpolateHcl);
    
		var pack = d3.pack()
			.size([diameter - margin, diameter - margin])
			.padding(2);
    
		var svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();

		var g = svg.append('g').attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');
    
		root = d3.hierarchy(root)
			.sum(function(d) { 
				if(d.value === 0) {
					return 0.1;
				} else return d.value; })
			.sort(function(a, b) { return b.value - a.value; });

		var focus = root,
			nodes = pack(root).descendants(),
			view;
    
		var circle = g.selectAll('circle')
			.data(nodes)
			.enter().append('circle')
			.attr('class', function(d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root'; })
			.style('fill', function(d) { 
				return d.children ? color(d.depth) : (d.value === 0.1 ? '#d1e3eb' : null); })
			.on('click', function(d) { if (focus !== d) {
				zoom(d);
				d3.event.stopPropagation();
			} });
  
		g.selectAll('circle')           
			.each(function(d) {
				d.bbox = this.getBBox();
				var rows = d.data.name.split(' ');
				d.rows = rows.length;
				var longest = rows.sort(
					function (a, b) {
						return b.length - a.length;
					}
				)[0];
				if (longest.length > 4) {
					d.longest = longest.length;
				} else {
					d.longest = 5;
				}
			});
    
		g.selectAll('foreignObject')
			.data(nodes)
			.enter().append('foreignObject')
			.attr('width', (function(d) {
				return d.longest*8.2;
			}))
			.attr('height', (function(d) {
				return d.rows*25;
			}))
			.attr('x', (function(d) {
				return d.bbox.x+d.bbox.width/2-(d.longest*8.2)/2;
			}))
			.attr('y', (function(d) {  
				return d.bbox.y+d.bbox.height/2-(d.rows*18/2);
			}))
			.attr('class', function(d) { return d.parent && !d.children ? 'leaf--label label' : 'label'; })
			.style('fill-opacity', function(d) { return d.parent === root ? 1 : 0; })
			.style('display', function(d) { return d.parent === root ? 'inline' : 'none'; })
			.html(function(d) {
				var html = d.data.name.split(' ');
				return html.join('<br>');
			});
    
		var node = g.selectAll('circle,foreignObject');

		d3.selectAll('.leaf--label')
			.on('click', function(d) { 
				setProgramName(d.data.name);
				setProgramCourses(d.data.courses);
				setModalOpen(true);
			});
    
		d3.select('body')
			.on('click', function() {
				zoom(root);
			});
    
		zoomTo([root.x, root.y, root.r * 2 + margin]);
    
		function zoom(d) {
			var focus = d;
    
			var transition = d3.transition()
				.duration(d3.event.altKey ? 7500 : 750)
				.tween('zoom', function(d) {
					var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					return function(t) { zoomTo(i(t)); };
				});
    
			transition.selectAll('foreignObject')
				.filter(function(d) { return d.parent === focus || this.style.display === 'inline'; })
				.style('fill-opacity', function(d) { return d.parent === focus ? 1 : 0; })
				.on('start', function(d) { if (d.parent === focus) this.style.display = 'inline'; })
				.on('end', function(d) { if (d.parent !== focus) this.style.display = 'none'; });
		}
    
		function zoomTo(v) {
			var k = diameter / v[2]; view = v;
    
			node.attr('transform', function(d) {
				return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')';
			});
			circle.attr('r', function(d) { return d.r * k; });
		}
	}, [modalOpen, programData]);

	return (
		<div className='circle-container'>
			<div className="text-container">
				<h2 className='front-page-header'>Welcome to the interactive Aalto Program Visualization!</h2>
				<p>Embark on a journey of exploration into the various online teaching methods at Aalto University. This visual representation displays and contrasts the range of online tools that are used across programs and courses at Aalto.</p>
				<p>Each of the schools at Aalto is represented by a light blue circle that contains all of the programs offered by that school. The white circles symbolize individual programs. The size of a white circle indicates the amount of courses utilizing online teaching methods in a program. The larger the circle, the higher the percentage of courses in that program that feature online teaching methods. Clicking the name of a program opens a view with statistics and course-specific information.</p>
				<p>Get started by clicking on a circle! </p>
			</div>
			{modalOpen && <Modal setModalOpen={setModalOpen} programCourses={programCourses} programName={programName} allPrograms={programsList}/>}
			<svg ref={svgRef} width="950" height="950" >
			</svg>
		</div>
    
	);
};

export default CirclePack;