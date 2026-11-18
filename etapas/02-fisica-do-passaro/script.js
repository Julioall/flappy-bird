"use strict";
// ETAPA 2: física, eventos de teclado/toque e requestAnimationFrame.
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
  const textos = { pronto: "Clique em Iniciar!", pausado: "Jogo pausado", fim: "O pássaro caiu! Reinicie." };
  aviso(textos[estado] || "");
  botaoIniciar.disabled = estado !== "pronto";
  botaoPausar.disabled = !["jogando", "pausado"].includes(estado);
  botaoPausar.textContent = estado === "pausado" ? "Continuar" : "Pausar";
  mensagem.textContent = `Estado atual: ${estado}`;
}
function iniciar() { estado = "jogando"; atualizarInterface(); }
function pausar() {
  if (estado === "jogando") estado = "pausado";
  else if (estado === "pausado") estado = "jogando";
  atualizarInterface();
}
function reiniciar() {
  passaro.y = 190;
  passaro.velocidade = 0;
  estado = "pronto";
  atualizarInterface();
}
function pular() {
  if (estado === "jogando") passaro.velocidade = passaro.forcaPulo;
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
    estado = "fim";
    atualizarInterface();
  }
}
function desenhar(tempo) {
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  desenharCenario();
  desenharPassaro(tempo);
  desenharChao();
}
function animar(tempo) {
  // O limite evita saltos grandes após mudar de aba ou travar o navegador.
  const delta = tempoAnterior ? Math.min((tempo - tempoAnterior) / 16.67, 2) : 1;
  tempoAnterior = tempo;
  if (estado === "jogando") atualizarFisica(delta);
  desenhar(tempo);
  requestAnimationFrame(animar);
}
atualizarInterface();
requestAnimationFrame(animar);
