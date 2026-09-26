# PRD — Product Requirements Document: DrawSVG Studio

> **Status**: Aprovado  
> **Versão**: 1.0.0  
> **Autor/Responsável**: Bruno / Agente de IA  
> **Data de Atualização**: 2026-09-26  

---

## 1. Visão do Produto & Resumo Executivo

O **DrawSVG Studio** é uma aplicação web de desenho e pintura digital desenvolvida para unir a fluidez orgânica de um estúdio de arte tradicional/quadrinhos à precisão do desenvolvimento web moderno, gerando e exibindo código SVG limpo, semântico e otimizado em tempo real.

O produto foi concebido para resolver o gargalo de criadores multimídia, quadrinistas e desenvolvedores que hoje precisam alternar entre softwares pesados e burocráticos (Illustrator, Inkscape) — que engessam o processo criativo com foco em nós Bézier — e softwares de pintura raster (Photoshop, Procreate) — que não produzem vetores escaláveis para a web.

Com interface minimalista Dark refinada, foco absoluto na prancheta de pintura e zero sobrecarga cognitiva (otimizado para perfis com TDAH), o DrawSVG Studio oferece ferramentas essenciais de desenho (pincéis, borracha, preenchimento, seleção, camadas e paleta de cores), um painel retrátil de código SVG sincronizado instantaneamente a cada traço e uma galeria visual local para catalogar, recarregar e exportar artes com um clique.

---

## 2. Personas & Jornada do Usuário

### Persona Principal
- **Nome/Perfil**: Bruno (Criador Multimídia, Quadrinista e Desenvolvedor Front-end).
- **Dores Principais**: 
  - Fadiga com softwares vetoriais pesados que exigem manipulação técnica constante de pontos de ancoragem.
  - Confinamento a bitmaps quando deseja desenhar livremente, perdendo a escalabilidade e a interatividade do código SVG na web.
  - Burocracia para exportar, inspecionar e limpar o código SVG gerado.
- **Objetivos ao usar o produto**: Abrir o navegador, desenhar com naturalidade de estúdio de arte e copiar instantaneamente o código SVG pronto e limpo para colar no seu projeto, além de catalogar suas criações em uma galeria visual pessoal.
- **Gatilho de Conversão**: Ver o código SVG nascer instantaneamente ao lado da tela no primeiro traço, com botão de copiar em 1 clique e zero delay.

### Jornada Chave ("Happy Path")
1. **Descoberta**: O criador abre a URL da aplicação no navegador (carregamento instantâneo, sem telas de cadastro ou barreiras).
2. **Ativação ("Aha! Moment")**: Seleciona o pincel, risca o primeiro traço na prancheta e vê o elemento `<path d="..." />` correspondente surgir e se formatar em tempo real no painel de código lateral.
3. **Engajamento**: Cria novas camadas, experimenta cores, usa a borracha vetorial para refinar contornos, preenche áreas fechadas e ajusta a opacidade.
4. **Retenção & Produtividade**: Clica em "Salvar na Galeria" e vê sua arte registrada com miniatura no armazenamento local do navegador; quando necessário, clica em "Copiar SVG" ou baixa o arquivo `.svg` e renderização `.png`.

---

## 3. Requisitos Funcionais (Escopo do Produto)

| ID | Módulo / Funcionalidade | Descrição & Regra de Negócio | Prioridade (MoSCoW) | Tier IA Indicado |
|---|---|---|---|---|
| `RF-01` | **Prancheta & Engine Vetorial Livre** | Prancheta de desenho com renderização a 60fps. Cada traço é interpolado suavemente e convertido em caminho vetorial (`<path>`) otimizado, sem engasgos. | Must Have | Tier 2 |
| `RF-02` | **Ferramenta de Pincel (Brush)** | Pincel com ajuste dinâmico de espessura (size), opacidade e seletor de cor com histórico recente. | Must Have | Tier 2 |
| `RF-03` | **Borracha Vetorial (Eraser)** | Borracha que apaga caminhos ou segmentos de traço, atualizando a árvore SVG imediatamente. | Must Have | Tier 2 |
| `RF-04` | **Balde de Preenchimento (Fill Bucket)** | Preenchimento vetorial de áreas e formas com a cor selecionada. | Must Have | Tier 2 |
| `RF-05` | **Ferramenta de Seleção / Mover** | Seleção de traços/elementos da camada ativa para reposicionamento e ajuste na tela. | Should Have | Tier 2 |
| `RF-06` | **Gerenciador de Camadas (Layers)** | Sistema de camadas com criação, exclusão, reordenação, ocultação/exibição e ajuste de opacidade. Cada camada gera um grupo `<g id="layer-n">` no SVG. | Must Have | Tier 2 |
| `RF-07` | **Inspetor de Código SVG ao Vivo** | Painel lateral retrátil com visualização do código SVG formatado em tempo real, realce de sintaxe e botão "Copiar SVG" em 1 clique. | Must Have | Tier 2 |
| `RF-08` | **Galeria Visual Local (IndexedDB)** | Painel/gaveta de galeria com miniaturas visuais de todas as artes salvas, data, opção de carregar para a prancheta, renomear e excluir. | Must Have | Tier 2 |
| `RF-09` | **Hub de Exportação Dupla** | Exportação direta do arquivo `.svg` para o computador e renderização em alta resolução `.png`. | Must Have | Tier 2 |
| `RF-10` | **Histórico de Ações (Undo/Redo)** | Pilha de histórico de ações com suporte completo aos atalhos universais `Ctrl+Z` e `Ctrl+Y`. | Must Have | Tier 2 |

---

## 4. Requisitos Não-Funcionais & Conformidade

- **Desempenho**: Tempo de carregamento inicial inferior a 1,5 segundo; taxa de atualização da prancheta constante a 60fps durante o desenho.
- **Privacidade & Segurança**: 100% Client-Side. As criações do usuário nunca saem do dispositivo, sendo persistidas exclusivamente no IndexedDB local do navegador.
- **Acessibilidade & Usabilidade (Amigável a TDAH)**:
  - Interface Dark refinada (tons de slate/zinc escuro) com contraste calculado para foco prolongado e redução de fadiga ocular.
  - Zero sobrecarga cognitiva: ferramentas organizadas ergonomicamente, sem menus suspensos labirínticos ou popups intrusivos.
  - Atalhos de teclado intuitivos (B: pincel, E: borracha, G: balde, V: seleção, Z: desfazer).
- **Escalabilidade Técnica**: Código SVG gerado limpo, sem metadados proprietários, com viewBox responsivo e pronto para uso direto em frameworks web (React, Vue, HTML puro).

---

## 5. Catálogo de Telemetria & Eventos de Uso Local

*Em conformidade com o Princípio 4, os eventos de uso alimentam métricas locais para acompanhamento no dashboard.*

| Nome do Evento | Gatilho de Disparo | Propriedades Registradas | Objetivo de Negócio / UX |
|---|---|---|---|
| `stroke_completed` | Final do traço do pincel | `tool`, `layer_id`, `points_count` | Monitorar fluidez e tempo de traçado |
| `svg_copied_clipboard` | Clique no botão "Copiar SVG" | `svg_length_bytes`, `elements_count` | Medir entrega do valor principal (Aha Moment) |
| `artwork_saved_gallery` | Salvar desenho na galeria | `artwork_id`, `layers_count` | Medir taxa de retenção e produção de artes |
| `artwork_exported` | Download em `.svg` ou `.png` | `format`, `file_size_kb` | Avaliar formato de saída mais utilizado |
| `layer_action` | Criar, apagar ou reordenar camada | `action_type`, `total_layers` | Medir profundidade de uso das ferramentas |

---

## 6. Critérios de Aceite para Auditoria (Definition of Done)

- [ ] A prancheta permite desenhar livremente com pincel e borracha com suavidade de 60fps.
- [ ] O painel lateral de código SVG reflete qualquer traço ou cor alterada em tempo real.
- [ ] O botão "Copiar SVG" transfere a marcação válida para a área de transferência com feedback visual claro.
- [ ] O gerenciador de camadas permite empilhar traços em grupos `<g>` independentes.
- [ ] A galeria local salva as artes no navegador e permite reabri-las para continuar desenhando.
- [ ] A aplicação compila e roda sem erros no console, com Design System consistente e sem quebra de layout.
