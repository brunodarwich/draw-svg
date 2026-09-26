window.__TASKS_DATA__ = {
  "project": {
    "name": "DrawSVG Studio",
    "summary": "Estúdio web de pintura e desenho digital focado em produtividade para criadores multimídia e desenvolvedores, gerando código SVG limpo e semântico em tempo real com camadas, ferramentas analógicas e galeria visual local.",
    "version": "1.0.0",
    "last_updated": "2026-09-26",
    "metrics": {
      "total_tasks": 5,
      "completed_tasks": 2,
      "progress_percentage": 40
    }
  },
  "milestones": [
    { "id": "m1_fundacao", "title": "Marco 1: Fundação, Narrativa & Planejamento Sistêmico", "order": 1 },
    { "id": "m2_design_arte", "title": "Marco 2: Design UI/UX & Direção de Arte", "order": 2 },
    { "id": "m3_backend_core", "title": "Marco 3: Engine Vetorial Core & Algoritmos", "order": 3 },
    { "id": "m4_frontend_ui", "title": "Marco 4: Frontend Studio & Galeria Local", "order": 4 },
    { "id": "m5_auditoria_growth", "title": "Marco 5: Auditoria & Go-to-Market", "order": 5 }
  ],
  "columns": [
    { "id": "todo", "title": "Backlog / A Fazer" },
    { "id": "in_progress", "title": "Em Desenvolvimento" },
    { "id": "review", "title": "Em Revisão & Auditoria" },
    { "id": "done", "title": "Concluído / Entregue" }
  ],
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Fundação, Narrativa, Canvas Sistêmico e Git Imediato",
      "description": "Condução do /grill-me passo a passo, estruturação da narrativa do criador, Canvas da Proposta de Valor com fit 1:1, Business Model Canvas integrado, Cartão Executivo de Decisão de Stack, PRD, TECH_STACK, FINANCIAL_MODEL e versionamento no GitHub.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "docs/NARRATIVE_STORYTELLING.md estruturado com base nas respostas do criador",
        "docs/VALUE_PROPOSITION_CANVAS.md com amarração estrita 1:1 entre dores e aliviadores",
        "docs/BUSINESS_MODEL_CANVAS.md com auditoria cruzada e desdobramento operacional completo",
        "Repositório privado criado e sincronizado via GitHub CLI (https://github.com/brunodarwich/draw-svg)",
        "PRD.md, TECH_STACK.md, FINANCIAL_MODEL.md e SUMMARY.md consolidados"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-002",
      "title": "Design UI/UX no Stitch e Direção de Arte Visual",
      "description": "Elaboração do docs/DESIGN_SYSTEM_STITCH.md, especificações de telas (Studio, Camadas, Inspetor SVG e Galeria), prompts do Stitch e ativos visuais unificados.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "DESIGN_SYSTEM_STITCH.md estruturado com paleta dark minimalista e ergonomia para TDAH",
        "Prompt de alta fidelidade para o Google Stitch estruturado",
        "Direção de Arte definida e ativos visuais gerados com coerência estilística unificada (logo, empty state e banner)"
      ],
      "audit_confirmed": true,
      "created_at": "2026-09-26",
      "completed_at": "2026-09-26"
    },
    {
      "id": "TASK-003",
      "title": "Motor de Desenho Vetorial Livre & Algoritmos de Suavização",
      "description": "Implementação da engine de captura de ponteiro a 60fps, interpolação suave de traços Bézier/Catmull-Rom, simplificação de caminhos Ramer-Douglas-Peucker e serialização para SVG limpo.",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Traçado livre fluido a 60fps sem delay perceptível",
        "Geração de paths vetoriais enxutos com redução de pontos redundantes",
        "Testes automatizados dos algoritmos de geometria e serialização SVG aprovados"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26",
      "completed_at": null
    },
    {
      "id": "TASK-004",
      "title": "Frontend Studio UI: Camadas, Ferramentas, Inspetor e Galeria",
      "description": "Construção da interface de estúdio completa: barra de ferramentas (pincel, borracha, balde, seleção, cor), gerenciador de camadas (<g>), inspetor de código SVG em tempo real com botão de copiar em 1 clique e galeria IndexedDB com cards visuais.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Prancheta de desenho com suporte a atalhos de teclado (B, E, G, V, Ctrl+Z/Y)",
        "Gerenciamento dinâmico de camadas com visibilidade, bloqueio e opacidade",
        "Painel lateral de código SVG com sincronização reativa e cópia instantânea",
        "Galeria persistente no navegador salvando e carregando artes sem perda de dados"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26",
      "completed_at": null
    },
    {
      "id": "TASK-005",
      "title": "Auditoria Estrita Tier 3, Telemetria e Deploy no GitHub Pages",
      "description": "Revisão e auditoria de código, catálogo de eventos de uso, configuração de workflow de CI/CD via GitHub Actions e publicação no GitHub Pages.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "Auditoria de conformidade com os princípios de ergonomia e zero sobrecarga",
        "Exportação dupla (.svg puro e renderização .png) testada e validada",
        "Deploy automatizado no GitHub Pages ativo e acessível publicamente"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-26",
      "completed_at": null
    }
  ]
};
