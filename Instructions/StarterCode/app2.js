
var width = parseInt(d3.select('#scatter').style('width'));
var height = width - width/3.9;
var margin = 20;
var pad = 40;
var labelArea = 110;

var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .style('border','4px solid black')
    .attr('class','chart')

var data = runApp();

async function runApp() {
    data = await d3.csv('data.csv')

    data.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
    });
};

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin}, ${margin})`);

// var circlesGroup = chartGroup.selectAll("circle").data(data).enter();
var circlesGroup = svg.selectAll('circle').data(data).enter();

circlesGroup
.append("circle")
.attr("cx", d => d.poverty)
.attr("cy", d => d.obesity)
.attr("r", 40)
.attr("fill", "blue")
// .attr("opacity", ".6")
// .attr("stroke-width", "1")
// .attr("stroke", "black")

// chartGroup.select("g")
// .selectAll("circle")
// .data(data)
// .enter()
// .append("text")
// .text(d => d.abbr)
// .attr("x", d => xLinearScale(d.poverty))
// .attr("y", d => yLinearScale(d.obesity))
// .attr("dy",-395)
// .attr("text-anchor", "middle")
// .attr("font-size", "12px")
// .attr("fill", "red");

