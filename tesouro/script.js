//==========================================variáveis globais============================================//

// elementos html
const quadrante = document.querySelector("#quadrante");
const tesouros = document.querySelector("#tesouros");
const vida = document.querySelector("#vida");
const radar = document.querySelector("#radar");
const btNovo1 = document.querySelector("#novo1");
const btNovo2 = document.querySelector("#novo2");
const pre = document.querySelector("pre");
const btL = document.querySelector("#l");
const btR = document.querySelector("#r");
const btU = document.querySelector("#u");
const btD = document.querySelector("#d");

const mapa = []; // matriz mapa
const max_lin = 32; // limite máximo de linhas da matriz
const max_col = 64; // limite máximo de colunas da matriz
let linha = 0; // linha posição do personagem
let coluna = 0; // coluna posição do personagem
const VAZIO = 0; // flag dos espaços caminháveis
const ARMADILHA = 1; // flag das armadilhas
const TESOURO = 2; // flag dos tesouros		
const PAREDE = 3; // flag das paredes
const PERSONAGEM = 4; // flag do personagem
const MAX_TESOURO = 4; // quantidade máxima de tesouros no mapa;
const MAX_ARMADILHA = 8; // quantidade máxima de armadilhas no mapa;
let numVida = 4; // contagem dos pontos de vida
let numTesouros = 0; // contagem dos tesouros encontrados
var itens = []; // guarda as informações dos tesouros no mapa;

//==========================================configuração inicial============================================//

// preenche a matriz do mapa
preencerMapa();

// inclui o personagem na posição inicial
mapa[linha][coluna] = PERSONAGEM;

// imprime o mapa
imprimirMapa(linha, coluna);

//==========================================configuração dos eventos============================================//

// permite o controle por teclado
window.addEventListener("keydown", mover);

// permitir controle por botões
btL.addEventListener("click", moverEsquerda);

btR.addEventListener("click", moverDireita);

btU.addEventListener("click", moverCima);

btD.addEventListener("click", moverBaixo);

btNovo1.addEventListener("click", () => {
    location.reload();
});

btNovo2.addEventListener("click", () => {
    location.reload();
});

//==========================================funções úteis============================================//

function imprimirMapa(l, c) {
    const qx = l > max_lin / 2 - 1 ? 16 : 0;
    const qy = c > max_col / 2 - 1 ? 32 : 0;
    let display = "";

    for (let i = qx; i < qx + max_lin / 2; i++) {
        for (let j = qy; j < qy + max_col / 2; j++) {
            switch (mapa[i][j]) {
                case VAZIO: // caminho
                case ARMADILHA: // armadilha
                case TESOURO: display += " "; break; // tesouro						
                case PAREDE: display += "<font style='color: black'>&clubs;</font>"; break; // parede
                case PERSONAGEM: display += "<font style='color: red'>&#9786;</font>"; // personagem
            }
        }

        display += "\n";
    }

    pre.innerHTML = display;
    quadrante.innerHTML = `(${qx}, ${qy})`;
    calcularTemperatura(linha, coluna);
}

function preencerMapa() {
    for (let i = 0; i < max_lin; i++) {
        mapa[i] = [];
        for (let j = 0; j < max_col; j++) {
            const k = Math.random();

            if (k < 0.3 && i != 0 && i != max_lin && j != 0 && j != max_col) {
                mapa[i][j] = PAREDE;
            } else {
                mapa[i][j] = VAZIO;
            }
        }
    }

    colocarComponente(ARMADILHA, MAX_ARMADILHA);
    colocarComponente(TESOURO, MAX_TESOURO);
}

function colocarComponente(tipo, quantidade) {
    for (let i = 0; i < quantidade; i++) {
        let l = Math.floor(Math.random() * max_lin);
        let c = Math.floor(Math.random() * max_col);

        while (mapa[l][c] != VAZIO) {
            l = Math.floor(Math.random() * max_lin);
            c = Math.floor(Math.random() * max_col);
        }

        mapa[l][c] = tipo;

        if (tipo == TESOURO) {
            itens.push({
                linha: l,
                coluna: c,
                distancia: undefined,
                encontrado: false
            });
        }
    }
}

function processarEncontro(l, c) {
    if (mapa[l][c] == ARMADILHA) {
        numVida--;

        if (numVida == 0) {
            alert("Você caiu em um buraco profundo!!");
            vida.innerHTML = "Game Over!";
            btNovo2.className = "exibe";
            window.removeEventListener("keydown", mover);
            btD.disabled = true;
            btU.disabled = true;
            btL.disabled = true;
            btR.disabled = true;
            pre.style.backgroundColor = "red";
        } else {
            alert("Você se feriu em uma armadilha!!");
            let display = "";

            for (let i = 0; i < numVida; i++) {
                display += "&#10084;&#65039; ";
            }

            vida.innerHTML = display;
        }

    } else if (mapa[l][c] == TESOURO) {
        numTesouros++;

        if (numTesouros == MAX_TESOURO) {
            alert("Você encontrou o último tesouro perdido!");
            window.removeEventListener("keydown", mover);
            btD.disabled = true;
            btU.disabled = true;
            btL.disabled = true;
            btR.disabled = true;
            tesouros.innerHTML = `Você encontrou os ${MAX_TESOURO} tesouros`;
            btNovo1.className = "exibe";
            radar.innerHTML = `Temperatura: --`;
        } else {
            alert("Você encontrou um dos tesouros");
            let display = "";

            for (let i = 0; i < numTesouros; i++) {
                display += "&#128176; ";
            }

            tesouros.innerHTML = display;
        }

        itens.shift();
    }
}

function calcularTemperatura(l, c) {
    for (let i = 0; i < itens.length; i++) {
        const dx = l - itens[i].linha;
        const dy = c - itens[i].coluna;
        const d2 = dx * dx + dy * dy;

        itens[i].distancia = d2;
    }

    itens.sort((a, b) => a.distancia - b.distancia);
    const proximo = Math.round(Math.sqrt(itens[0].distancia));
    let temepratura;

    //0 < fogo < 4 < muito quente < 16 < quente < 28 < frio < 40 < muito frio < 44 < congelado
    if (proximo > 44) {
        temepratura = "Está congelado!"
    } else if (proximo > 40) {
        temepratura = "Está muito frio!";
    } else if (proximo > 28) {
        temepratura = "Está frio";
    } else if (proximo > 16) {
        temepratura = "Está quente";
    } else if (proximo > 4) {
        temepratura = "Está muito quente!";
    } else {
        temepratura = "Está pegando fogo!!";
    }

    radar.innerHTML = `Temperatura: ${temepratura}`;
}

// funções de movimentação
function mover(e) {
    const tecla = e.key;

    switch (tecla) {
        case "ArrowLeft": // esquerda
            moverEsquerda();
            break;
        case "ArrowRight": // direita
            moverDireita();
            break;
        case "ArrowUp": // cima
            moverCima();
            break;
        case "ArrowDown": // baixo
            moverBaixo();
    }
}

function moverDireita() {
    if ((coluna + 1) < max_col && mapa[linha][coluna + 1] != PAREDE) {
        mapa[linha][coluna] = VAZIO;
        coluna += 1;
        processarEncontro(linha, coluna);
        mapa[linha][coluna] = PERSONAGEM;
    }

    imprimirMapa(linha, coluna);
}

function moverEsquerda() {
    if ((coluna - 1) >= 0 && mapa[linha][coluna - 1] != PAREDE) {
        mapa[linha][coluna] = VAZIO;
        coluna -= 1;
        processarEncontro(linha, coluna);
        mapa[linha][coluna] = PERSONAGEM;
    }

    imprimirMapa(linha, coluna);
}

function moverCima() {
    if ((linha - 1) >= 0 && mapa[linha - 1][coluna] != PAREDE) {
        mapa[linha][coluna] = VAZIO;
        linha -= 1;
        processarEncontro(linha, coluna);
        mapa[linha][coluna] = PERSONAGEM;
    }

    imprimirMapa(linha, coluna);
}

function moverBaixo() {
    if ((linha + 1) < max_lin && mapa[linha + 1][coluna] != PAREDE) {
        mapa[linha][coluna] = VAZIO;
        linha += 1;
        processarEncontro(linha, coluna);
        mapa[linha][coluna] = PERSONAGEM;
    }

    imprimirMapa(linha, coluna);
}