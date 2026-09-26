# Design System & Especificação UI/UX: DrawSVG Studio

> **Objetivo**: Especificar a identidade visual, o design system e gerar os prompts estruturados de alta fidelidade para prototipagem no **Google Stitch** ([stitch.withgoogle.com](https://stitch.withgoogle.com)) e implementação front-end.  
> **Status**: Aprovado  
> **Versão**: 1.0.0  
> **Data de Atualização**: 2026-09-26  

---

## 1. Identidade Visual & Design Tokens

### Princípios de Experiência (Amigável a TDAH & Foco Criativo)
- **Sobrecarga Cognitiva Zero**: Ferramentas agrupadas logicamente na lateral esquerda; prancheta central limpa; painéis de código e camadas recolhíveis à direita.
- **Feedback Imediato**: Cada traço desenhado atualiza instantaneamente o código SVG; o botão de cópia oferece confirmação tátil e visual clara.
- **Ergonomia de Estúdio**: Atalhos diretos de teclado para desenhar sem tirar a mão da mesa/prancheta (`B`, `E`, `G`, `V`, `Ctrl+Z`, `Ctrl+Y`).

### Paleta de Cores & Tokens

| Token de Cor | Código HEX | Utilização na Interface |
|---|---|---|
| `surface-ground` | `#09090b` (Zinc 950) | Fundo geral da aplicação e barras de ferramentas |
| `surface-panel` | `#18181b` (Zinc 900) | Cartões, gavetas e painéis flutuantes |
| `surface-border` | `#27272a` (Zinc 800) | Bordas sutis e divisores de seção |
| `accent-primary` | `#0284c7` (Sky 600) | Ferramenta ativa, botões principais de ação |
| `accent-glow` | `#38bdf8` (Sky 400) | Destaques de foco, estados de hover ativos |
| `accent-purple` | `#8b5cf6` (Violet 500) | Tags de camadas e seleções avançadas |
| `state-success` | `#10b981` (Emerald 500) | Feedback de cópia do SVG para o clipboard e salvamento |
| `canvas-paper` | `#ffffff` | Área do canvas de desenho (ou quadriculado de transparência) |
| `text-primary` | `#f4f4f5` (Zinc 100) | Títulos e texto de alta prioridade |
| `text-secondary` | `#a1a1aa` (Zinc 400) | Legendas, atalhos de teclado e valores secundários |

### Tipografia & Hierarquia
- **Títulos e Labels**: *Plus Jakarta Sans* / *Inter* (sem serifa geométrica limpa, peso 600/700).
- **Corpo e Menus**: *Inter* (sem serifa legível, peso 400/500).
- **Inspetor de Código**: *JetBrains Mono* / *Fira Code* (monospaçada com realce sintático para `<path>`, `<g>`, atributos e valores).

---

## 2. Telas Principais do MVP (Mapeamento Funcional)

| ID Tela | Nome da Tela | Finalidade do Usuário | Componentes Críticos |
|---|---|---|---|
| `SCREEN-01` | **Studio Workspace (Canvas Principal)** | Área central onde o usuário desenha livremente com pincéis, borracha, balde e camadas | Prancheta 60fps, barra superior de controle, barra lateral esquerda de ferramentas e seletor de cores flutuante |
| `SCREEN-02` | **Inspetor de Código SVG ao Vivo** | Painel lateral retrátil à direita com a árvore SVG em tempo real | Visualizador com numeração de linhas, badge de tamanho em KB, botão "Copiar SVG" e downloads (.svg / .png) |
| `SCREEN-03` | **Gerenciador de Camadas (Layers Panel)** | Aba lateral para organizar os grupos vetoriais `<g>` | Lista de camadas com drag-and-drop, visibilidade (olho), bloqueio (cadeado), opacidade e botão de nova camada |
| `SCREEN-04` | **Gaveta da Galeria Visual (IndexedDB)** | Visualização de todos os desenhos salvos no navegador | Grade de cards com miniaturas visuais, data, botão "Abrir no Estúdio", "Duplicar" e "Excluir" |

---

## 3. Direção de Arte & Geração de Ativos Visuais (Imagens)

> **Assinatura Visual Única**: *Modern Minimalist Creative Studio* — estética refinada Dark Mode, elementos com gradientes ciano/índigo sutis, formas limpas, contraste balanceado e acabamento premium.

### Fórmula Canônica de Prompt
```
[Sujeito Central em Ação] + [Composição Minimalista com Foco no Canvas/Vetor] + [Estilo Artístico Studio Digital Dark Minimalist] + [Iluminação Suave de Estúdio com Glow Ciano/Violeta] + [Paleta de Cores Zinc 950 com Acentos Sky 400 e Violet 500] + [Aspect Ratio Específico]
```

### Catálogo de Ativos Visuais do MVP
| ID Ativo | Nome do Ativo | Finalidade no Produto | Proporção (Aspect Ratio) | Destino do Arquivo |
|---|---|---|---|---|
| `IMG-01` | `drawsvg_studio_logo` | Logotipo e ícone oficial do DrawSVG Studio | 1:1 | `public/assets/images/logo.png` |
| `IMG-02` | `empty_gallery_artwork` | Ilustração elegante para estado vazio da galeria | 4:3 | `public/assets/images/empty_gallery.png` |
| `IMG-03` | `drawsvg_hero_banner` | Banner de apresentação e social share do estúdio | 16:9 | `public/assets/images/hero_banner.png` |

---

## 4. Prompt Pronto para o Google Stitch (Web)

*Copie o prompt abaixo e cole diretamente na caixa de geração do [stitch.withgoogle.com](https://stitch.withgoogle.com):*

```markdown
Design an ultra-clean, professional, dark-mode digital painting and vector drawing web studio application named "DrawSVG Studio".

Theme & Aesthetic:
- Background: Deep slate/zinc-950 (#09090b) with zinc-900 panels and subtle zinc-800 borders.
- Accent colors: Electric sky blue (#0284c7 / #38bdf8) and violet highlights.
- Canvas: Centered white drawing paper with a subtle drop shadow and thin border, surrounded by dark workspace.
- Typography: Clean modern sans-serif (Inter / Plus Jakarta Sans) for UI, monospaced (JetBrains Mono) for code. Zero visual clutter, designed for neurodivergent focus.

Key Layout Sections:
1. Top Studio Bar:
   - Left: Logo icon + "DrawSVG Studio" title + dimensions badge (800x600 px).
   - Center: Undo (Ctrl+Z) and Redo (Ctrl+Y) buttons, Clear Canvas, Zoom percentage control.
   - Right: "Save to Gallery" primary button (emerald/sky) and "Open Gallery" folder button with badge counter.

2. Left Vertical Toolbar (Floating Ergonometric Strip):
   - Brush tool (active with blue glow indicator).
   - Eraser tool.
   - Fill bucket tool.
   - Pointer / Selection tool.
   - Color picker disc showing active color (#0284c7) with a quick palette of 6 recent swatches.
   - Stroke thickness slider (2px to 48px) with dynamic circular preview.

3. Right Docked Inspector (Tabbed Split Panel):
   - Tab 1: "Live SVG Code" -> Formatted XML viewer with syntax highlighting (<path d="M120..." fill="none" stroke="#000" />), file size in KB, and a high-contrast "Copy SVG Code" button with copy icon. Below, secondary export buttons: "Export .SVG" and "Export .PNG".
   - Tab 2: "Layers" -> Layer stack list showing "Layer 2 (Inking)", "Layer 1 (Sketch)", with eye icon (toggle visibility), lock icon, opacity slider, and "+ Add Layer" button.

4. Slide-over Modal / Drawer (Artwork Gallery):
   - Grid of saved drawings cards showing vector thumbnail previews, title, timestamp, and "Open in Studio" button.
```

---

## 5. Critérios de Aceite de Design & Direção de Arte (Marco 2 DoD)

- [ ] `docs/DESIGN_SYSTEM_STITCH.md` estruturado com paleta Dark refinada, tokens e especificações ergonômicas.
- [ ] Prompt de alta fidelidade para o Google Stitch redigido e pronto para validação.
- [ ] Ativos visuais do MVP (`drawsvg_studio_logo`, `empty_gallery_artwork`, `drawsvg_hero_banner`) gerados com Direção de Arte consistente.
- [ ] `tasks.json` e `tasks_data.js` atualizados com o progresso do Marco 2.
- [ ] Ponto de parada obrigatório acionado para validação estética com o Bruno.
