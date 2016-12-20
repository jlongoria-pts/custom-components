//SVG dimensions
let rawWidth = 600, rawHeight = 400;

let margin = {top: 80, right: 60, bottom: 100, left: 60};

//chart content dimensions
let width = rawWidth - margin.left - margin.right,
    height = rawHeight - margin.top - margin.bottom;

//label and border adjustments
let skew = { left: margin.left/2, top:  margin.top/2 };

//percent axis bias
let bias = {
  value: 0.02,
  lower: function() { return +(1 - this.value) },
  upper: function() { return +(1 + this.value) }
};

//auto categorical colors
let colors10 = d3.scale.category10();



//raw data
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

//data features
let data = {
  max: d3.max(dataset, function(d) { return +d.measure; }),
  min: d3.min(dataset, function(d) { return +d.measure; }),

  categories: _.uniq(dataset.map(function(d) { return d.category; })),
  series:     _.uniq(dataset.map(function(d) { return d.series; }))
};



//measure axis
let x = d3.scale.linear()
    .domain([
      data.min * bias.lower(),
      data.max * bias.upper()
    ])
    .range( [0, width] );

let xAxis = d3.svg.axis()
    .orient("bottom")
    .ticks(width/50)
    .scale(x);


//category axis
let y = d3.scale.ordinal()
    .domain( data.categories )
    .rangePoints( [0, height] );

let yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);



//main SVG instance
let svg = d3.select("#dot-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", translate(margin.left, margin.top));

//y-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", translate(skew.left, -skew.top/2))
    .call(yAxis);

//x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", translate(skew.left, height))
    .call(xAxis);

//border
svg.append("rect")
    .attr("class", "border")
    .attr("x", skew.left)
    .attr("y", -skew.top)
    .attr("width", width)
    .attr("height", height + skew.top);

//guidelines
let guidelines = svg.selectAll(".guidelines")
    .data( data.categories ).enter();

for(let x=0, step=Math.max(width/100, 5); x < width; x+=step) {
  guidelines.append("circle")
    .attr("class", "guidelines")
    .attr("cy", function(d, i) { return y( data.categories[i] ); })
    .attr("cx", x)
    .attr("r", 0.5)
    .attr("transform", translate(skew.left, -skew.top/2));
}

//legend
/* ** */

//dots
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cy", function(d) { return y(d.category); })
    .attr("cx", function(d) { return x(d.measure); })
    .attr("r", 3)
    .attr("stroke", function(d) { return colors10(d.series); } )
    .attr("stroke-width", "2px")
    .attr("transform", translate(skew.left, -skew.top/2))
 .append("title").text(
   function(d) { return d.category + " - " + d.measure; }
 );



//helper methods
function translate(x, y) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}
