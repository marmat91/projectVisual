// load the data
d3.json("data/graph.json", function(data) {
    console.log(data);
/*    var circles = svg.append("g").selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle");
    var circleAttributes = circles
        .attr("cx", function (d) { return d.xpos; })
        .attr("cy", (function (d) { return d.ypos; }))
        .attr("r", 2)
        .style("fill", (function (d) { return d.color; }));
*/

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', '#E5E5E5');


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("fill", function(d) { return (d.color); })

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))

    node.append("title")
        .text(function(d) { return d.id; });
    // add nodes and links to simulation
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(data.links);



    function ticked() {
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos; })
            .attr("y1", function (d) { return d.source.ypos; })
            .attr("x2", function (d) { return d.target.xpos; })
            .attr("y2", function (d) { return d.target.ypos; });

        node
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return 2})
            .attr("cx", function (d) { return d.xpos})
            .attr("cy", function (d) { return d.ypos})
    }

   // simulation.force('link').link(links)



})

