# Teste Técnico

## 1. VISÃO GERAL
Este documento tem como objetivo avaliar suas habilidades fundamentais na área de Quality Assurance. Buscamos entender sua capacidade analítica para identificar inconsistências entre requisitos e implementação, além de sua habilidade técnica na criação de testes automatizados.

Você será avaliado nas seguintes competências:

- **Análise Crítica e Report de Bugs**: Capacidade de identificar discrepâncias entre a regra de negócio e a aplicação técnica.
- **Estratégia de Testes**: Cobertura de cenários (caminhos felizes e tristes).
- **Automação (Foco em API e E2E)**: Estruturação lógica e técnica utilizando Cypress.
- **Documentação**: Clareza na escrita de casos de teste e instruções de execução.

## 2. O DESAFIO
O projeto consiste em um CRUD de usuários vinculados a empresas.
O sistema possui um Backend (API) e um Frontend simples.

**Regra de Negócio para Cadastro:**
O formulário de cadastro de usuário deve exigir obrigatoriamente os seguintes campos para garantir a integridade dos dados:
- Nome Completo
- E-mail corporativo
- Telefone
- Data de Nascimento
- Empresa vinculada

## 3. INSTRUÇÕES GERAIS

### Configuração do Ambiente
*Pré-requisitos: Docker e Docker Compose instalados.*

*(Preferencialmente, utilize alguma distribuição **Linux** para a configuração do ambiente e realização dos testes.)*

1. Descompacte o projeto enviado por e-mail e acesse a pasta raiz do projeto via terminal.
2. Na raiz do projeto, execute: `docker-compose up --build -d`.
   - *Nota: O build inicial pode demorar alguns minutos.*
3. Após o build, os serviços estarão disponíveis em:
   - **Frontend:** `http://localhost:5400`
   - **Backend (API):** `http://localhost:8400` (Swagger/Docs não inclusos, guie-se pela seção 5 abaixo).
   - **MySQL:** Porta `3400`.

### Entregáveis Esperados
1. **Repositório no GitHub**: O código da automação deve estar em um repositório público.
2. **Documentação**:
    - **Plano de Teste**: Descreva os cenários que você mapeou utilizando a sintaxe **Gherkin** (BDD).
        - *Atenção:* O Gherkin deve ser usado apenas para fins de **documentação escrita**. Não utilize ferramentas como Cucumber para a execução dos testes.
    - **Relatório de Bugs**: Uma lista detalhada de quaisquer bugs ou inconsistências encontradas durante seus testes (seja na documentação, na API ou no Front).
    - **Instruções**: Como rodar seus testes automatizados.

## 4. DIRETRIZES TÉCNICAS (Júnior ou Superior)

Para este teste, a stack obrigatória é **Cypress**.

**Requisitos de Automação:**
1.  **Testes de API:** Crie testes que validem diretamente os endpoints da API (Status Code, Corpo da resposta, Headers). Queremos ver como você testa o backend isoladamente.
2.  **Testes E2E:** Crie cenários críticos navegando pelo Frontend.
3.  **Arquitetura:**
    - **NÃO utilize o padrão Page Objects.**
    - Encorajamos o uso de **Custom Commands** ou **App Actions** (funções simples em JS/TS) para encapsular a lógica repetitiva.
    - Mantenha o código limpo e sem dependências desnecessárias.

*(Para candidatos nível Estágio: A automação é opcional, foque na criação dos casos de teste em Gherkin e na exploração manual para encontrar bugs).*

## 5. DOCUMENTAÇÃO DA API (Endpoints)

*Utilize esta referência técnica para a construção das chamadas de API.*
### Home Route
---
- **Path:** `/`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: `{"msg": "home"}`

### User Routes
---
#### Get All Users
- **Path:** `/api/user`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: List of users

#### Get User by ID
- **Path:** `/api/user/{id}`
- **Parameters:**
 - `id`: User ID
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: User data
 - 400: Bad request
 - 500: Internal server error

#### Create User
- **Path:** `/api/user/create`
- **Parameters:** None
- **HTTP Method:** POST
- **Body:**
 ```json
 {
     "name": "string",
     "e-mail": "string",
     "companies": ["string"]
 }
 ```
- **Possible Returns:**
 - 201: Created user data
 - 400: Bad request
 - 500: Internal server error

#### Update User
- **Path:** `/api/user/{id}/update`
- **Parameters:**
 - `id`: User ID
- **HTTP Method:** PATCH
- **Body:**
 ```json
 {
     "name": "string",
     "e-mail": "string",
     "companies": ["string"]
 }
 ```
- **Possible Returns:**
 - 200: Updated user data
 - 400: Bad request
 - 500: Internal server error

#### Delete User
- **Path:** `/api/user/{id}/delete`
- **Parameters:**
 - `id`: User ID
- **HTTP Method:** DELETE
- **Body:** None
- **Possible Returns:**
 - 200: Deletion confirmation
 - 400: Bad request
 - 500: Internal server error

### Company Routes
---
#### Get All Companies
- **Path:** `/api/company`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: List of companies

#### Get Company by ID
- **Path:** `/api/company/{id}`
- **Parameters:**
 - `id`: Company ID
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: Company data
 - 400: Bad request
 - 500: Internal server error

#### Create Company
- **Path:** `/api/company/create`
- **Parameters:** None
- **HTTP Method:** POST
- **Body:**
 ```json
 {
     "name": "string",
     "cnpj": "string",
     "adress": {
         "cep": "string",
         "country": "string",
         "city": "string",
         "street_location": "string",
         "number": "string",
         "district": "string"
    }
 }
 ```
- **Possible Returns:**
 - 201: Created company data
 - 400: Bad request
 - 500: Internal server error

#### Update Company
- **Path:** `/api/company/{id}/update`
- **Parameters:**
 - `id`: Company ID
- **HTTP Method:** PATCH
- **Body:**
 ```json
 {
     "name": "string",
     "cnpj": "string",
     "adress": {
         "cep": "string",
         "country": "string",
         "state": "string",
         "city": "string",
         "street": "string",
         "number": "string",
         "district": "string"
    }
 }
 ```
- **Possible Returns:**
 - 200: Updated company data
 - 400: Bad request
 - 500: Internal server error

#### Delete Company
- **Path:** `/api/company/{id}/delete`
- **Parameters:**
 - `id`: Company ID
- **HTTP Method:** DELETE
- **Body:** None
- **Possible Returns:**
 - 200: Deletion confirmation
 - 400: Bad request
 - 500: Internal server error


### BOA SORTE!
