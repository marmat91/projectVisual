function creaGrafo (selection){
    console.log (selection);

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(selection.links)
        .enter()
        .append('line')
        .attr('stroke-width', 0.2)
        .attr('stroke', '#E5E5E5');

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(selection.nodes)
        .enter()
        .append("circle")
        .attr("opacity", 0.75)
        .attr("fill", function(d) { return (d.color); })

    // set scale for node size
    var nodeSizeRange = [1, 10];
    var valori =[];
    (selection.nodes).forEach(function(element) {
        valori.push(element.check_ins);
    })
    var minmax = d3.extent(valori);
    console.log(minmax);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.key;}))

    node.append("title")
        .text(function(d) { return  d.key + ", n° veicoli: " + d.check_ins  ; })
    // add nodes and links to simulation
    simulation
        .nodes(selection.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(selection.links);

    function ticked() {
        c=0;
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos; })
            .attr("y1", function (d) { return d.source.ypos; })
            .attr("x2", function (d) { return d.target.xpos; })
            .attr("y2", function (d) { return d.target.ypos; });

        node
            .attr("key", function(d) { return d.key ;})
            .attr("r", function(d){return nodeScale(d.check_ins);})
            .attr("cx", function (d) { return d.xpos;})
            .attr("cy", function (d) { return d.ypos;});
    }
}
function updateGrafo (selection, dati, data1){
    console.log (selection);
    console.log (dati);
    var cf	=	crossfilter(data1);
    svg.selectAll("g").remove();
    if (selection=='all'){
        var datiUpDim = cf.dimension(function(d) {return d.gatename;});
        var datiUpGroup= datiUpDim.group().reduceCount().all();
    } else {
    var cartype = cf.dimension(function(d) { return d.cartype; });
    console.log (cartype);
    cartype.filterExact(selection);
    var datiUpDim = cf.dimension(function(d) {return d.gatename;});
    var datiUpGroup= datiUpDim.group().reduceCount().all();
    }

    console.log (datiUpDim);
    console.log (datiUpGroup);
    datiUpGroup.forEach(function(element) {
        for (i = 0; i < dati.nodes.length; i++) {
            if (dati.nodes[i]["key"]==element.key){
                dati.nodes[i]["check_ins"]=element.value;
            }
        }
    })
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(dati.links)
        .enter()
        .append('line')
        .attr('stroke-width', 0.2)
        .attr('stroke', '#E5E5E5');

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(dati.nodes)
        .enter()
        .append("circle")
        .attr("opacity", 0.75)
        .attr("fill", function(d) { return (d.color); })

    // set scale for node size
    var nodeSizeRange = [1, 10];
    var valori =[];
    (dati.nodes).forEach(function(element) {
        valori.push(element.check_ins);
    })
    var minmax = d3.extent(valori);
    console.log(minmax);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {return d.key;}))

    node.append("title")
        .text(function(d) { return  d.key + ", n° veicoli: " + d.check_ins  ; })
    // add nodes and links to simulation
    simulation
        .nodes(dati.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(dati.links);

    function ticked() {
        c=0;
        link
            .attr("id", function(d) { return d.source.id + "-" + d.target.id; })
            .attr("class", "non")
            .attr("x1", function (d) { return d.source.xpos; })
            .attr("y1", function (d) { return d.source.ypos; })
            .attr("x2", function (d) { return d.target.xpos; })
            .attr("y2", function (d) { return d.target.ypos; });

        node
            .attr("key", function(d) { return d.key ;})
            .attr("r", function(d){return nodeScale(d.check_ins);})
            .attr("cx", function (d) { return d.xpos;})
            .attr("cy", function (d) { return d.ypos;});
    }
}