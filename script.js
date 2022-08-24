const countriesArray = [];
let longitudeOrigem = 0.0;
let longitudeDestino = 0.0;
let latitudeOrigem = 0.0;
let latitudeDestino = 0.0;
let distancia = 0.0;
let primeiraVez = true;
const fatorCriancaDom = 0.15;
const fatorAdultoDom = 0.3;
const fatorCriancaEx = 0.25;
const fatorAdultoEx = 0.5;
const classeEcoAdulto = 1; 
const classeEcoCrianca = 1; 
const classeExcAdulto = 1.8; 
const classeExcCrianca = 1.4; 
const fatorMilha = 0.02;

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
var rangeMilhas = document.getElementById("formControlRange");

var caixaResumo = document.getElementById("cxresumo");

caixaResumo.hidden = true;

qtdAdulto.value = 1;
qtdCrianca.value = 0;

desabilitaBotao(subBtnAdulto);
desabilitaBotao(subBtnCrianca);

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
    primeiraVez = false;
    distancia = calculaDistancia(latitudeOrigem, longitudeOrigem, latitudeDestino, longitudeDestino);
    montaResumo();    
};

function calculaRange(range) {
    var labelRange = document.getElementById("labelrange");
    labelRange.innerHTML = "Utilizar " + range.value + " milhas!";
    montaResumo();
}

function carregaCidadeOrigem(opcao) {
    limpaSelect(cidadeOrigem);
    const opPais = opcao;
    for (let i = 0; i < countriesArray[0][opPais.selectedIndex].cities.length; i++) {
        cidadeOrigem.innerHTML = cidadeOrigem.innerHTML +
        '<option value="' + i + '">' + countriesArray[0][opPais.selectedIndex].cities[i].city + '</option>';
    }
    latitudeOrigem = countriesArray[0][opPais.selectedIndex].cities[0].latitude;
    longitudeOrigem = countriesArray[0][opPais.selectedIndex].cities[0].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    if (!primeiraVez) {
        montaResumo();
    } else {
        primeiraVez = false;
    }
}

function localCidadeOrigem(cidade) {
    const cid = cidade;
    latitudeOrigem = countriesArray[0][paisOrigem.selectedIndex].cities[cid.selectedIndex].latitude;
    longitudeOrigem = countriesArray[0][paisOrigem.selectedIndex].cities[cid.selectedIndex].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    montaResumo();
}


function carregaCidadeDestino(opcao) {
    limpaSelect(cidadeDestino);
    const opPais = opcao;
    for (let i = 0; i < countriesArray[0][opPais.selectedIndex].cities.length; i++) {
        cidadeDestino.innerHTML = cidadeDestino.innerHTML +
        '<option value="' + i + '">' + countriesArray[0][opPais.selectedIndex].cities[i].city + '</option>';
    }
    latitudeDestino = countriesArray[0][opPais.selectedIndex].cities[0].latitude;
    longitudeDestino = countriesArray[0][opPais.selectedIndex].cities[0].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    if (!primeiraVez) {
        montaResumo();
    } else {
        primeiraVez = false;
    }

}

function localCidadeDestino(cidade) {
    const cid = cidade;
    latitudeDestino = countriesArray[0][paisDestino.selectedIndex].cities[cid.selectedIndex].latitude;
    longitudeDestino = countriesArray[0][paisDestino.selectedIndex].cities[cid.selectedIndex].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    montaResumo();
}

function limpaSelect(selecao) {
    while (selecao.length > 0) {
        selecao.remove(0);
    }
}

function desabilitaBotao(botao) {
    if (botao.id == "subadulto" || botao.id == "somadulto") {
        if (qtdAdulto.value < 2) {
            subBtnAdulto.disabled = true;
        } else {
            subBtnAdulto.disabled = false;
        }
    } else {
        if (botao.id == "subcriaca" || botao.id == "somcriaca") {
            if (qtdCrianca.value < 1) {
                subBtnCrianca.disabled = true;
            } else {
                subBtnCrianca.disabled = false;
            }
        }
    }
}

function calculaQtd(botao) {
    if (botao.id == "subadulto" ) {
        qtdAdulto.value--;
    } else {
        if (botao.id == "somadulto") {
            qtdAdulto.value++; 
        } else {
            if (botao.id == "subcriaca") {
                qtdCrianca.value--;
            } else {
                qtdCrianca.value++;
            }
        }    
    }
    desabilitaBotao(botao);
    montaResumo();
}

function montaResumo() {
    let valorPorAdulto = 0;
    let valorPorCrianca = 0;
    let valorCrianca = 0;
    let valorTotal = 0;
    let valorDesconto = 0;


    if (cidadeOrigem[cidadeOrigem.selectedIndex].textContent == cidadeDestino[cidadeDestino.selectedIndex].textContent) {
        caixaResumo.hidden = true; 
        return "Cidades iguais!";
    }

    const radio1 = document.getElementById("inlineRadio1");
    const radio2 = document.getElementById("inlineRadio2");
    if (!radio1.checked && !radio2.checked) {
        caixaResumo.hidden = true;
        return "Classe não escolhida!";
    }   

    valorDesconto =  calculaDesconto(rangeMilhas.value, fatorMilha);

    if (radio1.checked) {
        if (paisOrigem[paisOrigem.selectedIndex].textContent == paisDestino[paisDestino.selectedIndex].textContent) {
            valorPorAdulto = calcPrecoPorPassagem(distancia, fatorAdultoDom, classeEcoAdulto);
            valorPorCrianca = calcPrecoPorPassagem(distancia, fatorCriancaDom, classeEcoCrianca);
        } else {
            valorPorAdulto = calcPrecoPorPassagem(distancia, fatorAdultoEx, classeEcoAdulto);
            valorPorCrianca = calcPrecoPorPassagem(distancia, fatorCriancaEx, classeEcoCrianca);
        }
    } else {
        console.log("Executiva");
        if (paisOrigem[paisOrigem.selectedIndex].textContent == paisDestino[paisDestino.selectedIndex].textContent) {
            valorPorAdulto = calcPrecoPorPassagem(distancia, fatorAdultoDom, classeExcAdulto);
            valorPorCrianca = calcPrecoPorPassagem(distancia, fatorCriancaDom, classeExcCrianca);
        } else {
            valorPorAdulto = calcPrecoPorPassagem(distancia, fatorAdultoEx, classeExcAdulto);
            valorPorCrianca = calcPrecoPorPassagem(distancia, fatorCriancaEx, classeExcCrianca);
        }
    }
    valorCrianca = valorPorCrianca * qtdCrianca.value ;
    if (valorCrianca == 0) {
        valorPorCrianca = valorCrianca;
    }

    valorTotal = valorPorAdulto * qtdAdulto.value + valorCrianca - valorDesconto;

    valorPorAdulto = valorPorAdulto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    valorPorCrianca = valorPorCrianca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    valorDesconto = valorDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    valorTotal = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
    for (let index = 0; index <= 11 ; index++) {
        switch (index) {
            case 0:
                caixaResumo.hidden = false;
                let p0 = document.getElementById("resumo");
                p0.textContent = "Resumo";
            case 1:
                let p1 = document.getElementById("origem");
                p1.textContent = "Origem: " + paisOrigem[paisOrigem.selectedIndex].textContent +
                                        " (" + cidadeOrigem[cidadeOrigem.selectedIndex].textContent + ")";
                break;
            case 2:
                let p2 = document.getElementById("destino");
                p2.textContent = "Destino: " + paisDestino[paisDestino.selectedIndex].textContent +
                                        " (" + cidadeDestino[cidadeDestino.selectedIndex].textContent + ")";
                break;
            case 3:
                let p3 = document.getElementById("distancia");
                p3.textContent = "Distância: " + distancia.toLocaleString('pt-BR', {style: 'decimal'}) + " Km";    
                break;
            case 4:
                let p4 = document.getElementById("quantidade");
                p4 = qtdAdulto.value + " adulto(s), " + qtdCrianca.value + " criança(s)";
                break;
            case 5:
                let p5 = document.getElementById("tipovoo");
                if (radio1.checked) {
                    p5.textContent = "Tipo de Voo: Classe " + radio1.value;
                } else {
                    if (radio2.checked) {
                        p5.textContent = "Tipo de Voo: Classe " + radio2.value;
                    }
                }
                break;
            case 6:
                let p6 = document.getElementById("valorpassadulto");
                p6.textContent = valorPorAdulto + " por adulto";
                break;
            case 7:
                let p7 = document.getElementById("valorpasscrianca");    
                p7.textContent = valorPorCrianca + " por criança";
                break;
            case 8:
                let p8 = document.getElementById("milhas");
                p8.textContent = "Milhas: " + rangeMilhas.value + " Km";
                break;
            case 9:
                let p9 = document.getElementById("desconto");
                p9.textContent = "Valor abatido por milhas: " + valorDesconto;    
                break;
            case 10:
                let p10 = document.getElementById("valortotal"); 
                p10.textContent = "Total: " + valorTotal;   
                break;
        
            default:
                break;
        }
    }    
}

function calcPrecoPorPassagem(distancia, fator, classe) {
    return distancia * fator * classe;
}

function calculaDesconto(milhas, fatorMilha) {
    return fatorMilha * milhas;
}

function calculaDistancia(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
    const EARTH_RADIUS = 6371.071; // Earth 
    let diffLatitudeRadians = Math.abs(degreesToRadians(destinationLatitude) - degreesToRadians(originLatitude)); 
    let diffLongitudeRadians = Math.abs(degreesToRadians(destinationLongitude) - degreesToRadians(originLongitude));
    let originLatitudeRadians = Math.abs(degreesToRadians(originLatitude)); 
    let destinationLatitudeRadians = Math.abs(degreesToRadians(destinationLatitude)); 

    const kmDistance = 2 * EARTH_RADIUS * Math.asin( Math.sqrt( Math.sin(diffLatitudeRadians / 2) *
                        Math.sin(diffLatitudeRadians / 2) + Math.cos(originLatitudeRadians) * Math.cos(destinationLatitudeRadians) *
                        Math.sin(diffLongitudeRadians / 2) * Math.sin(diffLongitudeRadians / 2) ) );

    return kmDistance;

}

function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi/180);
}

fetchCountries();

