# Tech Stack & Arquitetura Técnica: DrawSVG Studio

> **Versão**: 1.0.0  
> **Status**: Aprovado  
> **Data de Atualização**: 2026-09-26  

---

## 1. Visão Geral da Arquitetura (Client-Side de Alta Performance)

O DrawSVG Studio adota uma arquitetura **100% Client-Side**, orientada a eventos e otimizada para execução em tempo real a 60fps no navegador.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      INTERFACE DO USUÁRIO & STUDIO UI (SPA)                     │
│               Vite + HTML5 / CSS Moderno (Vanilla) + Lucide Icons               │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ Eventos de Ponteiro (PointerEvents)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MOTOR DE DESENHO VETORIAL LIVRE                         │
│   • Interpolação Catmull-Rom / Bézier para suavização natural                   │
│   • Simplificação Ramer-Douglas-Peucker para código SVG ultra-leve              │
│   • Camadas estruturadas em grupos semânticos SVG (<g id="layer-n">)            │
└───────────────────┬─────────────────────────────────────────┬───────────────────┘
                    │ Serialização DOM em tempo real          │
                    ▼                                         ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────────┐
│      INSPETOR DE CÓDIGO SVG AO VIVO   │ │       GALERIA VISUAL PERSISTENTE      │
│   • Syntax Highlighting semântico     │ │   • Banco de Dados IndexedDB local    │
│   • Cópia instantânea para Clipboard  │ │   • Miniaturas em cache               │
│   • Exportação pura (.svg / .png)     │ │   • Zero envio de dados externos      │
└───────────────────────────────────────┘ └───────────────────────────────────────┘
```

---

## 2. Camadas da Stack Tecnológica

| Camada | Tecnologia Escolhida | Justificativa Técnica |
|---|---|---|
| **Build & Bundler** | **Vite** | Inicialização instantânea, Hot Module Replacement (HMR) ultra-rápido e build otimizado sem sobrecarga. |
| **Linguagem & Lógica** | **JavaScript Moderno (ESModules / Vanilla)** | Performance máxima sem camadas de abstração desnecessárias, controle direto do DOM vetorial e resposta imediata a eventos de desenho. |
| **Estilização & Design Tokens** | **CSS Moderno (Vanilla CSS + Variáveis)** | Controle absoluto de temas (Dark Mode refinado, glassmorphism, ergonomia de estúdio) em conformidade com as diretrizes do projeto. |
| **Ícones do Sistema** | **Lucide Icons** | Conjunto coeso, minimalista e legível de ícones para ferramentas de estúdio (pincel, borracha, balde, camadas, código, galeria). |
| **Persistência Local** | **IndexedDB (via Wrapper leve `idb-keyval` / Nativo)** | Armazenamento assíncrono de alta capacidade no navegador do usuário, eliminando as limitações de 5MB do LocalStorage e garantindo privacidade total. |
| **Hospedagem & CI/CD** | **GitHub Pages / Vercel** | Hospedagem estática com custo zero, SSL automático e deploy automatizado via GitHub Actions a cada push. |

---

## 3. Registro do Cartão Executivo de Decisão de Stack

> [!NOTE]
> Em atendimento estrito à Seção 6 do `AGENTS.md`, a IA avaliou a stack, emitiu o Cartão Executivo e obteve aprovação expressa do Bruno em 2026-09-26.

- **Opção Padrão do Framework**: Backend desacoplado em Python (FastAPI).
- **Alternativa Proposta & Aprovada**: Web App 100% Client-Side (Vite + JS/HTML/CSS + IndexedDB).
- **Racional da Decisão**:
  - Para um aplicativo de pintura e desenho que gera SVG em tempo real a 60fps, a latência de requisições de rede para um servidor degradaria a experiência fluida de desenho.
  - O processamento de traços e a serialização do SVG são nativamente suportados pelas APIs de DOM e Canvas do navegador com altíssima eficiência.
  - Elimina 100% de custos de servidores e infraestrutura (R$ 0,00 perpétuo), permitindo que o projeto permaneça gratuito e open-source no GitHub Pages sem manutenção de backends.
  - Privacidade incondicional: os desenhos do usuário não trafegam por servidores externos.

---

## 4. Matriz de Ferramental: CLIs, Autenticações & MCPs

| Tecnologia / Ferramenta | CLI Oficial | Comando de Verificação | Método de Login / Status | Papel no Projeto |
|---|---|---|---|---|
| **Controle de Versão** | `git` | `git --version` | Chave SSH / GCM | Versionamento do repositório local |
| **Repositório Remoto** | `gh` | `gh auth status` | `brunodarwich` autenticado | Criação de releases e esteira GitHub |
| **Runtime & Pacotes** | `node` / `npm` | `node -v; npm -v` | Instalado no PATH | Build e empacotamento com Vite |
| **Prototipagem UI** | Stitch Web / MCP | N/A | `stitch` / `StitchMCP` | Referência estética para o Marco 2 |

---

## 5. Diretrizes de Otimização e Geração do SVG

1. **Estrutura Limpa**:
   - Elemento raiz com `<svg viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg">`.
   - Camadas organizadas em grupos `<g id="camada-1" opacity="1.0">`.
   - Traços definidos por elementos `<path d="..." stroke="..." stroke-width="..." fill="none" stroke-linecap="round" stroke-linejoin="round" />`.
2. **Suavização e Redução de Ruído**:
   - Aplicação de algoritmo de suavização contínua para evitar cantos serrilhados.
   - Simplificação de pontos adjacentes redundantes para gerar paths concisos e com tamanho de arquivo reduzido.
