var resposta = [];

var listGastos = [['Tipo de Despesa','Dinheiro gasto']];

function infosDepts(){

    const Http = new XMLHttpRequest();
    const url='https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';
    var listDep;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
        listDep = JSON.parse(Http.responseText);
        var txt = "";
        for(var i = 0; i < 102; i++){
            txt += `<div id="dep_${listDep.dados[i].id}" class="depts">   <div class="infos">Nome: `;
            txt += listDep.dados[i].nome;
            
            txt += "<br>Partido:";
            txt += listDep.dados[i].siglaPartido;

            txt += "<br>Estado:";
            txt += listDep.dados[i].siglaUf;
            txt += "    </div>";

            txt += `<div class="container"> <img src="${listDep.dados[i].urlFoto}" alt="${listDep.dados[i].nome}"></div>`

            txt += '</div>';

            resposta.push(listDep.dados[i].id)
        }
        
        document.getElementById('listaDepts').style.height = "auto";
        document.getElementById('listaDepts').style.height = "auto";
        //document.getElementById('listaDepts').innerHTML = txt;
        
        console.log("Dept1: ",listDep.dados[1])
    }
    
}

infosDepts();

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var array = [
        ['Task', 'Hours per Day'],
        ['Work',     10],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    8]
    ];
    //var UrlGastos = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/despesas?ordem=ASC&ordenarPor=ano`;
    var data = google.visualization.arrayToDataTable(array);

    document.getElementById('listaDepts').style.height = '600px';
    document.getElementById('listaDepts').style.width = '1080px';

    var options = {
        title: 'Média de gastos'
    };

    var chart = new google.visualization.PieChart(document.getElementById('listaDepts'));

    chart.draw(data, options);
}

console.log("respostas: ",resposta);

function getGastos(){
    for(var i = 0; i < resposta.length; i++){
        const Http2 = new XMLHttpRequest();
        const UrlGastos = `https://dadosabertos.camara.leg.br/api/v2/deputados/${resposta[i]}/despesas?ordem=ASC&ordenarPor=ano`;
        var temp = "";
        Http2.open("GET", UrlGastos);
        Http2.send();
        Http2.onreadystatechange=(e)=>{
            temp = JSON.parse(Http2.responseText);
            console.log(temp);
        }
    }
}

getGastos();