const Http = new XMLHttpRequest();
const url='https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome';
var listDep;
Http.open("GET", url);
Http.send();
Http.onreadystatechange=(e)=>{
    listDep = JSON.parse(Http.responseText);
    var txt = "";
    for(var i = 0; i < 102; i++){
        txt += `<div id="dep_${i}" class="depts">   <div class="infos">Nome: `;
        txt += listDep.dados[i].nome;
        
        txt += "<br>Partido:";
        txt += listDep.dados[i].siglaPartido;

        txt += "<br>Estado:";
        txt += listDep.dados[i].siglaUf;
        txt += "    </div>";

        txt += `<div class="container"> <img src="${listDep.dados[i].urlFoto}" alt="${listDep.dados[i].nome}"></div>`

        txt += '</div>';
    }
    document.getElementById('listaDepts').innerHTML = txt;
    console.log(listDep.dados[1])
}
