function provaBarre (data1){
    console.log (data1);
    console.log (tutti);
    a=[];

    for (j = 0; j<7;j++){
        console.log (tutti[j].key);
        var cf	=	crossfilter(data1);
        var cartype = cf.dimension(function(d) { return d.cartype; });
        cartype.filterExact(tutti[j].key);
        var datiUpVei = cf.dimension(function(d) {return d.meseanno;});
        var datiUpV= datiUpVei.group().reduceSum(function(d) { return d.n; }),
            datiUpGroup=datiUpV.all();
        console.log (datiUpGroup);
        switch (j) {
            case 0:
                for (i = 0; i < datiUpGroup.length; i++) {
                    a[i]=({quarter:datiUpGroup[i].key, "Auto a 2 assi (o moto)":datiUpGroup[i].value});
                }
                break;
            case 1:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 2 assi": datiUpGroup[i].value});
                }
                break;
            case 2:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 2 assi del parco": datiUpGroup[i].value});
                }
                break;
            case 3:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion a 3 assi": datiUpGroup[i].value});
                }
                break;
            case 4:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Camion 4 assi o superiore": datiUpGroup[i].value});
                }
                break;
            case 5:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Bus a 2 assi": datiUpGroup[i].value});
                }
                break;
            case 6:
                for (i = 0; i < datiUpGroup.length; i++) {
                    Object.assign(a[i], {"Bus a 3 assi": datiUpGroup[i].value});
                }

        }

    }
    data=a;


    var margin = {top: 20, right: 55, bottom: 30, left: 40},
        width  = 1000 - margin.left - margin.right,
        height = 500  - margin.top  - margin.bottom;
    var x = d3.scaleBand ()
        .rangeRound([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    var line = d3.line()
        .x(function (d) { return x(d.label) + x.bandwidth() / 2; })
        .y(function (d) { return y(d.value); })
        .curve(d3.curveCardinal);
    ;

    var color = d3.scaleBand()
        .range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c","#6ed349","#6ed349"]);
    console.log(a)
    var labelVar = 'quarter'; //A
    var varNames = d3.keys(a[0])
        .filter(function (key) { return key !== labelVar;}); //B

    color.domain(varNames); //C
    console.log(varNames)
    var seriesData = varNames.map(function (name) { //D
        return {
            name: name,
            values: data.map(function (d) {
                return {name: name, label: d[labelVar], value: +d[name]};
            })
        };
    });
    console.log("seriesData", seriesData);
    console.log(color.name)
    console.log(color.domain)

    x.domain(data.map(function (d) { return d.quarter; })); //E
    y.domain([
        d3.min(seriesData, function (c) {
            return d3.min(c.values, function (d) { return d.value; });
        }),
        d3.max(seriesData, function (c) {
            return d3.max(c.values, function (d) { return d.value; });
        })
    ]);

    var series = d3.select("#ch").selectAll(".series")
        .data(seriesData)
        .enter()
        .append("g")
        .attr("class", "series");

    series.append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { console.log( color(d.name))
            return color(d.name); })
        .style("stroke-width", "4px")
        .style("fill", "none");





}