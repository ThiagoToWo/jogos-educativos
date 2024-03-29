var canvas; //elemento canvas
var ctx; // contexto 2d do canvas
var pontoJogador = null // guarda o elemento ponto do jogador
var pontoCpu = null // guarda o elemento ponto do cpu
var pedra = null; // guarda o elemento pedra
var papel = null; // guarda o elemento papel
var tesoura = null; // guarda o elemento tesoura
var x0 = 0; // guarda posição horizontal inicial da primeira imagem
var y0 = 0; // guarda posição vertical inicial da primeira imagem
var gap = 0; // guarda a distância entre as imagens
var w = 0; // guarda a largura das imagens
var h = 0; // guarda a altura das imagens
var t = 0; // tamanho inicial da imagem que o computador escolheu
var timer = null; // guarda o temporizador.
var cpuImg = new Image() // a imagem da escolha do cpu
var resultado = ''; // guarda o texto do resultado do jogo
var audios = null; // guarda os elementos de áudio acessados no html
var som = null; // guarda o som a ser feito após o resultado
var ponto = 0; // guarda o acréscimo de ponto ao jogador
var escolhas = [ // array com o url das imagens a serem escolhidas
	//'img/pedra_luva.png',
	//'img/papel_luva.png',
	//'img/tesoura_luva.png',
	'img/pedra.png',
	'img/papel.png',
	'img/tesoura.png'
];
var resultados = [ // array com os textos de resultados
	['Empate: ambos escolheram pedra.', 
	 'Vitória: o computador escolheu pedra. Papel embrulha pedra.', 
	 'Derrota: o computador escolheu pedra. Pedra quebra tesoura.'],
	['Derrota: o computador escolheu papel. Papel embrulha pedra.', 
	 'Empate: ambos escolheram papel.', 
	 'Vitória: o computador escolheu papel. Tesoura corta papel.'],
	['Vitória: o computador escolheu tesoura. Pedra quebra tesoura.', 
	 'Derrota: o computador escolheu tesoura. Tesoura corta papel.', 
	 'Empate: ambos escolheram tesoura.'],
];
var sons = [ // arrays com os sons de resposta ao resultado
	[-1, 1, 0],
	[1, -1, 2],
	[0, 2, -1]
];
var pontos = [ // arrays com os pontos ganhos pelo jogador
	[0, 1, -1],
	[-1, 0, 1],
	[1, -1, 0]
];
var tudo = []; // guarda todos os elementos do jogo

function Elemento(x, y, w, h, imagem) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.imagem = imagem;
}

Elemento.prototype.desenhar = function() {
	ctx.drawImage(this.imagem, this.x, this.y, this.w, this.h);
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = 'black';
	ctx.font = 'bold 16pt Georgia';
	pontoJogador = document.getElementById('jogador');
	pontoCpu = document.getElementById('cpu');
	audios = document.getElementsByTagName('audio');
	gap = 10;
	w = 60;
	h = 60;
	x0 = (canvas.width - 3 * w - 2 * gap) / 2;
	y0 = canvas.height - h - 2;	
	
	pedraImg = new Image();
	papelImg = new Image();
	tesouraImg = new Image();
	
	pedraImg.src = escolhas[0];
	papelImg.src = escolhas[1];
	tesouraImg.src = escolhas[2];
	
	pedra = new Elemento(x0, y0, w, h, pedraImg);
	papel = new Elemento(x0 + w + gap, y0, w, h, papelImg);
	tesoura = new Elemento(x0 + 2* (w + gap), y0, w, h, tesouraImg);
	
	pedraImg.onload = function() {pedra.desenhar();}
	papelImg.onload = function() {papel.desenhar();}
	tesouraImg.onload = function() {tesoura.desenhar();}	
	
	tudo.push(pedra);
	tudo.push(papel);
	tudo.push(tesoura);
	
	canvas.addEventListener('click', escolher, false);
	
	desenharTudo();
}

function desenharTudo() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i in tudo) {
		tudo[i].desenhar();
	}
}

function escolher(e) {
	var indexCpu = Math.floor(Math.random() * 3);
	cpuImg.src = escolhas[indexCpu];
	var mx;
	var my;
	var elt;
	
	if (e.layerX || e.layerX ==  0) {
		mx = e.layerX - canvas.offsetLeft;
		my = e.layerY - canvas.offsetTop;
	} else if (e.offsetX || e.offsetX ==  0) {
		mx = e.offsetX - canvas.offsetLeft;
		my = e.offsetY - canvas.offsetTop;
	}
	
	for (var i in tudo) {
		elt = tudo[i];
		if (mx >= elt.x && 
			mx <= elt.x + elt.w &&
			my >= elt.y && 
			my <= elt.y + elt.h) {
			t = 5;
			resultado = resultados[indexCpu][i];
			ponto = pontos[indexCpu][i];
			som = sons[indexCpu][i];
			timer = setInterval(aparecerFigura, 100);			
			break;
		}
	}
}

function aparecerFigura() {
	canvas.removeEventListener('click', escolher, false);
	desenharTudo();
	ctx.drawImage(cpuImg, (canvas.width - t) / 2, 250, t, t);
	t += 5;
	
	if (t == 60) {
		clearInterval(timer);			
		ctx.fillText(resultado, (canvas.width - 450) / 2, 200, 450);
		if(som > -1) audios[som].play();
		incrementarPontos();
		canvas.addEventListener('click', escolher, false);
	}	
}

function incrementarPontos() {
	var atualJogador = Number(pontoJogador.innerText);
	var atualCpu = Number(pontoCpu.innerText);
	if (ponto == 1) { // jogador ganhou
		pontoJogador.innerText = atualJogador + ponto;
	} else if (ponto == -1){ // cpu ganhou
		pontoCpu.innerText = atualCpu + 1;
	}
}

window.onload = init;