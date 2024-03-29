var canvas; // canvas
var ctx; // contexto 2d
var serial; // código serial do labirinto
var serial_txt; // espaço para o código serial do labirinto
var exibido = true; // o labirinto está totalmente exibido
var mouse_move = false; // estado de movimento do mouse
var paredeAtual; // parede que está sendo desenhada
var personagem; // objeto que atravessa o labirinto
var paredes = []; // para a função de salvamento
var pressionadas = []; // guarda o estado das teclas (pressionadas/soltas)
var tudo = []; // para o processamento geral
// Classe Parede
function Parede(x0, y0, x, y) {
	this.x0 = x0;
	this.y0 = y0;
	this.x = x;
	this.y = y;
	this.cor = 'white';	
	this.w = 2;
}

Parede.prototype.atualizar = function() {};

Parede.prototype.desenhar = function() {
	ctx.save();
	ctx.strokeStyle = this.cor;
	ctx.lineWidth = this.w;
	
	ctx.beginPath();
	ctx.moveTo(this.x0, this.y0)
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
	
	ctx.restore();
}
// Classe 
function Poligono(x, y, r, n, cor) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.n = n;
	this.v = 3;
	this.passoX = 0;
	this.passoY = 0;
	this.ang_central = 2 * Math.PI / this.n;
	this.cor = cor;	
}

Poligono.prototype.atualizar = function() {
	if (pressionadas[0]) {
		if (this.x > this.r) {
			this.x -= this.v;
			this.passoX = this.v;
			this.passoY = 0;
		} else this.x = this.r;
	} else if (pressionadas[1]) {
		if (this.y > this.r) {
			this.y -= this.v;
			this.passoX = 0;
			this.passoY = this.v;
		} else this.y = this.r;
	} else if (pressionadas[2]) {				
		if (this.x < canvas.width - this.r)	{
			this.x += this.v;
			this.passoX = -this.v;
			this.passoY = 0;
		} else this.x = canvas.width - this.r;
	} else if (pressionadas[3]) {
		if (this.y < canvas.height - this.r) {
			this.y += this.v;
			this.passoX = 0;
			this.passoY = -this.v;
		} else this.y = canvas.height - this.r;
	}
}

Poligono.prototype.desenhar = function() {
	ctx.save();		
	ctx.beginPath();
	ctx.fillStyle = this.cor;				

	ctx.moveTo(
		this.x + this.r * Math.cos(this.ang_central),
		this.y + this.r * Math.sin(this.ang_central)
	);
	
	for (var i = 1; i < this.n; i++) {
		ctx.lineTo(
			this.x + (this.r) * Math.cos((i + 1) * this.ang_central),
			this.y + (this.r) * Math.sin((i + 1) * this.ang_central)
		);
	}
	
	ctx.fill();		
	ctx.restore();			
}

Poligono.prototype.intercepta = function(parede) {
	var dx;
	var dy;
	var d2;
	
	dx = parede.x - parede.x0;
	dy = parede.y - parede.y0;
	var t = - ((parede.x0 - this.x) * dx +(parede.y0 - this.y) * dy) /
			((dx * dx) + (dy * dy));
	
	if (t < 0.0) {
		t = 0.0;
	} else if (t > 1.0){
		t = 1.0;
	}
	
	dx = (parede.x0 + t * (parede.x - parede.x0)) - this.x;
	dy = (parede.y0 + t * (parede.y - parede.y0)) - this.y;
	d2 = (dx * dx) + (dy * dy);
	
	if (d2 < this.r * this.r) {
		return true;
	} else {
		return false;
	}
}

Poligono.prototype.retornarUmPasso = function() {
	this.x += this.passoX;
	this.y += this.passoY;
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	canvas.addEventListener('mousedown', iniciarParede, false);
	canvas.addEventListener('mousemove', marcarParede, false);
	canvas.addEventListener('mouseup', finalizarParede, false);	
	serial_txt = document.getElementById('serial');
	window.addEventListener('keydown', function(e) {
		var tecla = e.keyCode;
		switch (tecla) {
			case 37: pressionadas[0] = true; break; // esquerda
			case 38: pressionadas[1] = true; break; // cima
			case 39: pressionadas[2] = true; break; // direita
			case 40: pressionadas[3] = true; break; // baixo
		}		
	}, false);
	window.addEventListener('keyup', function(e) {
		var tecla = e.keyCode;
		switch (tecla) {
			case 37: pressionadas[0] = false; break; // esquerda
			case 38: pressionadas[1] = false; break; // cima
			case 39: pressionadas[2] = false; break; // direita
			case 40: pressionadas[3] = false; break; // baixo
		}		
	}, false);
	
	personagem = new Poligono(100, 100, 10, 5, 'red');
	
	tudo.push(personagem);
	
	processarTudo();
}

function processarTudo() {		
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (var i in tudo) {			
		tudo[i].atualizar();			
	}
	
	for (var i in tudo) {			
		tudo[i].desenhar();
	}		
	
	for (var i in paredes) {
		if (personagem.intercepta(paredes[i])) {
			personagem.retornarUmPasso();				
			break;
		}
	}
	
	if (!exibido) clipCampoDeVisao(personagem);
	
	requestAnimationFrame(processarTudo);
}

function mostrarParedes() {

	if (document.fcampo.campo[0].checked) {
		exibido = false;
	} else {
		exibido = true;
		canvas.style.clip = 'auto';
	}
	
	return false;
}
function clipCampoDeVisao(personagem) {
	var campoX = personagem.x - 5 * personagem.r;
	var campoY = personagem.y - 5 * personagem.r;
	var campoL = 10 * personagem.r;
	
	canvas.style.position = 'absolute';
	canvas.style.clip = 'rect(' + campoY + 'px, ' +
							  (campoX + campoL) +'px,' +
							  (campoY + campoL) + 'px,' +
							  campoX + 'px)';
}

function iniciarParede(e) {
	var mx;
	var my;
	
	if (e.layerX || e.layerX == 0) {
		mx = e.layerX - canvas.offsetLeft;
		my = e.layerY - canvas.offsetTop;
	} else if (e.offsetX || e.offsetX == 0) {
		mx = e.offsetX - canvas.offsetLeft;
		my = e.offsetY - canvas.offsetTop;
	}
	
	mouse_move = true;
	paredeAtual = new Parede(mx, my, mx + 1, my + 1);
	tudo.push(paredeAtual);
}

function marcarParede(e) {
	if (mouse_move) {
		var mx;
		var my;
		
		if (e.layerX || e.layerX == 0) {
			mx = e.layerX - canvas.offsetLeft;
			my = e.layerY - canvas.offsetTop;
		} else if (e.offsetX || e.offsetX == 0) {
			mx = e.offsetX - canvas.offsetLeft;
			my = e.offsetY - canvas.offsetTop;
		}
		
		paredeAtual.x = mx;
		paredeAtual.y = my;
	} 
}

function finalizarParede(e) {
	mouse_move = false;
	paredes.push(paredeAtual);
}

function desfazerParede() {
	paredes.pop();
	tudo.pop();
}

function salvarParedes() {
	var campos = [];
	var uma_parede;
	var todas = [];
	var serial;
	var nome = document.fs.nome_labirinto.value;
	
	for (var i in paredes) {
		campos.push(paredes[i].x0);
		campos.push(paredes[i].y0);
		campos.push(paredes[i].x);
		campos.push(paredes[i].y);
		uma_parede = campos.join(',');
		todas.push(uma_parede);
		campos = [];
	}
	
	serial = todas.join(';');
	serial_txt.value = 'Compartilhe o código abaixo para que outra ' + 
						   'pessoa possa carregar teu labirinto.\n\n' + serial;
	try {
		localStorage.setItem(nome, serial);
	} catch (erro) {
		alert('Dado não salvo: ' + erro);
	}
	
	return false;
}

function carregarParedes() {
	var nome = document.fc.nome_labirinto.value;
	var serial;
	var paredes_carregar;
	var campos;
	var x0;
	var y0;
	var x;
	var y;
	var parede;
	
	try {
		serial = localStorage.getItem(nome);			
		serial_txt.value = 'Compartilhe o código abaixo para que outra ' + 
						   'pessoa possa carregar teu labirinto.\n\n' + serial;
		paredes_carregar = serial.split(';');
		
		for (var i in paredes_carregar) {
			campos = paredes_carregar[i].split(',');
			x0 = Number(campos[0]);
			y0 = Number(campos[1]);
			x = Number(campos[2]);
			y = Number(campos[3]);
			parede = new Parede(x0, y0, x, y);
			paredes.push(parede);
			tudo.push(parede);
		}
		
		exibido = true;
		document.fcampo.campo[1].disabled = false;
		document.fcampo.campo[1].checked = true;
		canvas.style.clip = 'auto';
	} catch (erro) {
		alert('Dado não carregado');
	}
	
	return false;
}

function carregarPeloSerial() {
	var serial = document.fcs.nome_labirinto.value;
	var paredes_carregar;
	var campos;
	var x0;
	var y0;
	var x;
	var y;
	var parede;
	
	try {			
		serial_txt.value = 'Compartilhe o código abaixo para que outra ' + 
						   'pessoa possa carregar teu labirinto.\n\n' + serial;
		paredes_carregar = serial.split(';');
		
		for (var i in paredes_carregar) {
			campos = paredes_carregar[i].split(',');
			x0 = Number(campos[0]);
			y0 = Number(campos[1]);
			x = Number(campos[2]);
			y = Number(campos[3]);
			parede = new Parede(x0, y0, x, y);
			paredes.push(parede);
			tudo.push(parede);
		}
	} catch (erro) {
		alert('Entrada de serial inválida.');
	}
	
	exibido = false;
	document.fcampo.campo[0].checked = true;
	document.fcampo.campo[1].disabled = true;
	
	return false;
}