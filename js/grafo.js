let colori_base = [
    {key:"general-gate", value:"paleturquoise"},
    {key:"entrance",value:"palegreen"},
    {key:"ranger-stop", value:"lemonchiffon"},
    {key:"gate", value:"crimson"},
    {key:"camping", value:"sandybrown"},
    {key:"ranger-base", value:"fuchsia"}];
function creaGrafo (selection, data2){
    var color = d3.scaleOrdinal()
        .domain(["Methylosmolene", "Chlorodinine", "AGOC-3A", "Appluimonia","Tutti"])
        .range(["#66c2a5", "#fc8d62", "#8da0cb","#e78ac3","#b59ea5"]);
    var cf	=	crossfilter(data2);
    var datiUpVei = cf.dimension(function(d) {return d.gatename;});
    var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup);

    //cambio i valori di check_ins con quelli aggiornati
    datiUpGroup.forEach(function(element) {
        for (i = 0; i < selection.nodes.length; i++) {
            if (selection.nodes[i]["key"]==element.key){
                selection.nodes[i]["check_ins"]=element.value;
            }
        }
    })

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width  = 650 - margin.left - margin.right,
        height = 650  - margin.top  - margin.bottom;

    var svg = d3.select("#xyz")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .attr("viewBox", "0 0 250.000000 250.000000")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var legend = svg.append("g")
        .selectAll(".legend")
        .data(colori_base)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {return "translate(200," + i * 10 + ")"; });
    legend.append("circle")
        .attr("cx", 42)
        .attr("cy", 3)
        .attr("r", 3)
        .style("fill", function (d) {return d.value; });
    legend.append("text")
        .attr("x", 50 - 12)
        .attr("y", 6)
        .style("text-anchor", "end")
        .attr("fill", "yellow")
        .style("font-size","7pt")
        .text(function (d) { return d.key; });

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(selection.links)
        .enter()
        .append('line')
        .attr('stroke-width', 0.0)
        .attr('stroke', '#E5E5E5')
        .attr("class", function(d) {return d.source; })
        .attr("id", function(d) { return d.target; })
        .attr("x1", function (d) {return d.Sxpos})
        .attr("y1", function (d) { return d.Sypos; })
        .attr("x2", function (d) { return d.Txpos; })
        .attr("y2", function (d) { return d.Typos; });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(selection.nodes)
        .enter()
        .append("circle")
        .attr("opacity", 0.75)
        .attr("fill", function(d) { return (d.color); });

    // Range grandezza Nodi
    var nodeSizeRange = [1, 10];
    var valori =[];
    (selection.nodes).forEach(function(element) {
        valori.push(element.check_ins);
    })
    var minmax = d3.extent(valori);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    var legenda = svg.append("g")
        .attr("transform","translate(190 ,170)")
        .append("text")
        .attr("fill", "yellow")
        .style("font-size","7pt")
        .text("Legenda (min, MAX)")
    var elem = svg.selectAll("g legend")
        .data(minmax)
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform","translate(200 ,200)")
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return nodeScale(d);})
        .attr("stroke","red")
        .attr("fill", "white")
        .attr("cx", function (d) { return nodeScale(d)*2})
    elemEnter.append("text")
        .attr("fill", "yellow")
        .style("font-size","5pt")
        .text(function(d){return d})
        .attr("x", function (d) { return nodeScale(d)*2-4})
        .attr("y", -16)

    node
        .attr("key", function(d) { return d.key ;})
        .attr("r", function(d){return nodeScale(d.check_ins);})
        .attr("cx", function (d) { return d.xpos;})
        .attr("cy", function (d) { return d.ypos;})
        .on('mouseover', function(d) {
            showPopover.call(this, d);
            d3.select("#xyz")
                .selectAll("."+$(this).attr("key"))
                .attr('stroke-width', 0.4);
            d3.select("#xyz")
                .selectAll("#"+$(this).attr("key"))
                .attr('stroke-width', 0.4);
            })
        .on("mouseout", function(d) {
            removePopovers();
            d3.select("#xyz")
                .selectAll("line")
                .attr('stroke-width', 0.0);
            console.log(this); })

}

function updateGrafo (dati, data2){
    var cf	=	crossfilter(data2);
    svg.selectAll("g").remove();
    var legend = svg.append("g")
        .selectAll(".legend")
        .data(colori_base)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {  console.log(d); return "translate(200," + i * 10 + ")"; });
    legend.append("circle")
        .attr("cx", 42)
        .attr("cy", 3)
        .attr("r", 3)
        .style("fill", function (d) {return d.value; });
    legend.append("text")
        .attr("x", 50 - 12)
        .attr("y", 6)
        .style("text-anchor", "end")
        .attr("fill", "yellow")
        .style("font-size","7pt")
        .text(function (d) { return d.key; });

    if (mese_anno!='tutte'){
    var prov = cf.dimension(function(d) { return d.meseanno; });
    prov.filterExact(mese_anno);
    }
    if (giorno!='Tutti i giorni'){
        var prov = cf.dimension(function(d) { return d.giorno; });
        prov.filterExact(giorno);
    }
    if (tipo_veicolo!='tutti'){
    var cartype = cf.dimension(function(d) { return d.cartype; });
    cartype.filterExact(tipo_veicolo);
    }
    var datiUpVei = cf.dimension(function(d) {return d.gatename;});
    var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
        datiUpGroup=datiUpV.all();
    console.log (datiUpGroup);

    //cambio i valori di check_ins con quelli aggiornati
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
        .attr('stroke-width', 0.0)
        .attr('stroke', '#E5E5E5')
        .attr("class", function(d) { return d.source; })
        .attr("id", function(d) { return d.target; })
        .attr("x1", function (d) {return d.Sxpos})
        .attr("y1", function (d) { return d.Sypos; })
        .attr("x2", function (d) { return d.Txpos; })
        .attr("y2", function (d) { return d.Typos; });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(dati.nodes)
        .enter()
        .append("circle")
        .attr("opacity", 0.75)
        .attr("fill", function(d) { return (d.color); });

    var nodeSizeRange = [1, 10];
    var valori =[];
    (dati.nodes).forEach(function(element) {
        valori.push(element.check_ins);
    })
    console.log(valori)
    var minmax = d3.extent(valori);
    var nodeScale = d3.scaleLinear()
        .range(nodeSizeRange)
        .domain(minmax);

    var legenda = svg.append("g")
        .attr("transform","translate(190 ,170)")
        .append("text")
        .attr("fill", "yellow")
        .style("font-size","7pt")
        .text("Legenda (min, MAX)")

    var elem = svg.selectAll("g legend")
        .data(minmax)
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform","translate(200 ,200)")
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return nodeScale(d);})
        .attr("stroke","red")
        .attr("fill", "white")
        .attr("cx", function (d) { return nodeScale(d)*2})
    elemEnter.append("text")
        .attr("fill", "yellow")
        .style("font-size","5pt")
        .text(function(d){return d})
        .attr("x", function (d) { return nodeScale(d)*2-4})
        .attr("y", -16)

    node
        .attr("key", function(d) { return d.key ;})
        .attr("r", function(d){return nodeScale(d.check_ins);})
        .attr("cx", function (d) { return d.xpos;})
        .attr("cy", function (d) { return d.ypos;})
        .on('mouseover', function(d) {
            showPopover.call(this, d);
            d3.select("#xyz")
                .selectAll("."+$(this).attr("key"))
                .attr('stroke-width', 0.4);
            d3.select("#xyz")
                .selectAll("#"+$(this).attr("key"))
                .attr('stroke-width', 0.4);
        })
        .on("mouseout", function(d) {
            removePopovers();
            d3.select("#xyz")
                .selectAll("line")
                .attr('stroke-width', 0.0);
            console.log(this); });

}
function removePopovers () {
    $('.popover').each(function() {
        $(this).remove();
    });
}
function showPopover (d) {
    console.log(d)
    $(this).popover({
        title: d.key,
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() {
            return "N° veicoli: "+d.check_ins;
        }
    });
    $(this).popover('show')
}