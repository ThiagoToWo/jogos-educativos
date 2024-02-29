/*=====================================Variáveis Globais====================================*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const form = document.querySelector("form");
const resp1 = document.querySelector("#f");
const resp2 = document.querySelector("#T");
const resp3 = document.querySelector("#l");
const resp4 = document.querySelector("#tReal");
let elementos;
let acao;
let tReal;
let contandoTempo;

/*=====================================Funções de Formulário====================================*/
form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearInterval(acao);

    const N = Number(form.N.value);
    const a = Number(form.a.value);
    const d = Number(form.d.value);
    const v = Number(form.v.value);
    const refletiu = form.refletir.checked;
    const fundiu = form.fundir.checked;

    canvas.width = a;
    canvas.height = a;

    const n = N / (a * a);
    const f = Math.SQRT2 * n * Math.PI * d * d * v;
    const T = 1 / f;
    const l = v * T;

    resp1.innerText = `Frequência Média de Colisões (f) = ${f.toPrecision(5)} /s`;
    resp2.innerText = `Período Médio entre Colisões (T) = ${T.toPrecision(5)} s`;
    resp3.innerText = `Livre Percurso Médio (l) = ${l.toPrecision(5)} cm`;

    let x = d / 2 + Math.random() * (canvas.width - d);
    let y = d / 2 + Math.random() * (canvas.height - d);
    let vx = Math.pow(-1, Math.floor(Math.random() * 10)) * Math.random() * v;
    let vy = Math.pow(-1, Math.floor(Math.random() * 10)) * Math.sqrt(v * v - vx * vx);
    let p = new Particula(x, y, d/2, vx, vy, "red", ctx);
    elementos = [p];

    for (let i = 0; i < N - 1; i++) {
        x = d / 2 + Math.random() * (canvas.width - d);
        y = d / 2 + Math.random() * (canvas.height - d);
        vx = Math.pow(-1, Math.floor(Math.random() * 10)) * Math.random() * v;
        vy = Math.pow(-1, Math.floor(Math.random() * 10)) * Math.sqrt(v * v - vx * vx);
        p = new Particula(x, y, d/2, vx, vy, "black", ctx);
        elementos.push(p);
    }

    tReal = 0;
    contandoTempo = true;

    if (refletiu) { // processamento com reflexão
        acao = setInterval(() => { processarTudo(refletir) }, 100);
    } else if (fundiu) { // processamento com fusão
        acao = setInterval(() => { processarTudo(fundir) }, 100);
    } else { // processamento do movimento browniano
        elementos[0].rastro = true;

        for (let i = 1; i < elementos.length; i++) {
            elementos[i].ativoDesenhar = false;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        acao = setInterval(() => { processarTudo(refletir) }, 100)
    }
});

form.addEventListener("reset", () => {
    clearInterval(acao);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.width = "300px";
    canvas.style.height = "300px";
    resp1.innerText = "";
    resp2.innerText = "";
    resp3.innerText = "";
    resp4.innerText = "";
});

/*=====================================Funções de Processamento====================================*/
function processarTudo(callback) {
    if (!elementos[0].rastro) ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < elementos.length; i++) {
        elementos[i].atualizar();
        elementos[i].desenhar();

        for (let j = i + 1; j < elementos.length; j++) {
            if (elementos[i].colidiuCom(elementos[j])) {
                callback(elementos[i], elementos[j]);
            }
        }
    }

    
    if (contandoTempo) {
        tReal += 0.1;
        resp4.innerText = `Tempo Real de Experiência = ${tReal.toPrecision(5)} s`;
        if (elementos.length == 1) contandoTempo = false;
    }
}

function refletir(a, b) {
    let v = a.vx;
    a.vx = b.vx;
    b.vx = v;
    v = a.vy;
    a.vy = b.vy;
    b.vy = v;
}

function fundir(a, b) {
    let vx = (a.vx + b.vx) / 2;
    let vy = (a.vy + b.vy) / 2;

    if (a.r > b.r) {
        a.vx = vx;
        a.vy = vy;
        a.r = Math.sqrt(a.r * a.r + b.r * b.r);
        elementos.splice(elementos.indexOf(b), 1);
    } else {
        b.vx = vx;
        b.vy = vy;
        b.r = Math.sqrt(a.r * a.r + b.r * b.r);
        elementos.splice(elementos.indexOf(a), 1);
    }
}