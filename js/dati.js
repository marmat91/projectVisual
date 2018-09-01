// load the data
d3.json("data/graph.json", function(data) {
    console.log(data);
    d3.json("data/graph1.json", function(data1) {
        console.log(data1);
        var expenses=data1;

        var cf	=	crossfilter(data1);
        var gate = cf.dimension(function(d){return d.gatename});
        gate.filter("entrance3");
        console.log("num reports (entrance3)",cf.groupAll().reduceCount().value());

        //	select VesselType,	count(*)	from	migrants group	by	VesselType
        var countgate = gate.group().reduceCount();
        console.log(countgate.all());
        var alfa = countgate.all();

        /*    var conta = d3.nest()
                .key(function(d) { return d.gatename; })
                .rollup(function(v)	{ return d3.mean(v,
                    function(d)	{ return d.carid; });})
                .entries(expenses);
            console.log(conta);})*/
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
        .attr('stroke-width', 0.2)
        .attr('stroke', '#E5E5E5');


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("fill", function(d) { return (d.color); })

    // set scale for node size
    var nodeSizeRange = [2, 7];
    var minmax = d3.extent(alfa, function(d) { return d.value });
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);
    console.log(d3.merge([data.nodes, alfa]));

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.key;}))
      //  .force("x", d3.forceX())
       // .force("y", d3.forceY())

    node.append("title")
        .text(function(d) { return d.key; });
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
            .attr("key", function(d) { return d.key })
            .attr("r",function(d) { return nodeScale(10)})
            .attr("cx", function (d) { return d.xpos})
            .attr("cy", function (d) { return d.ypos})
    }

   // simulation.force('link').link(links)

    })

})

