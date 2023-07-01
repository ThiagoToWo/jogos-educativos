var elemento;
var n = 7;
var primeiroElemento;
var primeiraSelecao = true;
var pontos = 0;

window.onload = init;

function init() {
    var e;
    var id_unico;
    var d;
    var s;
    var slots = new Array(n);
    var spEscolhas1 = document.querySelector("#escolhas1");
    var spEscolhas2 = document.querySelector("#escolhas2");

    document.querySelector("#btReiniciar").onclick = function () {
        window.location.reload();
    }

    for (var i = 0; i < n; i++) {
        do {
            e = Math.floor(Math.random() * fatos.length);
        } while (fatos[e][0] == true);

        fatos[e][0] = true

        id_unico = 'e' + e; //'e0'

        d = document.createElement('div');
        d.className = "elemento";
        d.id = id_unico;
        d.textContent = fatos[e][1];
        d.addEventListener('click', selecionar, false);
        spEscolhas1.appendChild(d);

        id_unico = 'c' + e; // 'c0'

        d = document.createElement('div');
        d.className = "elemento";
        d.id = id_unico;
        d.textContent = fatos[e][Math.floor(2 + Math.random() * (fatos[e].length - 2))];
        d.addEventListener('click', selecionar, false);

        do {
            s = Math.floor(Math.random() * n);
        } while (slots[s] != undefined);

        slots[s] = d;
    }

    for (var i in slots) {
        spEscolhas2.appendChild(slots[i]);
    }
}

function selecionar() {
    if (primeiraSelecao) {
        primeiroElemento = this;
        primeiroElemento.style.backgroundColor = 'pink';
        primeiraSelecao = false;
    } else {
        if (this.parentElement == primeiroElemento.parentElement) {
            primeiraSelecao = true;
            primeiroElemento.style.backgroundColor = 'white';
            this.style.backgroundColor = 'white';
            return;
        }

        primeiraSelecao = true;

        // 'c27' --> '27', 'e27' --> '27'
        if (this.id.substring(1) == primeiroElemento.id.substring(1)) {
            this.style.backgroundColor = 'green';
            primeiroElemento.style.backgroundColor = 'green';

            document.getElementById('acao').innerHTML = 'acertou';
            document.getElementById('pontos').innerHTML = ++pontos;

            this.removeEventListener('click', selecionar, false);
            primeiroElemento.removeEventListener('click', selecionar, false);
        } else {
            this.style.backgroundColor = 'red';
            primeiroElemento.style.backgroundColor = 'red';

            document.getElementById('acao').innerHTML = 'errou';

            this.removeEventListener('click', selecionar, false);
            primeiroElemento.removeEventListener('click', selecionar, false);
        }
    }
}