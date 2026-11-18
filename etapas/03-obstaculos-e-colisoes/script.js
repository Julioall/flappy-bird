"use strict";
// ETAPA 3: obstáculos, listas de objetos e detecção de colisões.
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
const ESPACO_CANOS = 150;
const VELOCIDADE_CANOS = 2.4;
const INTERVALO_CANOS = 110; // duração em quadros equivalentes a 60 FPS
let tempoDesdeCano = 0;

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
  canos.length = 0;          // Esvazia o array sem recriá-lo.
  tempoDesdeCano = 0;
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
function gerarCano() {
  const minimo = 55;
  const maximo = CHAO_Y - ESPACO_CANOS - 55;
  const topo = minimo + Math.random() * (maximo - minimo);
  canos.push({ x: canvas.width, topo, passou: false });
}
function atualizarCanos(delta) {
  tempoDesdeCano += delta;
  if (tempoDesdeCano >= INTERVALO_CANOS) {
    gerarCano();
    tempoDesdeCano = 0;
  }
  for (const cano of canos) cano.x -= VELOCIDADE_CANOS * delta;
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
    const topoBaixo = cano.topo + ESPACO_CANOS;
    const tocouSuperior = sobrepoe(x, y, largura, altura, cano.x, 0, LARGURA_CANO, cano.topo);
    const tocouInferior = sobrepoe(x, y, largura, altura, cano.x, topoBaixo,
      LARGURA_CANO, CHAO_Y - topoBaixo);
    if (tocouSuperior || tocouInferior) {
      estado = "fim";
      atualizarInterface();
      break;
    }
  }
}
function desenharCanos() {
  for (const cano of canos) {
    const baixo = cano.topo + ESPACO_CANOS;
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
    }
  }
  desenhar(tempo);
  requestAnimationFrame(animar);
}
atualizarInterface();
requestAnimationFrame(animar);
