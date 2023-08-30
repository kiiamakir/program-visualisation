import './styles/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ProgramVis from './components/ProgramVis';
import SuggestChangesForm from './components/SuggestChangesForm';
import ModifyCourseForm from './components/ModifyCourseForm';

const App = () => {

	return (
		<BrowserRouter>
			<NavigationBar></NavigationBar>
			<Routes>
				<Route path='/' element={<ProgramVis/>}/>
				<Route path='/suggestChanges/:courseCode' element={<SuggestChangesForm/>}/>
				<Route path='/modifyCourse' element={<ModifyCourseForm/>}/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
