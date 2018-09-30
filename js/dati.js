function app (){
var i=0;
var dispatch = d3.dispatch("changeYear");
function me (selection){
    console.log('selection');

    d3.json("data/graph.json", function(data) {
    console.log(data);
    d3.json("data/dati_mese.json", function(data1) {
        console.log(data1);
        var cf	=	crossfilter(data1);
        var gate = cf.dimension(function(d){return d.gatename});
        //conta e non somma
        var countgate = gate.group().reduceSum(function(d) { return d.n; }),
        alfa = countgate.all();
        console.log(countgate.all());
        alfa.forEach(function(element) {
            for (i = 0; i < data.nodes.length; i++) {
                if (data.nodes[i]["key"]==element.key){
                    data.nodes[i]["check_ins"]=element.value;
                }
            }
        })
        createToolbar(data, data1)
        createToolbar2(data, data1)
        creaGrafo(data)
        })
    })
}
var tutti =['Auto a 2 assi (o moto)','Camion a 2 assi','Camion a 2 assi del parco','Camion a 3 assi','Camion 4 assi o superiore','Bus a 2 assi','Bus a 3 assi','Tutti']
function createToolbar(data, data1) {
    k=-1;

    // create a selector for Years
    toolbar.append("label")
        .attr("style", "margin-right:5px")
        .text("Seleziona il tipo di veicolo:");

    var tbYear = toolbar.append("form");
    labels = tbYear.selectAll("button")
        .data(['1', '2', '2P', '3','4','5','6','all'])
        .enter()
        .append("div")
        .append("button")
        .text(function(d) {
            k=k+1
            return tutti[k]
        })
        //.attr('border-radius', '12px')
        .attr('style', 'width:180px')
        //.attr("type", "button")
        .attr('name', 'mode')
        .on("click", function(d) {
            dispatch.call('changeYear', this, d);
            console.log("click year", d);
            updateGrafo(d,data, data1)
        })
}


function createToolbar2(data, data1) {
    k=-1;
    var cf	=	crossfilter(data1);
    var dateT = cf.dimension(function(d){return d.meseanno});
    var date = dateT.group().all();
    console.log (Object.values(date));
    console.log (date);

    // create a selector for Years
    toolbar.append("label")
        .attr("style", "margin-right:5px")
        .text("Seleziona la data:");

    var tbYear = toolbar.append("div")
       // .attr('id', 'mode-group')
       // .attr('class', 'btn-group year-group')
        //.attr('data-toggle', 'buttons')
        //.attr('style', 'margin-right:20px; margin-bottom: 10px')
        .selectAll("button")
        .data(date)
        .enter()
        .append("div")
        .append("button")
        //.attr('class','btn btn-group btn-outline-primary')
        //.attr('role', 'group')
        .text(function(d) {
            return d.key
        })
        .on("click", function(d) {
            dispatch.call('changeYear', this, d);
            console.log("click year", d);
            updateGrafo(Object.values(d)[0],data, data1)
        })
}



return me;
}

let myApp = app();
d3.select("#viz")
    .call(myApp);
