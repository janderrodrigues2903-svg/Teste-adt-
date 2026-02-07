# Desafio | Fullstack

O teste consiste em implementar uma lista de contatos e empresas. O projeto, obrigatoriamente, deve ser separado em backend e frontend.

## Backend

O backend **deve** ser desenvolvido em `php` e **deve** conter uma API Rest.

O sistema deve conter as seguintes entidades e seus respectivos campos:

- Usuário
    - Nome: obrigatório para preenchimento
    - E-mail: obrigatório para preenchimento
    - Telefone: não obrigatório
    - Data de nascimento: não obrigatório
    - Cidade onde nasceu: não obrigatório
    - Empresas: obrigatório para preenchimento

- Empresa
    - Nome: obrigatório para preenchimento
    - CNPJ: obrigatório para preenchimento
    - Endereço: obrigatório para preenchimento
    - Usuários: obrigatório para preenchimento

A regra de relacionamento para `Usuário` e `Empresa` deve ser de __n para n__

### Banco
Você **deve** utilizar um banco de dados para o sistema. Pode-se escolher qualquer opção que desejar, mas o seguite cenário deve ser levado em consideração:
- O sistema lida com informações sensíveis e preza pela integridade dos dados
- O sistema lida com diferentes entidades relacionadas

Pedimos para que nos sinalize o motivo da escolha do banco no final do documento


## Frontend
O frontend **deve** ser desenvolvido utilizando `react` e **deve** usar os dados fornecidos pela API.

Você **pode** e, de preferência, **deve** utilizar bibliotecas de terceiros.

Deve-se desenvolver uma página de formulário para cada uma das entidades (`Usuario` e `Empresa`). Também deve ser desenvolvida uma página listando todos os usuários e seus respectivos campos, inclusive todas as empresas de que ele faz parte.

Deve-se ter a possibilidade de filtrar os dados conforme cada um dos campos.

Obs: para facilitar, segue uma proposta de layout, você tem liberdade para desenvolver o layout da forma que achar mais adequado.

## Testes
Testes unitários **devem** ser implementados no backend para validação das operações do CRUD.

Testes unitários **devem** ser implementados no frontend para a tela de exibição dos usuários.

Você pode utilizar o framework de sua preferência tanto para o backend quanto para o frontend.

## Ambiente
Aqui na Contato Seguro, utilizamos __Docker__ nos nossos ambientes, então será muito bem visto caso decida utilizar. Principalmente para que tenhamos o mesmo resultado (mesma configuração de ambiente). Caso desenvolva com docker, nos envie junto com o projeto o `docker-compose.yml` e/ou os `Dockerfile´`s.

## Requisitos mínimos
- As 4 operações CRUD, tanto para entidade `Usuário`, quanto para `Empresa`. Todas as operações devem ter rotas específicas no backend.
- O filtro de registros
- Código legível, limpo e seguindo boas práticas de Orientação a Objetos
- Um dump ou DDL do banco de dados
- Testes unitários

## Requisitos bônus
- Utilizar Docker
- Outras entidades e relacionamento entre entidades. Por exemplo: uma entidade `Relatos` ou `Atividades` que tenha `Usuários` e/ou `Empresas` vinculadas.
- Separação em commits, especialmente com boas mensagens de identificação.

# API Documentation

## Home Route
- **Path:** `/`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: `{"msg": "home"}`

## User Routes

### Get All Users
- **Path:** `/api/user`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: List of users

### Get User by ID
- **Path:** `/api/user/{id}`
- **Parameters:**
 - `id`: User ID
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: User data
 - 400: Bad request
 - 500: Internal server error

### Create User
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

### Update User
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

### Delete User
- **Path:** `/api/user/{id}/delete`
- **Parameters:**
 - `id`: User ID
- **HTTP Method:** DELETE
- **Body:** None
- **Possible Returns:**
 - 200: Deletion confirmation
 - 400: Bad request
 - 500: Internal server error

## Company Routes

### Get All Companies
- **Path:** `/api/company`
- **Parameters:** None
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: List of companies

### Get Company by ID
- **Path:** `/api/company/{id}`
- **Parameters:**
 - `id`: Company ID
- **HTTP Method:** GET
- **Body:** None
- **Possible Returns:**
 - 200: Company data
 - 400: Bad request
 - 500: Internal server error

### Create Company
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

### Update Company
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

### Delete Company
- **Path:** `/api/company/{id}/delete`
- **Parameters:**
 - `id`: Company ID
- **HTTP Method:** DELETE
- **Body:** None
- **Possible Returns:**
 - 200: Deletion confirmation
 - 400: Bad request
 - 500: Internal server error
