function app() {
    let svg;
    let map;
    let datigrafo; // variable containing all the reports

    // crossfilter data management RICORDARE DI CAMBIARE E ELIMINARE
    let cf; // crossfilter instance
    let dYear; // dimension for Year

    // dispacther for hte events eventi di cambio
    var dispatch = d3.dispatch("changeYear", "changeRecordType");

    function me(selection) {
        console.log('selection', selection.node());

        svg = selection.append("svg")
            .attr('height', 500)
            .attr('width', "100%");

        // loading geographical data
        d3.json("assets/data/graph3.json")
            .then(function(json) {
                datigrafo = json.map(function (d, i) {
                    let r = {
                        timestamp: d.timestamp,
                        carid: d.carid,
                        cartype: d.cartype,
                        gatename: d.gatename,
                        xpos: d.xpos,
                        ypos: d.ypos,
                        color: d.color,
                        year: +d.timestamp.split('-')[0]
                    };

                })
                // });
                // result of transformation
                console.log("datigrafo", datigrafo);


                //crossfilter
                cf = crossfilter(datigrafo);
                dYear = cf.dimension(function (d) {
                    return d.year
                });
                dCartype = cf.dimension(function (d) {
                    return d.cartype
                });
                dGatename = cf.dimension(function (d) {
                    return d.gatename
                });

                var countGatename = dGatename.group().reduceCount();

                createCounters();
                createCharts();

                // transform reports to a FeatureCollection
                let fcReports = {
                    type: "FeatureCollection",
                    features: datigrafo
                        .map(function (d, i) { // for each entry in Museums dictionary
                            return {
                                type: "Feature",
                                properties: {
                                    timestamp: d.timestamp,
                                    carid: +d.carid,
                                    cartype: +d.cartype,
                                    gatename: d.gatename,
                                    xpos: d.xpos,
                                    ypos: d.ypos,
                                    color: d.color,
                                    year: d.year
                                }
                            }
                        })
                };
                let gReports = svg.append("g")
                    .attr("class", "reports")
                    .datum(fcReports)
                    .call(map);

            });


        // utility functions
        function createCounters() {
            counterDescriptor = [{
                measure: "# Records",
                cfAggregator: cf.groupAll().reduceCount(),
                classed: "counter-num-records"
            }, {
                measure: "# car",
                cfAggregator: cf.groupAll().reduceSum(function(d) {
                    return d.carid
                }),
                classed: "counter-Passengers"
            }, {
                measure: "# type",
                cfAggregator: cf.groupAll().reduceSum(function(d) {
                    return d.cartype
                }),
                classed: "counter-num-records"
            }]


            counterDescriptor.forEach(function(d) {
                var counter = Counter().measure(d.measure);
                d.counter = counter;
                let cnt = d3.select("#counters")
                    .append("div")
                    .classed(d.classed, true)
                    .classed("col-xs-12", true)
                    .datum(d.cfAggregator.value())
                    .call(counter);
                console.log('meas', d.cfAggregator.value());
            })
        }


        function createToolbar(datigrafo) {
            var toolbar = d3.select("#toolbar");


            // create a selector for Years
            toolbar.append("label")
                .attr("style", "margin-right:5px")
                .text("Years:");

            var tbYear = toolbar.append("div")
                .attr('id', 'mode-group')
                .attr('class', 'btn-group year-group')
                .attr('data-toggle', 'buttons')
                .attr('style', 'margin-right:20px; margin-bottom: 10px')
                .selectAll("button")
                .data([2005, 2006, 2007])
                .enter()
                .append("button")
                .attr('class','btn btn-group btn-outline-primary')
                .attr('role', 'group')
                // .append("input")
                // 			.attr({type:"radio", name:"mode", id:"option1"})
                .text(function(d) {
                    return d
                })
                .on("click", function(d) {
                    dispatch.call('changeYear', this, d);
                    console.log("click year", d);
                });

            toolbar.append("label")
                .attr("style", "margin-right:5px")
                .text("RecordType:");

            var tbRecordType = toolbar.append("div")
                .attr('id', 'mode-group')
                .attr('class', 'btn-group recordtype-group')
                .attr('data-toggle', 'buttons')
                .attr('style', 'margin-right:20px; margin-bottom: 10px')
                .selectAll("button")
                .data(["All", "Interdiction", "Landing"])
                .enter()
                .append("button")
                .attr('class','btn btn-group btn-outline-primary')
                .attr('role', 'group')
                // .append("input")
                // 			.attr({type:"radio", name:"mode", id:"option1"})
                .text(function(d) {
                    return d
                })
                .on("click", function(d) {
                    dispatch.call('changeRecordType', this, d);
                    console.log("click type", d)
                });
        }

    }
    return me;

}
let myApp = app();
d3.select("#viz")
    .call(myApp);


























// load the data
/*    d3.json("data/graph.json", function (data) {
        console.log(data);
        d3.json("data/graph1.json", function (data1) {
            console.log(data1);
            var expenses = data1;

            var cf = crossfilter(data1);
            var gate = cf.dimension(function (d) {
                return d.gatename
            });
            gate.filter("entrance3");
            console.log("num reports (entrance3)", cf.groupAll().reduceCount().value());

            //	select VesselType,	count(*)	from	migrants group	by	VesselType
            var countgate = gate.group().reduceCount();
            console.log(countgate.all());
            var alfa = countgate.all();
        })
    })
}
*/