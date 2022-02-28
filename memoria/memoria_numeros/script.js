var canvas;
var ctx;
var jogo_t0;
var carta_x0 = 0;
var carta_y0 = 0;
var carta_r = 30;
var carta_w = 4 * carta_r;
var carta_h = 4 * carta_r;
var margem = 30;
var deck = [];
var jogoIniciado = false;
var primeiraEscolha = true;
var primeiraCarta;
var segundaCarta;
var combinou;
var combinacoes = 0;
var tentativas = 0;

function init() {		
	canvas = document.getElementById('canvas');
	fazerDeck();			
	embaralhar();
} 

function configurarCarta(button, x, y, w, h, info) {				
	button.style.backgroundColor = 'purple';
	button.className = info;
	button.style.position = 'absolute';
	button.style.left = x + 'px';
	button.style.top = y + 'px';
	button.style.width = w + 'px';
	button.style.height = h + 'px';
	button.addEventListener('click', escolher, false);
	canvas.appendChild(button);
}

function desenharCostas(button) {
	button.style.backgroundColor = 'purple';
	button.innerHTML = '';
}

function desenharFrente(button) {
	button.innerHTML = button.className;
	button.style.backgroundColor = 'yellow';
}

function fazerDeck() {
	var carta1;
	var carta2;
	var carta3;
	var carta4;
	
	var cx = carta_x0;
	var cy = carta_y0;
	
	for (var i = 0; i < 7; i++) {
		carta1 = document.createElement('button');		
		carta2 = document.createElement('button');
		carta3 = document.createElement('button');
		carta4 = document.createElement('button');
		
		configurarCarta(carta1, cx, cy, carta_w, carta_h, i);
		configurarCarta(carta2, cx, cy + carta_h + margem, carta_w, carta_h, i);
		
		i++;
		
		configurarCarta(carta3, cx, cy + 2 *(carta_h + margem), carta_w, carta_h, i);		
		configurarCarta(carta4, cx, cy + 3 * (carta_h + margem), carta_w, carta_h, i);
		
		desenharCostas(carta1);
		desenharCostas(carta2);
		desenharCostas(carta3);		
		desenharCostas(carta4);
		
		deck.push(carta1);
		deck.push(carta2);
		deck.push(carta3);
		deck.push(carta4);
		
		cx += carta_w + margem;
	}	
	
	embaralhar();
}

function embaralhar() {
	var j;
	var k;
	var temp_info;
	var temp_cor;
	var dl = deck.length;
	
	for (var i = 0; i < 3 * dl; i ++) {
		j = Math.floor(Math.random() * dl);
		k = Math.floor(Math.random() * dl);
		
		temp_info = deck[j].className;
		
		deck[j].className = deck[k].className;
		
		deck[k].className = temp_info;
	}
}

function escolher(e) {
	if (!jogoIniciado) {
		jogo_t0 = new Date().getTime();
		jogoIniciado = true;
	}
	
	if (primeiraEscolha) { // Esta foi a primeira seleção?
		primeiraCarta = this;
		primeiraEscolha = false;					
		
		desenharFrente(primeiraCarta);
	} else { // Caso contrário.	
		tentativas++;
		document.getElementById('tent').innerHTML = tentativas;
		
		this.removeEventListener('click', escolher, false); // Desativa as possibilidades de escolhas a mais.
		
		segundaCarta = this;
		
		desenharFrente(segundaCarta);
		
		if (segundaCarta.className == primeiraCarta.className) { // Teve combinação?
			combinou = true;
			// incrementar o número de combinações e exibir pontuação aqui.
			combinacoes++;
			document.getElementById('comb').innerHTML = combinacoes;
			if (combinacoes >= deck.length / 2) { // O jogo acabou?
				var jogo_t = new Date().getTime();							
				var intervalo = Math.floor(0.5 + (jogo_t - jogo_t0) / 1000);
				
				document.getElementById('tempo').innerHTML = intervalo + 's';
			}
		} else { // Não teve combinação.
			combinou = false;
		}
		
		primeiraEscolha = true;
		setTimeout(virarCarta, 1000);
	}			
}

function virarCarta() {
	var c1 = primeiraCarta;
	var c2 = segundaCarta;
	if (!combinou) {
		desenharCostas(c1);
		desenharCostas(c2);
	} else {
		c1.style.visibility = 'hidden';
		c2.style.visibility = 'hidden';
	}
	
	c1.addEventListener('click', escolher, false); // Reativa a possibilidade de escolha.
	c2.addEventListener('click', escolher, false); // Reativa a possibilidade de escolha.
}