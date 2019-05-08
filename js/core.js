var idDepts = [];
var nomeDepts = [];

var listGastos = [];
var tipoGastos = [];

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

function infosDepts(){
    
    const url='https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';
    const Http = createCORSRequest("GET",url);
    var listDep;
    Http.send();
    Http.onreadystatechange=(e)=>{
        listDep = JSON.parse(Http.responseText);
        var txt = "";
        for(var i = 0; i < 513; i++){
            txt += `<div id="dep_${listDep.dados[i].id}" class="depts">   <div class="infos">Nome: `;
            txt += listDep.dados[i].nome;
            
            txt += "<br>Partido:";
            txt += listDep.dados[i].siglaPartido;

            txt += "<br>Estado:";
            txt += listDep.dados[i].siglaUf;
            txt += "    </div>";

            txt += `<div class="container"> <img src="${listDep.dados[i].urlFoto}" alt="${listDep.dados[i].nome}"></div>`

            txt += '</div>';

            idDepts.push(listDep.dados[i].id);
            nomeDepts.push(listDep.dados[i].nome);
        }
        
        document.getElementById('listaDepts').style.height = "auto";
        document.getElementById('listaDepts').style.height = "auto";
        //document.getElementById('listaDepts').innerHTML = txt;
        
        console.log("Dept1: ",listDep.dados[1])
        getGastos();
    }
    
}

infosDepts();

function trataDespesas(){
    var listGastosProcessada = [['Tipo de Despesa','Dinheiro gasto']];
    var aux = 0, count = 0;
    for(var i = 0; i < tipoGastos.length; i++){
        aux = 0;
        count = 0;
        for(var j = 0; j < listGastos.length; j++){
            if(listGastos[j][0] == tipoGastos[i]){
                aux += listGastos[j][1];
                count++;
            }
        }
        listGastosProcessada.push([tipoGastos[i],aux/count]);
    }
    return listGastosProcessada;
}

function drawChart() {
    
    var array = trataDespesas();

    console.log(array)

    var data = google.visualization.arrayToDataTable(array);

    document.getElementById('listaDepts').style.height = '600px';
    document.getElementById('listaDepts').style.width = '1080px';

    var options = {
        title: 'Média de gastos'
    };

    var chart = new google.visualization.PieChart(document.getElementById('listaDepts'));

    chart.draw(data, options);
}

function getGastos(){
    for(var i = 0; i < 101; i++){
        const UrlGastos = `https://dadosabertos.camara.leg.br/api/v2/deputados/${idDepts[i]}/despesas?ordem=ASC&ordenarPor=ano`;
        const Http2 = createCORSRequest("GET",UrlGastos);
        var temp = "";
        Http2.send();
        Http2.onreadystatechange=(e)=>{
            temp = JSON.parse(Http2.responseText);
            for(var i = 0; i < temp.dados.length; i++){
                listGastos.push([temp.dados[i].tipoDespesa,temp.dados[i].valorLiquido]);
                if(!tipoGastos.includes(temp.dados[i].tipoDespesa)){
                    tipoGastos.push(temp.dados[i].tipoDespesa);
                }
            }
        }
    }
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}