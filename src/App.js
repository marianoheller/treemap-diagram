import React, { Component } from 'react';
import Treemap from './Treemap';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div id="title"></div>
				<div id="description"></div>
				<Treemap />
			</div>
		);
	}
}

export default App;
