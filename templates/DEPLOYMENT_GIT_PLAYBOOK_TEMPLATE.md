# Playbook de Git, Branches, PRs & Deploy: [Nome do Projeto]

> **Princípio Fundamental (Item 14)**: As informações de deploy, branch, pull request, commit e validação de "Go/No-Go" devem estar permanentemente estruturadas, previsíveis e organizadas para evitar qualquer perda ou retrabalho.

---

## 0. Inicialização Obrigatória no GitHub via CLI (Marco 1 — Minuto Zero)

Todo novo projeto nascido deste framework deve ser versionado localmente e conectado a um repositório remoto privado no GitHub imediatamente no início do Marco 1:

```powershell
# 1. Verificar autenticação da CLI do GitHub
gh auth status

# 2. Inicializar o repositório Git local e criar commit inicial da Fundação
git init
git add .
git commit -m "feat: marco 1 - fundacao, narrativa e planejamento inicial"

# 3. Criar repositório remoto privado e disparar o push inicial
gh repo create [nome-do-projeto] --private --source=. --remote=origin --push
```

> **Regra de Ouro**: A IA nunca posterga o envio para o GitHub para os marcos finais. O backup na nuvem e o versionamento existem desde o primeiro minuto.

---

## 1. Estratégia de Branches

Adotamos um fluxo baseado em **Trunk-Based simplificado com branches de funcionalidade**:

```
main (Produção estável e deployada)
  ▲
  │ Pull Request aprovado + Testes OK
  │
feat/nome-da-feature ou fix/nome-do-bug (Branches de trabalho isoladas)
```

- **`main`**: Código em produção. Protegida contra pushes diretos desavisados.
- **`feat/descricao-curta`**: Novas funcionalidades (ex: `feat/stripe-checkout`).
- **`fix/descricao-curta`**: Correção de bugs (ex: `fix/mobile-kanban-overflow`).
- **`docs/descricao-curta`**: Atualizações de documentação e templates.

---

## 2. Convenção de Commits Semânticos

A IA e os desenvolvedores devem utilizar mensagens atômicas seguindo a convenção [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Finalidade | Exemplo |
|---|---|---|
| `feat:` | Nova funcionalidade para o usuário | `feat: adiciona calculo de margem no modelo financeiro` |
| `fix:` | Correção de bug em código existente | `fix: resolve falha de sincronizacao no tasks.json` |
| `docs:` | Mudanças em arquivos de documentação | `docs: atualiza PRD com novos eventos de telemetria` |
| `refactor:` | Refatoração de código sem mudar comportamento | `refactor: modulariza componentes do dashboard html` |
| `test:` | Adição ou ajuste de testes | `test: inclui testes unitarios para webhook do stripe` |
| `chore:` | Tarefas de build, dependências ou configs | `chore: atualiza versoes de pacotes no package.json` |

---

## 3. Padrão de Pull Request (PR)

Ao abrir um Pull Request (utilizando a CLI `gh` ou via interface do GitHub), a descrição deve conter:

```markdown
## 🎯 O que esta PR faz?
[Resumo em 2 a 3 linhas do escopo das alterações]

## 📋 Tarefas Relacionadas
- Closes [ID da Tarefa no tasks.json, ex: TASK-003]

## 🧪 Como testar?
1. Execute `comando para subir aplicação`.
2. Acesse a rota `/exemplo` e verifique [comportamento esperado].

## 🔍 Checklist de Auditoria (Tier 3)
- [ ] O código não contém dados sensíveis ou tokens expostos.
- [ ] O `tasks.json` foi atualizado.
- [ ] Os testes locais passaram sem erro.
```

---

## 4. Checklist de "Go / No-Go" para Deploy em Produção

Antes de disparar ou aprovar o deploy para ambiente de produção, este checklist rigoroso deve receber parecer favorável:

| Critério de Verificação | Responsável | Status (Go / No-Go) |
|---|---|---|
| **1. Segurança de Segredos**: As variáveis de produção estão devidamente configuradas no painel da hospedagem e ausentes no repositório? | Humano / IA | `[ ] GO` |
| **2. Testes de Fumaça (Smoke Tests)**: Os fluxos principais (login, uso da IA e checkout de pagamento) funcionam em staging? | IA / Tier 3 | `[ ] GO` |
| **3. Webhooks & Callbacks**: Os webhooks de pagamento estão apontando para as URLs de produção com as chaves corretas? | Humano | `[ ] GO` |
| **4. Telemetria Ativa**: Os eventos de analytics estão sendo disparados corretamente? | IA / Tier 2 | `[ ] GO` |
| **5. Plano de Rollback**: Em caso de falha imediata, há um commit estável anterior identificado para reversão rápida? | IA | `[ ] GO` |
