"use strict";
// ETAPA 1: DOM, eventos, botões criados pelo JS e desenho inicial.
const canvas = document.querySelector("#jogo");
const contexto = canvas.getContext("2d");
const painel = document.querySelector("#painel");
const acoes = document.querySelector("#acoes");
const mensagem = document.querySelector("#mensagem");
const CHAO_Y = 400;
let estado = "pronto";
const passaro = { x: 80, y: 190, largura: 34, altura: 24 };

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

// createElement, textContent e appendChild criam o placar no DOM.
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
const botaoIniciar = criarBotao("Iniciar", iniciar);
const botaoPausar = criarBotao("Pausar", pausar);
const botaoReiniciar = criarBotao("Reiniciar", reiniciar);

function atualizarTela() {
  // replaceChildren remove avisos anteriores sem alterar o placar.
  painel.querySelectorAll(".aviso-jogo").forEach(aviso => aviso.remove());
  if (estado !== "jogando") {
    const aviso = document.createElement("div");
    aviso.className = "aviso-jogo";
    aviso.textContent = estado === "pronto" ? "Clique em Iniciar!" : "Jogo pausado";
    painel.appendChild(aviso);
  }
  botaoIniciar.disabled = estado !== "pronto";
  botaoPausar.disabled = estado === "pronto";
  botaoPausar.textContent = estado === "pausado" ? "Continuar" : "Pausar";
  mensagem.textContent = `Estado atual: ${estado}`;
  desenhar();
}
function iniciar() { estado = "jogando"; atualizarTela(); }
function pausar() { estado = estado === "jogando" ? "pausado" : "jogando"; atualizarTela(); }
function reiniciar() { estado = "pronto"; atualizarTela(); }
function desenhar() {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  desenharCenario();
  desenharPassaro();
  desenharChao();
}
// Quando uma imagem terminar de carregar, redesenhamos a tela.
Object.values(imagens).flat().forEach(img => img.addEventListener("load", desenhar));
atualizarTela();
