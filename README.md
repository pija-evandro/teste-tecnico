# Teste Técnico - QA Automation

Este projeto é minha solução para o teste técnico de QA, cobrindo automação Web e API com Cypress, JavaScript e Cucumber.

Além da automação, incluí cenários manuais em Gherkin e uma collection do Postman para a API de busca de produtos do Advantage Online Shopping.

## Tecnologias

- JavaScript
- Cypress
- Cucumber
- ESBuild
- AJV
- Postman
- GitHub Actions

## Cobertura automatizada

### Web - Automation Exercise

Usei o Automation Exercise para os cenários Web. O Automation Practice informado no enunciado é uma aplicação antiga e o exercício permite utilizar uma URL similar quando necessário.

A cobertura inclui:

- Login válido com usuário temporário
- Login com credenciais inválidas
- Busca por produto existente
- Busca sem resultado
- Inclusão de produto no carrinho
- Validação de nome, preço, quantidade e total no carrinho
- Remoção de produto do carrinho
- Validação do produto e dos valores na revisão do checkout
- Tentativa de checkout com carrinho vazio

Os cenários são independentes e montam seus próprios pré-requisitos.

Nos fluxos que precisam de autenticação, a massa é gerada pela `UserDataFactory`. O usuário é criado pela API do Automation Exercise antes do cenário e removido ao final da execução.

### API - Trello

A automação executa:

```text
GET https://api.trello.com/1/actions/592f11060f95a3d3d46a987a
```

São validados:

- Status HTTP
- Campo `data.list.name`
- Valor esperado da lista

O nome da lista também é exibido durante a execução.

Caso o endpoint exija autenticação, `trelloKey` e `trelloToken` podem ser informados por variáveis de ambiente e não ficam armazenados no projeto.

### API - Advantage Online Shopping

A automação cobre:

```text
GET /catalog/api/v1/products/search
```

A comunicação com a API fica centralizada em um Service Object, evitando chamadas HTTP espalhadas pelos steps.

A cobertura inclui:

- Busca válida por nome
- Busca por produto inexistente
- Parâmetro vazio
- Parâmetro ausente
- Entrada incomum
- Variação de header `Accept`
- Método não suportado
- Status e formato da resposta
- Validação de contrato com JSON Schema
- Campos obrigatórios dos produtos
- Consistência entre a categoria retornada e seus produtos

A validação de contrato utiliza AJV e considera tanto a estrutura das categorias quanto dos produtos.

### Known issues

Durante os testes negativos da API pública do Advantage foram identificadas situações em que o serviço retorna HTTP 500 para entradas inválidas:

- Busca sem o parâmetro `name`
- Solicitação com `Accept: application/xml`
- Uso de `POST` no recurso de busca

Esses cenários foram mantidos automatizados com a tag `@knownIssue`.

Eles ficam fora da execução padrão para não transformar uma limitação conhecida do ambiente externo em bloqueio da suíte, mas podem ser reproduzidos separadamente.

## Postman

A collection:

```text
postman/Advantage-Product-Search.postman_collection.json
```

possui cenários positivos, negativos e known issues.

Além das validações de status e conteúdo, a collection cobre:

- Parâmetro normal, vazio e ausente
- Header suportado e não suportado
- Métodos HTTP
- Busca sem resultado
- JSON Schema
- Consistência entre categoria e produtos

## Cenários manuais

O arquivo:

```text
manual/advantage-web-api-manual-tests.txt
```

contém os cenários manuais em Gherkin.

Eles foram escritos com foco em comportamento e resultado esperado, evitando transformar o Gherkin em uma sequência de ações de interface ou detalhes técnicos da API.

A cobertura passa por busca, carrinho, checkout, serviço de catálogo, consistência entre canais e cenários de limite e robustez.

## Estrutura

```text
.
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
│   ├── schemas/
│   │   ├── AdvantageProductSchema.json
│   │   └── AdvantageSearchResponseSchema.json
│   ├── services/
│   │   ├── AdvantageCatalogService.js
│   │   └── TrelloService.js
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
├── package-lock.json
└── README.md
```

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Instalação

Depois de clonar o repositório:

```bash
npm ci
```

O projeto mantém o `package-lock.json` versionado para garantir uma instalação reproduzível localmente e no CI.

Para validar o binário do Cypress:

```bash
npm run verify
```

## Execução

Suíte padrão:

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

Known issues da API:

```bash
npm run test:known-issues
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

As credenciais não ficam armazenadas no repositório.

## Integração contínua

A pipeline está configurada no GitHub Actions e é executada para Pull Requests direcionados à `master` e após alterações integradas na própria `master`.

A instalação utiliza `npm ci`.

Os testes de API são executados separadamente dos testes Web.

Antes da execução Web, a pipeline verifica a disponibilidade do Automation Exercise. O preflight não considera apenas o status HTTP: também verifica se a página e a API pública retornaram conteúdo válido.

Isso é necessário porque o ambiente externo pode responder HTTP 200 mesmo quando entrega uma página de bloqueio ou uma resposta diferente da esperada.

Quando o ambiente Web está inválido para execução, os testes Web não são iniciados e o motivo é registrado no summary da pipeline.

Falhas funcionais reais durante uma execução válida continuam causando falha na pipeline.

## Relatórios e evidências

Nas execuções headless, o Cypress pode gerar:

```text
cypress/videos/
cypress/screenshots/
```

Os screenshots são gerados em caso de falha.

Os artefatos de execução configurados na pipeline são publicados pelo GitHub Actions para auxiliar na análise de falhas.

Os arquivos gerados durante os testes não são versionados no repositório.

## Decisões do projeto

A estrutura foi separada entre features, step definitions, Page Objects, Service Objects, schemas e geração de massa para manter responsabilidades claras sem adicionar abstrações desnecessárias.

Os Page Objects concentram a interação e as validações relacionadas às páginas Web.

Os Service Objects concentram a comunicação com APIs.

A `UserDataFactory` centraliza a geração da massa dinâmica utilizada pelos testes.

Os testes não dependem da ordem de execução e não utilizam `cy.wait()` com tempo fixo.

Recursos externos que não fazem parte do fluxo testado, como publicidade e serviços de terceiros carregados pelo Automation Exercise, são bloqueados para reduzir interferência no carregamento das páginas.

Como os ambientes utilizados no exercício são públicos, comportamentos externos e indisponibilidades são tratados separadamente de regressões do framework ou da aplicação sob teste.