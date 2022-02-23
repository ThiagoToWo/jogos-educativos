var canvas = null; // elemento canvas
var ctx = null; // contexto 2d do canvas
var letra = null; // span da letra
var lacuna = null; // span do espaço para a letra escondida
var entrada = null; // o input de texto da nova palavra
var botaoNovo = null; // o botão para incluir nova palavra
var alfabeto = 'abcdefghijklmnopqrstuvwxyz'; // as letras dos botões
var index; // índice da palavra sorteada
var palavra; // guarda a palavra escolhida
var eixo = 70; // eixo central do corpo 
var tracos = [ // as funções de desenho
	desenharPatibulo,
	desenharCabeca,
	desenharCorpo,
	desenharBracoDireito,
	desenharBracoEsquerdo,
	desenharPernaDireita,
	desenharPernaEsquerda,
	desenharCorda
]
var passo = 0; // os passo atual do desenho
var letrasIdentificadas = 0; // conta o número de letras identificadas
var separadores = 0; // conta os separadores de palavras ("-" e " ").
var divLacunas; // div com as lacunas
var divJogo; // div com as letras

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	entrada = document.getElementById('palavra');
	botaoNovo = document.getElementById('nova');
	botaoNovo.addEventListener('click', substituirPalavra, false);
	divLacunas = document.getElementById('lacunas');
	divJogo = document.getElementById('letras');
	setupGame();
	ctx.font = 'bold 20pt Ariel';
}

function setupGame() {		
	criarAlfabeto();
	
	index = Math.floor(Math.random() * palavras.length);
	palavra = palavras[index];
	
	criarLacunas()
	
	tracos[passo++]();
}

function criarAlfabeto() {
	for (var i = 0; i < alfabeto.length; i++) {
		letra = document.createElement('span');
		letra.className = 'letra';
		letra.id = 'le' + i;
		letra.innerText = alfabeto[i];
		
		divJogo.appendChild(letra);
		letra.addEventListener('click', selecionarLetra, false);
	}
}

function criarLacunas() {
	for (var i = 0; i < palavra.length; i++) {
		lacuna = document.createElement('span');
		lacuna.className = 'lacuna';
		lacuna.id = 'la' + i;
		
		if (palavra[i] === ' ') {
			lacuna.innerText = ' ';
			separadores++;
		} else if (palavra[i] === '-') {
			lacuna.innerText = '-';
			separadores++;
		} else {
			lacuna.innerText = '?';
		}
		
		divLacunas.appendChild(lacuna);
	}
}

function substituirPalavra() {
	var elemento;
	for (var i = 0; i < palavra.length; i++) {
		elemento = document.getElementById('la' + i);
		elemento.parentNode.removeChild(elemento);
	}
	palavra = entrada.value;		
	criarLacunas();		
	entrada.value = '';
	passo = 0;
	tracos[passo++]();
}

function selecionarLetra() {
	var naoIdentificado = true;
	var letraClicada = this.textContent;
	var variacoes;
	
	if (letraClicada === 'a') {
		variacoes = ['a', 'á', 'â', 'ã', 'A', 'Á', 'Â', 'Ã'];
	} else if (letraClicada === 'c') {
		variacoes = ['c', 'ç', 'C', 'Ç'];
	} else if (letraClicada === 'e') {
		variacoes = ['e', 'é', 'ê', 'E', 'É', 'Ê'];
	} else if (letraClicada === 'i') {
		variacoes = ['i', 'í', 'I', 'Í'];
	} else if (letraClicada === 'o') {
		variacoes = ['o', 'ó', 'ô', 'õ', 'O', 'Ó', 'Ô', 'Õ'];
	} else if (letraClicada === 'u') {
		variacoes = ['u', 'ú', 'U', 'Ú'];
	} else {
		variacoes = [letraClicada, letraClicada.toUpperCase()];
	}
	
	for (var i = 0; i < palavra.length; i++) {		
		for (var j = 0; j < variacoes.length; j++) {			
			if (variacoes[j] == palavra[i]) { // se achou a letra
				naoIdentificado = false;
				document.getElementById('la' + i).textContent = variacoes[j];
				letrasIdentificadas++;
				if (letrasIdentificadas == palavra.length - separadores) { // se ganhou
					exibirMensagem('Você venceu!');
					removerOuvinte();
				}
			}
		}			
	}
	
	if (naoIdentificado) { // se não achou a letra
		tracos[passo++]();
		if (passo >= tracos.length) { // se perdeu
			for (var i = 0; i < palavra.length; i++) {
				document.getElementById('la' + i).textContent = palavra[i];
				exibirMensagem('Você perdeu.');
				removerOuvinte();
			}
		}
	}
	
	this.removeEventListener('click', selecionarLetra, false);
	this.style.backgroundColor = '#0000b3';
}

function exibirMensagem(s) {
	ctx.fillText(s, 120, 100);
	var botaoNovoJogo = document.createElement('button');
	botaoNovoJogo.innerText = 'Novo Jogo';
	botaoNovoJogo.onclick = function() {
		window.location.reload(true);
	}
	
	botaoNovoJogo.style.position = 'absolute';
	botaoNovoJogo.style.top = '270px';
	botaoNovoJogo.style.left = '130px';
	
	document.body.appendChild(botaoNovoJogo);
}

function removerOuvinte() {
	var letra;
	for (var i = 0; i < alfabeto.length; i++) {
		letra = document.getElementById('le' + i);
		letra.removeEventListener('click', selecionarLetra, false);
	}
}

function desenharPatibulo() {
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'brown';
	ctx.beginPath();
	ctx.moveTo(2, 180);
	ctx.lineTo(40, 180);
	ctx.moveTo(20, 180);
	ctx.lineTo(20, 40);
	ctx.moveTo(2, 40);
	ctx.lineTo(80, 40);
	ctx.stroke();
	ctx.closePath();
}

function desenharCabeca() {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'black';
	ctx.save();
	ctx.scale(.6, 1);
	ctx.beginPath();
	ctx.arc(eixo / .6, 80, 10, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

function desenharCorpo() {
	ctx.beginPath();
	ctx.moveTo(eixo, 90);
	ctx.lineTo(eixo, 125);
	ctx.stroke();
	ctx.closePath();
}

function desenharBracoDireito() {
	ctx.beginPath();
	ctx.moveTo(eixo, 100);
	ctx.lineTo(eixo + 20, 110);
	ctx.stroke();
	ctx.closePath();
}


function desenharBracoEsquerdo() {
	ctx.beginPath();
	ctx.moveTo(eixo, 100);
	ctx.lineTo(eixo - 20, 110);
	ctx.stroke();
	ctx.closePath();
}

function desenharPernaDireita() {
	ctx.beginPath();
	ctx.moveTo(eixo, 125);
	ctx.lineTo(eixo + 10, 155);
	ctx.stroke();
	ctx.closePath();
}

function desenharPernaEsquerda() {
	ctx.beginPath();
	ctx.moveTo(eixo, 125);
	ctx.lineTo(eixo - 10, 155);
	ctx.stroke();
	ctx.closePath();
}

function desenharCorda() {
	ctx.strokeStyle = 'tan';
	ctx.beginPath();
	ctx.moveTo(eixo - 10, 40);
	ctx.lineTo(eixo - 5, 95);
	ctx.stroke();
	ctx.closePath();
	
	ctx.save();		
	ctx.scale(1, .3);
	ctx.beginPath();
	ctx.arc(eixo, 95 / .3, 8, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.restore();
	desenharPescoco();
	desenharCabeca();
}

function desenharPescoco() {
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(eixo, 90);
	ctx.lineTo(eixo, 95);
	ctx.stroke();
	ctx.closePath();
}

window.onload = init;