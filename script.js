(() => {
  const celulas = document.querySelectorAll('.cell');
  const statusEl = document.getElementById('status');
  const botaoReiniciar = document.getElementById('reset');

  // elementos do placar
  const pontosXEl = document.getElementById('pontos-x');
  const pontosOEl = document.getElementById('pontos-o');
  const pontosEmpateEl = document.getElementById('pontos-empate');

  const JOGADOR_X = 'X';
  const JOGADOR_O = 'O';
  let jogadorAtual = JOGADOR_X;
  let tabuleiro = Array(9).fill(null);
  let jogoFinalizado = false;

  // placar (sempre zera ao recarregar a página)
  let pontosX = 0;
  let pontosO = 0;
  let pontosEmpate = 0;

  const COMBINACOES_VENCEDORAS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function atualizarStatus(msg = `Vez do jogador <strong>${jogadorAtual}</strong>`) {
    statusEl.innerHTML = msg;
    document.body.classList.toggle('current-x', jogadorAtual === JOGADOR_X);
    document.body.classList.toggle('current-o', jogadorAtual === JOGADOR_O);
  }

  function verificarVitoria(jogador) {
    return COMBINACOES_VENCEDORAS.find(combinacao =>
      combinacao.every(i => tabuleiro[i] === jogador)
    );
  }

  function atualizarPlacar() {
    pontosXEl.textContent = pontosX;
    pontosOEl.textContent = pontosO;
    pontosEmpateEl.textContent = pontosEmpate;
  }

  function aoClicarCelula(e) {
    if (jogoFinalizado) return;
    const celula = e.target;
    const indice = celula.dataset.index;

    if (tabuleiro[indice]) return;

    tabuleiro[indice] = jogadorAtual;
    celula.textContent = jogadorAtual;
    celula.classList.add(jogadorAtual.toLowerCase());
    celula.disabled = true;

    const combinacaoVencedora = verificarVitoria(jogadorAtual);
    if (combinacaoVencedora) {
      jogoFinalizado = true;
      combinacaoVencedora.forEach(i => celulas[i].classList.add('win'));
      atualizarStatus(`🎉 Jogador ${jogadorAtual} venceu!`);

      if (jogadorAtual === JOGADOR_X) {
        pontosX++;
      } else {
        pontosO++;
      }
      atualizarPlacar();
      return;
    }

    if (tabuleiro.every(Boolean)) {
      jogoFinalizado = true;
      atualizarStatus('😅 Empate!');
      pontosEmpate++;
      atualizarPlacar();
      return;
    }

    jogadorAtual = jogadorAtual === JOGADOR_X ? JOGADOR_O : JOGADOR_X;
    atualizarStatus();
  }

  function reiniciarJogo() {
    tabuleiro.fill(null);
    jogadorAtual = JOGADOR_X;
    jogoFinalizado = false;
    celulas.forEach(celula => {
      celula.textContent = '';
      celula.className = 'cell';
      celula.disabled = false;
    });
    atualizarStatus();
  }

  celulas.forEach(celula => celula.addEventListener('click', aoClicarCelula));
  botaoReiniciar.addEventListener('click', reiniciarJogo);

  atualizarStatus();
  atualizarPlacar();
})();
