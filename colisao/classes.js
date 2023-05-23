// Classe Corpo.
class Corpo {
    constructor(x, y, cor) {
        this.m;
        this.r;
        this.x = x;
        this.y = y;
        this.v;
        this.cor = cor;
    }

    atualizar() {
        this.x += this.v;
    }

    desenhar() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    colidiuCom(outro) {
        var x = this.x - this.r;
        var w = 2 * this.r;
        var ox = outro.x - outro.r;
        var ow = 2 * outro.r;
        return (x + w >= ox) &&
            (x <= ox + ow);
    }
}

// Classe Processador.
class Processador {
    constructor() {
        this.elementos = [];
        this.colidiu = false;
        this.animation;
    }

    adicionar(elemento) {
        this.elementos.push(elemento);
    }

    ligar() {
        this._processar();
    }

    desligar() {
        cancelAnimationFrame(this.animation);
    }

    atualizarElementos() {
        for (var i in this.elementos) {
            this.elementos[i].atualizar();
        }
    }

    desenharElementos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i in this.elementos) {
            this.elementos[i].desenhar();
        }

        if (this.colidiu == true) this._mostrarResultados();
    }

    verificarColisao() {
        var a = this.elementos[0];
        var b = this.elementos[1];

        if (a.colidiuCom(b)) {
            var q_total = a.m * a.v + b.m * b.v;
            var v_afast = -e * (a.v - b.v);
            var m_total = a.m + b.m;

            v1_final = (q_total + b.m * v_afast) / m_total;
            v2_final = v1_final - v_afast;

            a.v = v1_final;
            b.v = v2_final;
            this.colidiu = true;
        }
    }

    _processar() {
        this.atualizarElementos();
        this.desenharElementos()
        this.verificarColisao();
        var p = this;
        this.animation = requestAnimationFrame(function () { p._processar(); });
    }

    _mostrarResultados() {
        var x = canvas.width / 2 - 100;
        var y = 15;
        var esp = 15;

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Velocidade final (preta): ' + (v1_final * FATOR_VEL).toFixed(2) + 'm/s', x, y);
        ctx.fillStyle = 'white';
        ctx.fillText('Velocidade final (branca): ' + (v2_final * FATOR_VEL).toFixed(2) + 'm/s', x, y + esp);
    }
}