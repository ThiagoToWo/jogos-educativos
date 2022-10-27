// Obtém os elementos da página
		const p = document.querySelector("p"); // o parágrafo
		const btNovo = document.querySelector("#btNovo"); // o botão de gerar outro labirinto
		const btImprimir = document.querySelector("#btImprimir"); // o botão de exportar/imprimir

		// Desenha o labirinto dentro do parágrafo p
		for (let i = 0; i < 30; i++) {
			for (let j = 0; j < 30; j++) {
				const s = Math.floor(Math.random() * 2) % 2 ? "\u2571" : "\u2572";
				p.innerText += s;
			}
			p.innerText += "\n";
		}
		
		// Adiciona a cada botão sua função ao ser clicado
		btNovo.addEventListener("click", gerarNovo);
		btImprimir.addEventListener("click", imprimirLabirinto);

		// Definiçoes das funções de cada botão
		function gerarNovo() {
			location.reload();
		}

		function imprimirLabirinto() {
			const janela = window.open();
			janela.document.write("<p>");
			janela.document.write(p.innerText);

			const pJanela = janela.document.querySelector("p");
			pJanela.style.lineHeight = "18px";
			pJanela.style.fontSize = "18px";
			pJanela.style.marginTop = "12em";
			pJanela.style.marginLeft = "4em";
			
			janela.print();
			// não funciona direito no celular
			//janela.close(); 
		}