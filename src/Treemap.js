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
        const size = {
            width: 960,
            height: 570,
            margin: {
                top: 0,
                right: 0,
                bottom: 120,
                left: 0,
            },
            legend: {
                width: 500,
                size: 15,
                hSpacing: 150,
                vSpacing: 10,
            }
        }
        const legendCountPerRow = Math.floor(size.legend.width/size.legend.hSpacing);

        d3.select("#treemapContainer").selectAll("*").remove();
        d3.select(".d3-tip").remove();        

        var svg = d3.select("#treemapContainer")
        .append("svg")
        .attr("width", size.width)
        .attr("height", size.height);

        const legend = d3.select('#treemapContainer')
            .append("svg")
            .attr("width", size.legend.width )
            .attr("height", 200 )
            .attr("id", "legend")
            .attr("transform", `translate(${size.width/4}, ${0})`)
            .append('g');
            

        const tip = d3Tip()
        .attr('class', 'd3-tip')
        .attr("id", "tooltip")
        .html((d) => (
            `<div>
                Name: ${d.data.name}<br />
                Category: ${d.data.category}<br />
                Value: ${d.data.value}
            </div>`
        ));
        svg.call(tip);

        var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
            color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
            format = d3.format(",d");

        var treemap = d3.treemap()
            .tile(d3.treemapSquarify)
            .size([size.width, size.height])
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
                .attr("fill", function(d) { return color(d.data.category); })
                .on('mouseover', (d,i) => {
                    tip.attr("data-value", () => d.data.value);
                    tip.show(d,i);
                })
                .on('mouseout', tip.hide);

            cell.append("text")
                .attr('class', 'tile-text')
                .selectAll("tspan")
                .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
                .enter().append("tspan")
                .attr("x", 4)
                .attr("y", function(d, i) { return 13 + i * 10; })
                .text(function(d) { return d; });

            const categories = root.leaves().map( (node) => node.data.category ).filter( (cat, catIndex, catArr) => {
                return catIndex===0 || !catArr.slice(0, catIndex).includes(cat)
            } );

            const legendElement = legend.selectAll("g")
            .data(categories)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return `translate(
                    ${ ((i%legendCountPerRow)*size.legend.hSpacing) },
                    ${ ((Math.floor(i/legendCountPerRow))*size.legend.size + (size.legend.vSpacing*(Math.floor(i/legendCountPerRow)))) }
                )`;
            });

            legendElement.append("rect")
            .attr('width', size.legend.size)
            .attr('height', size.legend.size)
            .attr('class','legend-item')
            .attr('fill', (d) => color(d) )
                
            legendElement.append("text")
            .attr('x', size.legend.size + 3)
            .attr('y', size.legend.size + -2)
            .text( (d) => d);  

            
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