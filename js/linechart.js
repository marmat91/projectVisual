function creaLinechart (data2, data1){
    d3.select("#chBut").selectAll("g").remove();
    a=[]; //nello switch gli assegno i valori
    for (j = 0; j<8;j++){
        var cf	=	crossfilter(data1);
        var cartype = cf.dimension(function(d) { return d.cartype; });
        cartype.filterExact(tutti[j].key);
        var datiUpVei = cf.dimension(function(d) {return d.meseanno;});
        var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
            datiUpGroup=datiUpV.all();

        switch (j) {
            case 1:
                for (i = 0; i < datiUpGroup.length; i++) {
                    a[i]=({quarter:datiUpGroup[i].key, "Auto a 2 assi (o moto)":datiUpGroup[i].value});
                }
                break;
            case 2:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 2 assi": datiUpGroup[i].value});
                }
                break;
            case 3:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 2 assi del parco": datiUpGroup[i].value});
                }
                break;
            case 4:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 3 assi": datiUpGroup[i].value});
                }
                break;
            case 5:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion 4 assi o superiore": datiUpGroup[i].value});
                }
                break;
            case 6:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Bus a 2 assi": datiUpGroup[i].value});
                }
                break;
            case 7:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Bus a 3 assi": datiUpGroup[i].value});
                }
                break;
        }

    }
    data=a;
    console.log(a)

    var margin = {top: 20, right: 100, bottom: 30, left: 40},
        width  = 1000 - margin.left - margin.right,
        height = 500  - margin.top  - margin.bottom;

    var svg_line = d3.select("#ch")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand ()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y);

    var line = d3.line()
        .x(function (d) { return x(d.label) + x.bandwidth() / 2; })
        .y(function (d) { return y(d.value); })
        .curve(d3.curveCardinal);

    var labelVar = 'quarter'; //A

    var varNames = d3.keys(a[0])
        .filter(function (key) { return key !== labelVar;}); //B

    var colore = { "Auto a 2 assi (o moto)":"#e41a1c", "Camion a 2 assi":"#377eb8","Camion a 2 assi del parco":"#4daf4a",  "Camion a 3 assi":"#984ea3",
        "Camion 4 assi o superiore":"#ff7f00","Bus a 2 assi":"#ffff33", "Bus a 3 assi":"#a65628" };

    var seriesData = varNames.map(function (name) { console.log (name) //D
        return {
            name: name,
            values: data.map(function (d) {
                return {name: name, label: d[labelVar], value: +d[name]};
            })
        };
    });

    x.domain(data.map(function (d) { return d.quarter; })); //E
    y.domain([
        d3.min(seriesData, function (c) {
            return d3.min(c.values, function (d) { return d.value; });
        }),
        d3.max(seriesData, function (c) {
            return d3.max(c.values, function (d) { return d.value; });
        })
    ]);

    svg_line.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg_line.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Rounds");


    var series = svg_line.selectAll(".series")
        .data(seriesData)
        .enter()
        .append("g")
        .attr("class", "series");
    series.append("path")
        .attr("class", "line")
        .attr("d", function (d) {console.log(d); return line(d.values); })
        .style("stroke", function (d) { return colore[d.name]; })
        .style("stroke-width", "4px")
        .style("fill", "none");

    series.selectAll(".point")
        .data(function (d) { return d.values; })
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function (d) { return x(d.label) + x.bandwidth()/2; })
        .attr("cy", function (d) { return y(d.value); })
        .attr("r", "5px")
        .style("fill", function (d) { return colore[d.name]; })
        .style("stroke", "grey")
        .style("stroke-width", "2px")
        .on("click", function(d) {
            removePopoversLine();
            var mese_a=d.label;
            upLinechart(data2, mese_a, data1)
        })
        .on('mouseover', function(d) {
            showPopoverLine.call(this, d);
        })
        .on("mouseout", function(d) {
            removePopoversLine();
        });
        //.append("title")
        //.text(function(d) { return  d.name+"\nData: "+d.label + "\nNumero  " + d.value  ; })
    //////onclick è qui su

    var legend = svg_line.append("g")
        .selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(100," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d) {return colore[d]; })
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });
}

function removePopoversLine () {
    $('.popover').each(function() {
        $(this).remove();
    });
}
function showPopoverLine (d) {
    console.log(d)
    $(this).popover({
        title: d.name,
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() {
            return "Data: "+d.label+"<br>Numero: "+d.value;
        }
    });
    $(this).popover('show')
}