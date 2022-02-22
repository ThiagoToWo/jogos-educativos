var ctx; // contexto 2d
const DX = 25; // coordenada x do primeiro dados
const DY = 100; // coordenada y do primeiro dados
const DW = 100; // largura do dados
const DH = 100; // altura do dado
const RP = 6; // raio do ponto
var dx, dy; // cordenadas variáveis dos dados
var primeiroLance = true; // para identificar se foi para o segundo estágio				
var ponto; // para armazenar o ponto
var bank; // span com o dinheirodo jogador
var stage; // span com o estágio
var point; // span para a exibição de pontos
var outcome; // span com a saída do resultado

function jogar() {
	bank = document.getElementById('bank');
	stage = document.getElementById('stage');
	point = document.getElementById('point');
	outcome = document.getElementById('outcome');
	
	soma = 0;	
	dx = DX;
	dy = DY;
	var face = 1 + Math.floor(Math.random() * 6);
	//var face = 5;
	soma += face;
	desenhar(face);
	face = 1 + Math.floor(Math.random() * 6);
	//var face = 3;
	soma += face;
	dx = DX + 150;
	desenhar(face);
	
	if (primeiroLance) {
		var banco = Number(bank.innerHTML);
		if (banco < 10) {
			alert('Deposite mais dinheiro prara jogar.');
			return;
		}
		banco -= 10;
		bank.innerHTML = banco;
		
		switch (soma) {
			case 7:
			case 11:
				outcome.innerHTML = 'Você venceu!';
				var banco = Number(bank.innerHTML);
				banco += 20;
				bank.innerHTML = banco;
				break;
			case 2:
			case 3:
			case 12:
				outcome.innerHTML = 'Você perdeu!';						
				break;
			default:
				ponto = soma;
				stage.innerHTML = 'Precisa lançar de novo.';
				point.innerHTML = ponto;
				outcome.innerHTML = ''
				primeiroLance = false;
		}
	} else {
		switch(soma) {
			case 7:
				outcome.innerHTML = 'Você perdeu!'
				stage.innerHTML = 'Volte a primeira jogada.'
				point.innerHTML = '';
				primeiroLance = true;
				break
			case ponto:
				outcome.innerHTML = 'Você venceu!'
				stage.innerHTML = 'Volte a primeira jogada.'
				point.innerHTML = '';
				var banco = Number(bank.innerHTML);
				banco += 20;
				bank.innerHTML = banco;
				primeiroLance = true;
				break;
		}
	}
}

function desenhar(n) {	
	ctx = document.getElementById('canvas').getContext('2d');
	ctx.lineWidth = 5;
	ctx.clearRect(dx, dy, DW, DH);
	ctx.strokeRect(dx, dy, DW, DH);
	ctx.fillStyle = 'green';
	
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(dx, dy, DW, DH);
	ctx.restore();
	
	switch(n) {
		case 1:
			desenhar1();
			break;
		case 2:
			desenhar2();
			break;
		case 3:
			desenhar2();
			desenhar1();
			break;
		case 4:
			desenhar4();
			break;
		case 5:
			desenhar4();
			desenhar1();
			break;
		case 6:
			desenhar4();
			desenhar2meio();
			break;
	}
}

function desenhar1() {
	var x;
	var y;
	ctx.beginPath();
	x = dx + .5 * DW;
	y = dy + .5 * DH;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);			
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function desenhar2() {
	var x;
	var y;
	
	ctx.beginPath();
	x = dx + 3 * RP;
	y = dy + 3 * RP;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	x = dx + DW - 3 * RP;
	y = dy + DH - 3 * RP;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);	
	ctx.closePath();
	ctx.fill();
}

function desenhar4() {
	desenhar2();
	
	var x;
	var y;
	
	ctx.beginPath();
	x = dx + 3 * RP;
	y = dy + DH - 3 * RP;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	x = dx + DW - 3 * RP;
	y = dy + 3 * RP;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);	
	ctx.closePath();
	ctx.fill();
}

function desenhar2meio() {
	var x;
	var y;
	
	ctx.beginPath();
	x = dx + 3 * RP;
	y = dy + .5 * DH;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	x = dx + DW - 3 * RP;
	y = dy + .5 * DH;
	ctx.arc(x, y, RP, 0, 2 * Math.PI);	
	ctx.closePath();
	ctx.fill();
}