let dettaglio_o_no=0
function bolle (data, data2, data1, data3){
    var color = d3.scaleOrdinal()
        .domain(["general-gate", "entrance","ranger-stop", "gate","camping","ranger-bas"])
        .range(["paleturquoise", "palegreen", "lemonchiffon","crimson","sandybrown","fuchsia"]);

    dettaglio_o_no=0
    d3.select("#bolle").selectAll("g").remove();
    var legend = d3.select("#graf").append("g")
        .attr("transform",  "translate(700,100)" )
        .selectAll(".legend")
        .data(colori_base)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(1," + i * 20 + ")"; });
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
        height = 650

    var n = data.nodes.length, // total number of circles
        m = colori_base.length; // number of distinct clusters

    var cf	=	crossfilter(data2);
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
    var datiUpVei = cf.dimension(function(d) {return d.gatename;});
    var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup[0]);

    console.log(data)
    var nodeSizeRange = [15, 40];
    var valori =[];
    (datiUpGroup).forEach(function(element) {
        valori.push(element.value);
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
        .attr("transform","translate(600 ,500)")
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return nodeScale(d);})
        .attr("stroke","red")
        .attr("fill", "white")
        .attr("cx", function (d) { return nodeScale(d)*2.5})
    elemEnter.append("text")
        .attr("fill", "black")
        .style("font-size","14pt")
        .text(function(d){return d})
        .attr("x", function (d) { return nodeScale(d)*2.5-7})
        .attr("y", 5)

    // The largest node for each cluster.
    var clusters = new Array(m);
    console.log (clusters)
    var k = 0
    var nodes = d3.range(n).map(function() {
        var cluster_app=datiUpGroup[k].key.substr(0,datiUpGroup[k].key.length-1);
        if (cluster_app=="ranger-bas"){cluster_app="ranger-base"}
        var i = cluster_app,
            r = nodeScale(datiUpGroup[k].value),
            c=color(datiUpGroup[k].key.substr(0,datiUpGroup[k].key.length-1)), //RIVEDERE I COLORI ok
            cc=datiUpGroup[k].key,
            n=datiUpGroup[k].value;
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
        .force("collide", forceCollide) //distanza tra un nodo e un altro
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
        .data(nodes);

    var elemEnter = circle_all.enter()
        .append("g");

    var circle=elemEnter.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) {  return d.color;})
        .attr("opacity", 0.75)
        .on("click", function(d) {
            var gate_sele=d.id_c;
            bolle_dettaglio(data, data2, data1, gate_sele, data3)
        });


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
        .attr("dx", function(d){return (-1*d.radius)+(((d.id_c.length-13)*-1.2)*(d.radius/20))})
        .text(function(d) { return d.id_c ;});

    circle
        .on("click", function(d) {
            removePopoversBolle();
            var gate_sele=d.id_c;
            bolle_dettaglio(data, data2, data1, gate_sele, data3)
        })
        .on('mouseover', function(d) {
            showPopoverBolle.call(this, d);
        })
        .on("mouseout", function(d) {
            removePopoversBolle();
        });


}

function creaSelettoreVeicoloB(data, data1, data2, data3) {
    //SELEZIONE DEI VEICOLI
    d3.select("#toolbarB")
        .style('padding-top','64px')
        .append("label")
        .attr("style", "font-size: 26pt")
        .text("Seleziona il tipo di veicolo:");
    d3.select("#toolbarB").append("br");

    var labels = d3.select("#toolbarB").append("select")
        .attr('id','selettore')
        .style("font-size","20pt")
        .style("width","300px")
        .style("height","40px")
        .on('change',function(d) {
            for (i = 0; i < tutti.length; i++) {
                if (this.value==tutti[i].value){
                    tipo_veicoloB=tutti[i].key;
                    veiB=tutti[i].value;
                }
            };
            if (dettaglio_o_no==1){
                bolle_dettaglio(data, data2, data1, gate_sel_bolle, data3)
            }
            else{
                bolle(data, data2, data1, data3)
            }
        })
        .selectAll("option")
        .data(tutti)
        .enter()
        .append("option")
        .attr('name', (function(d) {
            return d.key
        }))
        .attr('style', 'width:100px; height:30px; font-size: 18pt; font-weight: bold')
        .text(function(d) {
            let id = d.key;
            return d.value
        })
    ;


}

var date_all =['tutte',
    '2015-05','2015-06','2015-07','2015-08','2015-09','2015-10','2015-11','2015-12','2016-01','2016-02','2016-03','2016-04','2016-05']
function creaSelettoreDateB(data, data1, data2, data3) {
    creaSelettoreDateSpecB(data, data2, data1, data3)
    //SELETTORE PER LE DATE mese e anno
    var cf	=	crossfilter(data1);
    var dateT = cf.dimension(function(d){return d.meseanno});
    var date = dateT.group().all();
    let toolbar2 = d3.select("#toolbar2B");
    toolbar2.append("label")
        .attr("style", "font-size: 26pt")
        .text("Seleziona l'anno e il mese:");

    toolbar2.append("br");

    var tbYear = toolbar2.append("select")
        .style("font-size","20pt")
        .style("width","300px")
        .style("height","40px")
        .on('change',function(d) {
            mese_annoB=this.value;
            giornoB='Tutti i giorni'
            if (dettaglio_o_no==1){
                bolle_dettaglio(data, data2, data1, gate_sel_bolle, data3)
            }
            else{
                bolle(data, data2, data1, data3)
            }
            creaSelettoreDateSpecB(data, data2, data1, data3)
        })
        .attr('name','selettore')
        .selectAll("option")
        .data(date_all)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 18pt; font-weight: bold')
        .text(function(d) {
            return d
        });
}

function creaSelettoreDateSpecB(data, data2, data1, data3) {
    //SELETTORE PER LE DATE giorni
    d3.select("#toolbar3B").selectAll("option").remove();

    if (mese_annoB=='tutte'){
        var date=([{key:'Seleziona un mese'}])
    }
    else {
        var cf	=	crossfilter(data2);
        var prov = cf.dimension(function(d) { return d.meseanno; });
        prov.filterExact(mese_annoB);
        var dateT = cf.dimension(function(d){return d.giorno});
        var appoggio=dateT.group().all();
        var date=([{key:'Tutti i giorni'}])
        for (i = 0; i < appoggio.length; i++) {
            if (appoggio[i].value!=0){
                date.push(appoggio[i])
            }
        }
        console.log (appoggio[0]);
        console.log (Object.values(date));
    }

    var tbYear = d3.select("#toolbar3B")
        .style("font-size","20pt")
        .style("width","300px")
        .style("height","40px")
        .on('change',function(d) {
            giornoB=this.value;

            if (dettaglio_o_no==1){
                bolle_dettaglio(data, data2, data1, gate_sel_bolle, data3)
            }
            else{
                bolle(data, data2, data1, data3)
            }

        })
        .attr('name','selettore')
        .selectAll("option")
        .data(date)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 18pt; font-weight: bold')
        .text(function(d) {
            return d.key
        });
}

function removePopoversBolle () {
    $('.popover').each(function() {
        $(this).remove();
    });
}
function showPopoverBolle (d) {
    $(this).popover({
        title: d.cluster,
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() {
            if (dettaglio_o_no==0) {return d.id_c+"<br>"+d.n+" veicoli";}
            else if(d.cluster=="gate selezionato") {return d.id_c+"<br>"+d.n+" veicoli<br>Media giorni permanenza: "
                +(gate_sel_bolle_val/d.n)+"<br>"+massimo_veicolo;}
            else{return d.id_c+"<br>"+d.n+" veicoli";}
        }
    });
    $(this).popover('show')
}