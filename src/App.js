import React, { Component } from 'react';
import Treemap from './Treemap';
import './App.css';


const datasets = [
	{
		filename: "kickstarter-funding-data.json",
		label: "Kickstarter funding",
		title: "Kickstarter Pledges",
		description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category"
	},
	{
		filename: "movie-data.json",
		label: "Movies",
		title: "Movie Sales",
		description: "Top 100 Highest Grossing Movies Grouped By Genre",
	},
	{
		filename: "video-game-sales-data.json",
		label: "Video game sales",
		title: "Video Game Sales",
		description: "Top 100 Most Sold Video Games Grouped by Platform",
	},
]


class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			dataset: datasets[0],
		}
	}

	handleRadioClick(e) {
		this.setState({
			dataset: datasets.find( (dataset) => dataset.filename === e.target.value),
		})
	}

	render() {
		const { dataset: currentDataset } = this.state;
		return (
			<div className="container">

				<div className="row">
					<div className="twelve columns">
						<form>
							{ datasets.map( (dataset, i) => 
							<div className="one-third column" key={`dataset${i}`} >
								<label>
									<input 
									checked={ dataset.filename===currentDataset.filename ? true : false}
									type="radio" 
									id={`dataset${i}`} 
									name="dataset" 
									value={dataset.filename} 
									onChange={this.handleRadioClick.bind(this)}
									/>
									<span className="label-body">{dataset.label}</span>
								</label>
							</div> )}
						</form>
					</div>
					
				</div>
				

				<h1 id="title">{currentDataset.title}</h1>
				<h5 id="description">{currentDataset.description}</h5>

				<Treemap dataset={currentDataset.filename} />
			</div>
		);
	}
}

export default App;
