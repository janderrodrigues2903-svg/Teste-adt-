# Plano de Teste - CRUD de Usuários vinculados a Empresas

**Projeto:** Teste Técnico QA  
**Data:** 03/02/2026  
**Ambiente:** Docker Compose (Frontend: localhost:5400 | Backend: localhost:8400)

---

## Observações Importantes

- Este documento utiliza a sintaxe **Gherkin (BDD)** apenas para fins de **documentação escrita**
- Os testes automatizados serão implementados em **Cypress** sem utilizar ferramentas como Cucumber
- Todos os cenários devem ser testados tanto manualmente quanto via automação

---

## Feature: Cadastro de Usuário (Frontend)

### Cenário: Cadastrar usuário com todos os dados válidos e obrigatórios

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E o modal de cadastro é exibido
E preencho o formulário com dados válidos:
  | Campo          | Valor                    |
  | Nome           | João Silva               |
  | Email          | joao@empresa.com        |
  | Telefone       | 11999999999             |
  | Data Nascimento| 1990-01-01              |
  | Cidade         | São Paulo               |
  | Empresas       | Empresa 1               |
E clico no botão "Salvar"
Então o usuário deve ser cadastrado com sucesso
E o modal deve ser fechado automaticamente
E o usuário deve aparecer na lista de usuários
E todos os dados devem estar corretos na tabela
```

### Cenário: Tentar cadastrar usuário sem preencher o nome

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios exceto o nome
E clico no botão "Salvar"
Então o sistema deve impedir o envio do formulário
E uma mensagem de validação HTML5 deve aparecer no campo nome
E o usuário não deve ser cadastrado
E o modal não deve ser fechado
```

### Cenário: Tentar cadastrar usuário sem preencher o email

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios exceto o email
E clico no botão "Salvar"
Então o sistema deve impedir o envio do formulário
E uma mensagem de validação HTML5 deve aparecer no campo email
E o usuário não deve ser cadastrado
```

### Cenário: Tentar cadastrar usuário sem preencher a data de nascimento

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios exceto a data de nascimento
E clico no botão "Salvar"
Então o sistema deve impedir o envio do formulário
E uma mensagem de validação HTML5 deve aparecer no campo data de nascimento
E o usuário não deve ser cadastrado
```

### Cenário: Tentar cadastrar usuário sem selecionar empresa

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios exceto empresas
E clico no botão "Salvar"
Então uma mensagem de alerta deve ser exibida informando "Insira as empresas do usuário!"
E o usuário não deve ser cadastrado
E o modal não deve ser fechado
```

### Cenário: Tentar cadastrar usuário sem preencher o telefone

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios exceto o telefone
E clico no botão "Salvar"
Então o sistema deve permitir o cadastro (telefone é opcional na implementação atual)
E o usuário deve ser cadastrado sem telefone
```

**Nota:** Este cenário documenta a inconsistência entre a regra de negócio (telefone obrigatório) e a implementação atual (telefone opcional).

### Cenário: Tentar cadastrar usuário com data de nascimento futura

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho o campo data de nascimento com uma data futura (ex: 01/01/2030)
E preencho os demais campos obrigatórios
E clico no botão "Salvar"
Então o sistema deve validar a data
E uma mensagem de alerta deve ser exibida informando "A data de nascimento não pode ser futura!"
E o cadastro deve ser impedido
E o modal não deve ser fechado
E o usuário deve poder corrigir a data e tentar novamente
```

### Cenário: Cadastrar usuário vinculado a múltiplas empresas

```gherkin
Dado que estou na página inicial do sistema
Quando eu clico no botão "Novo Usuário"
E preencho todos os campos obrigatórios
E seleciono mais de uma empresa no multiselect
E clico no botão "Salvar"
Então o usuário deve ser cadastrado com sucesso
E todas as empresas selecionadas devem aparecer na lista
E o usuário deve estar vinculado a todas as empresas selecionadas
```

---

## Feature: Listagem de Usuários (Frontend)

### Cenário: Visualizar lista de usuários cadastrados

```gherkin
Dado que existem usuários cadastrados no sistema
Quando eu acesso a página inicial
Então devo ver uma tabela com todos os usuários
E a tabela deve conter as seguintes colunas:
  | Coluna        |
  | Nome          |
  | Email         |
  | Telefone      |
  | Nascimento    |
  | Cidade        |
  | Empresas      |
  | Ações         |
E cada linha deve exibir os dados de um usuário
```

### Cenário: Verificar formatação da data de nascimento na tabela

```gherkin
Dado que existem usuários cadastrados no sistema
Quando eu acesso a página inicial
E visualizo a coluna "Nascimento" na tabela
Então as datas devem estar formatadas no padrão brasileiro (DD/MM/YYYY)
E não devem aparecer datas no formato ISO (YYYY-MM-DD)
```

### Cenário: Verificar exibição de empresas vinculadas na tabela

```gherkin
Dado que existem usuários vinculados a empresas
Quando eu acesso a página inicial
E visualizo a coluna "Empresas" na tabela
Então as empresas devem ser exibidas corretamente
E se houver muitas empresas, deve aparecer truncado com "..."
E os nomes das empresas devem estar separados por espaço
```

### Cenário: Verificar que usuários excluídos não aparecem na lista

```gherkin
Dado que existe um usuário que foi excluído (show = 0)
Quando eu acesso a página inicial
E visualizo a lista de usuários
Então o usuário excluído não deve aparecer na tabela
E apenas usuários ativos (show = 1) devem ser exibidos
```

---

## Feature: Exclusão de Usuário (Frontend)

### Cenário: Excluir usuário com sucesso

```gherkin
Dado que existe um usuário cadastrado no sistema
E estou na página inicial visualizando a lista de usuários
Quando eu clico no botão de excluir (ícone de lixeira) do usuário
Então o usuário deve ser removido da lista imediatamente
E uma mensagem de sucesso "Usuário deletado com sucesso!" deve aparecer
E o usuário não deve mais aparecer na tabela
```

### Cenário: Verificar exclusão lógica no banco de dados

```gherkin
Dado que um usuário foi excluído através da interface
Quando consulto o banco de dados diretamente
Então o campo "show" do usuário deve estar como 0 (false)
E o usuário não deve aparecer em consultas que filtram por "show = 1"
E os dados do usuário devem permanecer no banco (exclusão lógica)
```

---

## Feature: API - Endpoints de Usuário

### Cenário: GET /api/user - Listar todos os usuários

```gherkin
Dado que a API está disponível em http://localhost:8400
Quando faço uma requisição GET para /api/user
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o corpo da resposta deve ser um array
E cada elemento do array deve conter os campos:
  | Campo        |
  | id_user      |
  | name         |
  | email        |
  | telephone    |
  | birth_date   |
  | birth_city   |
  | companies    |
E apenas usuários com show = 1 devem aparecer na lista
```

### Cenário: GET /api/user/{id} - Buscar usuário por ID válido

```gherkin
Dado que existe um usuário com ID 1 no sistema
Quando faço uma requisição GET para /api/user/1
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o corpo da resposta deve conter os dados do usuário
E deve incluir o campo "companies" com as empresas vinculadas
E os dados devem estar corretos e completos
```

### Cenário: GET /api/user/{id} - Buscar usuário com ID inválido (string)

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /api/user/abc
Então devo receber status HTTP 400
E o Content-Type deve ser "application/json"
E o corpo da resposta deve indicar erro de requisição inválida
```

### Cenário: GET /api/user/{id} - Buscar usuário com ID zero

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /api/user/0
Então devo receber status HTTP 400
E o corpo da resposta deve indicar erro de requisição inválida
```

### Cenário: GET /api/user/{id} - Buscar usuário inexistente

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /api/user/99999
Então devo receber um status de erro (400, 404 ou 500)
E o corpo da resposta deve indicar que o usuário não foi encontrado
```

### Cenário: POST /api/user/create - Criar usuário com dados válidos mínimos

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON:
  """
  {
    "name": "Teste QA",
    "email": "teste@empresa.com",
    "companies": [1]
  }
  """
Então devo receber status HTTP 201
E o Content-Type deve ser "application/json"
E o corpo da resposta deve conter o ID do usuário criado
E o usuário deve estar disponível em GET /api/user/{id}
```

### Cenário: POST /api/user/create - Criar usuário com todos os campos

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON completo:
  """
  {
    "name": "João Silva",
    "email": "joao@empresa.com",
    "telephone": "11999999999",
    "birth_date": "1990-01-01",
    "birth_city": "São Paulo",
    "companies": [1, 4]
  }
  """
Então devo receber status HTTP 201
E o usuário deve ser criado com todos os dados informados
E todas as empresas devem estar vinculadas ao usuário
```

### Cenário: POST /api/user/create - Criar usuário sem campo obrigatório "name"

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON sem o campo "name":
  """
  {
    "email": "teste@empresa.com",
    "companies": [1]
  }
  """
Então devo receber status HTTP 400
E o Content-Type deve ser "application/json"
E o corpo da resposta deve indicar erro de requisição inválida
E o usuário não deve ser criado no banco de dados
```

### Cenário: POST /api/user/create - Criar usuário sem campo obrigatório "email"

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON sem o campo "email":
  """
  {
    "name": "Teste QA",
    "companies": [1]
  }
  """
Então devo receber status HTTP 400
E o usuário não deve ser criado
```

### Cenário: POST /api/user/create - Criar usuário sem campo obrigatório "companies"

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON sem o campo "companies":
  """
  {
    "name": "Teste QA",
    "email": "teste@empresa.com"
  }
  """
Então devo receber status HTTP 400
E o usuário não deve ser criado
```

### Cenário: POST /api/user/create - Criar usuário com companies vazio

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON com companies como array vazio:
  """
  {
    "name": "Teste QA",
    "email": "teste@empresa.com",
    "companies": []
  }
  """
Então devo receber status HTTP 400
E o usuário não deve ser criado
```

### Cenário: POST /api/user/create - Criar usuário vinculado a múltiplas empresas

```gherkin
Dado que a API está disponível
E existem empresas com IDs 1, 4 e 5 no sistema
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON:
  """
  {
    "name": "Usuário Multi-Empresa",
    "email": "multi@empresa.com",
    "companies": [1, 4, 5]
  }
  """
Então devo receber status HTTP 201
E o usuário deve ser criado com sucesso
E todas as empresas devem estar vinculadas ao usuário
E ao consultar GET /api/user/{id}, todas as empresas devem aparecer
```

### Cenário: POST /api/user/create - Criar usuário com company ID inexistente

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/user/create
Com o corpo JSON contendo ID de empresa inexistente:
  """
  {
    "name": "Teste QA",
    "email": "teste@empresa.com",
    "companies": [99999]
  }
  """
Então devo receber status HTTP 201 ou 400 (dependendo da validação)
E verificar se o sistema trata adequadamente IDs inexistentes
```

### Cenário: PATCH /api/user/{id}/update - Atualizar usuário existente

```gherkin
Dado que existe um usuário com ID 1 no sistema
Quando faço uma requisição PATCH para /api/user/1/update
Com o corpo JSON:
  """
  {
    "name": "Nome Atualizado",
    "email": "novo@email.com"
  }
  """
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E os dados do usuário devem ser atualizados
E ao buscar o usuário novamente (GET /api/user/1), os novos dados devem aparecer
```

### Cenário: PATCH /api/user/{id}/update - Atualizar apenas o nome

```gherkin
Dado que existe um usuário com ID 1 no sistema
Quando faço uma requisição PATCH para /api/user/1/update
Com o corpo JSON contendo apenas o campo name:
  """
  {
    "name": "Apenas Nome Atualizado"
  }
  """
Então devo receber status HTTP 200
E apenas o nome deve ser atualizado
E os demais campos devem permanecer inalterados
```

### Cenário: PATCH /api/user/{id}/update - Atualizar usuário inexistente

```gherkin
Dado que a API está disponível
Quando faço uma requisição PATCH para /api/user/99999/update
Com dados válidos
Então devo receber um status de erro apropriado (400, 404 ou 500)
E o corpo da resposta deve indicar que o usuário não foi encontrado
```

### Cenário: PATCH /api/user/{id}/update - Atualizar com ID inválido

```gherkin
Dado que a API está disponível
Quando faço uma requisição PATCH para /api/user/abc/update
Com dados válidos
Então devo receber status HTTP 400
E o corpo da resposta deve indicar erro de requisição inválida
```

### Cenário: DELETE /api/user/{id}/delete - Deletar usuário existente

```gherkin
Dado que existe um usuário com ID 1 no sistema
Quando faço uma requisição DELETE para /api/user/1/delete
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o usuário deve ser marcado como excluído (show = 0)
E o usuário não deve aparecer em GET /api/user
E os dados do usuário devem permanecer no banco (exclusão lógica)
```

### Cenário: DELETE /api/user/{id}/delete - Deletar usuário inexistente

```gherkin
Dado que a API está disponível
Quando faço uma requisição DELETE para /api/user/99999/delete
Então devo receber um status de erro apropriado (400, 404 ou 500)
E o corpo da resposta deve indicar que o usuário não foi encontrado
```

### Cenário: DELETE /api/user/{id}/delete - Deletar com ID inválido

```gherkin
Dado que a API está disponível
Quando faço uma requisição DELETE para /api/user/abc/delete
Então devo receber status HTTP 400
E o corpo da resposta deve indicar erro de requisição inválida
```

---

## Feature: API - Endpoints de Empresa

### Cenário: GET /api/company - Listar todas as empresas

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /api/company
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o corpo da resposta deve ser um array de empresas
E cada empresa deve conter: id_company, name, cnpj, endereço e usuários vinculados
E apenas empresas com show = 1 devem aparecer na lista
```

### Cenário: GET /api/company/{id} - Buscar empresa por ID válido

```gherkin
Dado que existe uma empresa com ID 1 no sistema
Quando faço uma requisição GET para /api/company/1
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o corpo da resposta deve conter os dados completos da empresa
E deve incluir o endereço completo
E deve incluir os usuários vinculados
```

### Cenário: GET /api/company/{id} - Buscar empresa com ID inválido

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /api/company/abc
Então devo receber status HTTP 400
E o corpo da resposta deve indicar erro de requisição inválida
```

### Cenário: POST /api/company/create - Criar empresa com dados válidos

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/company/create
Com o corpo JSON completo:
  """
  {
    "name": "Nova Empresa",
    "cnpj": "12345678000190",
    "adress": {
      "cep": "01310100",
      "country": "Brasil",
      "state": "SP",
      "city": "São Paulo",
      "street": "Avenida Paulista",
      "number": "1000",
      "district": "Bela Vista"
    }
  }
  """
Então devo receber status HTTP 201
E o Content-Type deve ser "application/json"
E a empresa deve ser criada com sucesso
E o endereço deve ser criado e vinculado à empresa
E o corpo da resposta deve conter o ID da empresa criada
```

### Cenário: POST /api/company/create - Criar empresa sem campo obrigatório "name"

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/company/create
Com o corpo JSON sem o campo "name":
  """
  {
    "cnpj": "12345678000190",
    "adress": {
      "cep": "01310100",
      "country": "Brasil",
      "state": "SP",
      "city": "São Paulo",
      "street": "Avenida Paulista",
      "number": "1000",
      "district": "Bela Vista"
    }
  }
  """
Então devo receber status HTTP 400
E a empresa não deve ser criada
```

### Cenário: POST /api/company/create - Criar empresa sem campo obrigatório "cnpj"

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/company/create
Com o corpo JSON sem o campo "cnpj"
Então devo receber status HTTP 400
E a empresa não deve ser criada
```

### Cenário: POST /api/company/create - Criar empresa sem endereço completo

```gherkin
Dado que a API está disponível
Quando faço uma requisição POST para /api/company/create
Com o corpo JSON sem todos os campos obrigatórios do endereço:
  """
  {
    "name": "Empresa Teste",
    "cnpj": "12345678000190",
    "adress": {
      "cep": "01310100",
      "country": "Brasil"
    }
  }
  """
Então devo receber status HTTP 400
E a empresa não deve ser criada
```

### Cenário: PATCH /api/company/{id}/update - Atualizar empresa existente

```gherkin
Dado que existe uma empresa com ID 1 no sistema
Quando faço uma requisição PATCH para /api/company/1/update
Com o corpo JSON:
  """
  {
    "name": "Empresa Atualizada",
    "cnpj": "98765432000110",
    "adress": {
      "cep": "04567890",
      "country": "Brasil",
      "state": "RJ",
      "city": "Rio de Janeiro",
      "street": "Avenida Atlântica",
      "number": "2000",
      "district": "Copacabana"
    }
  }
  """
Então devo receber status HTTP 200
E os dados da empresa devem ser atualizados
E o endereço deve ser atualizado
E ao buscar a empresa novamente, os novos dados devem aparecer
```

### Cenário: DELETE /api/company/{id}/delete - Deletar empresa existente

```gherkin
Dado que existe uma empresa com ID 1 no sistema
Quando faço uma requisição DELETE para /api/company/1/delete
Então devo receber status HTTP 200
E a empresa deve ser marcada como excluída (show = 0)
E a empresa não deve aparecer em GET /api/company
E os dados devem permanecer no banco (exclusão lógica)
```

---

## Feature: Validações e Regras de Negócio

### Cenário: Validar que telefone é obrigatório conforme regra de negócio

```gherkin
Dado que estou no formulário de cadastro de usuário
Quando tento cadastrar sem preencher o campo telefone
Então o sistema deve impedir o cadastro (conforme regra de negócio)
OU o sistema deve permitir o cadastro (se a implementação atual não valida)
```

**Nota:** Este cenário documenta a inconsistência entre a regra de negócio (telefone obrigatório) e a implementação atual.

### Cenário: Validar formato de email corporativo

```gherkin
Dado que estou no formulário de cadastro
Quando preencho o email com domínio pessoal (ex: @gmail.com)
E tento salvar
Então o sistema deve validar se é email corporativo (se implementado)
OU o sistema deve aceitar qualquer email válido (comportamento atual)
```

**Nota:** A regra de negócio especifica "E-mail corporativo", mas não há validação específica implementada.

### Cenário: Validar relacionamento N para N entre usuário e empresa

```gherkin
Dado que existe um usuário vinculado a múltiplas empresas
Quando consulto o usuário via API GET /api/user/{id}
Então todas as empresas vinculadas devem aparecer no campo "companies"
E quando consulto uma empresa via API GET /api/company/{id}
Então todos os usuários vinculados devem aparecer no campo "users"
E o relacionamento deve ser bidirecional e consistente
```

### Cenário: Validar que data de nascimento não pode ser futura

```gherkin
Dado que estou no formulário de cadastro
Quando preencho a data de nascimento com uma data futura
E preencho os demais campos obrigatórios
E tento salvar
Então o sistema deve validar a data
E uma mensagem de alerta deve ser exibida informando "A data de nascimento não pode ser futura!"
E o cadastro deve ser impedido
E o modal não deve ser fechado
E o usuário deve poder corrigir a data e tentar novamente
```

### Cenário: Validar que empresas devem existir antes de vincular usuário

```gherkin
Dado que a API está disponível
Quando tento criar um usuário vinculado a uma empresa inexistente
Então o sistema deve validar a existência das empresas (se implementado)
OU o sistema deve criar o usuário mesmo com empresa inexistente (comportamento atual)
```

---

## Feature: Home Route

### Cenário: GET / - Verificar rota home

```gherkin
Dado que a API está disponível
Quando faço uma requisição GET para /
Então devo receber status HTTP 200
E o Content-Type deve ser "application/json"
E o corpo da resposta deve ser: {"msg": "home"}
```

---

## Observações Finais

### Cenários de Teste Mapeados

- **Frontend (E2E):** 12 cenários
- **API - User:** 20 cenários
- **API - Company:** 8 cenários
- **Validações e Regras:** 5 cenários
- **Home Route:** 1 cenário
- **Total:** 46 cenários

### Priorização

**Alta Prioridade:**
- Cadastro de usuário (caminhos felizes e tristes)
- Listagem de usuários
- Exclusão de usuário
- Endpoints CRUD básicos da API

**Média Prioridade:**
- Validações de campos obrigatórios
- Tratamento de erros (IDs inválidos, inexistentes)
- Relacionamento N para N

**Baixa Prioridade:**
- Validações avançadas (email corporativo, data futura)
- Cenários de edge cases

### Inconsistências Identificadas

1. **Telefone obrigatório:** Regra de negócio diz obrigatório, mas implementação atual não valida
2. **Email corporativo:** Regra especifica "corporativo", mas não há validação de domínio
3. **Campo "e-mail" vs "email":** Documentação usa "e-mail", mas API espera "email"
4. **Campo "adress" vs "address":** Grafia incorreta mantida no código

---

**Última Atualização:** 03/02/2026
