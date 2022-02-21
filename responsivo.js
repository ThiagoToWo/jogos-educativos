/*Classe que configura o css de acordo com o tamanho da tela do dispositivo*/
function Responsivo() {
	window.addEventListener('resize', this.ajustarResponsividade, false);
	this.default_func = [];
	this.port_func = [];
	this.land_func = [];
	this.max320_func = [];
	this.max480_func = [];
	this.max768_func = [];
	this.max992_func = [];
	this.max1024_func = [];
	this.min1024_func = [];	
}

Responsivo.prototype.novaFuncaoDefault = function(funcao) {
	this.default_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMax320 = function(funcao) {
	this.max320_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMax480 = function(funcao) {
	this.max480_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMax768 = function(funcao) {
	this.max768_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMax992 = function(funcao) {
	this.max992_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMax1024 = function(funcao) {
	this.max1024_func.push(funcao);
}

Responsivo.prototype.novaFuncaoMin1024 = function(funcao) {
	this.min1024_func.push(funcao);
}

Responsivo.prototype.ajustarResponsividade = function() {
	for (var i in this.default_func) { // aplica opcionalmente as propriedades padrões
		this.default_func[i]();
	}
	if (window.innerWidth > window.innerHeight) { // para orientação paisagem
		for (var i in this.min1024_func) {
			this.min1024_func[i]();
		}
		return;
	}
	if (window.screen.width <= 320) { // para telas orientação retrato até 320px de largura
		for (var i in this.max320_func) {
			this.max320_func[i]();
		}
	} else if (window.screen.width <= 480) { // para telas orientação retrato de 321px até 480px de largura
		for (var i in this.max480_func) {
			this.max480_func[i]();
		}
	} else if (window.screen.width <= 768) { // para telas orientação retrato de 481px até 780px de largura
		for (var i in this.max768_func) {
			this.max768_func[i]();
		}
	} else if (window.screen.width <= 992) { // para telas orientação retrato de 769px até 992px de largura
		for (var i in this.max992_func) {
			this.max992_func[i]();
		}
	} else if (window.screen.width <= 1024) { // para telas orientação retrato de 993px até 1024px de largura
		for (var i in this.max1024_func) {
			this.max1024_func[i]();
		}
	} else if (window.screen.width > 1024) { // para telas maiores que 1024px de largura 
		for (var i in this.min1024_func) {
			this.min1024_func[i]();
		}
	}		
}