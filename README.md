# Teste Técnico - QA Automation

Este projeto é minha solução para o teste técnico de QA, cobrindo os exercícios Web e API com Cypress, JavaScript e Cucumber.

Além da automação, incluí os cenários manuais em Gherkin e uma collection do Postman para a busca de produtos do Advantage Online Shopping.

## Tecnologias

- JavaScript
- Cypress
- Cucumber
- ESBuild
- Postman
- GitHub Actions

## O que foi automatizado

### Web - Automation Exercise

Usei o Automation Exercise para os cenários Web. O Automation Practice informado no enunciado é uma aplicação antiga e o próprio teste permite utilizar uma URL similar quando necessário.

A cobertura automatizada inclui:

- Login válido com usuário temporário
- Login inválido
- Busca por produto existente
- Busca sem resultado
- Inclusão de produto no carrinho
- Remoção de produto do carrinho
- Validação do produto no checkout

Os cenários são independentes. Cada teste monta os próprios pré-requisitos e não depende da execução de outro cenário.

Quando um fluxo precisa de autenticação, o usuário é criado pela API do Automation Exercise e removido no final do cenário.

### API - Trello

A automação executa:

```text
GET https://api.trello.com/1/actions/592f11060f95a3d3d46a987a
```

São validados o status HTTP e o campo `data.list.name`. O valor da lista também é exibido no log da execução.

Caso o endpoint exija autenticação, `trelloKey` e `trelloToken` podem ser informados por variáveis de ambiente.

### API - Advantage Online Shopping

A automação cobre o endpoint:

```text
GET /catalog/api/v1/products/search
```

Os cenários verificam:

- Busca válida e aderência dos produtos ao termo pesquisado
- Busca por produto inexistente
- Status HTTP
- Content-Type
- Campos obrigatórios do produto

A mesma busca também está disponível na collection do Postman.

## Cenários manuais

A pasta `manual` possui 17 cenários em Gherkin.

Mantive os cenários que considerei mais relevantes para o exercício, cobrindo:

- Busca
- Carrinho
- Checkout
- API
- Consistência entre Web e API

A ideia foi ter uma cobertura ampla sem transformar o teste técnico em uma regressão completa do e-commerce.

## Estrutura

```text
Teste Tecnico/
├── .github/
│   └── workflows/
│       └── qa.yml
├── cypress/
│   ├── e2e/
│   │   ├── features/
│   │   │   ├── api/
│   │   │   │   ├── AdvantageSearch.feature
│   │   │   │   └── Trello.feature
│   │   │   └── web/
│   │   │       └── AutomationExercise.feature
│   │   └── step_definitions/
│   │       ├── api/
│   │       │   ├── AdvantageSearchSteps.js
│   │       │   └── TrelloSteps.js
│   │       └── web/
│   │           └── AutomationExerciseSteps.js
│   ├── factories/
│   │   └── UserDataFactory.js
│   ├── pages/
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── LoginPage.js
│   │   └── ProductsPage.js
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   └── utils/
│       └── ApiResponseUtils.js
├── manual/
│   └── advantage-web-api-manual-tests.txt
├── postman/
│   └── Advantage-Product-Search.postman_collection.json
├── .cypress-cucumber-preprocessorrc.json
├── .gitignore
├── cypress.config.js
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Instalação

Depois de clonar o repositório:

```bash
npm install
```

Para validar o binário do Cypress:

```bash
npm run verify
```

## Execução

Todos os testes:

```bash
npm test
```

Somente Web:

```bash
npm run test:web
```

Somente API:

```bash
npm run test:api
```

Smoke:

```bash
npm run test:smoke
```

Regressão:

```bash
npm run test:regression
```

Modo interativo:

```bash
npm run cy:open
```

## Trello com autenticação

PowerShell:

```powershell
$env:CYPRESS_trelloKey="sua-chave"
$env:CYPRESS_trelloToken="seu-token"
npm run test:api
```

Linux/macOS:

```bash
CYPRESS_trelloKey="sua-chave" CYPRESS_trelloToken="seu-token" npm run test:api
```

As credenciais não ficam armazenadas no projeto.

## Relatórios e evidências

O Cucumber gera os relatórios em:

```text
reports/cucumber-report.html
reports/cucumber-report.json
```

Em execução headless, o Cypress também grava vídeos em:

```text
cypress/videos/
```

Screenshots de falha ficam em:

```text
cypress/screenshots/
```

Essas pastas são ignoradas pelo Git e geradas somente durante a execução.

No GitHub Actions, reports, screenshots e vídeos são publicados como artefatos da execução.

## Decisões do projeto

Separei features, step definitions, Page Objects e massa de teste para deixar cada responsabilidade clara sem criar camadas que o tamanho do projeto não precisa.

Os arquivos de steps usam o sufixo `Steps`, as páginas usam o sufixo `Page` e a massa dinâmica fica centralizada em `UserDataFactory`.

Evitei `cy.wait()` com tempo fixo. Os testes aguardam elementos e estados da aplicação.

Como o Automation Exercise carrega recursos externos de publicidade que podem prender o evento de carregamento da página, esses hosts são bloqueados no `cypress.config.js`. O `pageLoadTimeout` também foi mantido curto para uma indisponibilidade real falhar rápido.

Os ambientes utilizados são públicos e podem sofrer alterações ou indisponibilidades fora do controle do projeto.
