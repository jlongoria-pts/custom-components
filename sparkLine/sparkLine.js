define('d3SparkLine',['d3'], function (d3) {

	 return function (instanceData) {

		 var margin = {top: 20, right: 20, bottom: 30, left: 40},
		     width = instanceData.width - margin.left - margin.right,
		     height = instanceData.height - margin.top - margin.bottom;

		 var x = d3.scale.ordinal()
		     .rangeRoundBands([0, width], .1);

		 var y = d3.scale.linear()
		     .range([height, 0]);

		 var format = d3.format(instanceData.format || "");

		 var svg = d3.select("#"+instanceData.id).append("svg")
		     .attr("width", width + margin.left + margin.right)
		     .attr("height", height + margin.top + margin.bottom)
				 .attr("id", instanceData.id + "svg")
				 .attr("xmlns", "http://www.w3.org/2000/svg")
		   .append("g")
		     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		 var dataset = instanceData.series[0];

		 //For quick testing...
		 /*
		 var dataset = [
			 {category: "A", measure: ".08167"},
			 {category: "B", measure: ".01492"},
			 {category: "C", measure: ".02782"},
			 {category: "D", measure: ".04253"},
			 {category: "E", measure: ".12702"},
			 {category: "F", measure: ".02288"},
			 {category: "G", measure: ".02015"},
			 {category: "H", measure: ".06094"},
			 {category: "I", measure: ".06966"},
			 {category: "J", measure: ".00153"},
			 {category: "K", measure: ".00772"},
			 {category: "L", measure: ".04025"},
			 {category: "M", measure: ".02406"},
			 {category: "N", measure: ".06749"},
			 {category: "O", measure: ".07507"},
			 {category: "P", measure: ".01929"},
			 {category: "Q", measure: ".00095"},
			 {category: "R", measure: ".05987"},
			 {category: "S", measure: ".06327"},
			 {category: "T", measure: ".09056"},
			 {category: "U", measure: ".02758"},
			 {category: "V", measure: ".00978"},
			 {category: "W", measure: ".02360"},
			 {category: "X", measure: ".00150"},
			 {category: "Y", measure: ".01974"},
			 {category: "Z", measure: ".00074"}
		 ];
		 */

	   x.domain(dataset.map(function(d) { return d.category; }));
	   y.domain([0, d3.max(dataset, function(d) { return type(d.measure); })]);


	   svg.selectAll(".bar")
	       .data(dataset)
	     .enter().append("rect")
	       .attr("class", "bar")
	       .attr("x", function(d) { return x(d.category); })
	       .attr("width", x.rangeBand())
	       .attr("y", function(d) { return y(d.measure); })
	       .attr("height", function(d) { return height - y(d.measure); })
				 .attr("fill", instanceData.color)
      .append("title").text(function(d) { return d.category + " - " + format(d.measure); });

		 function type(d) {
		   d.measure = +d.measure;
		   return d;
		 }

	};

});
