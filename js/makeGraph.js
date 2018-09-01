function makeGraph(graph) {
    /**
     *  Takes an object of data (with nodes and links) and draws a force directed graph with d3-force.
     *  Returns svg and node selection.
     * @param {object} graph
     */

        // set margins, height and width
    const margins = {top: 300, right: 300, bottom: 75, left: 50},
        width = (window.innerWidth / 2 + 100) - margins.right - margins.left,
        height = (window.innerHeight - margins.top) ;

    // append svg for graph
    var svg = version4.select('#graph').append("svg")
        .attr("id", "graphSVG")
        .attr("width", width)
        .attr("height", height);

    // append grouped element for graph
    var g = svg.append("g")
        .attr("class", "graphContainer")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // scale for coloring nodes
    var color = version4.scaleOrdinal(version4.schemeCategory20);

    // start force simulation with center in center of svg
    var simulation = version4.forceSimulation()
        .force("link", version4.forceLink().id(function(d) { return d.id; }))
        .force("center", version4.forceCenter());

    // set scale for node size
    var nodeSizeRange = [1, 30];
    var nodeScale = version4.scaleLinear()
        .range(nodeSizeRange);

    // add links
    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    // add nodes
    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("fill", function(d) { return color(d.group); })
        .attr("data-legend", function(d) { return d.group; });

    // scale nodes
    var minmax = version4.extent(graph.nodes, function(d) { return d.check_ins });
    nodeScale
        .domain(minmax);

    // add title for hovering
    node.append("title")
        .text(function(d) { return d.id; });

    // add nodes and links to simulation
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(graph.links);

    // add grouped elements for size legend and color legend
    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (width - 80) + ",20)");

    svg.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20, " + (height - 100) + ")");

    // add size legend
    var legendSize = version4.legendSize()
        .scale(nodeScale)
        .labelFormat(version4.format(".0f"))
        .cells(5)
        .shape('circle')
        .shapePadding(15)
        .labelOffset(5)
        .orient('horizontal')
        .title("Number of check-ins");

    svg.select(".legendSize")
        .call(legendSize);

    // re-scale legend to initial zoom
    svg.select(".legendSize").selectAll("circle")
        .attr("fill", "rgb(27, 158, 119)")
        .attr("r", function() { return version4.select(this).attr("r") * graphScale; });

    // add color legend
    var legendOrdinal = version4.legendColor()
        .shape("path", version4.symbol().type(version4.symbolCircle).size(150)())
        .shapePadding(5)
        .scale(color);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    // save size of legend circles for usage in update function
    var legendSizes = [];
    d3.select("#graphSVG").select(".legendSize").selectAll("circle").each(function() {

        // invert scaling
        legendSizes.push(d3.select(this).attr("r") * (1 / graphScale))
    });

    function ticked() {
        /**
         * Draws a node and a link from that node to it's target.
         */

            // block table while simulation loads (prevention of bug in table click events)
        var table = $("#table");
        table.block({
            message: null,
            overlayCSS: {opacity: 0}
        });

        // draw line between source node and target node position (initialize position to the left because of scaling)
        var offsetLeft = 150;
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos * 4 - offsetLeft; })
            .attr("y1", function (d) { return d.source.ypos * 4 - offsetLeft; })
            .attr("x2", function (d) { return d.target.xpos * 4 - offsetLeft; })
            .attr("y2", function (d) { return d.target.ypos * 4 - offsetLeft; });

        // var for saving highlighted links
        var highlighted;

        // draw node on position specified in data and highlight connections on mouseover
        node
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d) { return nodeScale(d.check_ins); })
            .attr("cx", function (d) { return d.xpos * 4 - offsetLeft; })
            .attr("cy", function (d) { return d.ypos * 4 - offsetLeft; })
            .on("mouseover", function(d) {
                link.style("stroke", function(l) {
                    if (d === l.source || d === l.target) {
                        return "#772718";
                    }
                    else {
                        return "grey";
                    }
                });
                link.style("stroke-opacity", function(l) {
                    if ((d === l.source || d === l.target) === false) {
                        return 0.1;
                    }
                    else {
                        return 1;
                    }
                });
            })
            .on("mouseout", function() {

                // apply different style changes to highlighted and non-highlighted links
                highlighted = svg.selectAll(".highlightedLink");
                if (highlighted["_groups"][0].length > 0) {
                    version4.selectAll(".non")
                        .style("stroke", "grey")
                        .style("stroke-opacity", 0.1)
                        .style("stroke-width", "1px");

                    version4.selectAll(".highlightedLink")
                        .style("stroke", "rgb(27, 158, 119)")
                        .style("stroke-opacity", 1)
                        .style("stroke-width", "3px");
                }
                else {
                    version4.selectAll(".non")
                        .style("stroke", "grey")
                        .style("stroke-opacity", 1)
                        .style("stroke-width", "1px");
                }
            });

        // when function done, table can be unblocked
        return table.unblock();
    }

    // zoom function
    function zoom_actions(){
        g.attr("transform", version4.event.transform);
    }

    return {
        node: node,
        svg: svg,
        simulation: simulation,
        scale: nodeScale,
        sizes: legendSizes
    };
}


function restart(simulation, graph, nodeScale, legendSizes) {
    /**
     * Restarts force simulation and redraws graph with new data, also updates legend for node size.
     * @param {object} simulation
     * @param {object} graph
     * @param {function} nodeScale
     * @param {object} legendSizes
     */

        // scale for coloring nodes
    var color = version4.scaleOrdinal(version4.schemeCategory20);

    // select nodes and links
    var node = version4.selectAll(".nodes circle");
    var link = version4.selectAll(".links line");

    // re-scale nodes
    var nodeSizeRange = [1, 30];
    var minmax = version4.extent(graph.nodes, function(d) { return d.check_ins });
    nodeScale
        .range(nodeSizeRange)
        .domain(minmax);

    // update nodes
    node = node.data(graph.nodes);
    node.exit().remove();
    node.enter().append("circle")
        .attr("fill", function(d) { return color(d.group); })
        .attr("r", function(d) { return nodeScale(d.check_ins); })
        .merge(node);

    // Apply the general update pattern to the links.
    link = link.data(graph.links);
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    // update and restart simulation
    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.alpha(1).restart();

    // invert legend circle sizes for obtaining new labels
    var newLabels = [];
    legendSizes.forEach(function(size) {
        newLabels.push(nodeScale.invert(size))
    });

    var legendSize = version4.select("#graphSVG").select(".legendSize");

    // append new data to labels
    var labels = legendSize.selectAll("text")
        .data(newLabels);

    // update labels
    labels.enter().append("text")
        .merge(labels)
        .text(function(d) { return d; });

    labels.exit().remove();
}