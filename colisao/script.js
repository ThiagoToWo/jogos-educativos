var canvas; // canvas
var ctx; // contexto 2d
const FATOR_RAIO = 10 / 10 // 10kg = raio 10px
const FATOR_VEL = 20 / 4 // 20m/s = 4px/s
var x_a; // posição inicial do corpo A
var x_b; // posição inicial do corpo B
var e; // coeficiente de restituição
var v1_final; // velocidade final da preta
var v2_final; // velocidade final da branca
var corpoA; // objeto Corpo
var corpoB; // objeto Corpo
var processador; // objeto Processador
var tudo = []; // guarda os corpos para processamento
const f = document.querySelector("form");
const botPlayPause = document.querySelector("#botPlayPause");
const botParar = document.querySelector("#botParar");

window.addEventListener("load", main);
f.addEventListener("change", configurarValores);
botParar.addEventListener("click", parar);

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    x_a = 20 / FATOR_RAIO;
    x_b = canvas.width / 2;
    var y = canvas.height / 2;
    corpoA = new Corpo(x_a, y, 'black');
    corpoB = new Corpo(x_b, y, 'white');  

    processador = new Processador();
    processador.adicionar(corpoA);
    processador.adicionar(corpoB);

    configurarValores();

    botPlayPause.addEventListener("click", iniciar);
}

function iniciar() {
    processador.ligar();
    botPlayPause.removeEventListener("click", iniciar);
    botPlayPause.addEventListener("click", pausar);
}

function pausar() {
    processador.desligar();
    botPlayPause.removeEventListener("click", pausar);
    botPlayPause.addEventListener("click", iniciar);
}

function parar() {
    processador.desligar();
    main();
}

function configurarValores() {
    e = Number(f.e.value);

    corpoA.x = x_a;
    corpoA.m = Number(f.m1.value);
    corpoA.v = Number(f.v1.value) / FATOR_VEL;
    corpoA.r = corpoA.m / FATOR_RAIO;

    corpoB.x = x_b;
    corpoB.m = Number(f.m2.value);
    corpoB.v = Number(f.v2.value) / FATOR_VEL;
    corpoB.r = corpoB.m / FATOR_RAIO;

    processador.desenharElementos();
}