# Business Model Canvas Sistêmico & Integrado: DrawSVG Studio

> **Metodologia Sistêmica Sebrae Startups**: O Business Model Canvas não é uma colcha de retalhos isolada; é uma engrenagem viva com **auditoria cruzada obrigatória**.  
> **Regra Suprema**: Toda estratégia de relacionamento exige um canal; todo compromisso assumido em Proposta de Valor, Relacionamento, Canais e Receitas gera uma **Atividade Principal compulsória**; toda atividade demanda um **Recurso Principal**; e atividades/recursos que não fazemos internamente devem ser absorvidos por **Parcerias Estratégicas**.

---

## 1. Segmentos de Clientes
- **Perfil do Cliente Principal (Beachhead / Uso Próprio)**: O próprio criador (Bruno), quadrinista e criador multimídia com alta demanda diária por geração de assets visuais vetoriais puros para projetos digitais, quadrinhos e interfaces web.
- **Segmentos Secundários / Expansão Comunitária**: Desenvolvedores front-end, designers de produto, ilustradores e criadores de conteúdo que buscam uma alternativa rápida, leve e sem fricção a softwares vetoriais pesados.
- **Comportamento & Momento de Adoção**: No momento em que o criador precisa ilustrar livremente sem as amarras de nós Bézier e precisa copiar na hora o código `<svg>` limpo para colar no seu projeto ou salvar em sua galeria de referências.

---

## 2. Proposta de Valor (Importada do Canvas de Proposta de Valor)
*Conexão direta com [`docs/VALUE_PROPOSITION_CANVAS.md`](./VALUE_PROPOSITION_CANVAS.md):*

- **Oferta Central**: Um estúdio web de pintura e desenho digital focado, intuitivo e com sensação de aplicativo tradicional (camadas, pincéis, borracha, balde de preenchimento, seleção), gerando e sincronizando código SVG limpo e semântico em tempo real, com galeria visual para salvar criações localmente.
- **Aliviadores de Dor Ativos**: 
  - Elimina a rigidez e a complexidade de lidar com nós Bézier em editores vetoriais pesados (DOR-01).
  - Permite desenhar e pintar em camadas vetoriais com a simplicidade e fluidez de apps de bitmap (DOR-02).
  - Acaba com a burocracia de exportações manuais através da cópia do código SVG em 1 clique e downloads diretos em `.svg` e `.png` (DOR-03).
- **Criadores de Ganho Ativos**: 
  - Código SVG limpo, estruturado e legível em tempo real no painel lateral retrátil (GANHO-01).
  - Prancheta imersiva e responsiva a 60fps com atalhos de estúdio e tema dark elegante (GANHO-02).
  - Galeria visual integrada com salvamento no navegador para reabrir, renomear e gerenciar desenhos (GANHO-03).
- **Diferencial Competitivo / Moat**: A simbiose perfeita entre a ergonomia de pintura analógica/quadrinhos e a precisão do código vetorial reativo imediato, sem dependência de softwares pesados ou logins obrigatórios.

---

## 3 & 4. Matriz Integrada: Relacionamento com o Cliente & Canais

> [!IMPORTANT]
> **Regra de Rastreabilidade**: Relacionamento é a estratégia de engajamento do usuário; o Canal é o meio físico ou digital por onde essa estratégia acontece. Toda linha abaixo tem canal definido e desdobra em uma Atividade Principal no Bloco 6.

| Momento da Jornada | Estratégia de Relacionamento | Canal(is) de Execução | Desdobramento em Atividade Principal |
|---|---|---|---|
| **Antes da Adoção (Atração / Conscientização)** | Portfólio público do criador, demonstrações visuais e compartilhamento de artes vetorizadas geradas no app | Repositório público no GitHub, Portfólio Web pessoal e Redes Sociais | Publicação de demonstrações práticas e documentação no GitHub |
| **Antes da Adoção (Experimentação Direta)** | Acesso imediato sem fricção: o usuário entra e já começa a desenhar em menos de 3 segundos | Aplicação web online (GitHub Pages / Vercel) | Deploy contínuo e manutenção de build web rápido |
| **Durante o Uso (Ativação / Aha Moment)** | Interface limpa e minimalista com código SVG sendo gerado ao vivo à direita no primeiro traço | Painel lateral do app com visualizador reativo e botão "Copiar SVG" | Manutenção da engine reativa de sincronização SVG |
| **Depois do Uso (Retenção & Produtividade)** | Preservação automática do trabalho na galeria visual do navegador | Galeria local integrada via IndexedDB | Manutenção do sistema de persistência e armazenamento local |
| **Depois do Uso (Comunidade & Evolução)** | Desenvolvimento aberto, acolhimento de sugestões e issues técnicas | Issues e Pull Requests no GitHub | Triagem de issues e melhorias no repositório aberto |

---

## 5. Fontes de Receita & Modelo de Sustentabilidade
- **Posicionamento**: 100% gratuito e open-source para sempre como portfólio pessoal e ferramenta de autoridade para o criador.
- **Monetização Indireta (Capital de Reputação & Autoridade)**: Atração de projetos de design de alto valor, consultorias criativas, desenvolvimento técnico e destaque profissional como quadrinista e criador multimídia.
- **Sustentabilidade Operacional**: Arquitetura ultra-leve com custo zero de infraestrutura e hospedagem (hospedagem estática gratuita via GitHub Pages / Vercel).

---

## 6. Atividades Principais (Motor Operacional — Auditoria Compulsória)

> [!CAUTION]
> **LEI DO DESDOBRAMENTO OPERACIONAL**:
> Esta tabela audita e consolida 100% dos compromissos operacionais assumidos em Proposta de Valor, Relacionamento, Canais e Sustentabilidade.

| ID | Origem do Compromisso | Atividade Operacional Específica | Reflexo Técnico no PRD / Backend / Front |
|---|---|---|---|
| **ATIV-01** | Proposta de Valor (Alívio DOR-01 e DOR-02) | Desenvolver o motor de desenho livre com pincéis, borracha, preenchimento e camadas vetoriais | Módulo Canvas & Camadas (`DrawingEngine` e `LayerSystem`) |
| **ATIV-02** | Proposta de Valor (Criador GANHO-01) | Construir o inspetor e gerador de código SVG em tempo real com realce e cópia em 1 clique | Painel retrátil `SvgInspector` com syntax highlighting |
| **ATIV-03** | Proposta de Valor (Alívio DOR-03) | Desenvolver o hub de exportação (.svg puro, código copiado e renderização PNG) | Módulo `ExportHub` com download e exportação de blob |
| **ATIV-04** | Proposta de Valor (Criador GANHO-03) | Implementar a galeria visual local com prévia de cards e gerenciamento no navegador | Módulo `GalleryManager` integrado a IndexedDB/LocalStorage |
| **ATIV-05** | Canais & Adoção sem Fricção | Configurar pipeline de CI/CD para deploy automático da aplicação estática | GitHub Actions / Vercel Deployment Playbook |
| **ATIV-06** | Relacionamento & Portfólio Aberto | Manter documentação técnica clara, README visual e roteiro de contribuição | Documentação em `README.md` e guia de uso |

---

## 7. Recursos Principais (Mapeamento Atividade ➔ Recurso)

| ID Atividade | Recurso Indispensável | Categoria do Recurso | Detalhamento / Especificação |
|---|---|---|---|
| **ATIV-01** | Algoritmos de traçado vetorial suave e renderização | Intelectual / Código | Algoritmos de simplificação de caminhos (Ramer-Douglas-Peucker / Chaikin) |
| **ATIV-02** | Biblioteca de serialização e formatação de SVG | Intelectual / Código | Módulo JS de parsing limpo da árvore de elementos SVG |
| **ATIV-03** | APIs nativas do navegador (Clipboard, Canvas2D, Blob) | Tecnológico | Suporte nativo a cópia de texto assíncrona e exportação de imagem |
| **ATIV-04** | Banco de dados local do cliente | Tecnológico | IndexedDB com fallback para LocalStorage para alta capacidade de armazenamento |
| **ATIV-05** | Plataforma de hospedagem e automação | Infraestrutura | GitHub Actions e GitHub Pages / Vercel (camada gratuita) |
| **ATIV-06** | Tempo de curadoria e portfólio | Humano | Bruno como autor e mantenedor do projeto |

---

## 8. Parcerias Estratégicas (Deslocamento Operacional de Atividades e Recursos)

| Atividade ou Recurso Deslocado | Parceiro Estratégico Responsável | Tipo de Parceria | O que o Parceiro Garante (SLA / Entrega) |
|---|---|---|---|
| Hospedagem da aplicação web e CDN | GitHub Pages / Vercel | Plataforma de Nuvem | Distribuição global via CDN com HTTPS automático e uptime de 99.9% |
| Armazenamento e persistência das artes | APIs de Armazenamento do Browser (IndexedDB) | Navegador do Usuário | Zero custo de servidor e privacidade total (dados não saem da máquina do usuário) |
| Versionamento, CI/CD e Comunidade | GitHub | Infraestrutura de Código | Controle de versões, esteira de deploy e fórum de issues/colaboração |

---

## 9. Estrutura de Custos (Derivada dos Recursos e Parcerias)

- **Custos Fixos de Hospedagem**: R$ 0,00 / mês (100% suportado pela camada gratuita do GitHub Pages / Vercel).
- **Custos de Banco de Dados de Servidor**: R$ 0,00 / mês (persistência cliente-lado via IndexedDB no navegador).
- **Custos Variáveis por Usuário**: R$ 0,00 (processamento 100% no cliente, sem custos de API ou tokens).
- **Ponto de Equilíbrio Operacional (Break-Even)**: Imediato (custo de manutenção zero além do tempo criativo do autor).

---

## 10. Checklist de Auditoria Cruzada da IA (Auditoria Estrita)

- [x] **1. Fit Problema-Solução**: Cada dor relevante tem aliviador e cada ganho tem mecanismo gerador (verificado no `VALUE_PROPOSITION_CANVAS.md`).
- [x] **2. Rastreabilidade Relacionamento-Canais**: Estratégias mapeadas com canais claros (GitHub, Portfólio, Web App).
- [x] **3. Desdobramento de Atividades**: Todas as promessas geraram Atividades Principais (ATIV-01 a ATIV-06).
- [x] **4. Vinculação Atividade-Recurso**: Cada Atividade Principal possui seus recursos explicitados no Bloco 7.
- [x] **5. Revisão de Parcerias**: Infraestrutura delegada para GitHub Pages/Vercel e navegador do cliente.
- [x] **6. Ponte com o PRD**: As Atividades Principais estão prontas para virar requisitos no `PRD.md` e tarefas no `tasks.json`.
