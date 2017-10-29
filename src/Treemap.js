import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import './Treemap.css';


export default class Treemap extends Component {


    componentDidMount() {
        this.drawTreemap();
    }

    componentDidUpdate() {
        this.drawTreemap();
    }


    drawTreemap() {
        const { dataset } = this.props;

        const width=960; 
        const height=570;

        d3.select("#treemapContainer").selectAll("*").remove();

        var svg = d3.select("#treemapContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        const legend = svg.append("g")
            .attr("id", "legend");

        const tip = d3Tip()
        .attr('class', 'd3-tip')
        .attr("id", "tooltip")
        .html((d) => (
            `<div>
                Category: ${d.data.category}<br />
                Name: ${d.data.name}
            </div>`
        ));
        svg.call(tip);

        var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
            color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
            format = d3.format(",d");

        var treemap = d3.treemap()
            .tile(d3.treemapResquarify)
            .size([width, height])
            .round(true)
            .paddingInner(1);

        d3.json(`./data/${dataset}`, function(error, data) {
            if (error) throw error;

            const root = d3.hierarchy(data)
                .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
                .sum(sumBySize)
                .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

            treemap(root);

            const cell = svg.selectAll("g")
                .data(root.leaves())
                .enter().append("g")
                .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

            //"data-name", "data-category", and "data-value
            cell.append("rect")
                .attr("class", "tile")
                .attr("id", function(d) { return d.data.id; })
                .attr("data-name", (d) => d.data.name )
                .attr("data-category", (d) => d.data.category )
                .attr("data-value", (d) => d.data.value )
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("fill", function(d) { return color(d.parent.data.id); })
                .on('mouseover', (d,i) => {
                    tip.attr("data-value", () => d.data.value);
                    tip.show(d,i);
                })
                .on('mouseout', tip.hide);

            cell.append("clipPath")
                .attr("id", function(d) { return "clip-" + d.data.id; })
                .append("use")
                .attr("xlink:href", function(d) { return "#" + d.data.id; });

            cell.append("text")
                .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
                .selectAll("tspan")
                .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
                .enter().append("tspan")
                .attr("x", 4)
                .attr("y", function(d, i) { return 13 + i * 10; })
                .text(function(d) { return d; });

            cell.append("title")
                .text(function(d) { return d.data.id + "\n" + format(d.value); });

            
        });


        const sumBySize = function (d) {
            return d.value;
        }
    }

    render() {
        return (
            <div id="treemapContainer"></div>
        )
    }
}