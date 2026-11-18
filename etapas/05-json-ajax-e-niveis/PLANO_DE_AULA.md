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
