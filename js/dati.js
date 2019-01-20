let mese_anno='tutte';
let tipo_veicolo='tutti';
let giorno='Tutti i giorni';
let vei='Tutti';

let mese_annoB='tutte';
let tipo_veicoloB='tutti';
let giornoB='Tutti i giorni';
let veiB='Tutti';
let tutti =[
    {key:"tutti", value:"Tutti"},
    {key:"1",value:"Auto a 2 assi (o moto)"},
    {key:"2", value:"Camion a 2 assi"},
    {key:"2P", value:"Camion a 2 assi del parco"},
    {key:"3", value:"Camion a 3 assi"},
    {key:"4", value:"Camion 4 assi o superiore"},
    {key:"5",value:"Bus a 2 assi"},
    {key:"6", value:"Bus a 3 assi"}];
function app (){
var i=0;
function me (){
    d3.json("data/graph.json", function(data) {
        d3.json("data/dati_mese.json", function(data1) {
            d3.json("data/dati_mese_giorno.json", function (data2){
                d3.json("data/percorsi.json", function (data3) {
                    creaSelettoreVeicolo(data, data1, data2)
                    creaSelettoreDate(data, data1, data2)
                    creaSelettoreVeicoloB(data, data1, data2, data3)
                    creaSelettoreDateB(data, data1, data2, data3)
                    creaGrafo(data, data2)
                    creaLinechart(data2, data1)
                    bolle(data, data2, data1, data3)
                })
            })
        })
    })
}

/*
function createToolbar(data, data1, data2) {
    //SELEZIONE DEI VEICOLI
    toolbar.append("label")
        .attr("style", "font-size: 18pt")
        .text("Seleziona il tipo di veicolo:");

    var tbYear = toolbar.append("form");
    var labels = tbYear.selectAll("button")
        .data(tutti)
        .enter()
        .append("div")
        .append("button")
        .text(function(d) {
            return d.value
        })
        .attr('style', 'width:180px; height:40px; font-size: 14pt; font-weight: bold')
        .attr('name', 'mode')
        .on("click", function(d) {
            console.log("click year", d);
            tipo_veicolo=d.key;
            vei=d.value;
            updateGrafo(data, data2)
        })
}
*/
function creaSelettoreVeicolo(data, data1, data2) {
    //SELEZIONE DEI VEICOLI
    toolbar.append("label")
        .attr("style", "font-size: 18pt")
        .text("Seleziona il tipo di veicolo:")
        .append("br");

    var labels = toolbar.append("select")
        .attr('id','selettore')
        .on('change',function(d) {
            console.log("click veicolo ", this.value);
            for (i = 0; i < tutti.length; i++) {
                if (this.value==tutti[i].value){
                    tipo_veicolo=tutti[i].key;
                    vei=tutti[i].value;
                }
            };
            updateGrafo(data, data2)
        })
        .selectAll("option")
        .data(tutti)
        .enter()
        .append("option")
        .attr('name', (function(d) {
            return d.key
        }))
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            let id = d.key;
            return d.value
        })
        ;


}

var date_all =['tutte',
    '2015-05','2015-06','2015-07','2015-08','2015-09','2015-10','2015-11','2015-12','2016-01','2016-02','2016-03','2016-04','2016-05']
function creaSelettoreDate(data, data1, data2) {
    creaSelettoreDateSpec(data, data2)
    //SELETTORE PER LE DATE mese e anno
    var cf	=	crossfilter(data1);
    var dateT = cf.dimension(function(d){return d.meseanno});
    var date = dateT.group().all();
    let toolbar2 = d3.select("#toolbar2");
    toolbar2.append("label")
        .attr("style", "font-size: 18pt")
        .text("Seleziona la data:")
        .append("br");

    var tbYear = toolbar2.append("select")
        .on('change',function(d) {
            mese_anno=this.value;
            giorno='Tutti i giorni'
            updateGrafo(data, data2)
            creaSelettoreDateSpec(data, data2)
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


function creaSelettoreDateSpec(data, data2) {
    //SELETTORE PER LE DATE giorni
    toolbar3.selectAll("option").remove();

    if (mese_anno=='tutte'){
        var date=([{key:'Seleziona un mese'}])
    }
    else {
        var cf	=	crossfilter(data2);
        var prov = cf.dimension(function(d) { return d.meseanno; });
        prov.filterExact(mese_anno);
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

    var tbYear = toolbar3
        .on('change',function(d) {
            giorno=this.value;
            console.log(mese_anno);
            console.log(giorno);
            updateGrafo(data, data2)

        })
        .attr('name','selettore')
        .selectAll("option")
        .data(date)
        .enter()
        .append("option")
        .attr('style', 'width:100px; height:30px; font-size: 14pt; font-weight: bold')
        .text(function(d) {
            return d.key
        });
}

 me();
}
app();
