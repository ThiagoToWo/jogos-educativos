/*=====================================Classe Partícula====================================*/
class Particula {
    constructor(x, y, r, vx, vy, cor, ctx) {
        this.x = x; // coordenada x da posição
        this.y = y; // coordenada y da posição
        this.r = r; // raio
        this.vx = vx; // componente x da velocidade
        this.vy = vy; // componente y da velocidade
        this.cor = cor; // cor
        this.ctx = ctx; // contexto 2d do canvas onde será desenhado
        this.ativo = true; // se pode atualizar, desenhar e colidir
        this.ativoAtualizar = true; // se pode atualizar
        this.ativoDesenhar = true; // se pode desenhar
        this.ativoColidir = true; // se pode colidir
        this.rastro = false; // se deixa rastro ao desenhar (if (!c.rastro) {ctx.clearRect()}))
    }

    atualizar() {
        if (!this.ativoAtualizar) return;
        if (!this.ativo) return;

        const larguraCanvas = this.ctx.canvas.width;
        const alturaCanvas = this.ctx.canvas.height;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > larguraCanvas - this.r) {
            this.vx *= -1;
            this.x = larguraCanvas - this.r;
        }

        if (this.x < this.r) {
            this.vx *= -1;
            this.x = this.r;
        }

        if (this.y > alturaCanvas - this.r) {
            this.vy *= -1;
            this.y = alturaCanvas - this.r;
        }

        if (this.y < this.r) {
            this.vy *= -1;
            this.y = this.r;
        }
    }

    desenhar() {
        if (!this.ativoDesenhar) return;
        if (!this.ativo) return;

        ctx.fillStyle = this.cor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    colidiuCom(outro) {
        if (!this.ativoColidir) return;
        if (!this.ativo) return;

        const dx = this.x - outro.x;
        const dy = this.y - outro.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        return d <= this.r + outro.r;
    }
}
