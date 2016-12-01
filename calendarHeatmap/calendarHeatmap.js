define('d3CalendarHeatmap',['d3'], function (d3) {

	 return function (instanceData) {

		 /* Script constants */

		 const dataset = instanceData.series[0];

		 const currentYear = parseInt( dataset[0].date.slice(0,4) );
		 const currentMonth = parseInt( dataset[0].date.slice(5,7) ) - 1;

		 var width = 200, height = 200, cellSize = 25;

		 var day = d3.time.format("%w"), // day of the week
		     week = d3.time.format("%U"), // week number of the year
		     month = d3.time.format("%m"), // month number
		     year = d3.time.format("%Y"),
		     format = d3.format(instanceData.format || ""),
		     date = d3.time.format("%Y-%m-%d");

		 var colorClass = (instanceData.scale == "sequential" ? "YlOrRd" : "RdYlGn"),
	 			 colorCount = 5;


		 /* SVG elements */

		 var svg = d3.select("#"+instanceData.id).selectAll("svg")
		     .data( [currentMonth] )
		     .enter().append("svg")
		       .attr("width", width)
		       .attr("height", height)
					 .attr("id", instanceData.id + "svg")
		       .attr("class", colorClass)
		     .append("g");

		 var rect = svg.selectAll(".day")
		     .data( getDates )
		     .enter().append("rect")
		       .attr("class", "day")
		       .attr("width", cellSize)
		       .attr("height", cellSize)
		       .attr("x", function(d) {
						 return (day(d) * cellSize) + cellSize/2;
					 })
		       .attr("y", function(d) {
						 return (weekDifference(d) * cellSize) + cellSize*2;
					 })
		     .datum( date );

		 var month_title = svg.selectAll(".month-title")
		     .data( getMonth )
		     .enter().append("text")
		       .text( monthTitle )
					 .style("fill", "black")
					 .style("font-size", "18px")
					 .style("font-family", "Arial")
		       .attr("x", cellSize/2)
		       .attr("y", function(d) {
						 return (weekDifference(d) * cellSize) + cellSize;
					 });



		 /* Color-scale function */

		 var values = [];
		 dataset.forEach(function(d) {
			 values.push(d.measure);
		 });

		 var min = d3.min(values),
		 		 max = d3.max(values);

		 var color = d3.scale.quantize()
				 .domain( [min, max] )
				 .range( d3.range(colorCount).map(
					 function(d) { return "q" +d+ "-" +colorCount; }
					 )
				 );



		 /* Data processing and rendering */

		 var data = {};
		 dataset.forEach(function(d) {
		 	data[d.date] = d.measure;
		 });

	   rect.filter(function(d) { return d in data; })
	       .attr("class", function(d) {
					 return "day " + color(data[d]);
				 })
	       .append("title")
	       .text(function(d) {
					 return getDateString(d) + ":    " + format(data[d]);
				 });



		 /* Helper functions */

		 function monthTitle(d) {
		   let monthName = d.toLocaleString("en-us", { month: "long" });

		   return monthName + " " + currentYear;
		 }

		 function weekDifference(d) {
		   let firstDayOfMonth = new Date(year(d), month(d)-1, 1);

		   return week(d) - week( firstDayOfMonth );
		 }

		 function getDates(d) {
		   return d3.time.days(
		     new Date(currentYear, d, 1),
		     new Date(currentYear, d+1, 1)
		   );
		 }

		 function getMonth(d) {
		   return d3.time.months(
		     new Date(currentYear, d, 1),
		     new Date(currentYear, d+1, 1)
		   );
		 }

		 function getDateString(d) {
		   let currentDay = parseInt( d.slice(8,10) );

		   let date = new Date(currentYear, currentMonth, currentDay);

		   return d3.time.format(instanceData.date)(date);
		 }

	}; //return block

}); //define block
