let rawWidth = 500, rawHeight = 400;

let margin = {top: 60, right: 40, bottom: 60, left: 40},
    width = rawWidth - margin.left - margin.right,
    height = rawHeight - margin.top - margin.bottom;

let svg = d3.select("#dot-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" +margin.left+ "," +margin.top+ ")");

let colors10 = d3.scale.category10();

//main data
let dataset = [
  {category: "1st Six Weeks", series: "2012", measure: "2000"},
  {category: "2nd Six Weeks", series: "2012", measure: "2050"},
  {category: "3rd Six Weeks", series: "2012", measure: "2100"},
  {category: "4th Six Weeks", series: "2012", measure: "2100"},
  {category: "5th Six Weeks", series: "2012", measure: "2050"},
  {category: "6th Six Weeks", series: "2012", measure: "2000"},

  {category: "1st Six Weeks", series: "2013", measure: "2010"},
  {category: "2nd Six Weeks", series: "2013", measure: "2060"},
  {category: "3rd Six Weeks", series: "2013", measure: "2110"},
  {category: "4th Six Weeks", series: "2013", measure: "2120"},
  {category: "5th Six Weeks", series: "2013", measure: "2060"},
  {category: "6th Six Weeks", series: "2013", measure: "2010"},

  {category: "1st Six Weeks", series: "2014", measure: "2020"},
  {category: "2nd Six Weeks", series: "2014", measure: "2070"},
  {category: "3rd Six Weeks", series: "2014", measure: "2120"},
  {category: "4th Six Weeks", series: "2014", measure: "2130"},
  {category: "5th Six Weeks", series: "2014", measure: "2070"},
  {category: "6th Six Weeks", series: "2014", measure: "2020"},
];

let datasetMax = d3.max(
  dataset, function(d) { return +d.measure; }
);

let datasetMin = d3.min(
  dataset, function(d) { return +d.measure; }
);

let datasetCategories = dataset.map(
  function(d) { return d.category; }
);

//measures axis
let x = d3.scale.linear()
    .range([width, 0]);

//categories axis
let y = d3.scale.ordinal()
.rangeRoundBands([0, height], .1);

x.domain( [datasetMin, datasetMax]  );

y.domain( datasetCategories );

svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cy", function(d) { return y(d.category); })
    .attr("cx", function(d) { return x(d.measure); })
    .attr("r", 5)
    .attr("fill", function(d) { return colors10(d.series)} )
 .append("text").text("test")
 .append("title").text(
   function(d) { return d.category + " - " + d.measure; }
 );
