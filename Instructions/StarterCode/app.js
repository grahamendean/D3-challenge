// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data.csv
d3.csv("data.csv")
    .then(function(StateData){

//Get data from data.csv file and turn strings into integers
    StateData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
        data.obesity = +data.obesity;
    });
//Create scales for X and Y
    let xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(StateData, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([3.5, d3.max(StateData, d => d.obesity)])
        .range([height, 0]);

//Create axis
    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale);

//Append axis to the chartGroup
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
    .call(yAxis);
    
//Make Circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(StateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".6")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

        chartGroup.select("g")
        .selectAll("circle")
        .data(StateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        .attr("dy",-395)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black");
     
        console.log(StateData);

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 50)
      .attr("x", 0 -250)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 25})`)
      .attr("class", "axisText")
      .text("Living in Poverty by State(%)");

  // var tooltip = d3.select("#scatter")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("visibility", "visible")
  //     .text(StateData.abbr);
    
  //   //
  //   d3.select("circle")
  //     .on("mouseover", function(){return tooltip.style("visibility", "visible");})
  //     .on("mousemove", function(){return tooltip.style("top", (event.pageY-800)+"px").style("left",(event.pageX-800)+"px");})
  //     .on("mouseout", function(){return tooltip.style("visibility", "visible");});
  


});