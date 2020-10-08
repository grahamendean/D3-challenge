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

// Create an svg wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append svg group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//displayed x and y
var chosenXAxis = 'poverty';
var chosenYAxis = 'obesity';



function xScale(StateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(StateData, d => d[chosenXAxis]) * 0.8,
    d3.max(StateData, d => d[chosenXAxis]) * 1.2])
    .range([width, 0]);

  return xLinearScale;
}

function yScale(StateData, chosenYAxis) {
  //scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(StateData, d => d[chosenYAxis]) * 0.8,
      d3.max(StateData, d => d[chosenYAxis]) ])
    .range([height, 0]);
  return yLinearScale;
}


//render x and y axis
    function renderXAxis(newXScale, xAxis) {
      let bottomAxis = d3.axisBottom(newXScale)
      xAxis.transition()
      .duration(2000)
      .call(bottomAxis)
    return xAxis;
    }

    function renderYAxis(newYScale, yAxis) {
      let leftAxis = d3.axisLeft(newYScale)
      yAxis.transition()
      .duration(2000)
      .call(leftAxis)
    return yAxis;
    }

//function to render the circle
   function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
     circlesGroup.transition()
     .duration(1000)
     .attr("cx", d => newXScale(d[chosenXAxis]))
     .attr("cy", d => newYScale(d[chosenYAxis]))
     
     return circlesGroup;
}

//render the text
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  textGroup.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]))
  .attr("y", d=> newYScale(d[chosenYAxis]));
  return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {
  //style based on variable
  //poverty
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income
  else if (chosenXAxis === 'income') {
      return `${value}`;
  }
  else {
    return `${value}`;
  }
}

function styleY(value, chosenYAxis) {
  //style based on variable
  if (chosenYAxis === 'obesity') {
      return `${value}%`;
  }
  else if (chosenYAxis === 'smoker') {
      return `${value}`;
  }
  else {
    return `${value}`;
  }
}

//update tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "income"){
    xlabel = "Income:"
  }
  else {
    xlabel = "Age:";
  }

  var ylabel;

  if (chosenYAxis === "obesity") {
    ylabel = "Obesity:";
  }
  else if (chosenYAxis === "smokes"){
    ylabel = "Smokers:"
  }
  else {
    ylabel = "Healthcare:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${ylabel} ${styleY(d[chosenYAxis], chosenYAxis)}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
  
  return circlesGroup;
}

//import data.csv
d3.csv("data.csv")
    .then(function(StateData, err){
      if (err) throw err;

//Get data from data.csv file and turn strings into integers
    StateData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
    });

    //create linear scales
    var xLinearScale = xScale(StateData, chosenXAxis);
    var yLinearScale = yScale(StateData, chosenYAxis);
    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);
    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);


//Append axis to the chartGroup
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);
    
//Make Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(StateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 10)
        .attr("fill", "black")
        .attr("opacity", ".6")
        .attr("stroke-width", "1")
        .attr("stroke", "black");


      var textGroup = chartGroup.selectAll('.stateText')
        .data(StateData)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .attr('dy', 3)
        .attr('font-size', '10px')
        .text(function(d){return d.abbr});
     
        console.log(StateData);
    
    var XlabelGroup = chartGroup.append('g')
    .attr("transform", `translate(${width / 1.5}, ${height + 50 + margin.top})`)

    var YlabelGroup = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left/5}, ${height/10})`);

    var ObesityLabel = YlabelGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 25)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "obseity")
      .classed("active", true)
      .text("Obesity (%)");

    var PovertyLabel = XlabelGroup.append("text")
      .attr("y", 0 - 50)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "poverty")
      .classed("active", true)
      .text("Poverty (%)");

    var SmokerLabel = YlabelGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 45)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smoker (%)");

    var IncomeLabel = XlabelGroup.append("text")
      .attr("y", 0 - 30)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "income")
      .classed("inactive", true)
      .text("Income (Median)");

    var healthLabel = YlabelGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 65)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "healthcare")
      .classed("inactive", true)
      .text("Without Healthcare (%)");

    var AgeLabel = XlabelGroup.append("text")
      .attr("y", 0 - 10)
      .attr("x", 0 -150)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");
      // //updateToolTip function above csv import
      var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
      // x axis labels event listener
      XlabelGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {
    
            // replaces chosenXAxis with value
            chosenXAxis = value;
    
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(StateData, chosenXAxis);
    
            // updates x axis with transition
            xAxis = renderXAxis(xLinearScale, xAxis);
    
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update text
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    
      //       // changes classes to change bold text
            if (chosenXAxis === "poverty") {
              PovertyLabel.classed('active', true).classed('inanctive', false);
              IncomeLabel.classed("active", false).classed("inactive", true);
              AgeLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenXAxis === "income"){
              PovertyLabel.classed('active', false).classed('inanctive', true);
              IncomeLabel.classed("active", true).classed("inactive", false);
              AgeLabel.classed("active", false).classed("inactive", true);
            }  
            else {
              PovertyLabel.classed('active', false).classed('inanctive', true);
              IncomeLabel.classed("active", false).classed("inactive", true);
              AgeLabel.classed("active", true).classed("inactive", false);
            }
          }
        })
      // x axis labels event listener
      YlabelGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
    
            // replaces chosenXAxis with value
            chosenYAxis = value;
    
            // functions here found above csv import
            // updates x scale for new data
            yLinearScale = yScale(StateData, chosenYAxis);
    
            // updates x axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);
    
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);

             //update text
             textGroup = renderText(textGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis)
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
    
      //       // changes classes to change bold text
            if (chosenYAxis === "obesity") {
              ObesityLabel.classed('active', true).classed('inanctive', false);
              SmokerLabel.classed("active", false).classed("inactive", true);
              healthLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smoker"){
              ObesityLabel.classed('active', false).classed('inanctive', true);
              SmokerLabel.classed("active", true).classed("inactive", false);
              healthLabel.classed("active", false).classed("inactive", true);
            }  
            else {
              ObesityLabel.classed('active', false).classed('inanctive', true);
              SmokerLabel.classed("active", false).classed("inactive", true);
              healthLabel.classed("active", true).classed("inactive", false);
            }
          }
    })
  })