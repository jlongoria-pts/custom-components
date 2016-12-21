/**   *** Styles and Formatting ***   **/

//SVG dimensions
let rawWidth = 500, rawHeight = 300;

let margin = {top: 80, right: 60, bottom: 100, left: 60};

//chart content dimensions
let width = rawWidth - margin.left - margin.right,
    height = rawHeight - margin.top - margin.bottom;

//label and border adjustments
let skew = { left: margin.left/2, top:  margin.top/2 };

//percent axis bias
let bias = {
  value: 0.01,
  lower: function() { return +(1 - this.value) },
  upper: function() { return +(1 + this.value) }
};

//auto categorical colors
let color = d3.scale.category10();

//text and graphic styling
let styles = {
  title: {
    fontSize: "16px",
    fontFamily: "sans-serif",
    fill: "#000"
  },

  legend: {
    fontSize: "10px",
    fontFamily: "sans-serif",
    fill: "#000"
  },

  circle: {
    strokeWidth: "2px",
    hoverStrokeWidth: "6px",
    inactiveStroke: "#DDD"
  }
};



/**   *** Data and Statistics ***   **/

//raw data
let dataset = [
  {category: "1st Six Weeks", series: "2010-11", measure: "574"},
  {category: "2nd Six Weeks", series: "2010-11", measure: "575"},
  {category: "3rd Six Weeks", series: "2010-11", measure: "569"},
  {category: "4th Six Weeks", series: "2010-11", measure: "579"},
  {category: "5th Six Weeks", series: "2010-11", measure: "569"},
  {category: "6th Six Weeks", series: "2010-11", measure: "556"},

  {category: "1st Six Weeks", series: "2011-12", measure: "535"},
  {category: "2nd Six Weeks", series: "2011-12", measure: "539"},
  {category: "3rd Six Weeks", series: "2011-12", measure: "534"},
  {category: "4th Six Weeks", series: "2011-12", measure: "532"},
  {category: "5th Six Weeks", series: "2011-12", measure: "525"},
  {category: "6th Six Weeks", series: "2011-12", measure: "523"},

  {category: "1st Six Weeks", series: "2012-13", measure: "520"},
  {category: "2nd Six Weeks", series: "2012-13", measure: "520"},
  {category: "3rd Six Weeks", series: "2012-13", measure: "528"},
  {category: "4th Six Weeks", series: "2012-13", measure: "518"},
  {category: "5th Six Weeks", series: "2012-13", measure: "517"},
  {category: "6th Six Weeks", series: "2012-13", measure: "511"},

  {category: "1st Six Weeks", series: "2013-14", measure: "567"},
  {category: "2nd Six Weeks", series: "2013-14", measure: "563"},
  {category: "3rd Six Weeks", series: "2013-14", measure: "558"},
  {category: "4th Six Weeks", series: "2013-14", measure: "564"},
  {category: "5th Six Weeks", series: "2013-14", measure: "562"},
  {category: "6th Six Weeks", series: "2013-14", measure: "558"},

  {category: "1st Six Weeks", series: "2014-15", measure: "569"},
  {category: "2nd Six Weeks", series: "2014-15", measure: "572"},
  {category: "3rd Six Weeks", series: "2014-15", measure: "564"},
  {category: "4th Six Weeks", series: "2014-15", measure: "560"},
  {category: "5th Six Weeks", series: "2014-15", measure: "559"},
  {category: "6th Six Weeks", series: "2014-15", measure: "550"}
];

//data features
let data = {
  max: d3.max(dataset, function(d) { return +d.measure; }),
  min: d3.min(dataset, function(d) { return +d.measure; }),

  categories: _.uniq(dataset.map(function(d) { return d.category; })),
  series:     _.uniq(dataset.map(function(d) { return d.series; }))
};



/**   *** Axes Definitions ***   **/

//measure axis
let x = d3.scale.linear()
    .domain([
      data.min * bias.lower(),
      data.max * bias.upper()
    ])
    .range( [0, width] )
    .nice();

let xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);


//category axis
let y = d3.scale.ordinal()
    .domain( data.categories )
    .rangePoints( [0, height] );

let yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);



/**   *** Graphic and Text Elements ***   **/

//main SVG instance
let svg = d3.select("#dot-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", translate(margin.left, margin.top));

//title
svg.append("text")
    .attr("class", "title")
    .text("Enrollment")
    .style("fill", styles.title.fill)
    .style("font-size", styles.title.fontSize)
    .style("font-family", styles.title.fontFamily)
    .attr("x", width/2 - 20)
    .attr("y", -margin.top*(3/4))

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
svg.selectAll(".legend")
    .data( data.series )
  .enter().append("circle")
    .attr("class", function(d) { return "legend series-" + d; })
    .attr("cy", height + (2/3)*margin.bottom)
    .attr("cx", function(d,i) {
      return (i+1)*(width/data.series.length);
    })
    .attr("r", 3)
    .attr("stroke", function(d) { return color(d); })
    .attr("stroke-width", styles.circle.strokeWidth)
    .attr("transform", translate(-margin.left, 0))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

svg.selectAll(".legend-text")
    .data( data.series )
  .enter().append("text")
    .text(function(d) { return d; })
    .style("fill", styles.legend.fill)
    .style("font-size", styles.legend.fontSize)
    .style("font-family", styles.legend.fontFamily)
    .attr("class", "legend-text")
    .attr("x", function(d,i) {
      return (i+1)*(width/data.series.length) + 6;
    })
    .attr("y", height + (2/3)*margin.bottom + 4)
    .attr("transform", translate(-margin.left, 0))
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

//dots
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle")
    .attr("class", function(d) { return "dot series-" + d.series; })
    .attr("cy", function(d) { return y(d.category); })
    .attr("cx", function(d) { return x(d.measure); })
    .attr("r", 3)
    .attr("stroke", function(d) { return color(d.series); })
    .attr("stroke-width", styles.circle.strokeWidth)
    .attr("transform", translate(skew.left, -skew.top/2))
 .append("title").text(
   function(d) { return d.category + " - " + d.measure; }
 );




/**   *** Helper Methods ***   **/

function translate(x, y) {
  return "translate({x}, {y})"
          .replace("{x}", x)
          .replace("{y}", y);
}

function mouseover(d, i) {
  d3.select(".legend.series-"+ d)
    .attr("stroke-width", styles.circle.hoverStrokeWidth);

  data.series.forEach(function(series, index){
    if(index != i) {
      d3.selectAll(".dot.series-" + series)
        .attr("stroke", styles.circle.inactiveStroke);
    }
  });
}

function mouseout(d, i) {
  d3.select(".legend.series-"+ d)
    .attr("stroke-width", styles.circle.strokeWidth);

  data.series.forEach(function(series, index){
    if(index != i) {
      d3.selectAll(".dot.series-" + series)
        .attr("stroke", function(d) { return color(d.series); });
    }
  });
}
