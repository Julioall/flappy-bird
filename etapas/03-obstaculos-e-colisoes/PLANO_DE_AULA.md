# ETAPA 3 — Obstáculos, listas de objetos e colisões

**Duração:** 4 horas (240 min). **Produto esperado:** canos aparecem em posições variadas, se movem da direita para a esquerda, somem ao deixar a tela e encerram a partida quando tocam o pássaro. **Limite intencional:** pontuação sonora e tela final serão ensinadas na etapa 4.

## Objetivos

Criar e manipular um array de objetos; gerar posições aleatórias dentro de limites; atualizar propriedades em um loop; remover objetos que saem do campo visual; desenhar sprites transformados; compreender colisão retângulo-retângulo com condições lógicas.

**Relação com a apostila:** 4.2 e 4.3 objetos/propriedades; 4.4 e 4.5 inclusão e exclusão; 5.1 temporização; 5.2 animações; 6.3.2 Canvas.

## Plano de aula minuto a minuto

| Tempo | Mediação docente | Evidência do aluno |
|---|---|---|
| 0–20 min | Teste a física e retome os limites da tela. | Controla o pássaro. |
| 20–55 min | Explique arrays, objetos e a diferença entre um cano e vários. | Constrói objetos no Console. |
| 55–100 min | Crie `gerarCano()` e o intervalo de surgimento. | Obstáculos aparecem. |
| 100–115 min | Pausa; teste na aba Console. | Examina `canos`. |
| 115–155 min | Programe movimentação, remoção e desenho superior/inferior. | Canos cruzam a tela. |
| 155–205 min | Demonstre interseção de retângulos e colisões. | Tocar no cano encerra o jogo. |
| 205–225 min | Exercícios: modificar abertura e velocidade. | Compara duas dificuldades. |
| 225–240 min | Testes e reflexão. | Explica a condição de colisão. |

## Passo a passo

### Passo 1 — Criar a lista de obstáculos

```javascript
const canos = [];
const LARGURA_CANO = 52;
const ESPACO_CANOS = 150;
const VELOCIDADE_CANOS = 2.4;
const INTERVALO_CANOS = 110;
let tempoDesdeCano = 0;
```

**Explique:** o array comportará vários objetos, um para cada par de canos. `const canos = []` impede reatribuir a variável para outro array, mas **não impede** adicionar, alterar ou excluir os objetos contidos. `INTERVALO_CANOS` mede quadros equivalentes de aproximadamente 60 FPS, e não milissegundos reais.

### Passo 2 — Gerar altura variável sem bloquear a passagem

```javascript
function gerarCano() {
  const minimo = 55;
  const maximo = CHAO_Y - ESPACO_CANOS - 55;
  const topo = minimo + Math.random() * (maximo - minimo);
  canos.push({ x: canvas.width, topo, passou: false });
}
```

**Explique:** cada par nasce na borda direita. A variável `topo` define onde termina o cano superior; a abertura tem 150 px. Os limites `55` reservam espaço no alto e abaixo da passagem. Demonstre `Math.random()` no Console e peça uma estimativa de valores mínimos e máximos de `topo`.

### Passo 3 — Criar os canos em intervalos e movimentá-los

```javascript
function atualizarCanos(delta) {
  tempoDesdeCano += delta;
  if (tempoDesdeCano >= INTERVALO_CANOS) {
    gerarCano();
    tempoDesdeCano = 0;
  }
  for (const cano of canos) {
    cano.x -= VELOCIDADE_CANOS * delta;
  }
}
```

**Explique:** um obstáculo começa em `x = 288`; subtrair velocidade faz o cano andar para a esquerda. Diferencie um timer clássico (`setInterval`) do contador de quadros dentro de `requestAnimationFrame`. Aqui usamos o próprio loop do jogo para manter as atualizações sincronizadas com a animação.

### Passo 4 — Excluir os obstáculos invisíveis

Complete `atualizarCanos()` com o trecho:

```javascript
const ativos = canos.filter(cano => cano.x + LARGURA_CANO > 0);
canos.splice(0, canos.length, ...ativos);
```

**Explique:** `filter` mantém os elementos que satisfazem uma condição. Um cano está completamente fora da tela quando `cano.x + largura <= 0`. Se os objetos antigos nunca forem excluídos, a lista crescerá indefinidamente. O uso de `splice` preserva a referência do array original, alterando seu conteúdo. Esclareça que **excluir um objeto do array não é o mesmo que remover um nó HTML do DOM**, embora ambos pratiquem a ideia de manter a interface/dados organizados.

### Passo 5 — Desenhar pares de canos, inclusive o cano invertido

O arquivo final da etapa usa `desenharCanos()`. No Canvas, `save()` guarda o estado de transformação, `translate(x, y)` muda a origem e `scale(1, -1)` inverte o sprite para formar o cano de cima. `restore()` devolve o contexto ao normal. Sem `restore()`, desenhos seguintes podem aparecer invertidos.

```javascript
contexto.save();
contexto.translate(cano.x, cano.topo);
contexto.scale(1, -1);
contexto.drawImage(imagens.cano, 0, 0, LARGURA_CANO, 320);
contexto.restore();
contexto.drawImage(imagens.cano, cano.x, cano.topo + ESPACO_CANOS, LARGURA_CANO, 320);
```

**Questão prática:** por que o par de canos deve ser desenhado **depois do cenário e antes do pássaro**? O Canvas pinta um desenho sobre o anterior.

### Passo 6 — Entender a interseção entre retângulos

Use dois retângulos desenhados no quadro. Uma colisão ocorre quando suas projeções horizontal e vertical se sobrepõem simultaneamente.

```javascript
function sobrepoe(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx &&
         ay < by + bh && ay + ah > by;
}
```

**Explique termo a termo:** `ax < bx + bw` verifica se a esquerda de A está antes da direita de B; `ax + aw > bx` verifica o lado oposto. As duas condições da vertical repetem a mesma ideia no eixo `y`. O operador `&&` exige que **todas** sejam verdadeiras. O exemplo é uma aproximação retangular: não considera pixels transparentes do sprite.

### Passo 7 — Detectar choque com cano superior e inferior

A função `verificarColisoes()` no arquivo resolvido usa os limites do pássaro (com pequena margem) e compara com dois retângulos: cano superior, da altura 0 até `cano.topo`, e inferior, que começa em `cano.topo + ESPACO_CANOS` e termina antes do chão. Ao tocar qualquer um, muda `estado` para `fim` e atualiza o aviso do DOM.

**Experimento:** imprima no Console `topo`, `x` e as quatro comparações lógicas para identificar qual delas fez o resultado final ser `true`.

### Passo 8 — Colocar tudo na ordem correta do loop

No `animar()`, dentro de `if (estado === 'jogando')`, chame primeiro `atualizarFisica(delta)`. Caso o pássaro não tenha caído, chame `atualizarCanos(delta)` e `verificarColisoes()`. No desenho, a ordem recomendada é cenário → canos → pássaro → chão.

### Passo 9 — Reiniciar e testar memória/estado

Ao reiniciar, utilize `canos.length = 0` e `tempoDesdeCano = 0`, além dos resets anteriores. Caso contrário, a próxima partida pode herdar obstáculos da tentativa anterior. Deixe o jogo rodando e verifique que a quantidade de objetos não cresce sem limite.

## Exercícios

1. Altere a abertura de 150 px para 180 px e descreva o efeito no jogo.
2. Aumente a velocidade dos canos para 3 px por quadro equivalente.
3. Para quem avançar: desenhe temporariamente uma borda retangular ao redor do pássaro e das áreas de colisão, para visualizar a matemática.

## Testes de conclusão

- [ ] Canos aparecem após alguns instantes e têm alturas diferentes.
- [ ] Canos se deslocam para a esquerda enquanto o jogo está ativo.
- [ ] Canos antigos saem do array após ultrapassarem a borda.
- [ ] A colisão com qualquer cano encerra a partida.
- [ ] Ao reiniciar, não restam canos da tentativa anterior.
- [ ] Pausar congela obstáculos e pássaro.

**Erros comuns:** usar `=` no lugar de comparação; calcular `topo` fora dos limites; esquecer que o eixo Y cresce para baixo; excluir objetos enquanto itera sem cuidado; desenhar canos por cima do chão; não restaurar a transformação do Canvas.

**Evidência:** aluno explica o array de objetos e identifica, em um desenho, por que dois retângulos colidem ou não.
