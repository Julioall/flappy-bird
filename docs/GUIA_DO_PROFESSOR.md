# Flappy Bird JS Challenge — Guia do professor

**Unidade curricular:** Programação Client-Side  
**Público:** turma que já construiu dois sites simples com HTML/CSS/JavaScript  
**Duração de referência:** 20 horas (cinco etapas de 4 horas); adapte ao ritmo da turma  
**Metodologia:** explicação curta → programação acompanhada → teste → desafio → retomada  
**Ferramentas:** VS Code, Live Server (ou `python -m http.server 8000`), Chrome/Firefox com DevTools  
**Recursos:** sprites e sons de `Flappy_Bird_assets by kosresetr55.rar`, enviados pelo professor; organização inicial das pastas em `Flappy Bird(1).zip`.

## Orientações antes da primeira aula

1. **Não distribua a solução da etapa seguinte antecipadamente.** Cada diretório contém um projeto que já funciona ao fim daquela etapa. Para ensinar, faça os estudantes digitarem as funções indicadas, usando o arquivo resolvido apenas como referência e recuperação de erros.
2. **Abra cada pasta como um projeto separado.** A página inicial é sempre `index.html` e o JavaScript é carregado com `defer`. Os arquivos de recursos são buscados por caminhos relativos à pasta da etapa.
3. **Use servidor HTTP local.** Em todas as etapas, prefira Live Server. Na etapa 5, `fetch()` de JSON normalmente não funciona quando a página é aberta como `file://`.
4. **Teste com o Console e a aba Rede do navegador.** F12 abre as ferramentas de desenvolvedor na maioria dos navegadores. Peça que os alunos expliquem cada erro e não apenas copiem uma correção.
5. **Separe DOM de Canvas.** O DOM inclui botões, avisos e placar; o Canvas desenha o cenário, o pássaro e os canos. Os desenhos no Canvas não são elementos HTML independentes.
6. **Observe direitos de uso.** O pacote foi enviado pelo professor e contém recursos de terceiros; confirme direitos e licenças antes de qualquer redistribuição pública.

## Ligação com a apostila SENAI (UC9)

- **Capítulo 4, páginas impressas 65–87:** DOM, objetos, propriedades, inserção, exclusão e eventos.
- **Capítulo 5, páginas impressas 89–110:** temporizadores, animação, requisições assíncronas e JSON.
- **Capítulo 6, páginas impressas 111–132:** som, vídeo, imagens, Canvas e recursos vetoriais.

## Estrutura do pacote

```text
Flappy Bird - Projeto Didatico/
  Etapa 1. Estrutura e interface/
    index.html
    style.css
    script.js
    dados/dificuldades.json
    ../../assets/imagens/*.png
    ../../assets/sons/*.ogg
    PLANO_DE_AULA.md
  ... (o mesmo padrão para as etapas 2 a 5)
```

**Regra de progressão:** etapa 1 prepara interface; etapa 2 introduz física; etapa 3 introduz obstáculos; etapa 4 adiciona pontuação e efeitos; etapa 5 usa `fetch()` e configurações JSON. Os arquivos de cada etapa são cumulativos, mas a explicação enfatiza as novidades.


# ETAPA 1 — Estrutura, interface e primeiro contato com o DOM

**Duração:** 4 horas (240 min). **Produto esperado:** cenário estático no Canvas, placar e botões Iniciar, Pausar e Reiniciar, criados com JavaScript, com mudança de mensagens conforme o estado do jogo. **Limite intencional:** nesta etapa o pássaro ainda não voa.

## Objetivos de aprendizagem

Ao final, o estudante deverá ser capaz de: (a) identificar a diferença entre HTML, CSS, DOM e Canvas; (b) selecionar elementos usando `document.querySelector()`; (c) criar, inserir, alterar e remover nós do DOM; (d) registrar eventos com `addEventListener()`; (e) explicar um objeto JavaScript usado para representar o pássaro.

**Relação com a apostila:** 4.1 DOM; 4.2 objetos; 4.3 propriedades; 4.4 inclusão; 4.5 exclusão; 4.6 execução a partir de ações do usuário; introdução ao 6.3.2 Canvas.

## Plano de aula minuto a minuto

| Tempo | Mediação docente | Evidência do aluno |
|---|---|---|
| 0–20 min | Contextualize o jogo, mostre o pacote de sprites e a divisão em cinco etapas. | Aponta o objetivo do projeto. |
| 20–50 min | Desenhe a árvore do DOM no quadro; compare `div`, `canvas` e objetos JS. | Identifica elementos no inspetor. |
| 50–85 min | Construa `index.html` e explique a folha `style.css`. | Abre a página, sem erros no Console. |
| 85–100 min | Pausa e conferência de arquivos e caminhos. | Corrige nomes e pastas. |
| 100–145 min | Apresente seleção, `createElement`, `appendChild` e eventos. | Botões aparecem dinamicamente. |
| 145–190 min | Carregue imagens e desenhe fundo, pássaro e chão. | Cenário estático desenhado. |
| 190–220 min | Exercício em dupla: novo aviso e estado do jogo. | Exibe uma mensagem própria via DOM. |
| 220–240 min | Revisão, avaliação e entrega. | Mostra o projeto e explica uma função. |

## Passo a passo para construir com a turma

### Passo 1 — Preparar as pastas e explicar os arquivos

Abra a pasta `Etapa 1. Estrutura e interface` no VS Code. Verifique `index.html`, `style.css`, `script.js`, `../../assets/imagens/` e `../../assets/sons/`. Explique que HTML define a estrutura, CSS modifica a aparência e JavaScript altera o comportamento. Não peça que copiem todas as funções prontas antes da explicação.

**Demonstração:** use os arquivos `background-day.png` (288×512), `base.png` (336×112) e `yellowbird-midflap.png` (34×24). Mostre que um nome de arquivo errado impede a imagem de carregar. O Canvas tem resolução interna 288×512 pixels.

### Passo 2 — Criar a estrutura HTML essencial

No `index.html`, crie o documento padrão HTML5 e inclua os elementos centrais abaixo dentro de `<main>`. O arquivo resolvido da etapa já contém o cabeçalho e o rodapé.

```html
<section class="area-jogo" aria-label="Área do jogo">
  <canvas id="jogo" width="288" height="512"></canvas>
  <div id="painel" class="painel" aria-live="polite"></div>
</section>
<section id="acoes" class="acoes"></section>
<p id="mensagem" class="mensagem" role="status"></p>
```

No `<head>`, carregue o arquivo com `<script src="script.js" defer></script>`.

**Explique:** `id` identifica um elemento único; `class` permite aplicar estilos a vários elementos; `defer` espera o HTML ser analisado antes de executar o arquivo JS. O script `defer` fica no `head` na solução completa. O Canvas contém pixels desenhados, enquanto o `painel` receberá elementos HTML normais.

### Passo 3 — Configurar o CSS e fazer um teste visual

No `style.css`, defina `.area-jogo { position: relative; width: 288px; height: 512px; }` e `.painel { position: absolute; inset: 0; pointer-events: none; }`. Isso posiciona o painel sobre o Canvas. Explique que `pointer-events: none` impede o painel de bloquear cliques no jogo. Compare com o CSS completo fornecido, que inclui botões acessíveis e adaptação à largura da tela.

**Verificação:** a área reservada do jogo aparece centralizada e com borda. Neste momento ainda não aparecem imagens e botões.

### Passo 4 — Selecionar elementos do DOM

No início de `script.js`, peça que os alunos adicionem as referências abaixo. Abra o Console e execute `document.querySelector('#jogo')` para mostrar que o navegador retorna o elemento real da página.

```javascript
const canvas = document.querySelector("#jogo");
const contexto = canvas.getContext("2d");
const painel = document.querySelector("#painel");
const acoes = document.querySelector("#acoes");
const mensagem = document.querySelector("#mensagem");
```

**Explique:** `document` representa o documento HTML; `querySelector` procura um nó; o método `getContext('2d')` permite pintar no Canvas. O objeto `contexto` não altera botões do HTML, mas controla desenho.

### Passo 5 — Criar o placar via JavaScript, sem colocá-lo pronto no HTML

```javascript
const placar = document.createElement("div");
placar.className = "placar";
placar.textContent = "Pontos: 0";
painel.appendChild(placar);
```

**Explique linha a linha:** `createElement` cria um elemento solto; `className` muda a propriedade de classe; `textContent` define texto de modo seguro; `appendChild` insere o elemento no DOM. Peça que removam a última linha temporariamente e observem: o objeto existe na memória, mas não aparece na página.

### Passo 6 — Criar botões e associar eventos

```javascript
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
```

**Explique:** `acao` recebe a referência de uma função. Passamos `iniciar`, não `iniciar()`, porque o navegador deve chamá-la quando houver clique. Esse é um ótimo momento para demonstrar a diferença entre referência e execução de função.

### Passo 7 — Representar o estado e alterar o DOM

```javascript
let estado = "pronto";
function iniciar() { estado = "jogando"; atualizarTela(); }
function pausar() { estado = estado === "jogando" ? "pausado" : "jogando"; atualizarTela(); }
function reiniciar() { estado = "pronto"; atualizarTela(); }
```

Construa `atualizarTela()` seguindo o `script.js` resolvido. Mostre como `botaoIniciar.disabled`, `botaoPausar.textContent`, `mensagem.textContent` e `document.createElement('div')` atualizam a interface. A solução remove avisos antigos com `.remove()` antes de inserir avisos novos; isso evita avisos duplicados.

**Pergunta-chave:** se alteramos apenas o valor de `estado`, a página muda automaticamente? Não. Ainda é necessário executar a função que modifica o DOM, neste projeto `atualizarTela()`.

### Passo 8 — Carregar sprites e desenhar no Canvas

Use `new Image()` e a propriedade `.src` para associar imagens aos arquivos existentes. O arquivo resolvido já define `carregarImagem()`, `imagemPronta()`, `desenharCenario()`, `desenharPassaro()` e `desenharChao()`.

```javascript
const imagem = new Image();
imagem.src = "../../assets/imagens/background-day.png";
imagem.addEventListener("load", desenhar);
```

**Explique:** imagens carregam de modo assíncrono, por isso o evento `load` é importante. No Canvas, `contexto.drawImage()` desenha uma imagem em uma posição; `contexto.clearRect()` apaga um quadro antes de redesenhar. Apresente a ordem do desenho: fundo, pássaro, chão. Os últimos podem cobrir os anteriores.

### Passo 9 — Testar e concluir

Inicie a página com Live Server. Clique em Iniciar, Pausar, Continuar e Reiniciar, observando o texto da mensagem, a disponibilidade dos botões e o elemento de aviso. Use F12 > Elements e procure o `div.placar`, que foi criado pelo JavaScript.

## Exercício de fixação (20–30 minutos)

Em duplas, criem um novo botão chamado `Ajuda`, com uma função que mostre `Use a tecla Espaço para voar na próxima etapa`. Não vale adicionar a mensagem diretamente no HTML: a alteração deve ocorrer por JavaScript. **Extensão:** alternar cor ou classe de um elemento ao clicar no botão.

## Roteiro de testes e gabarito de observação

- [ ] A página abre sem erro de JavaScript no Console.
- [ ] O fundo, o pássaro e o chão são desenhados.
- [ ] Três botões surgem por `createElement()`.
- [ ] O botão Iniciar altera o estado para `jogando`.
- [ ] Pausar exibe `Jogo pausado` e Continuar retoma.
- [ ] Reiniciar volta ao estado `pronto`.
- [ ] Avisos antigos são removidos antes de inserir os novos.

**Erros comuns:** elemento HTML com `id` diferente do seletor; `iniciar()` usado no lugar de `iniciar` em `addEventListener`; imagem com caminho errado; CSS não vinculado; esquecer `appendChild`. Peça que cada aluno cite o erro e explique a correção.

**Evidência de aprendizagem:** demonstração de dois eventos funcionando e explicação oral de seleção → criação → inserção → atualização de elemento.


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


# ETAPA 5 — AJAX, JSON e níveis de dificuldade

**Duração:** 4 horas (240 min). **Produto esperado:** o jogo final lê `dados/dificuldades.json` de modo assíncrono, cria um seletor de níveis com DOM e usa velocidade e abertura dos canos de acordo com a opção escolhida. A partida só inicia depois que os dados são carregados e validados.

## Objetivos

Diferenciar um objeto JavaScript de um texto JSON; usar `fetch()` e `await` para fazer uma requisição assíncrona; ler e validar propriedades; tratar erros com `try/catch`; criar opções do seletor por código; verificar requisições na aba Rede do navegador; integrar todos os recursos aprendidos.

**Relação com a apostila:** 4.3 propriedades; 4.4 DOM; 4.6 eventos; 5.3 AJAX; 5.4 JSON; integração com animação e Canvas dos capítulos 5–6.

## Plano de aula minuto a minuto

| Tempo | Mediação docente | Evidência do aluno |
|---|---|---|
| 0–20 min | Faça o jogo completo da etapa 4 funcionar e mostre limitações dos valores fixos. | Identifica parâmetros a configurar. |
| 20–55 min | Compare objeto JS, string JSON e arquivo JSON. | Lê propriedades dos níveis. |
| 55–100 min | Explique `fetch`, `await`, status HTTP e `response.json()`. | Vê a requisição na aba Rede. |
| 100–115 min | Pausa e conferência do servidor HTTP. | Corrige `file://` ou 404. |
| 115–160 min | Valide dados, crie `<select>` e opções no DOM. | Níveis aparecem na interface. |
| 160–200 min | Ligue nível ao funcionamento e implemente erros. | Velocidade e abertura mudam. |
| 200–225 min | Faça testes de integração e desafio livre. | Corrige cenários de falha. |
| 225–240 min | Apresentação final, rubrica e autoavaliação. | Explica o fluxo completo de dados. |

## Passo a passo

### Passo 1 — Comparar configuração fixa e configuração externa

Retome `VELOCIDADE_CANOS = 2.4` e `ESPACO_CANOS = 150` da etapa 4. Peça que os alunos indiquem por que seria cansativo alterar o código-fonte para cada dificuldade. Na etapa 5, substituímos por variáveis `velocidadeCanos` e `espacoCanos`, que receberão os números do JSON.

### Passo 2 — Ler e discutir o arquivo JSON

Abra `dados/dificuldades.json`. Ele já foi enviado no ZIP inicial e é preservado na solução:

```json
{
  "facil": { "velocidadeCanos": 2, "espacoCanos": 180 },
  "normal": { "velocidadeCanos": 3, "espacoCanos": 150 },
  "dificil": { "velocidadeCanos": 4, "espacoCanos": 120 }
}
```

**Explique:** JSON é um formato textual para representar dados; aqui ele parece a notação de objetos, mas existe como **texto em arquivo**. As chaves estão entre aspas duplas. Um arquivo JSON válido não admite comentários. Um nível contém duas propriedades numéricas. `velocidadeCanos` maior significa obstáculos mais rápidos; `espacoCanos` menor significa passagem mais estreita.

### Passo 3 — Rodar o projeto com servidor HTTP

No VS Code, use Live Server ou abra o terminal **dentro da pasta `Etapa 5...`** e execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Abra F12 > Network/Rede. Clique no pedido do arquivo JSON e observe a URL, o status HTTP (esperado 200) e o corpo retornado. **Explique:** abrir diretamente `index.html` com `file://` não é equivalente a solicitar arquivos via um servidor web; políticas de segurança do navegador podem impedir `fetch()` local.

### Passo 4 — Fazer a requisição assíncrona

```javascript
async function carregarDificuldades() {
  try {
    const resposta = await fetch("dados/dificuldades.json");
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    dificuldades = dados;
  } catch (erro) {
    mensagem.textContent = `Falha ao ler JSON: ${erro.message}`;
  }
}
```

**Explique:** `fetch` pede um recurso; `await` aguarda uma Promise ser resolvida sem congelar a página; `resposta.ok` ajuda a detectar HTTP 404/500; `resposta.json()` converte o texto da resposta em dados JavaScript; `catch` atende falhas. O arquivo final vai além e verifica cuidadosamente os números recebidos.

### Passo 5 — Validar o conteúdo antes de usar

Apresente a condição do `script.js` resolvido, que verifica a presença dos níveis `facil`, `normal` e `dificil`, se `velocidadeCanos` e `espacoCanos` são números finitos e se estão dentro de faixas aceitáveis. Peça que simulem um JSON com `"velocidadeCanos": "rapido"` para observar a mensagem de erro.

**Explique:** conseguir carregar um arquivo não prova que seus dados estão corretos. Um valor inválido pode quebrar a lógica do jogo. A solução conserva `carregando = true` quando há erro, impedindo partida com configuração desconhecida.

### Passo 6 — Criar seletor de nível com DOM

```javascript
const rotulo = document.createElement("label");
rotulo.textContent = "Dificuldade: ";
const seletor = document.createElement("select");
rotulo.appendChild(seletor);
acoes.appendChild(rotulo);
```

Depois da resposta válida, um `for...of` percorre `Object.keys(dados)`, cria um `<option>` para cada nível e usa `appendChild()`. Adicione um ouvinte `change` no seletor para executar `aplicarDificuldade()`. **Explique:** o HTML não possui previamente as opções; elas são geradas a partir dos dados recebidos. Esse passo integra JSON e manipulação dinâmica do DOM.

### Passo 7 — Aplicar os valores no jogo

```javascript
function aplicarDificuldade() {
  if (!dificuldades) return;
  const configuracao = dificuldades[nomeDificuldade];
  velocidadeCanos = configuracao.velocidadeCanos;
  espacoCanos = configuracao.espacoCanos;
}
```

**Explique:** o nome da dificuldade indica qual objeto queremos acessar. A leitura ocorre pela notação `dificuldades[nomeDificuldade]` porque o valor da chave está guardado numa variável. `gerarCano()`, `verificarColisoes()`, `desenharCanos()` e `atualizarCanos()` precisam usar os valores variáveis em vez das antigas constantes.

### Passo 8 — Desabilitar controles durante carregamento e partida

Na função `atualizarInterface()`, o botão Iniciar fica indisponível enquanto `carregando` for `true`. O seletor fica desabilitado durante uma partida, para não mudar a geometria dos canos no meio do jogo. No início da etapa, apresente um texto de carregamento no DOM e substitua por uma mensagem de sucesso ou erro depois da resposta.

### Passo 9 — Testar falhas reais e investigar a aba Rede

1. Com o servidor ligado, confirme JSON com status 200 e selecione Fácil, Normal e Difícil.
2. Renomeie temporariamente `dificuldades.json`, atualize a página e observe erro HTTP 404; depois restaure.
3. Substitua temporariamente um número por texto e observe a validação falhar; restaure.
4. Abra `index.html` com duplo clique e compare o comportamento no Console e na aba Rede.
5. Teste Reiniciar e escolha outra dificuldade antes da próxima partida.

### Passo 10 — Integrar, explicar e apresentar o jogo

Cada aluno ou dupla apresenta a sequência **evento → mudança de estado/objeto → atualização da lógica → desenho no Canvas → atualização do DOM**. No nível de dificuldade, acrescente **requisição → JSON → validação → aplicação dos números**. Faça a turma identificar os arquivos e funções correspondentes no código.

## Desafio final

Inclua uma quarta dificuldade em `dificuldades.json`. Observe que a implementação atual valida explicitamente os três níveis originais e gera opções percorrendo as chaves do JSON: uma quarta opção será gerada automaticamente, mas deve respeitar a estrutura `velocidadeCanos`/`espacoCanos`. Ajuste os números e teste a jogabilidade. **Extensões opcionais:** recorde com `localStorage`; menu de instruções usando vídeo da turma; medalha desenhada com SVG; criar uma tela de configurações com novos elementos DOM.

## Testes de conclusão

- [ ] A aba Rede mostra carregamento de JSON com status 200.
- [ ] As opções do seletor são criadas pelo JavaScript.
- [ ] A partida não inicia antes de carregar dados válidos.
- [ ] Fácil é perceptivelmente mais lento/mais aberto que Difícil.
- [ ] A dificuldade não é alterada durante uma partida.
- [ ] Um JSON inválido mostra erro, não trava a página sem explicação.
- [ ] Reiniciar, mudar nível e iniciar nova partida funciona.
- [ ] O jogo mantém todos os requisitos das etapas 1 a 4.

**Erros comuns:** `await` fora de função `async`; tentar ler JSON sem servidor HTTP; caminho incorreto; esquecer `resposta.ok`; usar `dados.normal` independentemente do seletor; escrever `velocidadeCano` em vez de `velocidadeCanos`; permitir mudança de dificuldade durante a partida.

**Evidência:** estudante demonstra a requisição na aba Rede, explica o JSON e identifica uma alteração visível causada pelo dado recebido.


# Avaliação final, recuperação e encaminhamentos

## Rubrica sugerida (100 pontos)

| Critério | Pontos | Evidência observável |
|---|---:|---|
| DOM e eventos | 20 | Elementos criados/removidos, botões, mensagens e eventos funcionando. |
| Objetos e lógica | 20 | Pássaro, canos, array, condições e estados coerentes. |
| Física, animação e colisões | 25 | Pulo, gravidade, fluidez e derrota corretos. |
| Imagens, som e Canvas | 15 | Sprites, desenho e efeitos sonoros integrados. |
| AJAX/JSON | 10 | JSON carregado, validado e aplicado. |
| Organização e testes | 10 | Código identificável, sem erros críticos e testes demonstrados. |

**Observação docente:** avalie também a explicação do aluno. Uma solução que funciona, mas não pode ser explicada, indica necessidade de retomada. Em recuperação, escolha uma função pequena a ser refeita ao vivo (por exemplo, `pular`, `criarBotao` ou `atualizarPontuacao`).

## Perguntas para avaliação oral ou escrita

1. Qual a diferença entre adicionar um `div` ao DOM e desenhar um cano no Canvas?
2. Por que o pássaro sobe quando sua velocidade recebe um número negativo?
3. Por que atualizamos a física antes de redesenhar a imagem?
4. Como garantimos que um cano só renda um ponto?
5. O que acontece com o array se nunca removermos os canos fora da tela?
6. Qual a diferença entre `setInterval` e `requestAnimationFrame` neste projeto?
7. O que significa uma Promise em `fetch()` e por que usamos `await`?
8. O que acontece quando o JSON é inválido ou está ausente?
9. Como um clique do usuário pode resultar em mudança de um elemento do DOM?
10. Por que precisamos limpar um timer antes de reiniciar o jogo?

## Critérios de conclusão para o projeto

O projeto pode ser considerado concluído quando: (1) a página abre em servidor local sem exceções; (2) os sprites carregam; (3) os controles respondem; (4) colisões e pontuação estão coerentes; (5) os sons funcionam depois da interação; (6) o menu de dificuldade usa JSON externo; (7) os alunos conseguem descrever ao menos três funções-chave sem depender da leitura literal do arquivo.

## Nota sobre adaptações

A carga horária de 20 h é uma sugestão de planejamento, não uma exigência da apostila. Para grupos iniciantes, desdobre a etapa 3 em duas aulas; para grupos avançados, aprofunde testes unitários do capítulo 7 ou acrescente explicação de SVG/vídeo do capítulo 6. O jogo usa atualização baseada em quadro equivalente de 60 FPS, adequada para fins didáticos, e não um motor físico profissional.
