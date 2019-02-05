let colori_base_bis = [
    {key:"gate entrante", value:"#2c7fb8"},
    {key:"gate selezionato",value:"#7fcdbb"},
    {key:"gate uscente",value:"#edf8b1"}];
let gate_sel_bolle="";
let gate_sel_bolle_val=0;
let massimo_veicolo="";
function bolle_dettaglio (data, data2, data1, gate_sele, data3){
    gate_sel_bolle_val=0;
    gate_sel_bolle=gate_sele;
    dettaglio_o_no=1;
    d3.select("#bolle").selectAll("g").remove();

    var legend = d3.select("#graf").append("g")
        .attr("transform",  "translate(700,100)" )
        .selectAll(".legend")
        .data(colori_base_bis)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {  console.log(d); return "translate(1," + i * 20 + ")"; });
    legend.append("circle")
        .attr("cx", 50)
        .attr("cy", 6)
        .attr("r", 6)
        .style("fill", function (d) {return d.value; });
    legend.append("text")
        .attr("x", 38)
        .attr("y", 6)
        .style("text-anchor", "end")
        .attr("fill", "black")
        .attr("dy", ".35em")
        //.style("font-size","7pt")
        .text(function (d) { return d.key; });

    var width = 960,
        height = 650;

    var cf	=	crossfilter(data3);
    if (mese_annoB!='tutte'){
        var prov = cf.dimension(function(d) { return d.meseanno; });
        prov.filterExact(mese_annoB);
    }
    if (giornoB!='Tutti i giorni'){
        var prov = cf.dimension(function(d) { return d.giorno; });
        prov.filterExact(giornoB);
    }
    if (tipo_veicoloB!='tutti'){
        var cartype = cf.dimension(function(d) { return d.cartype; });
        cartype.filterExact(tipo_veicoloB);
    }
    var datiUpVeiVai = cf.dimension(function(d) { return d.gatename; });
    datiUpVeiVai.filterExact(gate_sele);
    var datiUpVei = cf.dimension(function(d) {return d.gatename_succ;});
    var datiUpV= datiUpVei.group().reduceCount(),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup);

    //calcolo i giorni di permanenza totali nei gate
    var datiUpVip= datiUpVeiVai.group().reduceSum(function(d) { return d.differenza; }),
        datiUpGroupSum=datiUpVip.all();
    console.log(datiUpGroupSum)
    //mi prendo solo quelli del gate che mi interessa
    datiUpGroupSum.forEach(function(element) {
        console.log(element.key)
        if (element.key==gate_sele){
            gate_sel_bolle_val=element.value;
        }
    })
    console.log(gate_sel_bolle_val)

    //DA TESTARE (OK!!)
    var top_car = cf.dimension(function(d) { return d.car_id; }),
        car_vol = top_car.group().reduceSum(function(d) { return d.differenza; }),
        topTypes = car_vol.top(1);
    console.log(topTypes[0].key);
    console.log(topTypes[0].value);
    massimo_veicolo=(topTypes[0].key+": "+topTypes[0].value+" giorni");


    var flusso=[]
    datiUpGroup.forEach(function(element) {
        if (element.value>0){
            flusso.push({nodo: element.key, valore:element.value, colore: "#2c7fb8", cluster:"entra"});
        }

    })
    console.log(flusso)

    var cf	=	crossfilter(data3);
    if (mese_annoB!='tutte'){
        var prov = cf.dimension(function(d) { return d.meseanno; });
        prov.filterExact(mese_annoB);
    }
    if (giornoB!='Tutti i giorni'){
        var prov = cf.dimension(function(d) { return d.giorno; });
        prov.filterExact(giornoB);
    }
    if (tipo_veicoloB!='tutti'){
        var cartype = cf.dimension(function(d) { return d.cartype; });
        cartype.filterExact(tipo_veicoloB);
    }
    var datiUpVeiVai = cf.dimension(function(d) { return d.gatename_succ; });
    datiUpVeiVai.filterExact(gate_sele);
    var datiUpVei = cf.dimension(function(d) {return d.gatename;});
    var datiUpV= datiUpVei.group().reduceCount(),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup);

    var tot=0
    datiUpGroup.forEach(function(element) {
        if (element.value>0){
            tot=tot+element.value
            flusso.push({nodo: element.key, valore:element.value, colore: "#edf8b1", cluster:"esce"});
        }

    })
    flusso.push({nodo: gate_sele, valore:tot, colore: "#7fcdbb", cluster:"selezionato"});


    var nodeSizeRange = [20, 40];
    var valori =[];

    (flusso).forEach(function(element) {
        valori.push(element.valore);
    })
    var minmax = d3.extent(valori);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    //legenda min max
    var legenda = d3.select("#graf").append("g")
        .attr("transform","translate(620 ,450)")
        .append("text")
        .attr("fill", "black")
        .style("font-size","16pt")
        .text("Legenda (min, MAX)")
    var elem = d3.select("#graf").selectAll("g legend")
        .data(minmax)
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform","translate(575 ,500)")
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return nodeScale(d);})
        .attr("stroke","red")
        .attr("fill", "white")
        .attr("cx", function (d) { return nodeScale(d)*3.2})
    elemEnter.append("text")
        .attr("fill", "black")
        .style("font-size","14pt")
        .text(function(d){return d})
        .attr("x", function (d) { return nodeScale(d)*3.2-7})
        .attr("y", 5)

    var n = flusso.length, // total number of circles
        m = 3; // number of distinct clusters
    // The largest node for each cluster.
    var clusters = new Array(m);
    console.log (clusters)
    var k = 0
    var nodes = d3.range(n).map(function() {
        for (ind=0; ind < colori_base_bis.length; ind++){
            if (colori_base_bis[ind].value==flusso[k].colore){
                var cluster_app=colori_base_bis[ind].key
            }
        }
        var i = cluster_app,
            r = nodeScale(flusso[k].valore),
            c=flusso[k].colore,
            cc=flusso[k].nodo,
            n=flusso[k].valore;
        d = {cluster: i, radius: r, color:c, id_c:cc, n:n};
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        k=k+1;
        return d;
    });

    var forceCollide = d3.forceCollide()
        .radius(function(d) { return d.radius + 7; })
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
        .style("padding-top","50px")
        .append('g')
        .attr('transform', 'translate(' + width / 3 + ',' + 280 + ')');

    var circle_all = svg2.selectAll("my circle")
        .data(nodes)

    var elemEnter = circle_all.enter()
        .append("g")

    var circle=elemEnter.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) {  return d.color;})
        .attr("opacity", 0.75)


    function tick() {
        elemEnter
            .attr("transform","translate(190 ,170)")
            .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
    }

    function forceCluster(alpha) {
        for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
            node = nodes[i];
            cluster = clusters[node.cluster];
            node.vx -= (node.x - cluster.x) * k;
            node.vy -= (node.y - cluster.y) * k;
        }
    }

    //metto i titoli e legenda a ogni bolla
    elemEnter.append("text")
        .style("font-size",function(d) { return d.radius*0.4 + "pt"; })
        .style("font-weight","bold")
        //.attr("dx", function(d){return (-1*d.radius)+((d.id_c.length*-1)+15)})
        .attr("dx", function(d){return (-1*d.radius)+(((d.id_c.length-13)*-1.2)*(d.radius/20))})
        .text(function(d) { return d.id_c ;})

    circle.on('mouseover', function(d) {
        showPopoverBolle.call(this, d);
        })
        .on("mouseout", function(d) {
            removePopoversBolle();
        });

    var indietro = d3.select("#tool")
        .append("g")
        .append("div")
        .style('padding-top','64px')
        .append("button")
        .style("font-size","15pt")
        .text("go back")
        .on("click", function(d) {
            bolle(data, data2, data1, data3)
        });


}