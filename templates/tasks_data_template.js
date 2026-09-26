window.__TASKS_DATA__ = {
  "project": {
    "name": "Nome do Seu Projeto",
    "summary": "Resumo do projeto em 1 parágrafo descrevendo o objetivo e público.",
    "version": "1.0.0",
    "last_updated": "2026-09-24",
    "metrics": {
      "total_tasks": 5,
      "completed_tasks": 0,
      "progress_percentage": 0
    }
  },
  "milestones": [
    {
      "id": "m1_fundacao",
      "title": "Marco 1: Fundação, Narrativa & Planejamento Sistêmico",
      "order": 1
    },
    {
      "id": "m2_design_arte",
      "title": "Marco 2: Design UI/UX & Direção de Arte",
      "order": 2
    },
    {
      "id": "m3_backend_core",
      "title": "Marco 3: Backend Core & Testes",
      "order": 3
    },
    {
      "id": "m4_frontend_ui",
      "title": "Marco 4: Frontend & Integração",
      "order": 4
    },
    {
      "id": "m5_auditoria_growth",
      "title": "Marco 5: Auditoria & Go-to-Market",
      "order": 5
    }
  ],
  "columns": [
    {
      "id": "todo",
      "title": "Backlog / A Fazer"
    },
    {
      "id": "in_progress",
      "title": "Em Desenvolvimento"
    },
    {
      "id": "review",
      "title": "Em Revisão & Auditoria"
    },
    {
      "id": "done",
      "title": "Concluído / Entregue"
    }
  ],
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Fundação, Narrativa, Canvas Sistêmico e Git Imediato",
      "description": "Entrevista passo a passo (/grill-me) da linha lógica do projeto, criação imediata do repo no GitHub via CLI (gh repo create --private), elaboração do Canvas da Proposta de Valor (fit 1:1), Business Model Canvas com auditoria cruzada (Relacionamento x Canais, Atividades x Recursos x Parceiros) e PRD derivado.",
      "status": "todo",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "Linha lógica do projeto consolidada em docs/NARRATIVE_STORYTELLING.md",
        "Repositório remoto privado criado e sincronizado via GitHub CLI (gh repo create --private)",
        "Canvas da Proposta de Valor (fit 1:1) e Business Model Canvas com auditoria cruzada preenchidos",
        "PRD.md e tasks.json com requisitos funcionais derivados das Atividades Principais do Canvas"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-24",
      "completed_at": null
    },
    {
      "id": "TASK-002",
      "title": "Design UI/UX no Stitch e Direção de Arte de Imagens",
      "description": "Especificar DESIGN_SYSTEM_STITCH.md, gerar protótipos no Google Stitch e produzir ativos visuais com estilo artístico unificado.",
      "status": "todo",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "Protótipo gerado e validado no Google Stitch",
        "Direção de Arte definida com fórmula canônica de prompts",
        "Ativos visuais gerados mantendo consistência estética"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-24",
      "completed_at": null
    },
    {
      "id": "TASK-003",
      "title": "Backend Core em Python (FastAPI) e Testes Automatizados",
      "description": "Provisionar ambiente com uv, implementar modelos Pydantic, rotas de API essenciais e validar com testes automatizados passando.",
      "status": "todo",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Servidor FastAPI rodando localmente com documentação /docs acessível",
        "Testes automatizados unitários/integração executando com 100% de aprovação"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-24",
      "completed_at": null
    },
    {
      "id": "TASK-004",
      "title": "Frontend UI e Integração Completa com o Backend",
      "description": "Desenvolver interface visual consumindo o backend FastAPI, espelhando o protótipo do Stitch e integrando os ativos da Direção de Arte.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Interface responsiva funcional sem erros no console",
        "Fluxos do usuário navegáveis de ponta a ponta com dados reais da API"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-24",
      "completed_at": null
    },
    {
      "id": "TASK-005",
      "title": "Auditoria Estrita Tier 3, Telemetria Real e Go-to-Market",
      "description": "Auditar indicadores de aceite, configurar eventos reais em analytics.json, validar gateways de pagamento e seguir Git Playbook para release.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "Cartões de Configuração Guiada gerados para credenciais sensíveis",
        "Eventos de telemetria catalogados e testados",
        "Auditoria de conformidade com os 21 princípios aprovada"
      ],
      "audit_confirmed": false,
      "created_at": "2026-09-24",
      "completed_at": null
    }
  ]
};
