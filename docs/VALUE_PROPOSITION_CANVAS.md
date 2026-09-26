# Canvas da Proposta de Valor: DrawSVG Studio

> **Metodologia**: Value Proposition Canvas (Alexander Osterwalder) com Amarração Biunívoca Estrita 1:1 (Sebrae Startups).  
> **Regra de Ouro**: Nenhuma dor do cliente pode ficar sem um aliviador correspondente no produto, e nenhum ganho desejado pode ficar sem um mecanismo criador. Nenhuma feature é inventada sem lastro em uma dor ou ganho.

---

## 1. O Perfil do Cliente (Lado Direito)

### 1.1 Tarefas do Cliente (Customer Jobs)
*O que o usuário está tentando realizar no seu trabalho ou vida pessoal que o produto apoia?*
- **Tarefas Funcionais**: Desenhar e pintar à mão livre com ferramentas clássicas (pincéis, borracha, preenchimento, camadas e seleção); obter código SVG vetorial limpo e estruturado em tempo real; exportar código ou arquivo vetorial para projetos web/interfaces; catalogar e gerenciar criações em uma galeria visual local.
- **Tarefas Emocionais**: Sentir a fluidez criativa relaxante e focada do desenho tradicional de quadrinhos/ilustração sem a frustração de softwares pesados ou manipulação cansativa de nós e curvas Bézier.
- **Tarefas Sociais**: Apresentar assets e ilustrações digitais autorais de altíssima qualidade técnica, leves e perfeitamente escaláveis para seus projetos e público.

### 1.2 Dores Concretas do Cliente (Customer Pains)
*O que machuca, atrasa, gera custo ou frustra o cliente antes, durante e após realizar as tarefas?*

| ID | Dor / Fricção Concreta | Intensidade (Alta / Média / Baixa) | Custo Prático da Dor (Tempo, R$, Estresse) |
|---|---|---|---|
| **DOR-01** | Curva de aprendizado íngreme e rigidez de ferramentas vetoriais tradicionais (focadas em caneta Bézier e nós em vez de pintura livre). | Alta | Bloqueio criativo, lentidão e sensação de atrito técnico que interrompe o fluxo de desenho. |
| **DOR-02** | Impossibilidade de desenhar em camadas vetoriais com a facilidade e intuição de aplicativos de bitmap (pixels). | Alta | Confinamento a formatos raster (PNG/JPEG) que perdem resolução e não geram código SVG utilizável em código web. |
| **DOR-03** | Dificuldade e burocracia de exportar tanto o código SVG puro quanto a imagem renderizada para uso imediato. | Alta | Retrabalho abrindo múltiplos softwares conversores ou editores de texto para extrair a marcação SVG. |

### 1.3 Ganhos Desejados pelo Cliente (Customer Gains)
*Quais resultados, benefícios concretos e surpresas positivas o cliente busca ativamente?*

| ID | Ganho Desejado | Relevância (Essencial / Desejado / Inesperado) | Critério de Sucesso do Cliente |
|---|---|---|---|
| **GANHO-01** | Visualização do código SVG semântico e limpo em tempo real com botão de copiar em 1 clique. | Essencial | Traço desenhado aparece imediatamente como elemento vetorial semântico no painel de código. |
| **GANHO-02** | Experiência de desenho imersiva e sem lag com atalhos intuitivos (Ctrl+Z, troca de ferramentas, espessura e cor). | Essencial | Desenho responsivo a 60fps sem engasgos, com controles ergonômicos e atalhos de estúdio de arte. |
| **GANHO-03** | Galeria visual integrada com salvamento no navegador para reabrir, baixar e gerenciar artes com 1 clique. | Essencial | Preservação das artes no armazenamento local (IndexedDB/LocalStorage) com miniaturas organizadas. |

---

## 2. O Mapa de Valor do Produto (Lado Esquerdo)

### 2.1 Produtos & Serviços
*Qual é a oferta concreta, tangível ou digital que disponibilizamos ao cliente?*
- **Canvas de Pintura Vetorial Interativo**: Prancheta de desenho com suporte a pincéis calibrados, borracha vetorial, balde de preenchimento, ferramenta de seleção e camadas agrupadas.
- **Painel de Código SVG em Tempo Real**: Inspetor lateral retrátil que renderiza a árvore SVG formatada, permitindo cópia instantânea com um clique.
- **Galeria Visual Local Integrada**: Painel de gerenciamento de artes salvas com miniaturas visuais, reabertura imediata para edição e opções de download (.svg e .png).

### 2.2 Aliviadores de Dor (Pain Relievers)
*Como exatamente o produto alivia, minimiza ou elimina cada uma das dores listadas no item 1.2?*
- **Aliviador da DOR-01**: Elimina a necessidade de manusear nós ou curvas Bézier complexas. O usuário desenha livremente com pincéis e traços fluidos que o motor converte silenciosamente em caminhos vetoriais otimizados.
- **Aliviador da DOR-02**: Fornece um gerenciador de camadas completo e intuitivo onde cada camada gera um grupo `<g id="layer-n">` no SVG, unindo a naturalidade de camadas de pintura à precisão vetorial.
- **Aliviador da DOR-03**: Disponibiliza botões de ação rápida para copiar o código SVG diretamente para a área de transferência, fazer download do arquivo `.svg` e exportar como `.png` em alta definição.

### 2.3 Criadores de Ganho (Gain Creators)
*Como exatamente o produto cria, maximiza ou evidencia cada um dos ganhos desejados listados no item 1.3?*
- **Criador do GANHO-01**: Sincronização em tempo real (reativa) do DOM vetorial para um visualizador de código com realce de sintaxe e contador de elementos.
- **Criador do GANHO-02**: Engine de desenho otimizada com interpolação suave de traços, suporte a atalhos de teclado (B para pincel, E para borracha, G para balde, V para seleção, Ctrl+Z / Ctrl+Y) e histórico de ações.
- **Criador do GANHO-03**: Galeria visual em gaveta lateral ou modal de tela cheia que renderiza previews instantâneos em SVG, com data de criação e botões de ação rápida (Carregar, Exportar, Excluir).

---

## 3. Matriz de Fit Problema-Solução (Auditoria Estrita 1:1)

### 3.1 Tabela de Amarração de Dores (Dores vs. Aliviadores)

| ID Dor | Dor Concreta do Cliente | Aliviador Específico no Produto | Funcionalidade Correspondente no PRD |
|---|---|---|---|
| **DOR-01** | Curva de aprendizado íngreme e rigidez de softwares vetoriais focados em nós. | Desenho livre à mão com pincéis e borracha que geram paths vetoriais automaticamente. | Módulo Canvas & Traçado Livre (`Freehand Vector Engine`) |
| **DOR-02** | Impossibilidade de desenhar em camadas vetoriais com a facilidade de bitmap. | Sistema de camadas visual com reordenação, visibilidade, bloqueio e agrupamento `<g>`. | Gerenciador de Camadas Vetoriais (`Layer Manager`) |
| **DOR-03** | Burocracia para exportar código SVG puro e imagem renderizada. | Botão "Copiar Código SVG" em 1 clique + exportação dupla (.svg e .png). | Barra de Exportação Rápida (`Export Hub`) |

### 3.2 Tabela de Amarração de Ganhos (Ganhos vs. Criadores)

| ID Ganho | Ganho Desejado pelo Cliente | Criador Específico no Produto | Funcionalidade Correspondente no PRD |
|---|---|---|---|
| **GANHO-01** | Código SVG semântico e limpo em tempo real com botão de copiar em 1 clique. | Painel lateral retrátil com visualizador de código SVG sincronizado em tempo real. | Inspetor de Código SVG ao Vivo (`Live SVG Inspector`) |
| **GANHO-02** | Experiência de desenho imersiva e sem lag com atalhos intuitivos de estúdio. | Interface Dark minimalista focada no canvas, engine a 60fps e atalhos ergonômicos. | Estúdio & Controles Ergonômicos (`Studio UI & Shortcuts`) |
| **GANHO-03** | Galeria visual integrada com salvamento no navegador para reabrir e gerenciar. | Galeria com cartões visuais dos desenhos salvos em IndexedDB com prévia interativa. | Galeria Visual Local (`Artwork Gallery Manager`) |
