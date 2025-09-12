(() => {
  // seleciona todos os elementos do tabuleiro (as 9 células)
  const celulas = document.querySelectorAll('.cell');

  // elemento que mostra mensagens de status (vez, vitória, empate)
  const statusEl = document.getElementById('status');

  // botão de reinício
  const botaoReiniciar = document.getElementById('reset');

  // elementos do placar
  const pontosXEl = document.getElementById('pontos-x');
  const pontosOEl = document.getElementById('pontos-o');
  const pontosEmpateEl = document.getElementById('pontos-empate');

  // símbolos dos jogadores
  const JOGADOR_X = 'X';
  const JOGADOR_O = 'O';

  // jogador que começa
  let jogadorAtual = JOGADOR_X;

  // estado do tabuleiro (array de 9 posições inicialmente nulas)
  let tabuleiro = Array(9).fill(null);

  // indica se o jogo já terminou (vitória ou empate)
  let jogoFinalizado = false;

  // placar (zera ao recarregar a página)
  let pontosX = 0;
  let pontosO = 0;
  let pontosEmpate = 0;

  // todas as combinações possíveis de vitória
  const COMBINACOES_VENCEDORAS = [
    [0,1,2],[3,4,5],[6,7,8], // linhas
    [0,3,6],[1,4,7],[2,5,8], // colunas
    [0,4,8],[2,4,6]          // diagonais
  ];

  // atualiza mensagem de status dinamicamente
  function atualizarStatus(msg = `Vez do jogador <strong>${jogadorAtual}</strong>`) {
    statusEl.innerHTML = msg;
    // adiciona uma classe no body para indicar o jogador atual (poderia ser usado no CSS)
    document.body.classList.toggle('current-x', jogadorAtual === JOGADOR_X);
    document.body.classList.toggle('current-o', jogadorAtual === JOGADOR_O);
  }

  // verifica se o jogador tem alguma combinação vencedora
  function verificarVitoria(jogador) {
    return COMBINACOES_VENCEDORAS.find(combinacao =>
      combinacao.every(i => tabuleiro[i] === jogador)
    );
  }

  // atualiza os números do placar na tela
  function atualizarPlacar() {
    pontosXEl.textContent = pontosX;
    pontosOEl.textContent = pontosO;
    pontosEmpateEl.textContent = pontosEmpate;
  }

  // função chamada ao clicar em uma célula
  function aoClicarCelula(e) {
    if (jogoFinalizado) return; // se já acabou, não faz nada
    const celula = e.target;
    const indice = celula.dataset.index; // posição da célula no tabuleiro

    if (tabuleiro[indice]) return; // se já está preenchida, não deixa jogar de novo

    // marca no estado e no HTML
    tabuleiro[indice] = jogadorAtual;
    celula.textContent = jogadorAtual;
    celula.classList.add(jogadorAtual.toLowerCase()); // adiciona classe "x" ou "o" p/ estilizar
    celula.disabled = true; // bloqueia a célula

    // verifica vitória
    const combinacaoVencedora = verificarVitoria(jogadorAtual);
    if (combinacaoVencedora) {
      jogoFinalizado = true;
      // destaca as células vencedoras
      combinacaoVencedora.forEach(i => celulas[i].classList.add('win'));
      atualizarStatus(`🎉 Jogador ${jogadorAtual} venceu!`);

      // atualiza placar
      if (jogadorAtual === JOGADOR_X) {
        pontosX++;
      } else {
        pontosO++;
      }
      atualizarPlacar();
      return;
    }

    // se o tabuleiro está todo preenchido e ninguém ganhou → empate
    if (tabuleiro.every(Boolean)) {
      jogoFinalizado = true;
      atualizarStatus('😅 Empate!');
      pontosEmpate++;
      atualizarPlacar();
      return;
    }

    // troca o jogador da vez
    jogadorAtual = jogadorAtual === JOGADOR_X ? JOGADOR_O : JOGADOR_X;
    atualizarStatus();
  }

  // reinicia o jogo mas mantém o placar
  function reiniciarJogo() {
    tabuleiro.fill(null);
    jogadorAtual = JOGADOR_X;
    jogoFinalizado = false;

    // limpa todas as células
    celulas.forEach(celula => {
      celula.textContent = '';
      celula.className = 'cell'; // remove classes "x", "o", "win"
      celula.disabled = false;
    });

    atualizarStatus();
  }

  // adiciona eventos de clique nas células e no botão
  celulas.forEach(celula => celula.addEventListener('click', aoClicarCelula));
  botaoReiniciar.addEventListener('click', reiniciarJogo);

  // inicializa o jogo com status e placar zerados
  atualizarStatus();
  atualizarPlacar();
})();

