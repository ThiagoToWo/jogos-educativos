const DECK = new Image();
DECK.src = 'baralho.png';
const CARTA_W = 960 / 13; // = 73,84615
const CARTA_H = 575 / 5; // = 115

// classe Carta
function Carta(naipe, simbolo, valor, linha, coluna) {
	this.naipe = naipe;
	this.simbolo = simbolo;
	this.valor = valor;		
	this.linha = linha;
	this.coluna = coluna;
}

Carta.prototype.desenharFrente = function(x, y) {
	ctx.drawImage(DECK, 					// imagem
				  this.linha * CARTA_W,		// coordenada x do clip
				  this.coluna * CARTA_H,	// coordenada y do clip
				  CARTA_W,					// largura do clip
				  CARTA_H,					// comprimento do clip
				  x, 						// coordenada x do desenho
				  y,						// coordenada y do desenho
				  CARTA_W, 					// largura do desenho
				  CARTA_H);					// comprimento do desenho
}

Carta.prototype.desenharCostas = function(x, y) {
	ctx.drawImage(DECK, 					// imagem
				  2 * CARTA_W,				// coordenada x do clip
				  4 * CARTA_H,				// coordenada y do clip
				  CARTA_W,					// largura do clip
				  CARTA_H,					// comprimento do clip
				  x, 						// coordenada x do desenho
				  y,						// coordenada y do desenho
				  CARTA_W, 					// largura do desenho
				  CARTA_H);					// comprimento do desenho
}

// classe Baralho
function Baralho(valores) {
	this.cartas = [];
	this.topo = -1;
	this.valores = valores;
	
	var simbolos = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	var naipes = ['paus', 'ouros', 'copas', 'espadas'];
			
	for (var j = 0; j < naipes.length; j++) {
		for (var i = 0; i < simbolos.length; i++) {
			this.cartas.push(new Carta(naipes[j], simbolos[i], valores[i], i, j));
		}
	}
}

Baralho.prototype.embaralhar = function() {
	var j;
	var temp;
	
	for (var i = this.cartas.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = this.cartas[j];
		this.cartas[j] = this.cartas[i];
		this.cartas[i] = temp;
	}
}

Baralho.prototype.distribuir = function() {
	if (this.topo < this.cartas.length) {
		return this.cartas[++this.topo];
	} else {
		return null;
	}		
}

var canvas; // elemento canvas
var ctx; // contexto 2d do canvas
var botDeal; // botão de comprar mais carta
var botHold; // botão de manter a mão
var botNew; // botão de nova rodada
var pontosJogador; // guarda o span para exibir pontos do jogador
var pontosCasa; // guarda o span para exibir pontos da casa
var banco; // guarda o span do banco doo jogador
var aposta; // guarda o span do valor da aposta
var fichas; // guarda um array com os botões de ficha
var baralho; // guarda o objeto baralho
var maoJogador = []; // guarda as cartas dos jogadores
var maoCasa = []; // guarda as cartas da casa
var jogadorX = 100; // posisão x inicial das cartas do jogador
var jogadorY = 400; // posisão y inicial das cartas do jogador
var casaX = 400 - CARTA_W / 2; // posisão x inicial das cartas da casa
var casaY = 100; // posisão y inicial das cartas da casa
var dX = 30; // guarda o deslocamanto horizontal de desenho das cartas
var pontos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]; // o ponto de cada carta
var totalCasa = 0; // total de pontos da casa
var totalJogador = 0; // total de pontos do jogador
var msgX = 30; // a posisão x da mensagem
var msgY = 50; // a posisão y da mensagem
var divValores; // div com os valores do banco (dinheiro do jogador e aposta)
var divPontos; // div com os pontos das cartas
var divFichas; // div com as figuras das fichas

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	botDeal = document.getElementById('deal');
	botHold = document.getElementById('hold');
	botNew = document.getElementById('new');
	pontosJogador = document.getElementById('ptsj');
	pontosCasa = document.getElementById('ptsc');
	banco = document.getElementById('banco');
	aposta = document.getElementById('aposta');
	divValores = document.getElementById('valores');
	divPontos = document.getElementById('pontos');
	divFichas = document.getElementById('fichas');
	
	fichas = document.getElementsByClassName('ficha');
	for (var i = 0; i < fichas.length; i++) {
		fichas[i].addEventListener('click', apostar, false);
	}
	
	botDeal.addEventListener('click', comprarCartas, false);
	botHold.addEventListener('click', manterMao, false);
	botNew.addEventListener('click', novaRodada, false);
	botDeal.disabled = true;
	botHold.disabled = true;
	botNew.disabled = true;
	
	ctx.font = 'italic 20pt Georgia';
	
	baralho = new Baralho(pontos);
	baralho.embaralhar();
	_darMaoInicial();
}

function novaRodada() {
	for (var i = 0; i < fichas.length; i++) {
		fichas[i].disabled= false;
	}
	botNew.disabled = true;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	jogadorX = 100;
	casaX = 400 - CARTA_W / 2;
	maoCasa = [];
	maoJogador = [];
	totalCasa = 0;
	totalJogador = 0;
	pontosCasa.textContent = 'Pontos da casa = ?';
	
	baralho = new Baralho(pontos);
	baralho.embaralhar();
	_darMaoInicial();
}	

function apostar() {
	var v = Number(this.value);
	var b = Number(banco.textContent);
	var a = Number(aposta.textContent);
	if (b >= v) {
		a += v;
		aposta.textContent = a;
		b -= v;
		banco.textContent = b;
	}
	botDeal.disabled = false;
	botHold.disabled = false;
}

function comprarCartas() {
	_darPara(maoJogador);
	for (var i = 0; i < fichas.length; i++) {
		fichas[i].disabled= true;
	}
}

function manterMao() {
	
	botDeal.disabled = true;
	for (var i = 0; i < fichas.length; i++) {
		fichas[i].disabled= true;
	}
	botHold.disabled = true;
	botNew.disabled = false;
	
	while (totalCasa < 17) {
		_darPara(maoCasa);
	}
	
	_mostrarCasa();
	
	var b = Number(banco.textContent);
	var a = Number(aposta.textContent);
	
	if (totalJogador > 21) { // jogador perdeu?
		if (totalCasa > 21) { // casa perdeu?
			ctx.fillText('Você e a casa perderam.', msgX, msgY);
			banco.textContent = b + a;
			aposta.textContent = 0;				
		} else { // casa ganhou?
			ctx.fillText('Você estourou os 21 pontos e perdeu.', msgX, msgY);
			aposta.textContent = 0;
			_processarDerrota();
			
		}			
	} else { // jogador pode ganhar?
		if (totalCasa > 21) { // casa perdeu?
			ctx.fillText('A casa estourou os 21 pontos e perdeu.', msgX, msgY);
			banco.textContent = b + 2 * a;
			aposta.textContent = 0;	
		} else { // os dois menores que 21?
			if (totalJogador > totalCasa) { 
				ctx.fillText('Você ganhou!', msgX, msgY);
				banco.textContent = b + 2 * a;
				aposta.textContent = 0;	
			} else if (totalJogador == totalCasa) {
				ctx.fillText('Houve um empate.', msgX, msgY);
				banco.textContent = b + a;
				aposta.textContent = 0;
			} else {
				ctx.fillText('Você perdeu!', msgX, msgY);
				aposta.textContent = 0;
				_processarDerrota()
			}
		}
	}
	
	function _processarDerrota() {
		if (b == 0) {
			alert ('Seu dinheiro acabou. Reinicie para um novo jogo.');
			botNew.disabled = true;
		}
	}
	
	function _mostrarCasa() {
		casaX = 400 - CARTA_W / 2;
		
		for (var i = 0; i < maoCasa.length; i++) {
			maoCasa[i].desenharFrente(casaX, casaY);
			casaX += dX;
			pontosCasa.textContent = 'Pontos da casa = ' + totalCasa;
		}
	}
}	

/////////funções auxiliares//////////

/*
*função auxiliar para dar a mão inicial do jogo.
*/
function _darMaoInicial() {
	_darPara(maoJogador);
	_darPara(maoCasa, false);
	_darPara(maoJogador);
	_darPara(maoCasa);
}

/*
*função auxiliar para distribuir carta para uma determinada mão
*virada para cima ou para baixo
*/
function _darPara(mao, viradaParaCima) {
	mao.push(baralho.distribuir());	
	
	if (mao == maoJogador) {
		baralho.cartas[baralho.topo].desenharFrente(jogadorX, jogadorY);
		jogadorX += dX;
		totalJogador = _somarPontos(mao);
		pontosJogador.textContent = 'Pontos do jogador = ' + totalJogador;
	} else {
		if (viradaParaCima || viradaParaCima === undefined) {
			baralho.cartas[baralho.topo].desenharFrente(casaX, casaY);
		} else {
			baralho.cartas[baralho.topo].desenharCostas(casaX, casaY);
		}
		casaX += dX;
		totalCasa = _somarPontos(mao);			
	}		
}

/*
*função auxiliar para somar os pontos de uma mão.
*/
function _somarPontos(mao) {
	var soma = 0;
	var ases = 0;
	
	for (var i = 0; i < mao.length; i++) {
		soma += mao[i].valor;
		if (mao[i].valor == 1) {
			ases++
		}
	}
	
	if ((ases > 0) && (soma + 10 <= 21)) {
		soma += 10;
	}
	
	return soma;
}	

window.onload = init;	