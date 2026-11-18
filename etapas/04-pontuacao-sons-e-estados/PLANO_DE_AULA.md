# ETAPA 4 — Pontuação, áudio, contagem regressiva e estados

**Duração:** 4 horas (240 min). **Produto esperado:** jogo com placar que aumenta uma vez por cano ultrapassado, som de pulo e ponto, contagem inicial 3–2–1, pausa, fim e reinício confiáveis.

## Objetivos

Modelar uma máquina de estados simples (`pronto`, `contagem`, `jogando`, `pausado`, `fim`); usar `setInterval()` e `clearInterval()`; atualizar propriedades do DOM; registrar uma pontuação única por objeto; reproduzir som com `Audio`; explicar limitações de autoplay nos navegadores.

**Relação com a apostila:** 4.3 propriedades; 4.6 eventos; 5.1 timers; 5.2 animação; 6.1 som; 6.3 imagens e Canvas.

## Plano de aula minuto a minuto

| Tempo | Mediação docente | Evidência do aluno |
|---|---|---|
| 0–20 min | Recapitule arrays e colisões. | Descreve o ciclo de um cano. |
| 20–55 min | Explique máquina de estados e transições permitidas. | Desenha um pequeno diagrama. |
| 55–100 min | Implemente pontuação e atualização do DOM. | Placar aumenta uma vez por cano. |
| 100–115 min | Pausa e teste de pontuação. | Reproduz e corrige erro de pontuação dupla. |
| 115–155 min | Carregue os sons de pulo e ponto. | Sons tocam após interação. |
| 155–195 min | Programe contagem com `setInterval` e limpeza com `clearInterval`. | Jogo inicia após 3–2–1. |
| 195–220 min | Feche com game over e reinício. | Partidas não acumulam timers. |
| 220–240 min | Avaliação de funcionamento e reflexão. | Demonstra fluxo completo. |

## Passo a passo

### Passo 1 — Planejar os estados antes de programar

Desenhe a sequência: `pronto → contagem → jogando → fim` e `jogando ↔ pausado`. O botão Reiniciar retorna de qualquer estado para `pronto`. **Explique:** o estado evita que uma ação de usuário produza resultados incompatíveis (por exemplo, pular enquanto está pausado ou iniciar duas partidas simultâneas).

### Passo 2 — Criar variáveis para pontos, contagem e áudio

```javascript
let pontos = 0;
let intervaloContagem = null;
const sons = {
  pulo: new Audio("../../assets/sons/wing.ogg"),
  ponto: new Audio("../../assets/sons/point.ogg"),
  colisao: new Audio("../../assets/sons/hit.ogg"),
  fim: new Audio("../../assets/sons/die.ogg")
};
```

**Explique:** `pontos` varia durante o jogo; `intervaloContagem` guardará o identificador do timer. O pacote oferece tanto arquivos `.ogg` quanto `.wav`; a solução utiliza `.ogg`. Um arquivo sonoro existente na pasta não é automaticamente reproduzido: é preciso disparar uma ação.

### Passo 3 — Som somente quando necessário

```javascript
function tocar(nome) {
  const som = sons[nome];
  if (!som) return;
  som.currentTime = 0;
  som.play().catch(() => {});
}
```

**Explique:** o `.play()` pode retornar uma Promise rejeitada se o navegador bloquear reprodução sem interação. O `.catch()` evita erro não tratado; durante os testes, peça que o aluno investigue qualquer silêncio no Console e na aba Rede. `currentTime = 0` permite reproduzir o som desde o começo a cada pulo. Na implementação, `tocar('pulo')` é chamado dentro de `pular()` quando o estado é `jogando`.

### Passo 4 — Pontuar apenas após ultrapassar um obstáculo

```javascript
function atualizarPontuacao() {
  for (const cano of canos) {
    if (!cano.passou && cano.x + LARGURA_CANO < passaro.x) {
      cano.passou = true;
      pontos += 1;
      placar.textContent = `Pontos: ${pontos}`;
      tocar("ponto");
    }
  }
}
```

**Explique:** `passou` pertence ao objeto de cada cano, criado na etapa 3 inicialmente como `false`. Sem a propriedade booleana, o placar somaria pontos a cada quadro depois da passagem, um erro clássico de jogos. A atualização do placar é uma **alteração de propriedade do DOM**, não um desenho do Canvas.

### Passo 5 — Criar a contagem regressiva no DOM

O professor demonstra como `mostrarContagem()` usa `document.createElement('div')` para criar `div.contagem` no painel apenas quando necessário. A função `iniciar()` recebe estas instruções:

```javascript
estado = "contagem";
let restante = 3;
mostrarContagem(restante);
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
```

**Explique:** `setInterval` executa uma função repetidamente, aproximadamente a cada 1000 ms. `clearInterval` interrompe a repetição. Ao terminar, o elemento da contagem é removido do DOM. O `?.` é o encadeamento opcional: chama `remove()` somente se existir um elemento encontrado.

### Passo 6 — Impedir timers duplicados

Em `iniciar()`, verifique `if (estado !== 'pronto') return;`. Em `reiniciar()`, antes de zerar o jogo, execute `clearInterval(intervaloContagem)` quando aplicável e remova a contagem. **Discussão:** se o usuário iniciar e reiniciar rapidamente, o que aconteceria se o timer antigo continuasse ativo? Ele poderia começar outra partida de modo inesperado.

### Passo 7 — Encerrar o jogo com uma função única

```javascript
function terminarJogo() {
  if (estado !== "jogando") return;
  estado = "fim";
  tocar("colisao");
  atualizarInterface();
}
```

**Explique:** tanto chão quanto cano podem provocar a derrota. Em vez de duplicar código, chamamos a mesma função. A guarda `if` impede executar a derrota repetidamente em vários quadros consecutivos, o que poderia repetir o som sem parar.

### Passo 8 — Adicionar imagem de Game Over via DOM

No `atualizarInterface()` da etapa 4, quando `estado === 'fim'`, a aplicação cria um `<img>` dinamicamente, define `src = '../../assets/imagens/gameover.png'`, configura `alt = 'Game Over'` e usa `prepend()` para inseri-lo no aviso. É uma oportunidade para revisar inclusão e exclusão de elementos.

### Passo 9 — Testar o fluxo inteiro

A sequência esperada é: Iniciar → contagem 3–2–1 → jogar → pular → ganhar pontos → colidir → ver Game Over e pontuação → Reiniciar → nova partida. Também teste o botão Pausar/Continuar, garantindo que não altere a pontuação enquanto pausado.

## Exercícios e extensões

1. Exiba no aviso final uma frase diferente para 0 pontos e para 5 ou mais pontos.
2. Mostre um contador de tentativas usando DOM.
3. **Extensão multimídia do capítulo 6.2:** gravar um vídeo de 10 segundos demonstrando como jogar e criar um botão `Como jogar` que mostre/oculte um `<video controls>` com esse arquivo criado pela turma. O pacote enviado não contém vídeo.

## Testes de conclusão

- [ ] Existe contagem regressiva com 3, 2 e 1 antes da jogada.
- [ ] Reiniciar durante a contagem não dispara partida depois do reset.
- [ ] Cada par de canos soma exatamente um ponto.
- [ ] O placar no DOM acompanha `pontos`.
- [ ] Pulo, pontuação e colisão acionam áudio.
- [ ] A tela final aparece apenas uma vez por derrota.
- [ ] Pausa/Continuação e Reiniciar mantêm comportamento correto.

**Erros comuns:** chamar `setInterval` várias vezes; não limpá-lo no reinício; esquecer `cano.passou = true`; chamar áudio fora de interação e não lidar com Promise; ouvir som de colisão repetidamente; alterar o placar sem alterar a variável `pontos`.

**Evidência:** aluno explica os estados possíveis, indica onde um timer nasce e é cancelado e demonstra pontuação não duplicada.
