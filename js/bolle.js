function bolle (data, data2){
    console.log(colori_base.length)
    console.log(colori_base[0].value)

    var width = 960,
        height = 650,
        maxRadius = 12;

    var n = data.nodes.length, // total number of circles
        m = colori_base.length; // number of distinct clusters

    var cf	=	crossfilter(data2);
    var datiUpVei = cf.dimension(function(d) {return d.gatename;});
    var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup);

    //cambio i valori di check_ins con quelli aggiornati
    datiUpGroup.forEach(function(element) {
        for (i = 0; i < data.nodes.length; i++) {
            if (data.nodes[i]["key"]==element.key){
                data.nodes[i]["check_ins"]=element.value;
            }
        }
    })
    var nodeSizeRange = [5, 50];
    var valori =[];
    (data.nodes).forEach(function(element) {
        valori.push(element.check_ins);
    })
    var minmax = d3.extent(valori);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    // The largest node for each cluster.
    var clusters = new Array(m);
    console.log (clusters)
    var k = 0
    var nodes = d3.range(n).map(function() {
        for (ind=0; ind < colori_base.length; ind++){
            if (colori_base[ind].value==data.nodes[k].color){
                var cluster_app=colori_base[ind].key
            }
        }
        var i = cluster_app,
            r = nodeScale(data.nodes[k].check_ins),
            c=data.nodes[k].color,
            cc=data.nodes[k].key,
            n=data.nodes[k].check_ins;
            d = {cluster: i, radius: r, color:c, id_c:cc, n:n};
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        k=k+1;
        return d;
    });

    var forceCollide = d3.forceCollide()
        .radius(function(d) { return d.radius + 1.5; })
        .iterations(1);

    var force = d3.forceSimulation()
        .nodes(nodes)
        .force("center", d3.forceCenter())
        .force("collide", forceCollide)
        .force("cluster", forceCluster)
        .force("gravity", d3.forceManyBody(30))
        .force("x", d3.forceX().strength(.7))
        .force("y", d3.forceY().strength(.7))
        .on("tick", tick);

    var svg2 = d3.select("#graf")
        .attr("width", width)
        .attr("height", height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var circle = svg2.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) {  return d.color;})

    //    TODO: Update for v4
    //    .call(force.drag);

    function tick() {
        circle
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .append("title")
            .text(function(d) { return  "cluster gate: "+d.cluster +", \ngate: " + d.id_c + ", \nn° veicoli: " + d.n ;});
    }

    function forceCluster(alpha) {
        for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
            node = nodes[i];
            cluster = clusters[node.cluster];
            node.vx -= (node.x - cluster.x) * k;
            node.vy -= (node.y - cluster.y) * k;
        }
    }
}
