const countriesArray = [];

var paisOrigem = document.getElementById('sel1');
var cidadeOrigem = document.getElementById('sel3');
var paisDestino = document.getElementById('sel2');
var cidadeDestino = document.getElementById('sel4');
var qtdAdulto = document.getElementById("adulto");
var qtdCrianca  = document.getElementById("crianca");

var subBtnAdulto  = document.getElementById("subadulto");
var somBtnAdulto  = document.getElementById("somadulto");

var subBtnCrianca  = document.getElementById("subcriaca");
var somBtnCrianca  = document.getElementById("somcriaca");

qtdAdulto.value = 0;
qtdCrianca.value = 0;

desabilitaBotao(qtdAdulto,subBtnAdulto);
desabilitaBotao(qtdCrianca,subBtnCrianca);

const fetchCountries = async () => {
    const url = () => `http://localhost:3000/countries`;

    countriesArray.push(await fetch(url()).then((res) => res.json()));

    for (var i = 0; i < countriesArray[0].length; i++) {
        // Popular SELECT com JSON.
        paisOrigem.innerHTML = paisOrigem.innerHTML +
            '<option value="' + i + '">' + countriesArray[0][i].country + '</option>';
        paisDestino.innerHTML = paisDestino.innerHTML +
            '<option value="' + i + '">' + countriesArray[0][i].country + '</option>';
    }
    carregaCidadeOrigem(paisOrigem);
    carregaCidadeDestino(paisDestino);

};

function calculaRange(range) {
    var labelRange = document.getElementById("labelrange");
    labelRange.innerHTML = "Utilizar " + range.value + " milhas!";
}

function carregaCidadeOrigem(opcao) {
    limpaSelect(cidadeOrigem);
    const opCidade = opcao;
    for (let i = 0; i < countriesArray[0][opCidade.selectedIndex].cities.length; i++) {
        cidadeOrigem.innerHTML = cidadeOrigem.innerHTML +
            '<option value="' + i + '">' + countriesArray[0][opCidade.selectedIndex].cities[i].city + '</option>';
    }
}

function carregaCidadeDestino(opcao) {
    limpaSelect(cidadeDestino);
    const opCidade = opcao;
    for (let i = 0; i < countriesArray[0][opCidade.selectedIndex].cities.length; i++) {
        cidadeDestino.innerHTML = cidadeDestino.innerHTML +
            '<option value="' + i + '">' + countriesArray[0][opCidade.selectedIndex].cities[i].city + '</option>';
    }
}

function limpaSelect(selecao) {
    while (selecao.length > 0) {
        selecao.remove(0);
    }
}

function desabilitaBotao(quantidade, botao) {
    //desabilita o botão no início
    //document.getElementById("botao").disabled = true;
    console.log(quantidade);
    console.log(botao);
    var conteudo = quantidade.value;
    console.log(conteudo);
    
    //var conteudo = quantidade.value;
    if (conteudo == 0) {
        botao.disabled = false;
    } else {
        botao.disabled = true;
    }
}

function subtraiAdulto() {
    //
}

function subtraiCrianca() {
    //
}

function somaAdulto() {
    //
}

function somaCrianca() {
    //
}

fetchCountries();

