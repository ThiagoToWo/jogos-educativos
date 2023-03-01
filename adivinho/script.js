btIniciar = document.querySelector("#iniciar");
dvPalpite = document.querySelector("#palpite");
dvTentativas = document.querySelector("#tentativas");

let btMenor;
let btIgual;
let btMaior;

let med = 50;
let aux = 50;
let tentativas = 0;

function chutarMenor() {
    aux = Math.ceil(aux / 2);
    med = (med - aux < 0) ? 0 : med - aux;
    dvPalpite.innerText = med;
    dvTentativas.innerText = ++tentativas + " tentativas";

    if (med == 0 || tentativas == 7) {
        btMenor.disabled = true;
        btMaior.disabled = true;
    }
}

function comemorarVitoria() {
    alert("Acertei com " + tentativas + " tentativa(s)!");
    window.location.reload();
}

function chutarMaior() {
    aux = Math.ceil(aux / 2);
    med = (med + aux > 100) ? 100 : med + aux;
    dvPalpite.innerText = med;
    dvTentativas.innerText = ++tentativas + " tentativas";

    if (med == 100 || tentativas == 7) {
        btMenor.disabled = true;
        btMaior.disabled = true;
    }
}

btIniciar.addEventListener("click", () => {
    btIniciar.disabled = true;
    dvPalpite.innerText = med;
    dvTentativas.innerText = ++tentativas + " tentativa";

    btMenor = document.createElement("button");
    btIgual = document.createElement("button");
    btMaior = document.createElement("button");

    btMenor.innerHTML = "É menor";
    btIgual.innerHTML = "Acertou";
    btMaior.innerHTML = "É maior";

    btMenor.addEventListener("click", chutarMenor);
    btIgual.addEventListener("click", comemorarVitoria);
    btMaior.addEventListener("click", chutarMaior);

    document.body.appendChild(btMenor);
    document.body.appendChild(btIgual);
    document.body.appendChild(btMaior);
});