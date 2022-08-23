const countriesArray = [];
let longitudeOrigem = 0.0;
let longitudeDestino = 0.0;
let latitudeOrigem = 0.0;
let latitudeDestino = 0.0;
let distancia = 0.0;
let primeiraVez = true;

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
    distancia = calculaDistancia(0.0, 0.0, 0.0, 0.0);
    for (let index = 0; index <= 10 ; index++) {
        montaResumo(index);    
    }
    

};

function calculaRange(range) {
    var labelRange = document.getElementById("labelrange");
    labelRange.innerHTML = "Utilizar " + range.value + " milhas!";
}

function carregaCidadeOrigem(opcao) {
    limpaSelect(cidadeOrigem);
    const opPais = opcao;
    for (let i = 0; i < countriesArray[0][opPais.selectedIndex].cities.length; i++) {
        cidadeOrigem.innerHTML = cidadeOrigem.innerHTML +
        '<option value="' + i + '">' + countriesArray[0][opPais.selectedIndex].cities[i].city + '</option>';
    }
    if (!primeiraVez) {
        montaResumo(1);
    } else {
        latitudeOrigem = countriesArray[0][opPais.selectedIndex].cities[0].latitude;
        longitudeOrigem = countriesArray[0][opPais.selectedIndex].cities[0].longitude;
        distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    }
}

function localCidadeOrigem(cidade) {
    const cid = cidade;
    //console.log(cid);
    //console.log(countriesArray[0][paisOrigem.selectedIndex].cities[cid.selectedIndex].city);
    latitudeOrigem = countriesArray[0][paisOrigem.selectedIndex].cities[cid.selectedIndex].latitude;
    longitudeOrigem = countriesArray[0][paisOrigem.selectedIndex].cities[cid.selectedIndex].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    for (let index = 1; index < 4; index++) {
        montaResumo(index);
    }
}


function carregaCidadeDestino(opcao) {
    limpaSelect(cidadeDestino);
    const opPais = opcao;
    for (let i = 0; i < countriesArray[0][opPais.selectedIndex].cities.length; i++) {
        cidadeDestino.innerHTML = cidadeDestino.innerHTML +
        '<option value="' + i + '">' + countriesArray[0][opPais.selectedIndex].cities[i].city + '</option>';
    }
    if (!primeiraVez) {
        montaResumo(2);
    } else {
        latitudeDestino = countriesArray[0][opPais.selectedIndex].cities[0].latitude;
        longitudeDestino = countriesArray[0][opPais.selectedIndex].cities[0].longitude;
        console.log(latitudeOrigem + '  ' + longitudeOrigem + '  ' + latitudeDestino + '  ' + longitudeDestino)
        distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
        console.log(distancia);
    }
}

function localCidadeDestino(cidade) {
    const cid = cidade;
    latitudeDestino = countriesArray[0][paisDestino.selectedIndex].cities[cid.selectedIndex].latitude;
    longitudeDestino = countriesArray[0][paisDestino.selectedIndex].cities[cid.selectedIndex].longitude;
    distancia = calculaDistancia(latitudeOrigem,longitudeOrigem,latitudeDestino,longitudeDestino);
    for (let index = 1; index < 4; index++) {
        montaResumo(index);
    }
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

function montaResumo(index) {
    switch (index) {
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
            p3.textContent = "Distância: " + distancia + " Km";    
            break;
        case 4:
            let p4 = document.getElementById("quantidade");
            p4 = qtdAdulto.value + " adulto(s), " + qtdCrianca.value + " criança(s)";
            break;
        case 5:
            let p5 = document.getElementById("tipovoo");
            const radio1 = document.getElementById("inlineRadio1");
            const radio2 = document.getElementById("inlineRadio2");

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
            break;
        case 7:
            let p7 = document.getElementById("valorpasscrianca");    
            break;
        case 8:
            let p8 = document.getElementById("milhas");    
            break;
        case 9:
            let p9 = document.getElementById("desconto");    
            break;
        case 10:
            let p10 = document.getElementById("valortotal");    
            break;
    
        default:
            break;
    }    
}


function calculaDistancia(originLatitude, 
                          originLongitude,
                          destinationLatitude,
                          destinationLongitude) {

    console.log(originLatitude);
    console.log(originLongitude);
    console.log(destinationLatitude);
    console.log(destinationLongitude);

    const EARTH_RADIUS = 6371.071; // Earth 
    let diffLatitudeRadians = degreesToRadians(destinationLatitude) - degreesToRadians(originLatitude); 
    if (diffLatitudeRadians < 0) {
        diffLatitudeRadians = Math.abs(diffLatitudeRadians);
    }
    let diffLongitudeRadians = degreesToRadians(destinationLongitude) - degreesToRadians(originLongitude);
    if (diffLongitudeRadians < 0) {
        diffLongitudeRadians = Math.abs(diffLongitudeRadians);
    }
    let originLatitudeRadians = degreesToRadians(originLatitude); 
    let destinationLatitudeRadians = degreesToRadians(destinationLatitude); 


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

