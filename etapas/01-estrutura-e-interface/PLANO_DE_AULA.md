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
