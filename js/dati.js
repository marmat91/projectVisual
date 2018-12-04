let mese_anno='tutte';
let tipo_veicolo='tutti';
let vei='Tutti';
let tutti =[{key:"1",value:"Auto a 2 assi (o moto)"},
    {key:"2", value:"Camion a 2 assi"},
    {key:"2P", value:"Camion a 2 assi del parco"},
    {key:"3", value:"Camion a 3 assi"},
    {key:"4", value:"Camion 4 assi o superiore"},
    {key:"5",value:"Bus a 2 assi"},
    {key:"6", value:"Bus a 3 assi"},
    {key:"tutti", value:"Tutti"}];
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
        creaGrafico(data, data1)
        provaBarre(data1)
        })
    })
}


function createToolbar(data, data1) {
    k=-1;
    console.log(tutti);


    // create a selector for Years
    toolbar.append("label")
        .attr("style", "font-size: 18pt")
        .text("Seleziona il tipo di veicolo:");

    var tbYear = toolbar.append("form");
    labels = tbYear.selectAll("button")
        .data(tutti)
        .enter()
        .append("div")
        .append("button")
        .text(function(d) {
            return d.value
        })
        //.attr('border-radius', '12px')
        .attr('style', 'width:180px; height:40px; font-size: 14pt; font-weight: bold')
        //.attr("type", "button")
        .attr('name', 'mode')
        .on("click", function(d) {
            console.log("click year", d);
            tipo_veicolo=d.key;
            vei=d.value;
            updateGrafo(data, data1)
        })
}

var date_all =['tutte','2015-05','2015-06','2015-07','2015-08','2015-09','2015-10','2015-11','2015-12','2016-01','2016-02','2016-03','2016-04','2016-05']
function createToolbar2(data, data1) {
    k=-1;
    var cf	=	crossfilter(data1);
    var dateT = cf.dimension(function(d){return d.meseanno});
    var date = dateT.group().all();
    console.log (Object.values(date));
    console.log (date);

    // create a selector for Years
    toolbar2.append("label")
        .attr("style", "font-size: 18pt")
        .text("Seleziona la data:");

    var tbYear = toolbar2.append("select")
        .on('change',function(d) {
            mese_anno=this.value;
            console.log(mese_anno);
            updateGrafo(data, data1)

        })
        .attr('name','selettore')
        .selectAll("option")
        .data(date_all)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d
        });
}

return me;
}

let myApp = app();
d3.select("#viz")
    .call(myApp);
