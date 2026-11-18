# ETAPA 2 — Física e controle do pássaro

**Duração:** 4 horas (240 min). **Produto esperado:** pássaro sobe ao pressionar Espaço ou clicar/tocar no Canvas, desce com gravidade e perde ao alcançar o chão. **Limite intencional:** os obstáculos começam na etapa 3.

## Objetivos de aprendizagem

Modelar o pássaro como objeto com propriedades; usar números e operações para calcular movimento; responder a `keydown` e `pointerdown`; criar um loop de animação com `requestAnimationFrame()`; distinguir atualização da lógica e renderização; reconhecer o papel de `delta` na fluidez.

**Relação com a apostila:** 4.2 objetos; 4.3 propriedades; 4.6 eventos; 5.1 temporização; 5.2 animação; 6.3.2 Canvas.

## Plano de aula minuto a minuto

| Tempo | Mediação docente | Evidência do aluno |
|---|---|---|
| 0–20 min | Retome DOM, estado `pronto` e cenário estático. | Explica uma função da etapa 1. |
| 20–55 min | Faça experimento no quadro com posição, velocidade e gravidade. | Calcula próximos valores de `y`. |
| 55–100 min | Codifique o objeto `passaro` e a função `atualizarFisica()`. | Pássaro cai gradualmente. |
| 100–115 min | Pausa e teste do Console. | Inspeciona a variável. |
| 115–150 min | Introduza `requestAnimationFrame` e cálculo de `delta`. | Movimento contínuo. |
| 150–195 min | Programe eventos de teclado/toque e função `pular()`. | Controles funcionam. |
| 195–220 min | Desafios: alterar gravidade e força do pulo. | Explica por que os valores mudam a jogabilidade. |
| 220–240 min | Teste e discussão sobre atualização por quadro. | Demonstra partida, pulo, queda e reinício. |

## Passo a passo para construir com a turma

### Passo 1 — Partir do projeto da etapa anterior

Use a estrutura HTML/CSS já funcional. No `script.js` da etapa 2, mantenha `canvas`, `contexto`, painel, botões e imagens. Mostre as novidades isoladamente; os arquivos resolvidos permitem comparar o código das duas etapas.

### Passo 2 — Tratar o pássaro como um objeto

```javascript
const passaro = {
  x: 80,
  y: 190,
  largura: 34,
  altura: 24,
  velocidade: 0,
  gravidade: 0.35,
  forcaPulo: -6.2
};
```

**Explique:** um objeto reúne propriedades de algo que queremos representar. `x` controla a posição horizontal; `y`, a vertical; velocidade e gravidade modificam `y` a cada quadro. No Canvas, a coordenada vertical **aumenta para baixo**, por isso pular exige velocidade negativa. Diferencie objeto `passaro` de um elemento HTML: ele armazena dados do jogo, não um nó do DOM.

### Passo 3 — Definir atualização da física

```javascript
function atualizarFisica(delta) {
  passaro.velocidade += passaro.gravidade * delta;
  passaro.y += passaro.velocidade * delta;
}
```

**Explique com números:** se `velocidade` começa em 0 e `gravidade` é 0,35, a velocidade fica 0,35 após um quadro equivalente, 0,70 após dois, e assim por diante. A cada quadro somamos a velocidade à posição. Mostre que não é uma simulação física exata do mundo real, mas um modelo simples suficiente para a aprendizagem.

### Passo 4 — Controlar as bordas

Adicione ao fim de `atualizarFisica()` a verificação para o teto (`passaro.y < 0`) e para o chão (`passaro.y + passaro.altura >= CHAO_Y`). Ao tocar o teto, fixe `y = 0` e zere a velocidade; ao tocar o chão, defina `estado = 'fim'` e atualize a interface.

**Discussão:** por que somamos `altura` ao `y` do pássaro? Porque o desenho começa no canto superior esquerdo; o ponto inferior é `y + altura`.

### Passo 5 — Programar o pulo e os eventos

```javascript
function pular() {
  if (estado === "jogando") {
    passaro.velocidade = passaro.forcaPulo;
  }
}
document.addEventListener("keydown", evento => {
  if (evento.code === "Space") {
    evento.preventDefault();
    pular();
  }
});
canvas.addEventListener("pointerdown", pular);
```

**Explique:** tanto teclado quanto ponteiro usam a mesma função. `preventDefault()` evita que a tecla Espaço role a página. `pointerdown` responde a mouse, caneta ou toque. Peça que pressionem Espaço antes de começar: nada deve acontecer porque o estado ainda não é `jogando`.

### Passo 6 — Fazer o loop de animação

```javascript
function animar(tempo) {
  const delta = tempoAnterior
    ? Math.min((tempo - tempoAnterior) / 16.67, 2)
    : 1;
  tempoAnterior = tempo;
  if (estado === "jogando") atualizarFisica(delta);
  desenhar(tempo);
  requestAnimationFrame(animar);
}
requestAnimationFrame(animar);
```

**Explique:** o navegador chama `animar` antes do próximo quadro. A função primeiro atualiza dados e depois redesenha o jogo. `tempo` vem em milissegundos. O valor de referência de 16,67 ms corresponde aproximadamente a 60 quadros por segundo. O limite 2 reduz pulos enormes quando a aba fica inativa. Não há garantia de que o monitor rode exatamente a 60 FPS.

### Passo 7 — Desenhar novas posições no Canvas

Ao redesenhar cada quadro, chame `clearRect()`, `desenharCenario()`, `desenharPassaro(tempo)` e `desenharChao()`. A função `desenharPassaro` troca entre três sprites de asas de acordo com o tempo e utiliza as propriedades do objeto `passaro`.

**Mostre o efeito da ordem:** desenhar o chão depois do pássaro faz com que o pássaro apareça por trás do chão quando chega ao limite, em vez de atravessá-lo visualmente.

### Passo 8 — Reiniciar todas as variáveis relevantes

```javascript
function reiniciar() {
  passaro.y = 190;
  passaro.velocidade = 0;
  estado = "pronto";
  atualizarInterface();
}
```

**Explique:** não basta alterar só o texto da tela. Se a velocidade negativa ou positiva persistir, o pássaro pode começar a partida seguinte com um movimento indesejado.

### Passo 9 — Testar, observar e ajustar

Inicie, deixe o pássaro cair, reinicie, pule com Espaço e repita usando clique. Modifique temporariamente `gravidade` de 0,35 para 0,60 e `forcaPulo` de -6,2 para -8. Peça que descrevam, sem usar apenas `ficou melhor/pior`, o que cada alteração provocou.

## Experimento de fixação

Cada dupla registra uma hipótese e um resultado: **o que acontece se a gravidade for 0,20 e a força do pulo -4?** Depois escolhe valores equilibrados e justifica. **Extensão:** criar um contador de pulos via DOM e resetá-lo corretamente na reinicialização.

## Testes de conclusão

- [ ] Antes de Iniciar, pressionar Espaço não move o pássaro.
- [ ] Após Iniciar, o pássaro cai de forma progressiva.
- [ ] Espaço e clique/toque aplicam impulso para cima.
- [ ] Ao pausar, o movimento para; ao continuar, volta.
- [ ] O pássaro não atravessa o teto nem o chão.
- [ ] Reiniciar reseta `y` e `velocidade`.

**Erros comuns:** aplicar gravidade mesmo pausado; inverter o sinal da força do pulo; esquecer de chamar `requestAnimationFrame` dentro do loop; criar vários loops ao pressionar Iniciar; deixar de zerar `velocidade` no reinício.

**Evidência:** aluno explica, com um exemplo numérico, como velocidade altera `y` e de que forma o evento chama `pular()`.
