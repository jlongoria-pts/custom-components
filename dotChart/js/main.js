let rawWidth = 600, rawHeight = 400;

let margin = {top: 60, right: 50, bottom: 60, left: 40},
    width = rawWidth - margin.left - margin.right,
    height = rawHeight - margin.top - margin.bottom;

let colors10 = d3.scale.category10();

//main data
let dataset = [
  {category: "1st Six Weeks", series: "2012", measure: "622.7"},
  {category: "2nd Six Weeks", series: "2012", measure: "628.6"},
  {category: "3rd Six Weeks", series: "2012", measure: "623.4"},
  {category: "4th Six Weeks", series: "2012", measure: "613.0"},
  {category: "5th Six Weeks", series: "2012", measure: "599.7"},
  {category: "6th Six Weeks", series: "2012", measure: "603.8"},

  {category: "1st Six Weeks", series: "2013", measure: "655.4"},
  {category: "2nd Six Weeks", series: "2013", measure: "653.2"},
  {category: "3rd Six Weeks", series: "2013", measure: "644.2"},
  {category: "4th Six Weeks", series: "2013", measure: "613.5"},
  {category: "5th Six Weeks", series: "2013", measure: "592.6"},
  {category: "6th Six Weeks", series: "2013", measure: "592.9"},

  {category: "1st Six Weeks", series: "2014", measure: "599.5"},
  {category: "2nd Six Weeks", series: "2014", measure: "604.1"},
  {category: "3rd Six Weeks", series: "2014", measure: "593.6"},
  {category: "4th Six Weeks", series: "2014", measure: "567.3"},
  {category: "5th Six Weeks", series: "2014", measure: "556.7"},
  {category: "6th Six Weeks", series: "2014", measure: "552.4"},
];

let datasetMax = d3.max(
  dataset, function(d) { return +d.measure; }
);

let datasetMin = d3.min(
  dataset, function(d) { return +d.measure; }
);

let datasetCategories = _.uniq(
  dataset.map(function(d) { return d.category; })
);

//measures axis
let x = d3.scale.linear()
    .domain( [datasetMin - 10, datasetMax + 10]  )
    .range( [0, width - 30] );

//categories axis
let y = d3.scale.ordinal()
    .domain( datasetCategories )
    .rangePoints( [0, height] );

let yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);

let xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);

//main SVG instance
let svg = d3.select("#dot-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")");

//y-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(60, -15)")
    .call(yAxis);

//x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(60, 280)")
    .call(xAxis);

//border
svg.append("rect")
    .attr("class", "border")
    .attr("x", "60px")
    .attr("y", "-30px")
    .attr("width", width - 30 )
    .attr("height", height + 30);

//dots
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cy", function(d) { return y(d.category); })
    .attr("cx", function(d) { return x(d.measure); })
    .attr("r", 5)
    .attr("fill", "#FFF")
    .attr("fill-opacity", 0.2)
    .attr("stroke", function(d) { return colors10(d.series); } )
    .attr("stroke-width", "2px")
    .attr("transform", "translate(60, -15) scale(1, 1)")
 .append("title").text(
   function(d) { return d.category + " - " + d.measure; }
 );
