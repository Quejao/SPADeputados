var idDepts = [];
var nomeDepts = [];

var listGastos = [];
var tipoGastosGlobal = [];

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        xhr = new XDomainRequest();
        xhr.open(method, url);

    } else {

        xhr = null;

    }
    return xhr;
}

function trataDespesas(){
    var listGastosProcessada = [['Tipo de Despesa','Dinheiro gasto']];
    var aux = 0, count = 0, media = 0;
    for(var i = 0; i < tipoGastosGlobal.length; i++){
        aux = 0;
        count = 0;
        media = 0;
        for(var j = 0; j < listGastos.length; j++){
            if(listGastos[j][0] == tipoGastosGlobal[i]){
                aux += listGastos[j][1];
                count++;
            }
        }
        media = (aux/count);
        listGastosProcessada.push([tipoGastosGlobal[i], parseFloat(media.toFixed(2))]);
    }
    return listGastosProcessada;
}

function drawChart() {
    
    var array = trataDespesas();

    var data = google.visualization.arrayToDataTable(array);

    document.getElementById('listaDepts').style.height = '600px';
    document.getElementById('listaDepts').style.width = '1080px';

    var options = {
        title: 'Média de gastos'
    };

    var chart = new google.visualization.PieChart(document.getElementById('listaDepts'));

    chart.draw(data, options);
}

function getGastos(UrlGastos){
    const Http2 = createCORSRequest("GET",UrlGastos);
    var temp = "";
    var tipoGastos = [];
    var valorGastos = [];
    setTimeout(Http2.send(),200);
    Http2.onreadystatechange=(e)=>{
        temp = JSON.parse(Http2.response);
        for(var i = 0; i < temp.dados.length; i++){
            if(!tipoGastosGlobal.includes(temp.dados[i].tipoDespesa)){
                tipoGastosGlobal.push(temp.dados[i].tipoDespesa);
            }
            if(!tipoGastos.includes(temp.dados[i].tipoDespesa)){
                tipoGastos.push(temp.dados[i].tipoDespesa);
                valorGastos.push(temp.dados[i].valorDocumento);
            } else{
                valorGastos[tipoGastos.indexOf(temp.dados[i].tipoDespesa)] += temp.dados[i].valorDocumento;
            }
        }
        for(var i = 0; i < tipoGastos.length; i++){
            listGastos.push([tipoGastos[i],valorGastos[i]]);
        }
    }
}

function calculaGastos(){
    for(var i = 0; i < 101; i++){
        const UrlGastos = `https://dadosabertos.camara.leg.br/api/v2/deputados/${idDepts[i]}/despesas?ordem=ASC&ordenarPor=ano`;
        getGastos(UrlGastos);
    }

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

function infosDepts(){
    const url='https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';
    const Http = createCORSRequest("GET",url);
    var listDep;
    Http.send();
    Http.onreadystatechange=(e)=>{
        listDep = JSON.parse(Http.response);
        for(var i = 0; i < 513; i++){

            idDepts.push(listDep.dados[i].id);
            nomeDepts.push(listDep.dados[i].nome);
        }
        console.log(listDep.dados[400].nome);
        document.getElementById('listaDepts').style.height = "auto";
        document.getElementById('listaDepts').style.height = "auto";
        calculaGastos();
    }
}

function pesquisa(value){
    document.getElementById('listaDepts').style.height = "100%";
    document.getElementById('listaDepts').style.height = "100%";
    if(nomeDepts.includes(value)){
        idPesquisa = idDepts[nomeDepts.indexOf(value)];
        const urlDep = `https://dadosabertos.camara.leg.br/api/v2/deputados/${idPesquisa}`;
        const HttpPesquisa = createCORSRequest("GET",urlDep);
        HttpPesquisa.send();
        HttpPesquisa.onreadystatechange=(e)=>{
            var txt = '<div class="depts">';
            infoDep = JSON.parse(HttpPesquisa.response);
            txt += "Nome Civil: ";
            txt += infoDep.dados.nomeCivil;

            txt += "<br>Nome Eleitoral: ";
            txt += infoDep.dados.ultimoStatus.nomeEleitoral;

            txt += "<br>CPF: ";
            txt += infoDep.dados.cpf;

            txt += "<br>Idade: ";
            var idade = 2019 - parseInt(infoDep.dados.dataNascimento.split())
            txt += idade;

            txt += "<br>Partido: ";
            txt += infoDep.dados.ultimoStatus.siglaPartido;

            txt += "<br>Estado: ";
            txt += infoDep.dados.ultimoStatus.siglaUf;

            txt += `<div class="container"> <img src="${infoDep.dados.ultimoStatus.urlFoto}" alt="${infoDep.dados.nomeCivil}"></div>`;

            txt += "</div>";
            document.getElementById("listaDepts").innerHTML = txt;
        };
    } else{
        alert(`Deputado ${value} não encontrado! Verifique o nome e pesquise novamente.`)
    }
};

infosDepts();