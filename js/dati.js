let alfa;
function app (){
var i=0;
var dispatch = d3.dispatch("changeYear");
function me (selection){
    console.log('selection');

    d3.json("data/graph.json", function(data) {
    console.log(data);
    d3.json("data/graph1.json", function(data1) {
        console.log(data1);
        var cf	=	crossfilter(data1);
        var gate = cf.dimension(function(d){return d.gatename});
        var countgate = gate.group().reduceCount();
        console.log(countgate.all());
        alfa = countgate.all();
        alfa.forEach(function(element) {
            for (i = 0; i < data.nodes.length; i++) {
                if (data.nodes[i]["key"]==element.key){
                    data.nodes[i]["check_ins"]=element.value;
                }
            }
        })
        createToolbar(data, cf, data1)
        creaGrafo(data)
        })
    })
}
var tutti =['alfa','beta','gamma','tutti']
function createToolbar(data, cf, data1) {
    k=-1;

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
        .data([1, 2, 3,'all'])
        .enter()
        .append("button")
        .attr('class','btn btn-group btn-outline-primary')
        .attr('role', 'group')
        .text(function(d) {
            k=k+1
            return tutti[k]
        })
        .on("click", function(d) {
            dispatch.call('changeYear', this, d);
            console.log("click year", d);
            updateGrafo(d,data, data1)
        })



}
return me;
}

let myApp = app();
d3.select("#viz")
    .call(myApp);
