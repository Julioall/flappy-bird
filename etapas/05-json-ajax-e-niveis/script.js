"use strict";
// ETAPA 5: configuração assíncrona, JSON e níveis de dificuldade.
const canvas = document.querySelector("#jogo");
const contexto = canvas.getContext("2d");
const painel = document.querySelector("#painel");
const acoes = document.querySelector("#acoes");
const mensagem = document.querySelector("#mensagem");
const CHAO_Y = 400;
const passaro = { x: 80, y: 190, largura: 34, altura: 24,
  velocidade: 0, gravidade: 0.35, forcaPulo: -6.2 };
let estado = "pronto";
let tempoAnterior = 0;
const canos = []; // Cada cano será um objeto dentro de um array.
const LARGURA_CANO = 52;
let espacoCanos = 150;
let velocidadeCanos = 2.4;
let dificuldades = null;
let nomeDificuldade = "normal";
let carregando = true;
const INTERVALO_CANOS = 110; // duração em quadros equivalentes a 60 FPS
let tempoDesdeCano = 0;
let pontos = 0;
let intervaloContagem = null;
const sons = {
  pulo: new Audio("../../assets/sons/wing.ogg"),
  ponto: new Audio("../../assets/sons/point.ogg"),
  colisao: new Audio("../../assets/sons/hit.ogg"),
  fim: new Audio("../../assets/sons/die.ogg")
};
function tocar(nome) {
  const som = sons[nome];
  if (!som) return;
  som.currentTime = 0;
  som.play().catch(() => { /* Navegador pode bloquear som sem interação. */ });
}

// Associamos cada imagem a um objeto que armazena seu endereço.
const imagens = {
  fundo: carregarImagem("../../assets/imagens/background-day.png"),
  base: carregarImagem("../../assets/imagens/base.png"),
  cano: carregarImagem("../../assets/imagens/pipe-green.png"),
  asas: [
    carregarImagem("../../assets/imagens/yellowbird-downflap.png"),
    carregarImagem("../../assets/imagens/yellowbird-midflap.png"),
    carregarImagem("../../assets/imagens/yellowbird-upflap.png")
  ]
};
function carregarImagem(caminho) {
  const imagem = new Image();
  imagem.src = caminho;
  return imagem;
}
function imagemPronta(img) {
  return img.complete && img.naturalWidth > 0;
}
function desenharCenario() {
  if (imagemPronta(imagens.fundo)) contexto.drawImage(imagens.fundo, 0, 0, 288, 512);
  else { contexto.fillStyle = "#70c5ce"; contexto.fillRect(0, 0, 288, 512); }
}
function desenharChao() {
  if (imagemPronta(imagens.base)) contexto.drawImage(imagens.base, 0, CHAO_Y, 336, 112);
  else { contexto.fillStyle = "#ded895"; contexto.fillRect(0, CHAO_Y, 288, 112); }
}
function desenharPassaro(tempo = 0) {
  const indice = Math.floor(tempo / 130) % imagens.asas.length;
  const asa = imagens.asas[indice];
  if (imagemPronta(asa)) contexto.drawImage(asa, passaro.x, passaro.y, passaro.largura, passaro.altura);
  else { contexto.fillStyle = "#ffd83f"; contexto.fillRect(passaro.x, passaro.y, passaro.largura, passaro.altura); }
}

const placar = document.createElement("div");
placar.className = "placar";
placar.textContent = "Pontos: 0";
painel.appendChild(placar);
function criarBotao(rotulo, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = rotulo;
  botao.addEventListener("click", acao);
  acoes.appendChild(botao);
  return botao;
}
// O seletor de dificuldade também nasce via manipulação do DOM.
const rotulo = document.createElement("label");
rotulo.className = "rotulo-dificuldade";
rotulo.textContent = "Dificuldade: ";
const seletor = document.createElement("select");
seletor.id = "dificuldade";
rotulo.appendChild(seletor);
acoes.appendChild(rotulo);
seletor.addEventListener("change", () => {
  nomeDificuldade = seletor.value;
  aplicarDificuldade();
});
const botaoIniciar = criarBotao("Iniciar", iniciar);
const botaoPausar = criarBotao("Pausar", pausar);
criarBotao("Reiniciar", reiniciar);
function aviso(texto) {
  painel.querySelectorAll(".aviso-jogo").forEach(el => el.remove());
  if (!texto) return;
  const elemento = document.createElement("div");
  elemento.className = "aviso-jogo";
  elemento.textContent = texto;
  painel.appendChild(elemento);
}
function atualizarInterface() {
  const textos = { pronto: "Clique em Iniciar!", pausado: "Jogo pausado", fim: `Fim de jogo! Pontuação: ${pontos}` };
  aviso(textos[estado] || "");
  const avisoFim = painel.querySelector(".aviso-jogo");
  if (estado === "fim" && avisoFim) {
    const figura = document.createElement("img");
    figura.src = "../../assets/imagens/gameover.png";
    figura.alt = "Game Over";
    avisoFim.prepend(figura);
  }
  botaoIniciar.disabled = estado !== "pronto" || carregando;
  seletor.disabled = carregando || estado !== "pronto";
  botaoPausar.disabled = !["jogando", "pausado"].includes(estado);
  botaoPausar.textContent = estado === "pausado" ? "Continuar" : "Pausar";
  placar.textContent = `Pontos: ${pontos}`;
  mensagem.textContent = `Estado atual: ${estado}`;
}
function iniciar() {
  if (estado !== "pronto" || carregando) return;
  estado = "contagem";
  let restante = 3;
  mostrarContagem(restante);
  atualizarInterface();
  intervaloContagem = setInterval(() => {
    restante -= 1;
    if (restante > 0) mostrarContagem(restante);
    else {
      clearInterval(intervaloContagem);
      intervaloContagem = null;
      painel.querySelector(".contagem")?.remove();
      estado = "jogando";
      atualizarInterface();
    }
  }, 1000);
}
function mostrarContagem(numero) {
  let elemento = painel.querySelector(".contagem");
  if (!elemento) {
    elemento = document.createElement("div");
    elemento.className = "contagem";
    painel.appendChild(elemento);
  }
  elemento.textContent = numero;
}
function pausar() {
  if (estado === "jogando") estado = "pausado";
  else if (estado === "pausado") estado = "jogando";
  atualizarInterface();
}
function reiniciar() {
  if (intervaloContagem !== null) clearInterval(intervaloContagem);
  intervaloContagem = null;
  painel.querySelector(".contagem")?.remove();
  pontos = 0;
  passaro.y = 190;
  passaro.velocidade = 0;
  canos.length = 0;          // Esvazia o array sem recriá-lo.
  tempoDesdeCano = 0;
  estado = "pronto";
  atualizarInterface();
}
function pular() {
  if (estado === "jogando") {
    passaro.velocidade = passaro.forcaPulo;
    tocar("pulo");
  }
}
document.addEventListener("keydown", evento => {
  if (evento.code === "Space") { evento.preventDefault(); pular(); }
});
canvas.addEventListener("pointerdown", pular);
function atualizarFisica(delta) {
  // delta mede quantos quadros de 60 FPS se passaram.
  passaro.velocidade += passaro.gravidade * delta;
  passaro.y += passaro.velocidade * delta;
  if (passaro.y < 0) { passaro.y = 0; passaro.velocidade = 0; }
  if (passaro.y + passaro.altura >= CHAO_Y) {
    passaro.y = CHAO_Y - passaro.altura;
    terminarJogo();
  }
}
function gerarCano() {
  const minimo = 55;
  const maximo = CHAO_Y - espacoCanos - 55;
  const topo = minimo + Math.random() * (maximo - minimo);
  canos.push({ x: canvas.width, topo, passou: false });
}
function atualizarCanos(delta) {
  tempoDesdeCano += delta;
  if (tempoDesdeCano >= INTERVALO_CANOS) {
    gerarCano();
    tempoDesdeCano = 0;
  }
  for (const cano of canos) cano.x -= velocidadeCanos * delta;
  // filter cria uma lista nova apenas com obstáculos visíveis.
  const ativos = canos.filter(cano => cano.x + LARGURA_CANO > 0);
  canos.splice(0, canos.length, ...ativos);
}
function sobrepoe(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function verificarColisoes() {
  const x = passaro.x + 3, y = passaro.y + 3;
  const largura = passaro.largura - 6, altura = passaro.altura - 6;
  for (const cano of canos) {
    const topoBaixo = cano.topo + espacoCanos;
    const tocouSuperior = sobrepoe(x, y, largura, altura, cano.x, 0, LARGURA_CANO, cano.topo);
    const tocouInferior = sobrepoe(x, y, largura, altura, cano.x, topoBaixo,
      LARGURA_CANO, CHAO_Y - topoBaixo);
    if (tocouSuperior || tocouInferior) {
      terminarJogo();
      break;
    }
  }
}
function atualizarPontuacao() {
  for (const cano of canos) {
    // O mesmo cano não pode pontuar duas vezes.
    if (!cano.passou && cano.x + LARGURA_CANO < passaro.x) {
      cano.passou = true;
      pontos += 1;
      placar.textContent = `Pontos: ${pontos}`;
      tocar("ponto");
    }
  }
}
function terminarJogo() {
  if (estado !== "jogando") return;
  estado = "fim";
  tocar("colisao");
  atualizarInterface();
}
function desenharCanos() {
  for (const cano of canos) {
    const baixo = cano.topo + espacoCanos;
    if (imagemPronta(imagens.cano)) {
      // Inverte o sprite verticalmente para desenhar o cano de cima.
      contexto.save();
      contexto.translate(cano.x, cano.topo);
      contexto.scale(1, -1);
      contexto.drawImage(imagens.cano, 0, 0, LARGURA_CANO, 320);
      contexto.restore();
      contexto.drawImage(imagens.cano, cano.x, baixo, LARGURA_CANO, 320);
    } else {
      contexto.fillStyle = "#62ba46";
      contexto.fillRect(cano.x, 0, LARGURA_CANO, cano.topo);
      contexto.fillRect(cano.x, baixo, LARGURA_CANO, CHAO_Y - baixo);
    }
  }
}
function desenhar(tempo) {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  desenharCenario();
  desenharCanos();
  desenharPassaro(tempo);
  desenharChao();
}
function animar(tempo) {
  // O limite evita saltos grandes após mudar de aba ou travar o navegador.
  const delta = tempoAnterior ? Math.min((tempo - tempoAnterior) / 16.67, 2) : 1;
  tempoAnterior = tempo;
  if (estado === "jogando") {
    atualizarFisica(delta);
    if (estado === "jogando") {
      atualizarCanos(delta);
      verificarColisoes();
      if (estado === "jogando") atualizarPontuacao();
    }
  }
  desenhar(tempo);
  requestAnimationFrame(animar);
}
async function carregarDificuldades() {
  carregando = true;
  atualizarInterface();
  mensagem.textContent = "Carregando configurações em JSON...";
  try {
    const resposta = await fetch("dados/dificuldades.json");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    // Conferimos a estrutura recebida antes de usá-la.
    for (const nome of ["facil", "normal", "dificil"]) {
      const nivel = dados[nome];
      if (!nivel || !Number.isFinite(nivel.velocidadeCanos) ||
          !Number.isFinite(nivel.espacoCanos) || nivel.espacoCanos < 100 ||
          nivel.espacoCanos > 220 || nivel.velocidadeCanos <= 0) {
        throw new Error(`Dados inválidos para o nível ${nome}`);
      }
    }
    dificuldades = dados;
    for (const nome of Object.keys(dados)) {
      const opcao = document.createElement("option");
      opcao.value = nome;
      opcao.textContent = nome[0].toUpperCase() + nome.slice(1);
      seletor.appendChild(opcao);
    }
    seletor.value = nomeDificuldade;
    aplicarDificuldade();
    carregando = false;
    atualizarInterface();
    mensagem.textContent = "Configurações carregadas. Escolha um nível e inicie!";
  } catch (erro) {
    carregando = true; // Não iniciamos com configuração desconhecida.
    atualizarInterface();
    mensagem.textContent = `Falha ao ler JSON: ${erro.message}. Execute em servidor HTTP local.`;
  }
}
function aplicarDificuldade() {
  if (!dificuldades) return;
  const configuracao = dificuldades[nomeDificuldade];
  velocidadeCanos = configuracao.velocidadeCanos;
  espacoCanos = configuracao.espacoCanos;
  mensagem.textContent = `Nível ${nomeDificuldade}: velocidade ${velocidadeCanos}, abertura ${espacoCanos}.`;
}
atualizarInterface();
requestAnimationFrame(animar);
carregarDificuldades();
