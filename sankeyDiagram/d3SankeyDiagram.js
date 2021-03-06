define('d3SankeyDiagram',['d3', 'sankey'], function (d3) {

	 return function (instanceData) {

		let dataset = instanceData.series[0];

		//Removes duplicate row at the end. Not sure why duplicate occurs.
		dataset.pop();

		let margin = {top: 1, right: 1, bottom: 6, left: 1},
       	width = instanceData.width - margin.left - margin.right,
       	height = instanceData.height - margin.top - margin.bottom;

		let formatNumber = d3.format(instanceData.measureFormat);

		let format = function(d) {
				let prefix = instanceData.prefix,
						suffix = instanceData.suffix;

				return prefix + formatNumber(d) + suffix;
		}

		let color = d3.scale.category20();

		let svg = d3.select("#" + instanceData.id).append("svg")
        .attr("id", instanceData.id + "svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	  let uniqueNodes = [];

		let data = {
			"nodes":[],
			"links":[]
		};

		//Prepare list of unique nodes in dataset.
		for(let i=0; i < dataset.length; i++) {
			let nodes = dataset[i].nodes.split(",");

			nodes.forEach(function(node) {
				if (uniqueNodes.indexOf(node) == -1)
					uniqueNodes.push(node);
			});
		}

		//Place list of unique nodes in data JSON
		for(let i=0; i < uniqueNodes.length; i++) {
			data.nodes.push( {"name": uniqueNodes[i]} );
		}

		//Determine the source-target relationships
		for(let i=0; i < dataset.length; i++) {
			let nodes = dataset[i].nodes.split(","),
				value = dataset[i].values;

			for(let j=0; j < nodes.length - 1; j++) {
				let source = nodes[j],
					target = nodes[j+1];

				let sourceIndex = uniqueNodes.indexOf(source),
				    targetIndex = uniqueNodes.indexOf(target);

				let linkIndex = checkLinks(sourceIndex, targetIndex);

				if(linkIndex > -1)
				 	data.links[linkIndex].value += value;
			  	else
					pushLink(sourceIndex, targetIndex, value);
			}
		}

		let sankey = this.d3.sankey()
		    .nodeWidth(15)
		    .nodePadding(10)
		    .size([width, height]);

		let path = sankey.link();


	  sankey
	      .nodes(data.nodes)
	      .links(data.links)
	      .layout(32);

	  let link = svg.append("g").selectAll(".link")
	      .data(data.links)
	    .enter().append("path")
	      .attr("class", "link")
	      .attr("d", path)
	      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
	      .sort(function(a, b) { return b.dy - a.dy; });

	  link.append("title")
	      .text(function(d) {
			return d.source.name + " → " + d.target.name + "\n" + format(d.value);
		});

	  let node = svg.append("g").selectAll(".node")
	      .data(data.nodes)
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .call(d3.behavior.drag()
	      .origin(function(d) { return d; })
	      .on("dragstart", function() { this.parentNode.appendChild(this); })
	      .on("drag", dragmove));


	  node.append("rect")
	      .attr("height", function(d) { return d.dy; })
	      .attr("width", sankey.nodeWidth())
	      .style("fill", function(d) { return d.color = color(d.name); })
	      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
	    .append("title")
	      .text(function(d) { return d.name + "\n" + format(d.value); });

	  node.append("text")
	      .attr("x", -6)
	      .attr("y", function(d) { return d.dy / 2; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", "end")
	      .attr("transform", null)
				.style("fill", "#000")
 	      .style("font-size", "12px")
 	      .style("font-family", "Arial")
	      .text(function(d) { return d.name; })
	    .filter(function(d) { return d.x < width / 2; })
	      .attr("x", 6 + sankey.nodeWidth())
	      .attr("text-anchor", "start");

	  function dragmove(d) {
			let x = Math.max(0, Math.min(width - d.dx, d3.event.x));
      let y = Math.max(0, Math.min(height - d.dy, d3.event.y));

      let translation = (instanceData.dragBothAxes == "false")     ?
                      "translate(" +(d.x    )+ "," +(d.y = y)+ ")" :
                      "translate(" +(d.x = x)+ "," +(d.y = y)+ ")" ;

	    d3.select(this).attr("transform", translation);

	    sankey.relayout();
	    link.attr("d", path);
	  }

		//checks for existing node links in links array.
		function checkLinks(source, target) {
			let linkIndex = -1;

			data.links.forEach(function(link, index) {
				if(link.source === source && link.target === target)
					 linkIndex = index;
			});

			return linkIndex;
		}

		//links array uses indices of nodes rather than node names.
		function pushLink(source, target, value) {
			data.links.push({
				"source": source,
				"target": target,
				"value" : value
			});
		}


	};

});
