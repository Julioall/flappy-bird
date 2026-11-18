# Flappy Bird JS Challenge

Projeto didático de **Programação Client-Side (HTML, CSS e JavaScript puro)**, desenvolvido em **5 etapas** para aulas práticas de DOM, objetos, eventos, Canvas, temporizadores, multimídia, AJAX e JSON.

## Comece por aqui

- [Etapa 1: Estrutura e interface](etapas/01-estrutura-e-interface/PLANO_DE_AULA.md): DOM, botões, eventos e desenho inicial.
- [Etapa 2: Física do pássaro](etapas/02-fisica-do-passaro/PLANO_DE_AULA.md): gravidade, pulo e `requestAnimationFrame()`.
- [Etapa 3: Obstáculos e colisões](etapas/03-obstaculos-e-colisoes/PLANO_DE_AULA.md): arrays, canos, colisões e pontuação inicial.
- [Etapa 4: Pontuação, sons e estados](etapas/04-pontuacao-sons-e-estados/PLANO_DE_AULA.md): efeitos sonoros, contagem regressiva, game over.
- [Etapa 5: JSON, AJAX e níveis](etapas/05-json-ajax-e-niveis/PLANO_DE_AULA.md): `fetch()`, tratamento de JSON e dificuldade configurável.

**[Guia completo do professor (Markdown)](docs/GUIA_DO_PROFESSOR.md)** · **[Guia editável (Word)](docs/GUIA_DO_PROFESSOR.docx)**

Cada pasta é uma versão independente do jogo ao término da respectiva etapa. O ideal é **programar o código com a turma**, usando os arquivos como referência, não entregar a solução antes da aula.

## Como executar

1. Faça o clone do repositório ou baixe como ZIP.
2. [Confira a configuração dos sprites e sons](assets/README.md). Esses arquivos **não estão incluídos** neste repositório público.
3. No VS Code, abra a pasta de uma etapa e inicie o **Live Server** (ou execute `python -m http.server 8000` dentro dela).
4. Acesse o endereço local informado pelo servidor.
5. Teste os botões, clique/toque no Canvas e pressione **Espaço** nas etapas a partir da 2.

> Na ausência dos PNGs, o jogo possui desenhos simplificados de fallback no Canvas; a parte visual fica limitada e os sons de terceiros não tocarão. Para ver o jogo com os sprites de referência, siga as instruções da pasta `assets/`.

**Importante:** na etapa 5 o `fetch('dados/dificuldades.json')` exige servir os arquivos via HTTP (Live Server ou servidor local). Abrir `index.html` diretamente com `file://` pode falhar.

## Estrutura

```text
flappy-bird/
├── README.md
├── LICENSE
├── assets/README.md            # orientações para adicionar recursos locais
├── docs/
│   ├── GUIA_DO_PROFESSOR.md
│   └── GUIA_DO_PROFESSOR.docx
└── etapas/
    ├── 01-estrutura-e-interface/
    ├── 02-fisica-do-passaro/
    ├── 03-obstaculos-e-colisoes/
    ├── 04-pontuacao-sons-e-estados/
    └── 05-json-ajax-e-niveis/
```

## Direitos autorais

A licença MIT deste repositório aplica-se **ao código e à documentação criados para este projeto**, não a sprites, trilhas sonoras ou elementos do jogo original. O pacote indicado pelo professor é disponibilizado por terceiros no [itch.io](https://kosresetr55.itch.io/flappy-bird-assets-by-kosresetr55), sem licença de redistribuição claramente estabelecida. Por isso, os recursos não são publicados aqui. Verifique as permissões antes de qualquer publicação ou distribuição.
