# Relatório de Bugs

**Projeto:** CRUD de Usuários vinculados a Empresas  
**Data:** 03/02/2026  
**Ambiente:** Docker Compose (Frontend: localhost:5400 | Backend: localhost:8400)

---

## Cronograma de Execução (5 dias)

| Dia | Atividades |
|-----|------------|
| **1º** | Estudo do projeto; testes manuais no frontend e API |
| **2º** | Git pull para estado original; organização dos testes de API e frontend; execução e documentação |
| **3º** | Implementação do Cypress (API e E2E); Custom Commands |
| **4º** | Documentação geral; refinamentos |
| **5º** | Publicação no repositório GitHub; análise final |

---

## Resumo dos Entregáveis

| Entregável | Localização | Status |
|------------|-------------|--------|
| **Plano de Teste (Gherkin)** | `docs/PLANO_DE_TESTE.md` | ✅ Concluído |
| **Relatório de Bugs** | `RELATORIO_BUGS.md` (este documento) | ✅ Concluído |
| **Instruções de execução** | Seção abaixo neste documento | ✅ Concluído |
| **Repositório GitHub** | https://github.com/janderrodrigues2903-svg/Teste-adt- | ✅ Concluído |
| **Testes de API (Cypress)** | `frontend/cypress/e2e/api/` | ✅ 33 testes passando |
| **Testes E2E (Cypress)** | `frontend/cypress/e2e/frontend/` | ⚠️ 5 automatizados + 8 manuais |
| **Custom Commands** | `frontend/cypress/support/commands.ts` | ✅ Implementado |

---

## Status dos Endpoints Testados (Postman)

| Endpoint | Método | Status |
|----------|--------|--------|
| `/` | GET | OK |
| `/api/user` | GET | OK |
| `/api/user/{id}` | GET | OK |
| `/api/user/create` | POST | OK |
| `/api/user/{id}/update` | PATCH | **BUG** |
| `/api/user/{id}/delete` | DELETE | OK |
| `/api/company` | GET | OK |
| `/api/company/{id}` | GET | OK |
| `/api/company/create` | POST | OK |
| `/api/company/{id}/update` | PATCH | OK |
| `/api/company/{id}/delete` | DELETE | OK |

---

## Bug #001 - PATCH /api/user/{id}/update retorna erro 500

**Severidade:** Alta  
**Prioridade:** Alta  
**Status:** Aberto  
**Localização:** Backend - API

### Descrição
O endpoint PATCH `/api/user/{id}/update` retorna erro 500 (Slim Application Error) ao tentar atualizar um usuário, independente do corpo da requisição enviado.

### Erro retornado
```
TypeError: array_intersect(): Argument #1 ($array) must be of type array, null given
Arquivo: /var/www/html/Classes/Util/ValidateArgs.php
Linha: 29
```

### Causa raiz

**Arquivo:** `backend/Classes/Util/ValidateArgs.php`  
**Função:** `validateBody($type, $body, $obligatoryParams = null)`  
**Linha problemática:** 29

#### Explicação técnica detalhada:

1. **`ValidateArgs.php`**: 
   - Classe utilitária responsável por validar argumentos recebidos nas requisições da API
   - Contém a função `validateBody()` que valida se o corpo da requisição contém os campos esperados

2. **`$obligatoryParams`**:
   - Parâmetro opcional (terceiro argumento) da função `validateBody()`
   - Quando não informado, assume o valor `null` (valor default)
   - Deve ser um **array** contendo os nomes dos campos obrigatórios que devem estar presentes no `$body`
   - **Exemplo:** `["name", "email", "companies"]` para criação de usuário

3. **`array_intersect()`**:
   - Função nativa do PHP que compara dois arrays e retorna os valores que existem em ambos
   - **Sintaxe:** `array_intersect(array1, array2)`
   - **Requisito:** Ambos os parâmetros DEVEM ser arrays, não aceita `null`
   - **Exemplo:** `array_intersect(["name", "email"], ["name", "email", "telephone"])` retorna `["name", "email"]`

4. **O problema:**
   - No endpoint PATCH `/api/user/{id}/update`, a chamada é: `ValidateArgs::validateBody('user', $body)` (sem o terceiro parâmetro)
   - Isso faz com que `$obligatoryParams = null`
   - A condição original era: `array_intersect($obligatoryParams, array_keys($body)) === sizeof($obligatoryParams) || $obligatoryParams === null`
   - O PHP avalia a expressão da esquerda para direita, então executa `array_intersect(null, ...)` **ANTES** de verificar `|| $obligatoryParams === null`
   - Como `array_intersect()` não aceita `null` como primeiro argumento, gera o TypeError

5. **Por que o PATCH de Company funciona:**
   - O endpoint PATCH de Company (`/api/company/{id}/update`) também chama `validateBody()` sem o terceiro parâmetro
   - Porém, há uma verificação adicional antes: `ValidateArgs::validateBody('adress', $body["adress"])`
   - Se essa validação falhar primeiro, o erro pode não chegar na linha problemática
   - Ou pode ser que o código tenha sido testado em um contexto diferente

### Passos para reproduzir
1. Abrir Postman
2. Criar requisição **PATCH** para `http://localhost:8400/api/user/1/update`
3. Na aba Body, selecionar **raw** e **JSON**
4. Enviar corpo:
```json
{
  "name": "Nome Atualizado",
  "email": "novo@email.com"
}
```
5. Clicar em Send

### Comportamento esperado
- Status HTTP **200**
- Usuário atualizado com sucesso
- Retorno com dados do usuário atualizado

### Comportamento atual
- Status HTTP **500**
- Página HTML de erro do Slim Framework
- Usuário não é atualizado

### Correção aplicada

**Arquivo:** `backend/Classes/Util/ValidateArgs.php`  
**Linha:** 29

#### Código anterior (com bug):
```php
if(sizeof(array_intersect($obligatoryParams, array_keys($body))) === sizeof($obligatoryParams) || $obligatoryParams === null) {
```

#### Código corrigido:
```php
// Verifica se $obligatoryParams é null ANTES de usar array_intersect
// Se for null, significa que não há parâmetros obrigatórios para validar
$hasObligatoryParams = ($obligatoryParams === null) || (sizeof(array_intersect($obligatoryParams, array_keys($body))) === sizeof($obligatoryParams));

if($hasObligatoryParams) {
```

#### Explicação da correção:
- A verificação `$obligatoryParams === null` agora é feita **primeiro** na expressão
- Se `$obligatoryParams` for `null`, a expressão retorna `true` imediatamente (short-circuit evaluation)
- `array_intersect()` só é executado quando `$obligatoryParams` **não é null**, garantindo que sempre receberá um array válido
- Isso permite que o PATCH funcione sem parâmetros obrigatórios (atualização parcial), que é o comportamento esperado para operações PATCH

#### Teste pós-correção:
Após aplicar a correção, é necessário reiniciar o container do backend:
```bash
docker-compose restart backend
```

**Status:** ✅ Correção aplicada

---

## Bug #002 - Modal fecha mesmo quando validação de empresa falha

**Severidade:** Média  
**Prioridade:** Média  
**Status:** Aberto  
**Localização:** Frontend - Componente NewUserModal

### Descrição
Ao tentar cadastrar um usuário sem selecionar empresa, o sistema exibe corretamente a mensagem de alerta "Insira as empresas do usuário!", porém o modal é fechado mesmo que o cadastro não tenha sido realizado com sucesso.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`  
**Arquivo:** `frontend/src/hooks/useUsers.tsx`

### Causa raiz

**Arquivo:** `frontend/src/hooks/useUsers.tsx`  
**Função:** `createUser(userInput: UserInput)`  
**Linhas:** 61-84

#### Explicação técnica detalhada:

1. **Fluxo atual:**
   - Quando o usuário clica em "Salvar" sem selecionar empresa, o `companies` permanece como `[0]`
   - A função `createUser()` verifica: `if(Array.isArray(userInput.companies) && userInput.companies[0] !== 0)`
   - Como `companies[0] === 0`, a condição é falsa e entra no `else`
   - O SweetAlert é exibido corretamente
   - **Porém**, o componente `NewUserModal` chama `onRequestClose()` após o `await createUser()`, independente do resultado

2. **`NewUserModal/index.tsx` (linha 58):**
   ```typescript
   await createUser({ ... })
   // ... reset de valores ...
   onRequestClose() //close modal - SEMPRE executa, mesmo se createUser falhou
   ```

3. **O problema:**
   - O `onRequestClose()` é chamado **sempre** após `createUser()`, mesmo quando o cadastro não foi realizado
   - Não há verificação se o `createUser()` foi bem-sucedido ou não
   - O modal fecha antes mesmo do usuário poder ler a mensagem de erro completamente

### Passos para reproduzir
1. Acessar http://localhost:5400
2. Clicar no botão "Novo Usuário"
3. Preencher todos os campos obrigatórios (Nome, Email, Data de Nascimento)
4. **NÃO** selecionar nenhuma empresa no multiselect
5. Clicar no botão "Salvar"
6. Observar que a mensagem de alerta aparece
7. Observar que o modal fecha imediatamente após o alerta

### Comportamento esperado
- Mensagem de alerta "Insira as empresas do usuário!" deve ser exibida
- O modal **NÃO** deve ser fechado
- O usuário deve poder ler a mensagem e corrigir o erro
- O modal só deve fechar após cadastro bem-sucedido

### Comportamento atual
- Mensagem de alerta é exibida corretamente
- O modal fecha imediatamente após o alerta aparecer
- O usuário precisa abrir o modal novamente para corrigir o erro
- Experiência do usuário prejudicada

### Correção sugerida

**Opção 1 - Retornar boolean de `createUser()`:**
```typescript
// Em useUsers.tsx
async function createUser(userInput : UserInput): Promise<boolean> {
    if(Array.isArray(userInput.companies) && userInput.companies[0] !== 0){
        api.post('/user/create', userInput).then(response =>{
            // ... código existente ...
        })
        return true;
    } else {
        await MySwal.fire({ ... });
        return false;
    }
}

// Em NewUserModal/index.tsx
const success = await createUser({ ... });
if (success) {
    // reset modal values
    onRequestClose();
}
```

**Opção 2 - Verificar se companies está vazio antes de fechar:**
```typescript
// Em NewUserModal/index.tsx
await createUser({ ... });

// Verificar se o usuário foi realmente criado antes de fechar
if (companies[0] !== 0) {
    // reset modal values
    onRequestClose();
}
```

### Correção aplicada

**Arquivo:** `frontend/src/hooks/useUsers.tsx`  
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

#### Código anterior (com bug):

**useUsers.tsx:**
```typescript
async function createUser(userInput : UserInput){
    if(Array.isArray(userInput.companies) && userInput.companies[0] !== 0){
        api.post('/user/create', userInput).then(response =>{
            // ... código ...
        })
    }else{
        await MySwal.fire({ ... });
    }
}
```

**NewUserModal/index.tsx:**
```typescript
async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();
    await createUser({ ... });
    // ... reset valores ...
    onRequestClose(); // SEMPRE executa, mesmo se falhou
}
```

#### Código corrigido:

**useUsers.tsx:**
```typescript
async function createUser(userInput : UserInput): Promise<boolean>{
    if(Array.isArray(userInput.companies) && userInput.companies[0] !== 0){
        try {
            const response = await api.post('/user/create', userInput);
            const user = response.data;

            setUsers([
                ...users,
                user
            ])
            
            return true;
        } catch (error) {
            await MySwal.fire({
                title: <strong>Erro!</strong>,
                html: <i>Erro ao cadastrar usuário!</i>,
                icon: 'error'
            })
            return false;
        }
    }else{
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>Insira as empresas do usuário!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        })
        
        return false;
    }
}
```

**NewUserModal/index.tsx:**
```typescript
async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();

    // Chama createUser e aguarda o resultado
    const success = await createUser({
        name,
        email,
        telephone,
        birth_date,
        birth_city,
        companies
    })

    // IMPORTANTE: Só fecha o modal e reseta os valores se o cadastro foi bem-sucedido
    // Se success === false (empresa não selecionada ou erro na API), o modal permanece aberto
    if (success === true) {
        // Reset dos valores do formulário
        setName('')
        setEmail('')
        setTelephone('')
        setBirth_date('')
        setBirth_city('')
        setCompanies([0])

        // Fecha o modal apenas após sucesso
        onRequestClose()
    }
    // Se success === false, o modal permanece aberto para o usuário corrigir o erro
}
```

#### Explicação da correção:

1. **Mudança no tipo de retorno:**
   - A função `createUser()` agora retorna `Promise<boolean>` ao invés de `Promise<void>`
   - Isso permite que o componente chamador saiba se a operação foi bem-sucedida ou não

2. **Retorno de sucesso (`true`):**
   - Quando o cadastro é bem-sucedido (empresas selecionadas e API responde com sucesso)
   - O usuário é adicionado à lista de usuários
   - Retorna `true` para indicar sucesso

3. **Retorno de erro (`false`):**
   - Quando empresas não são selecionadas (`companies[0] === 0`)
   - Quando há erro na API (catch block)
   - Exibe mensagem de erro apropriada (SweetAlert)
   - Retorna `false` para indicar falha

4. **Controle de fechamento do modal:**
   - O componente `NewUserModal` verifica o retorno antes de fechar o modal
   - O modal só fecha quando `success === true`
   - Se `success === false`, o modal permanece aberto para o usuário corrigir o erro

5. **Melhorias adicionais:**
   - Adicionado tratamento de erro com try/catch para erros da API
   - Configurado SweetAlert com `allowOutsideClick: false` e `allowEscapeKey: false` para evitar fechamento acidental
   - Comentários explicativos no código para facilitar manutenção futura
   - Melhorada a experiência do usuário: ele pode ler a mensagem de erro e corrigir sem precisar abrir o modal novamente

#### Fluxo correto após correção:

1. **Usuário preenche formulário sem selecionar empresa:**
   - Clica em "Salvar"
   - `createUser()` valida e retorna `false`
   - SweetAlert exibe: "Insira as empresas do usuário!"
   - Usuário clica em "OK" no SweetAlert
   - **Apenas o SweetAlert fecha**
   - **Modal de cadastro permanece aberto**
   - Usuário pode selecionar empresa e tentar novamente

2. **Usuário preenche formulário com empresa selecionada:**
   - Clica em "Salvar"
   - `createUser()` valida e retorna `true`
   - Usuário é cadastrado com sucesso
   - Valores do formulário são resetados
   - **Modal fecha automaticamente**

#### Teste pós-correção:
1. Acessar http://localhost:5400
2. Clicar em "Novo Usuário"
3. Preencher campos obrigatórios (Nome, Email, Data de Nascimento)
4. **NÃO** selecionar nenhuma empresa
5. Clicar em "Salvar"
6. ✅ Verificar que o SweetAlert aparece com mensagem "Insira as empresas do usuário!"
7. ✅ Clicar em "OK" no SweetAlert
8. ✅ Verificar que **apenas o SweetAlert fecha**
9. ✅ Verificar que **o modal de cadastro permanece aberto**
10. Selecionar uma empresa e clicar em "Salvar" novamente
11. ✅ Verificar que o usuário é cadastrado e o modal fecha apenas após sucesso

**Status:** ✅ Correção aplicada e testada - Funcionando corretamente

---

## Observações

- Todos os demais endpoints da API foram testados e estão funcionando corretamente.
- O bug #001 (PATCH) foi corrigido e está funcionando.
- O bug #002 foi corrigido e está funcionando corretamente - o modal permanece aberto quando há erro de validação.
- O bug #003 foi corrigido - usuários excluídos não aparecem mais nas listagens.

## Bug #003 - Usuários excluídos ainda aparecem na listagem

**Severidade:** Alta  
**Prioridade:** Alta  
**Status:** ✅ Corrigido  
**Localização:** Backend - API

### Descrição
Após deletar um usuário via API (DELETE `/api/user/{id}/delete`), o sistema retorna status 200 e mensagem de sucesso, porém o usuário excluído ainda aparece tanto na listagem da API (GET `/api/user`) quanto no frontend.

### Causa raiz

**Arquivo:** `backend/Classes/Database/UserContr.php`  
**Funções:** `getAllUsers()` e `getUser()`

#### Explicação técnica detalhada:

1. **Exclusão lógica:**
   - O sistema utiliza exclusão lógica (soft delete)
   - Quando um usuário é deletado, o campo `show` é atualizado para `0` (false)
   - O registro permanece no banco de dados, mas não deveria aparecer nas consultas

2. **O problema:**
   - A função `getAllUsers()` (linha 90) não filtra por `show = 1`
   - A função `getUser()` (linha 57) também não filtra por `show = 1`
   - As queries SQL retornam todos os usuários, incluindo os excluídos (`show = 0`)

3. **Query problemática:**
   ```sql
   SELECT user.*, ...
   FROM user CROSS JOIN ...
   -- FALTA: WHERE user.show = 1
   ```

### Passos para reproduzir
1. Criar um usuário via API POST `/api/user/create`
2. Verificar que o usuário aparece em GET `/api/user`
3. Deletar o usuário via API DELETE `/api/user/{id}/delete`
4. Verificar que retorna status 200 e mensagem de sucesso
5. Consultar novamente GET `/api/user`
6. **Bug:** O usuário excluído ainda aparece na lista

### Comportamento esperado
- Após deletar um usuário, ele não deve aparecer em GET `/api/user`
- Apenas usuários com `show = 1` devem ser retornados
- Usuários excluídos (`show = 0`) devem ser filtrados das consultas

### Comportamento atual
- Usuários excluídos ainda aparecem na listagem
- GET `/api/user` retorna todos os usuários, incluindo excluídos
- Frontend exibe usuários que foram deletados

### Correção aplicada

**Arquivo:** `backend/Classes/Database/UserContr.php`

#### Código anterior (com bug):

**getAllUsers():**
```php
$query = '  SELECT  user.*, ...
          FROM    user CROSS JOIN ...
          -- SEM FILTRO WHERE user.show = 1
```

**getUser():**
```php
$query = '  SELECT  user.*, ...
          WHERE   id_user = "'.$id_user.'"
          -- FALTA: AND user.show = 1
```

#### Código corrigido:

**getAllUsers():**
```php
$query = '  SELECT  user.*,
                  IF(LENGTH(tmp.companies)>14, 
                      CONCAT(SUBSTRING(tmp.companies, 1,14), "..."),
                      tmp.companies
                  ) AS companies
          FROM    user CROSS JOIN  ( SELECT user_company.id_user,
                                      GROUP_CONCAT(" ",company.name) AS companies
                                    FROM company INNER JOIN user_company
                                    ON company.id_company = user_company.id_company
                                    GROUP BY user_company.id_user) AS tmp
                  ON user.id_user = tmp.id_user
          WHERE   user.show = 1';  // ✅ FILTRO ADICIONADO
```

**getUser():**
```php
$query = '  SELECT  user.*, ...
          WHERE   id_user = "'.$id_user.'"
          AND     user.show = 1';  // ✅ FILTRO ADICIONADO
```

#### Explicação da correção:
- Adicionado filtro `WHERE user.show = 1` na função `getAllUsers()`
- Adicionado filtro `AND user.show = 1` na função `getUser()`
- Agora apenas usuários ativos são retornados nas consultas
- Usuários excluídos (soft delete) não aparecem mais nas listagens
- Mantém a consistência com a exclusão lógica implementada

#### Teste pós-correção:
1. Criar um usuário via API POST `/api/user/create`
2. Verificar que o usuário aparece em GET `/api/user`
3. Deletar o usuário via API DELETE `/api/user/{id}/delete`
4. Verificar que retorna status 200
5. Consultar novamente GET `/api/user`
6. ✅ Verificar que o usuário excluído **NÃO** aparece mais na lista
7. ✅ Verificar que o frontend também não exibe o usuário excluído

**Status:** ✅ Correção aplicada

---

## Bug #004 - API não valida data de nascimento (formato e data futura)

**Severidade:** Média  
**Prioridade:** Média  
**Status:** ✅ Corrigido  
**Localização:** Backend - API

### Descrição
A API não valida o formato da data de nascimento nem impede que datas futuras sejam cadastradas. Isso permite que usuários sejam criados com datas inválidas ou futuras quando a API é chamada diretamente (sem passar pelo frontend).

### Causa raiz

**Arquivo:** `backend/index.php`  
**Arquivo:** `backend/Classes/Util/ValidateArgs.php`

#### Explicação técnica detalhada:

1. **Falta de validação na API:**
   - A função `validateBody()` apenas verifica se os campos estão presentes e são permitidos
   - Não valida o **formato** dos dados (ex: formato de data)
   - Não valida o **conteúdo** dos dados (ex: se a data é futura)

2. **Por que é um problema:**
   - A API pode ser chamada diretamente (Postman, scripts, outros sistemas)
   - Se alguém chamar a API sem passar pelo frontend, pode cadastrar datas inválidas
   - Viola o princípio de **defesa em profundidade** (validação em múltiplas camadas)
   - Pode causar inconsistências nos dados do banco

3. **Boas práticas de segurança:**
   - **Nunca confie apenas na validação do frontend**
   - A API deve ser a **fonte da verdade** para validações
   - Validações devem existir em **ambas as camadas** (frontend + backend)

### Passos para reproduzir
1. Abrir Postman
2. Criar requisição POST para `http://localhost:8400/api/user/create`
3. Enviar corpo com data futura:
```json
{
  "name": "Teste",
  "email": "teste@empresa.com",
  "birth_date": "2030-01-01",
  "companies": [1]
}
```
4. Verificar que a API aceita e cria o usuário com data futura

### Comportamento esperado
- API deve validar formato de data (YYYY-MM-DD)
- API deve rejeitar datas futuras
- API deve retornar erro 400 com mensagem clara quando a data for inválida
- Validação deve ocorrer tanto no POST quanto no PATCH

### Comportamento atual
- API aceita qualquer string como data
- API aceita datas futuras
- API aceita datas muito antigas (ex: 1800)
- Não há validação de formato ou conteúdo

### Correção aplicada

**Arquivo:** `backend/Classes/Util/ValidateArgs.php`  
**Arquivo:** `backend/index.php`

#### Nova função de validação criada:

**ValidateArgs.php:**
```php
public static function validateBirthDate($birth_date)
{
    // Verifica se a data foi informada
    if(empty($birth_date)) {
        return true; // Data opcional, então vazio é válido
    }

    // Valida formato de data (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birth_date)) {
        return false;
    }

    // Converte para objeto DateTime
    $date = DateTime::createFromFormat('Y-m-d', $birth_date);
    
    // Verifica se a data é válida
    if (!$date || $date->format('Y-m-d') !== $birth_date) {
        return false;
    }

    // Verifica se a data não é futura
    $today = new DateTime();
    $today->setTime(0, 0, 0);
    
    if ($date > $today) {
        return false; // Data futura não é permitida
    }

    // Verifica se a data não é muito antiga (ex: antes de 1900)
    $minDate = DateTime::createFromFormat('Y-m-d', '1900-01-01');
    if ($date < $minDate) {
        return false; // Data muito antiga não é permitida
    }

    return true;
}
```

#### Validação adicionada nos endpoints:

**POST /api/user/create:**
```php
// Validação de data de nascimento (se informada)
if(isset($body['birth_date']) && !empty($body['birth_date'])) {
    if(!ValidateArgs::validateBirthDate($body['birth_date'])) {
        $response->getBody()->write(json_encode(["error" => "Data de nascimento inválida. A data deve estar no formato YYYY-MM-DD, não pode ser futura e deve ser posterior a 1900-01-01."]));
        return $response->withStatus(400)->withHeader('Content-type', 'application/json');
    }
}
```

**PATCH /api/user/{id}/update:**
```php
// Mesma validação adicionada
```

#### Explicação da correção:
- Criada função `validateBirthDate()` que valida:
  - Formato da data (YYYY-MM-DD)
  - Se a data é válida (ex: não aceita 2024-13-45)
  - Se a data não é futura
  - Se a data não é muito antiga (antes de 1900)
- Validação aplicada em POST e PATCH
- Retorna erro 400 com mensagem clara quando inválida
- Segue o princípio de defesa em profundidade (validação no backend mesmo com validação no frontend)

#### Teste pós-correção:
1. Tentar criar usuário com data futura via Postman
2. ✅ Verificar que retorna status 400
3. ✅ Verificar mensagem de erro clara
4. Tentar criar usuário com formato de data inválido
5. ✅ Verificar que retorna status 400
6. Tentar criar usuário com data válida
7. ✅ Verificar que funciona normalmente

**Status:** ✅ Correção aplicada

---

## Bug #005 - Falta de indicador de loading durante requisições

**Severidade:** Baixa  
**Prioridade:** Baixa  
**Status:** Aberto  
**Localização:** Frontend - Componentes

### Descrição
O sistema não exibe nenhum indicador visual de que uma requisição está em andamento. Quando o usuário clica em "Salvar" ou "Deletar", não há feedback visual de que a ação está sendo processada.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`  
**Arquivo:** `frontend/src/hooks/useUsers.tsx`

### Comportamento esperado
- Botão "Salvar" deve ser desabilitado durante a requisição
- Deve exibir um spinner ou mensagem "Salvando..." ou "Carregando..."
- Usuário deve saber que a ação está sendo processada
- Botão não deve permitir múltiplos cliques durante a requisição

### Comportamento atual
- Botão permanece habilitado durante a requisição
- Não há indicador visual de loading
- Usuário pode clicar múltiplas vezes no botão
- Não há feedback de que a ação está sendo processada

### Impacto
- **UX:** Usuário pode ficar confuso se a ação está funcionando
- **Segurança:** Possibilidade de múltiplas requisições se o usuário clicar várias vezes
- **Experiência:** Falta de feedback visual prejudica a experiência do usuário

### Correção aplicada

**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

#### Código anterior (com bug):
```typescript
const [companies, setCompanies] = useState([0])

async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();
    // ... código ...
    const success = await createUser({ ... })
    // SEM controle de loading
}

<button type="submit"><Save />Salvar</button>
```

#### Código corrigido:
```typescript
const [isLoading, setIsLoading] = useState(false)

async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();

    // Previne múltiplos cliques durante requisição
    if (isLoading) {
        return;
    }

    setIsLoading(true);

    try {
        const success = await createUser({ ... })
        // ... código ...
    } finally {
        setIsLoading(false);
    }
}

<button type="submit" disabled={isLoading}>
    {isLoading ? (
        <>Carregando...</>
    ) : (
        <><Save />Salvar</>
    )}
</button>
```

#### Explicação da correção:
- Adicionado estado `isLoading` para controlar o estado de carregamento
- Botão é desabilitado durante a requisição (`disabled={isLoading}`)
- Texto do botão muda para "Carregando..." durante requisição
- Previne múltiplos cliques com verificação no início da função
- Loading é desativado sempre (try/finally garante isso mesmo em caso de erro)
- Melhora significativamente a experiência do usuário

#### Teste pós-correção:
1. Abrir modal de cadastro
2. Preencher formulário e clicar em "Salvar"
3. ✅ Verificar que o botão mostra "Carregando..."
4. ✅ Verificar que o botão está desabilitado
5. ✅ Verificar que não é possível clicar múltiplas vezes
6. Aguardar resposta da API
7. ✅ Verificar que o botão volta ao normal após resposta

**Status:** ✅ Correção aplicada

---

## Bug #006 - Tratamento inadequado de erros de rede e timeout

**Severidade:** Média  
**Prioridade:** Média  
**Status:** Aberto  
**Localização:** Frontend - Hooks e Componentes

### Descrição
O sistema não trata adequadamente erros de rede (sem conexão), timeout ou outros erros específicos do axios. Algumas funções não possuem tratamento de erro.

### Localização
**Arquivo:** `frontend/src/hooks/useUsers.tsx`

#### Problemas identificados:

1. **`deleteUser()` não tem try/catch:**
   - Se a requisição falhar, pode quebrar a aplicação
   - Não trata erros de rede ou timeout

2. **`useEffect()` que busca usuários não trata erros:**
   - Se a API estiver offline, a aplicação pode quebrar
   - Não há tratamento de erro na inicialização

3. **`createUser()` trata erro genérico:**
   - Não diferencia tipos de erro (rede, timeout, validação)
   - Mensagem genérica não ajuda o usuário

### Código problemático:

**deleteUser() - SEM tratamento de erro:**
```typescript
async function deleteUser(userId : number){
    api.delete(`/user/${userId}/delete`).then(response =>{
        // Se der erro de rede, isso nunca executa e não há catch
        if(response.status === 200){
            // ...
        }
    })
    // SEM .catch() para tratar erros
}
```

**useEffect() - SEM tratamento de erro:**
```typescript
useEffect(() =>{
    api.get('user')
        .then(response => setUsers(response.data))
        // SEM .catch() - se API estiver offline, quebra
}, [])
```

### Comportamento esperado
- Todas as requisições devem ter tratamento de erro
- Erros de rede devem exibir mensagem específica: "Sem conexão com o servidor"
- Timeout deve exibir mensagem: "Tempo de espera esgotado. Tente novamente."
- Erros de validação devem exibir mensagem específica do erro
- Aplicação não deve quebrar em caso de erro

### Comportamento atual
- `deleteUser()` pode quebrar se houver erro de rede
- `useEffect()` pode quebrar se API estiver offline
- Mensagens de erro são genéricas
- Não diferencia tipos de erro

### Correção sugerida

**Adicionar tratamento de erro em todas as requisições:**
```typescript
// deleteUser com tratamento de erro
async function deleteUser(userId : number){
    try {
        const response = await api.delete(`/user/${userId}/delete`);
        if(response.status === 200){
            api.get('user').then(response => setUsers(response.data))
            MySwal.fire({ ... })
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            // Timeout
            await MySwal.fire({
                title: <strong>Erro!</strong>,
                html: <i>Tempo de espera esgotado. Tente novamente.</i>,
                icon: 'error'
            })
        } else if (error.response) {
            // Erro da API
            await MySwal.fire({ ... })
        } else {
            // Erro de rede
            await MySwal.fire({
                title: <strong>Erro!</strong>,
                html: <i>Sem conexão com o servidor. Verifique sua internet.</i>,
                icon: 'error'
            })
        }
    }
}

// useEffect com tratamento de erro
useEffect(() =>{
    api.get('user')
        .then(response => setUsers(response.data))
        .catch(error => {
            console.error('Erro ao carregar usuários:', error)
            // Opcional: exibir mensagem ou manter lista vazia
        })
}, [])
```

### Correção aplicada

**Arquivo:** `frontend/src/hooks/useUsers.tsx`

#### Código anterior (com bugs):

**useEffect() - SEM tratamento de erro:**
```typescript
useEffect(() =>{
    api.get('user')
        .then(response => setUsers(response.data))
        // SEM .catch() - se API estiver offline, quebra
}, [])
```

**deleteUser() - SEM try/catch:**
```typescript
async function deleteUser(userId : number){
    api.delete(`/user/${userId}/delete`).then(response =>{
        // Se der erro de rede, isso nunca executa e não há catch
        if(response.status === 200){
            // ...
        }
    })
    // SEM .catch() para tratar erros
}
```

**createUser() - Tratamento genérico:**
```typescript
catch (error) {
    await MySwal.fire({
        title: <strong>Erro!</strong>,
        html: <i>Erro ao cadastrar usuário!</i>, // Mensagem genérica
        icon: 'error'
    })
}
```

#### Código corrigido:

**useEffect() - COM tratamento de erro:**
```typescript
useEffect(() =>{
    api.get('user')
        .then(response => setUsers(response.data))
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
            // Em caso de erro, mantém lista vazia ao invés de quebrar
        })
}, [])
```

**deleteUser() - COM try/catch completo:**
```typescript
async function deleteUser(userId : number){
    try {
        const response = await api.delete(`/user/${userId}/delete`);
        
        if(response.status === 200){
            try {
                const usersResponse = await api.get('user');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Erro ao atualizar lista:', error);
                // Mesmo com erro ao atualizar, mostra sucesso da exclusão
            }
            
            await MySwal.fire({ ... })
        }
    } catch (error: any) {
        let errorMessage = 'Erro ao deletar usuário!';
        
        // Tratamento específico de tipos de erro
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            errorMessage = 'Tempo de espera esgotado. Tente novamente.';
        } else if (error.code === 'ERR_NETWORK' || !error.response) {
            errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
        } else if (error.response?.status === 400) {
            errorMessage = 'Requisição inválida. Verifique o ID do usuário.';
        } else if (error.response?.status === 404) {
            errorMessage = 'Usuário não encontrado.';
        } else if (error.response?.status === 500) {
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }
        
        await MySwal.fire({
            title: <strong>Erro!</strong>,
            html: <i>{errorMessage}</i>,
            icon: 'error'
        })
    }
}
```

**createUser() - Tratamento específico de erros:**
```typescript
catch (error: any) {
    let errorMessage = 'Erro ao cadastrar usuário!';
    
    // Tratamento específico de tipos de erro
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Tempo de espera esgotado. Tente novamente.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
    } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || 'Dados inválidos. Verifique os campos preenchidos.';
    } else if (error.response?.status === 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
    }
    
    await MySwal.fire({
        title: <strong>Erro!</strong>,
        html: <i>{errorMessage}</i>,
        icon: 'error'
    })
    return false;
}
```

#### Explicação da correção:
- **useEffect():** Adicionado `.catch()` para tratar erros ao carregar usuários inicialmente
- **deleteUser():** Convertido para async/await com try/catch completo
- **createUser():** Melhorado tratamento de erro para diferenciar tipos
- **Mensagens específicas:**
  - Timeout: "Tempo de espera esgotado. Tente novamente."
  - Sem conexão: "Sem conexão com o servidor. Verifique sua internet."
  - Erro 400: Mensagem específica da API ou genérica
  - Erro 404: "Usuário não encontrado."
  - Erro 500: "Erro no servidor. Tente novamente mais tarde."
- **Prevenção de crashes:** Aplicação não quebra mais em caso de erro de rede
- **Melhor UX:** Usuário recebe mensagens claras sobre o que aconteceu

#### Teste pós-correção:
1. **Teste de erro de rede:**
   - Desconectar internet
   - Tentar criar/deletar usuário
   - ✅ Verificar mensagem: "Sem conexão com o servidor..."
   
2. **Teste de timeout:**
   - Simular timeout (se possível)
   - ✅ Verificar mensagem: "Tempo de espera esgotado..."
   
3. **Teste de erro 400:**
   - Enviar dados inválidos
   - ✅ Verificar mensagem específica do erro
   
4. **Teste de API offline:**
   - Parar o backend
   - Carregar página
   - ✅ Verificar que aplicação não quebra
   - ✅ Verificar que lista fica vazia sem erro

**Status:** ✅ Correção aplicada

---

## Bug #007 - Empresas hardcoded no Frontend ao invés de buscar da API

**Severidade:** Alta  
**Prioridade:** Alta  
**Status:** ✅ Corrigido  
**Localização:** Frontend - Componente NewUserModal

### Descrição
O componente `NewUserModal` possui uma lista de empresas hardcoded (fixa no código) ao invés de buscar da API `/api/company`. Isso faz com que apenas 3 empresas apareçam no multiselect, mesmo que a API retorne 4 empresas disponíveis.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`  
**Linha problemática:** 32

### Causa raiz

**Código problemático:**
```typescript
const [selectCompanies] = useState([{id:4, name: "Empresa 1"}, {id:5, name: "Empresa 2"}, {id:6, name: "Empresa 3"}])
```

#### Explicação técnica detalhada:

1. **Empresas hardcoded:**
   - A lista de empresas está fixa no código com apenas 3 itens
   - IDs e nomes são fictícios: `[{id:4, name: "Empresa 1"}, ...]`
   - Não reflete as empresas reais do banco de dados

2. **Problemas causados:**
   - Se a API retornar 4 empresas, apenas 3 aparecem no frontend
   - Se novas empresas forem criadas, não aparecem no formulário
   - Se empresas forem deletadas, ainda aparecem no formulário
   - IDs podem não corresponder às empresas reais
   - Nomes são genéricos ("Empresa 1", "Empresa 2") ao invés dos nomes reais

3. **Comportamento esperado:**
   - O componente deve buscar empresas da API `/api/company` quando o modal abrir
   - Deve exibir todas as empresas retornadas pela API
   - Deve atualizar automaticamente quando empresas forem criadas/deletadas

### Passos para reproduzir
1. Verificar quantas empresas existem via API: GET `http://localhost:8400/api/company`
2. Abrir o frontend: `http://localhost:5400`
3. Clicar em "Novo Usuário"
4. Observar o campo de seleção de empresas
5. **Bug:** Apenas 3 empresas aparecem, mesmo que a API retorne mais

### Comportamento esperado
- Todas as empresas retornadas pela API devem aparecer no multiselect
- Nomes das empresas devem ser os reais do banco de dados
- IDs devem corresponder aos IDs reais das empresas
- Se houver scroll no multiselect, todas as empresas devem estar acessíveis

### Comportamento atual
- Apenas 3 empresas hardcoded aparecem
- Nomes são genéricos ("Empresa 1", "Empresa 2", "Empresa 3")
- Não reflete empresas reais do banco
- Se API retornar 4 empresas, a 4ª não aparece

### Correção aplicada

**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

#### Código anterior (com bug):
```typescript
const [selectCompanies] = useState([{id:4, name: "Empresa 1"}, {id:5, name: "Empresa 2"}, {id:6, name: "Empresa 3"}])

// SEM busca da API
```

#### Código corrigido:
```typescript
const [selectCompanies, setSelectCompanies] = useState<Company[]>([])
const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)

// Buscar empresas da API quando o modal abrir
useEffect(() => {
    if (isOpen) {
        loadCompanies();
    }
}, [isOpen])

async function loadCompanies() {
    setIsLoadingCompanies(true);
    try {
        const response = await api.get<CompanyApiResponse[]>('company');
        // Mapear dados da API para o formato esperado pelo Multiselect
        const companiesFormatted = response.data.map(company => ({
            id: company.id_company,
            name: company.name
        }));
        setSelectCompanies(companiesFormatted);
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        await MySwal.fire({
            title: <strong>Erro!</strong>,
            html: <i>Erro ao carregar empresas. Tente novamente.</i>,
            icon: 'error'
        });
        setSelectCompanies([]);
    } finally {
        setIsLoadingCompanies(false);
    }
}

// Multiselect com placeholder dinâmico e disabled durante loading
<Multiselect
    placeholder={isLoadingCompanies ? "Carregando empresas..." : "Empresas"}
    disabled={isLoadingCompanies}
    options={selectCompanies}
    // ...
/>
```

#### Explicação da correção:
- Removida lista hardcoded de empresas
- Adicionado `useEffect` que busca empresas da API quando o modal abre
- Função `loadCompanies()` busca empresas de `/api/company`
- Dados da API são mapeados para o formato esperado pelo Multiselect (`id_company` → `id`)
- Adicionado estado de loading para empresas (`isLoadingCompanies`)
- Multiselect mostra "Carregando empresas..." durante o carregamento
- Multiselect fica desabilitado durante o carregamento
- Tratamento de erro caso a API falhe
- Todas as empresas retornadas pela API agora aparecem no multiselect

#### Teste pós-correção:
1. Verificar quantas empresas existem via API: GET `/api/company`
2. Abrir frontend e clicar em "Novo Usuário"
3. ✅ Verificar que todas as empresas da API aparecem no multiselect
4. ✅ Verificar que os nomes são os reais das empresas (não "Empresa 1", etc.)
5. ✅ Verificar que se houver scroll, todas as empresas estão acessíveis
6. Criar uma nova empresa via API
7. Abrir modal novamente
8. ✅ Verificar que a nova empresa aparece na lista

**Status:** ✅ Correção aplicada

---

## Resumo Estatístico

| Bug ID | Severidade | Status | Correção |
|--------|------------|--------|----------|
| #001   | Alta       | ✅ Corrigido | Aplicada |
| #002   | Média      | ✅ Corrigido | Aplicada |
| #003   | Alta       | ✅ Corrigido | Aplicada |
| #004   | Média      | ✅ Corrigido | Aplicada |
| #005   | Baixa      | ✅ Corrigido | Aplicada |
| #006   | Média      | ✅ Corrigido | Aplicada |
| #007   | Alta       | ✅ Corrigido | Aplicada |

---

## Bug #008 - Falta de validações de formato e tamanho nos campos do formulário

**Severidade:** Média  
**Prioridade:** Média  
**Status:** ✅ Corrigido  
**Localização:** Frontend - Componente NewUserModal

### Descrição
O formulário de cadastro não valida o formato e tamanho mínimo/máximo dos campos antes de enviar para a API. Isso permite que dados inválidos sejam enviados e pode causar problemas na API ou no banco de dados.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

### Causa raiz

#### Explicação técnica detalhada:

1. **Campos sem validação:**
   - **Nome:** Não valida tamanho mínimo (2 caracteres) nem máximo (100 caracteres)
   - **Email:** Não valida se contém o símbolo `@` (formato básico)
   - **Telefone:** Não valida se contém apenas números, nem tamanho mínimo/máximo
   - **Cidade de nascimento:** Não valida tamanho mínimo/máximo

2. **Problemas causados:**
   - Usuário pode cadastrar nome com apenas 1 caractere
   - Usuário pode cadastrar email sem `@` (ex: "usuario.com")
   - Usuário pode cadastrar telefone com letras ou caracteres especiais
   - Usuário pode cadastrar cidade com apenas 1 caractere
   - Dados inválidos podem chegar na API e causar erros

3. **Boas práticas:**
   - Validação deve ocorrer no frontend para melhor UX (feedback imediato)
   - Validação também deve existir no backend (defesa em profundidade)
   - Mensagens de erro devem ser claras e específicas

### Passos para reproduzir
1. Acessar http://localhost:5400
2. Clicar em "Novo Usuário"
3. Preencher campos com dados inválidos:
   - Nome: "A" (apenas 1 caractere)
   - Email: "usuario.com" (sem @)
   - Telefone: "abc123" (com letras)
   - Cidade: "X" (apenas 1 caractere)
4. Clicar em "Salvar"
5. **Bug:** Sistema aceita e tenta enviar dados inválidos

### Comportamento esperado
- Sistema deve validar cada campo antes de enviar
- Deve exibir mensagens de erro claras para cada campo inválido
- Deve impedir o envio do formulário se houver campos inválidos
- Validações devem ser:
  - **Nome:** Mínimo 2 caracteres, máximo 100 caracteres
  - **Email:** Deve conter `@`
  - **Telefone:** Apenas números, mínimo 8 caracteres, máximo 15 caracteres (se preenchido)
  - **Cidade:** Mínimo 2 caracteres, máximo 100 caracteres (se preenchida)

### Comportamento atual
- Sistema não valida formato nem tamanho dos campos
- Aceita dados inválidos e tenta enviar para API
- Não há feedback claro sobre o que está errado
- Usuário só descobre o erro após tentar salvar

### Correção aplicada

**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

#### Código anterior (sem validações):
```typescript
async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();
    
    // SEM validações de formato/tamanho
    const success = await createUser({ ... })
}
```

#### Código corrigido:
```typescript
// Funções de validação individual para cada campo
function validateName(value: string): boolean {
    if (!value || value.trim().length === 0) return false;
    if (value.trim().length < 2 || value.trim().length > 100) return false;
    return true;
}

function validateEmail(value: string): boolean {
    if (!value || value.trim().length === 0) return false;
    if (!value.includes('@')) return false;
    return true;
}

function validateTelephone(value: string): boolean {
    if (!value || value.trim().length === 0) return true; // Opcional
    const phoneNumbersOnly = value.replace(/\D/g, '');
    if (phoneNumbersOnly.length !== value.trim().length) return false;
    if (value.trim().length < 8 || value.trim().length > 15) return false;
    return true;
}

function validateBirthCity(value: string): boolean {
    if (!value || value.trim().length === 0) return true; // Opcional
    if (value.trim().length < 2 || value.trim().length > 100) return false;
    return true;
}

// Função para validar todos os campos antes de enviar
async function validateForm(): Promise<boolean> {
    // Validação do Nome
    if (!name || name.trim().length === 0) {
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>O campo Nome é obrigatório!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        return false;
    }
    
    if (name.trim().length < 2) {
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>O campo Nome deve ter no mínimo 2 caracteres!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        return false;
    }
    
    if (name.trim().length > 100) {
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>O campo Nome deve ter no máximo 100 caracteres!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        return false;
    }

    // Validação do Email
    if (!email || email.trim().length === 0) {
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>O campo Email é obrigatório!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        return false;
    }
    
    if (!email.includes('@')) {
        await MySwal.fire({
            title: <strong>Atenção!</strong>,
            html: <i>O campo Email deve conter o símbolo @!</i>,
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        return false;
    }

    // Validação do Telefone (se preenchido)
    if (telephone && telephone.trim().length > 0) {
        const phoneNumbersOnly = telephone.replace(/\D/g, '');
        if (phoneNumbersOnly.length !== telephone.trim().length) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Telefone deve conter apenas números!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        const phoneLength = telephone.trim().length;
        if (phoneLength < 8) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Telefone deve ter no mínimo 8 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        if (phoneLength > 15) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Telefone deve ter no máximo 15 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
    }

    // Validação da Cidade de nascimento (se preenchida)
    if (birth_city && birth_city.trim().length > 0) {
        const cityLength = birth_city.trim().length;
        if (cityLength < 2) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Cidade de nascimento deve ter no mínimo 2 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        if (cityLength > 100) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Cidade de nascimento deve ter no máximo 100 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
    }

    return true;
}

async function handleCreateNewUser(event: FormEvent){
    event.preventDefault();
    
    if (isLoading) return;
    
    // Valida todos os campos antes de enviar
    const isValid = await validateForm();
    if (!isValid) {
        return; // Impede envio se houver erro
    }
    
    // ... resto do código ...
}
```

#### Adições nos inputs:
```typescript
// Input de Telefone com filtro para aceitar apenas números
<input
    placeholder="Telefone"
    type="text"
    value={telephone}
    maxLength={15}
    onChange={event => {
        // Permite apenas números
        const value = event.target.value.replace(/\D/g, '');
        setTelephone(value);
    }}/>

// Inputs com maxLength para limitar caracteres
<input
    placeholder="Nome"
    type="text"
    required
    value={name}
    maxLength={100}
    onChange={event => setName(event.target.value)}/>

<input
    placeholder="Email"
    type="email"
    required
    value={email}
    onChange={event => setEmail(event.target.value)}/>

<input
    placeholder="Cidade de nascimento"
    type="text"
    value={birth_city}
    maxLength={100}
    onChange={event => setBirth_city(event.target.value)}/>
```

#### Explicação da correção:
- **Funções de validação individuais:** Criadas para cada campo (validateName, validateEmail, validateTelephone, validateBirthCity)
- **Função validateForm():** Centraliza todas as validações e retorna `boolean`
- **Validações implementadas:**
  - **Nome:** Obrigatório, mínimo 2 caracteres, máximo 100 caracteres
  - **Email:** Obrigatório, deve conter `@`
  - **Telefone:** Opcional, se preenchido: apenas números, mínimo 8, máximo 15 caracteres
  - **Cidade:** Opcional, se preenchida: mínimo 2, máximo 100 caracteres
- **Mensagens de erro claras:** Cada validação exibe mensagem específica via SweetAlert
- **Prevenção de envio:** Formulário não é enviado se houver campos inválidos
- **Filtro em tempo real:** Campo telefone aceita apenas números enquanto o usuário digita
- **maxLength nos inputs:** Limita caracteres diretamente no HTML para melhor UX

#### Teste pós-correção:
1. Tentar cadastrar com nome de 1 caractere
   - ✅ Verificar mensagem: "O campo Nome deve ter no mínimo 2 caracteres!"
   
2. Tentar cadastrar com email sem @
   - ✅ Verificar mensagem: "O campo Email deve conter o símbolo @!"
   
3. Tentar cadastrar com telefone contendo letras
   - ✅ Verificar que apenas números são aceitos enquanto digita
   - ✅ Se ainda houver letras, verificar mensagem: "O campo Telefone deve conter apenas números!"
   
4. Tentar cadastrar com cidade de 1 caractere
   - ✅ Verificar mensagem: "O campo Cidade de nascimento deve ter no mínimo 2 caracteres!"
   
5. Tentar cadastrar com dados válidos
   - ✅ Verificar que o formulário é enviado normalmente

**Status:** ✅ Correção aplicada

---

## Bug #009 - Falta de feedback visual positivo quando campos estão corretos

**Severidade:** Baixa  
**Prioridade:** Baixa  
**Status:** ✅ Corrigido  
**Localização:** Frontend - Componente NewUserModal

### Descrição
O formulário não exibe nenhum feedback visual quando os campos estão preenchidos corretamente. O usuário só recebe feedback quando há erro, não quando o campo está válido.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

### Causa raiz

#### Explicação técnica detalhada:

1. **Falta de feedback positivo:**
   - Quando o usuário preenche um campo corretamente e passa para o próximo, não há indicação visual
   - O usuário só sabe se está correto quando tenta salvar e não há erro
   - Isso prejudica a experiência do usuário (UX)

2. **Boas práticas de UX:**
   - Feedback imediato melhora a experiência do usuário
   - Mensagens de sucesso aumentam a confiança do usuário
   - Validação em tempo real (onBlur) é uma prática comum em formulários modernos

### Passos para reproduzir
1. Acessar http://localhost:5400
2. Clicar em "Novo Usuário"
3. Preencher o campo "Nome" com valor válido (ex: "João Silva")
4. Clicar no campo seguinte (Email)
5. **Bug:** Não há nenhuma indicação de que o campo Nome está correto

### Comportamento esperado
- Quando o usuário preenche um campo corretamente e passa para o próximo (onBlur)
- Deve exibir uma mensagem verde abaixo do campo indicando que está válido
- Mensagem deve aparecer apenas quando o campo está correto
- Mensagem deve desaparecer quando o usuário começa a editar novamente

### Comportamento atual
- Não há feedback visual quando campos estão corretos
- Usuário só recebe feedback quando há erro
- Não há confirmação de que o campo está preenchido corretamente

### Correção aplicada

**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`

#### Código anterior (sem feedback positivo):
```typescript
<input
    placeholder="Nome"
    type="text"
    required
    value={name}
    onChange={event => setName(event.target.value)}/>
```

#### Código corrigido:
```typescript
// Estados para controlar validação de cada campo
const [nameValid, setNameValid] = useState<boolean | null>(null)
const [emailValid, setEmailValid] = useState<boolean | null>(null)
const [telephoneValid, setTelephoneValid] = useState<boolean | null>(null)
const [birthCityValid, setBirthCityValid] = useState<boolean | null>(null)

// Inputs com validação onBlur e mensagem de sucesso
<div>
    <input
        placeholder="Nome"
        type="text"
        required
        value={name}
        maxLength={100}
        onChange={event => {
            setName(event.target.value);
            setNameValid(null); // Reset validação ao digitar
        }}
        onBlur={() => {
            if (name.trim().length > 0) {
                setNameValid(validateName(name));
            }
        }}/>
    {nameValid === true && (
        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            ✓ Nome válido
        </span>
    )}
</div>

<div>
    <input
        placeholder="Email"
        type="email"
        required
        value={email}
        onChange={event => {
            setEmail(event.target.value);
            setEmailValid(null);
        }}
        onBlur={() => {
            if (email.trim().length > 0) {
                setEmailValid(validateEmail(email));
            }
        }}/>
    {emailValid === true && (
        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            ✓ Email válido
        </span>
    )}
</div>

<div>
    <input
        placeholder="Telefone"
        type="text"
        value={telephone}
        maxLength={15}
        onChange={event => {
            const value = event.target.value.replace(/\D/g, '');
            setTelephone(value);
            setTelephoneValid(null);
        }}
        onBlur={() => {
            if (telephone.trim().length > 0) {
                setTelephoneValid(validateTelephone(telephone));
            }
        }}/>
    {telephoneValid === true && (
        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            ✓ Telefone válido
        </span>
    )}
</div>

<div>
    <input
        placeholder="Cidade de nascimento"
        type="text"
        value={birth_city}
        maxLength={100}
        onChange={event => {
            setBirth_city(event.target.value);
            setBirthCityValid(null);
        }}
        onBlur={() => {
            if (birth_city.trim().length > 0) {
                setBirthCityValid(validateBirthCity(birth_city));
            }
        }}/>
    {birthCityValid === true && (
        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
            ✓ Cidade válida
        </span>
    )}
</div>
```

#### Explicação da correção:
- **Estados de validação:** Criados para cada campo (`nameValid`, `emailValid`, `telephoneValid`, `birthCityValid`)
- **Validação onBlur:** Quando o usuário sai do campo (clica no próximo), valida automaticamente
- **Mensagens de sucesso:** Exibidas em verde abaixo do campo quando válido
- **Reset ao editar:** Quando o usuário começa a digitar novamente, a mensagem desaparece
- **Apenas campos preenchidos:** Validação só ocorre se o campo tiver conteúdo
- **Campos opcionais:** Telefone e Cidade só validam se preenchidos
- **Melhora UX:** Usuário recebe confirmação imediata de que o campo está correto

#### Teste pós-correção:
1. Preencher campo "Nome" com valor válido (ex: "João Silva")
2. Clicar no campo seguinte (Email)
3. ✅ Verificar que aparece mensagem verde "✓ Nome válido" abaixo do campo Nome
4. Começar a editar o campo Nome novamente
5. ✅ Verificar que a mensagem desaparece
6. Repetir para Email, Telefone e Cidade
7. ✅ Verificar que mensagens aparecem apenas quando campos estão corretos

**Status:** ✅ Correção aplicada

---

## Bug #010 - Quadrado branco aparece no dropdown de empresas do Multiselect

**Severidade:** Baixa  
**Prioridade:** Baixa  
**Status:** ✅ Corrigido  
**Localização:** Frontend - Componente Multiselect

### Descrição
O componente Multiselect exibe um quadrado branco grande dentro das opções do dropdown de empresas, ocupando espaço desnecessário e prejudicando a visualização das empresas.

### Localização
**Arquivo:** `frontend/src/components/NewUserModal/index.tsx`  
**Arquivo:** `frontend/src/styles/global.ts`

### Causa raiz

#### Explicação técnica detalhada:

1. **Elemento visual indesejado:**
   - O Multiselect renderiza elementos vazios ou com background branco dentro das opções
   - Esses elementos aparecem como um quadrado branco grande
   - Ocupam espaço vertical significativo, limitando quantas empresas são visíveis

2. **Problema de CSS:**
   - O componente Multiselect tem estilos padrão que incluem placeholders de imagem
   - Esses placeholders aparecem mesmo quando não há imagem
   - CSS não estava ocultando esses elementos vazios

### Passos para reproduzir
1. Acessar http://localhost:5400
2. Clicar em "Novo Usuário"
3. Clicar no campo "Selecione as empresas"
4. Observar o dropdown aberto
5. **Bug:** Ver um quadrado branco grande dentro das opções

### Comportamento esperado
- Dropdown deve exibir apenas o nome da empresa e o checkbox
- Não deve haver quadrados brancos ou elementos vazios
- Layout deve ser limpo e mostrar apenas o texto necessário

### Comportamento atual
- Quadrado branco grande aparece dentro das opções
- Ocupa espaço vertical desnecessário
- Prejudica a visualização das empresas

### Correção aplicada

**Arquivo:** `frontend/src/styles/global.ts`

#### Código anterior (sem tratamento do quadrado):
```css
/* SEM regras CSS para ocultar elementos vazios */
```

#### Código corrigido:
```css
/* Estilos para Multiselect - Remover quadrado branco e exibir apenas nomes das empresas */
.multiSelectContainer {
    width: 100% !important;
    
    .optionListContainer {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #d7d7d7;
        border-radius: 0.25rem;
    }
    
    .option {
        padding: 0.75rem 1rem !important;
        font-size: 1rem;
        display: flex !important;
        align-items: center !important;
        min-height: auto !important;
        height: auto !important;
        line-height: 1.5 !important;
        
        /* Remover TODOS os elementos que podem aparecer como quadrado branco */
        > div:empty,
        > span:empty,
        > div[style*="background-color: white"],
        > div[style*="background-color: #fff"],
        > div[style*="background-color: #ffffff"],
        > div[style*="background: white"],
        > div[style*="background: #fff"],
        > div[style*="background: #ffffff"],
        img:not([src]),
        img[src=""],
        img[src*="placeholder"],
        [class*="placeholder"],
        [class*="empty"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            visibility: hidden !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* Garantir que apenas o texto (nome da empresa) apareça */
        span:not(:empty):not([class*="placeholder"]):not([class*="empty"]),
        label {
            margin-left: 0 !important;
            padding-left: 0 !important;
            width: 100% !important;
            display: block !important;
            text-align: left !important;
            color: var(--title) !important;
        }
        
        /* Ajustar checkbox */
        input[type="checkbox"] {
            margin-right: 0.75rem;
            flex-shrink: 0;
            width: 18px;
            height: 18px;
        }
    }
}

/* Regras específicas para remover quadrados brancos */
.multiSelectContainer .option > div:empty,
.multiSelectContainer .option > span:empty,
.multiSelectContainer .option > div[style*="background-color: white"],
.multiSelectContainer .option > div[style*="background-color: #fff"],
.multiSelectContainer .option > div[style*="background-color: #ffffff"] {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    visibility: hidden !important;
}
```

#### Explicação da correção:
- **CSS específico:** Adicionadas regras para ocultar elementos vazios ou com background branco
- **Múltiplos seletores:** Cobre diferentes formas que o quadrado pode aparecer (div vazio, span vazio, background branco)
- **Ocultação completa:** Usa `display: none`, `width: 0`, `height: 0` e `visibility: hidden` para garantir remoção
- **Layout limpo:** Garante que apenas texto e checkbox apareçam
- **Scroll funcional:** Mantém scroll para exibir todas as empresas quando necessário

#### Teste pós-correção:
1. Abrir modal de cadastro
2. Clicar no campo "Selecione as empresas"
3. ✅ Verificar que não há quadrado branco nas opções
4. ✅ Verificar que apenas nomes das empresas e checkboxes aparecem
5. ✅ Verificar que todas as empresas são visíveis com scroll
6. ✅ Verificar que layout está limpo e organizado

**Status:** ✅ Correção aplicada

---

## Resumo Estatístico

| Bug ID | Severidade | Status | Correção |
|--------|------------|--------|----------|
| #001   | Alta       | ✅ Corrigido | Aplicada |
| #002   | Média      | ✅ Corrigido | Aplicada |
| #003   | Alta       | ✅ Corrigido | Aplicada |
| #004   | Média      | ✅ Corrigido | Aplicada |
| #005   | Baixa      | ✅ Corrigido | Aplicada |
| #006   | Média      | ✅ Corrigido | Aplicada |
| #007   | Alta       | ✅ Corrigido | Aplicada |
| #008   | Média      | ✅ Corrigido | Aplicada |
| #009   | Baixa      | ✅ Corrigido | Aplicada |
| #010   | Baixa      | ✅ Corrigido | Aplicada |

---

## Bug #011 - Vulnerabilidade de SQL Injection no Backend

**Severidade:** Crítica  
**Prioridade:** Alta  
**Status:** ⚠️ Documentado (Não corrigido - requer refatoração significativa)  
**Localização:** Backend - Classes Database (UserContr.php, CompanyContr.php)

### Descrição
O código utiliza `prepare()` e `execute()` do PDO, porém as queries SQL são construídas através de concatenação de strings antes de serem preparadas. Isso torna o código vulnerável a SQL Injection, pois os valores são inseridos diretamente na string SQL ao invés de serem passados como parâmetros preparados.

### Localização
**Arquivos afetados:**
- `backend/Classes/Database/UserContr.php`
  - `insertUser()` - linha 21-22
  - `insertUserCompanies()` - linha 43-44
  - `getUser()` - linha 70, 72
  - `updateUser()` - linha 118-119, 124
  - `deleteUser()` - linha 143
- `backend/Classes/Database/CompanyContr.php`
  - `getCompany()` - linha 33
  - `insertCompany()` - linha 86-87
  - `updateCompany()` - linha 108-109, 114
  - `deleteCompany()` - linha 134

### Causa raiz

#### Explicação técnica detalhada:

1. **Uso incorreto de Prepared Statements:**
   - O código usa `$stmt = $this->mysql->prepare($query)` e `$stmt->execute()`
   - Porém, a query é construída ANTES com concatenação de strings
   - Os valores são inseridos diretamente na string SQL usando `implode()` ou concatenação com `"`
   - Isso anula completamente a proteção dos prepared statements

2. **Exemplo do problema:**

**Código atual (vulnerável):**
```php
// UserContr.php - insertUser()
$query = 'INSERT INTO user ('.implode(', ', array_keys($data)).')
        VALUES ("'.implode('", "', $data).'")';

$stmt = $this->mysql->prepare($query);
$stmt->execute();
```

**Problema:**
- Se `$data['name']` contiver `"; DROP TABLE user; --`, a query se torna:
  ```sql
  INSERT INTO user (name) VALUES (""; DROP TABLE user; --")
  ```
- O banco de dados executará o comando malicioso
- Mesmo usando `prepare()`, a query já está montada com valores injetados

3. **Por que é crítico:**
   - **SQL Injection** é uma das vulnerabilidades mais graves em aplicações web
   - Permite que atacantes:
     - Acessem dados não autorizados
     - Modifiquem ou deletem dados
     - Executem comandos SQL arbitrários
     - Potencialmente comprometam todo o banco de dados
   - OWASP Top 10 lista SQL Injection como vulnerabilidade crítica

4. **Outros métodos vulneráveis:**

**getUser() - ID injetado diretamente:**
```php
$query = '... WHERE user_company.id_user = "'.$id_user.'"';
// Se $id_user = '1" OR "1"="1', retorna todos os usuários
```

**updateUser() - Valores injetados diretamente:**
```php
foreach ($data as $key => $value) {
    $values[] = $key.' = "'.$value.'"';
}
// Se $value contiver SQL malicioso, será executado
```

### Passos para reproduzir

#### Exemplo 1 - SQL Injection em insertUser:
1. Abrir Postman
2. Criar requisição POST para `http://localhost:8400/api/user/create`
3. Enviar corpo JSON malicioso:
```json
{
  "name": "Teste'; DROP TABLE user; --",
  "email": "teste@empresa.com",
  "companies": [1]
}
```
4. **Risco:** Se o sistema não sanitizar adequadamente, pode executar SQL malicioso

#### Exemplo 2 - SQL Injection em getUser:
1. Abrir Postman
2. Criar requisição GET para `http://localhost:8400/api/user/1" OR "1"="1`
3. **Risco:** Pode retornar todos os usuários ao invés de apenas o ID 1

### Comportamento esperado
- Todas as queries devem usar **parâmetros nomeados** ou **placeholders** (`:param`)
- Valores nunca devem ser concatenados diretamente na string SQL
- PDO deve fazer o binding dos valores após preparar a query
- Exemplo correto:
  ```php
  $query = 'INSERT INTO user (name, email) VALUES (:name, :email)';
  $stmt = $this->mysql->prepare($query);
  $stmt->execute([':name' => $data['name'], ':email' => $data['email']]);
  ```

### Comportamento atual
- Queries são construídas com concatenação de strings
- Valores são inseridos diretamente na SQL antes de `prepare()`
- Sistema está vulnerável a SQL Injection
- Mesmo usando `prepare()`, não há proteção real

### Impacto
- **Segurança:** Crítico - vulnerabilidade de segurança grave
- **Integridade de dados:** Alto risco de corrupção ou perda de dados
- **Conformidade:** Viola práticas de segurança OWASP
- **Produção:** Sistema não deve ir para produção com esta vulnerabilidade

### Correção sugerida

**Refatoração completa necessária:**

#### Exemplo de correção para insertUser():
```php
public function insertUser($data)
{
    // Construir query com placeholders
    $columns = array_keys($data);
    $placeholders = array_map(function($col) { return ':'.$col; }, $columns);
    
    $query = 'INSERT INTO user ('.implode(', ', $columns).')
            VALUES ('.implode(', ', $placeholders).')';
    
    $stmt = $this->mysql->prepare($query);
    
    // Binding seguro dos valores
    $params = [];
    foreach ($data as $key => $value) {
        $params[':'.$key] = $value;
    }
    
    $stmt->execute($params);
    
    // ... resto do código ...
}
```

#### Exemplo de correção para getUser():
```php
public function getUser($id_user)
{
    $query = 'SELECT user.*, ...
              WHERE user_company.id_user = :id_user
              AND id_user = :id_user
              AND user.show = 1';
    
    $stmt = $this->mysql->prepare($query);
    $stmt->execute([':id_user' => $id_user]);
    
    // ... resto do código ...
}
```

#### Exemplo de correção para updateUser():
```php
public function updateUser($id_user, $data)
{
    $setParts = [];
    $params = [':id_user' => $id_user];
    
    foreach ($data as $key => $value) {
        $setParts[] = $key.' = :'.$key;
        $params[':'.$key] = $value;
    }
    
    $query = 'UPDATE user
            SET '.implode(', ', $setParts).'
            WHERE user.id_user = :id_user';
    
    $stmt = $this->mysql->prepare($query);
    $stmt->execute($params);
    
    // ... resto do código ...
}
```

### Observações importantes

1. **Por que não foi corrigido:**
   - Esta é uma vulnerabilidade crítica que requer refatoração significativa
   - Todos os métodos de `UserContr` e `CompanyContr` precisam ser reescritos
   - Como analista de QA, identifiquei e documentei o problema
   - A correção deve ser feita pela equipe de desenvolvimento com revisão de segurança

2. **Testes realizados:**
   - Testes de API foram realizados via Postman com dados válidos
   - Não foram realizados testes de penetração (penetration testing) para explorar a vulnerabilidade
   - Recomenda-se realizar testes de segurança específicos antes de ir para produção

3. **Recomendações:**
   - **Curto prazo:** Implementar validação rigorosa de entrada no backend
   - **Médio prazo:** Refatorar todas as queries para usar parâmetros preparados corretamente
   - **Longo prazo:** Implementar code review de segurança e testes automatizados de segurança

**Status:** ⚠️ Documentado - Requer correção pela equipe de desenvolvimento

---

## Resumo Estatístico

| Bug ID | Severidade | Status | Correção |
|--------|------------|--------|----------|
| #001   | Alta       | ✅ Corrigido | Aplicada |
| #002   | Média      | ✅ Corrigido | Aplicada |
| #003   | Alta       | ✅ Corrigido | Aplicada |
| #004   | Média      | ✅ Corrigido | Aplicada |
| #005   | Baixa      | ✅ Corrigido | Aplicada |
| #006   | Média      | ✅ Corrigido | Aplicada |
| #007   | Alta       | ✅ Corrigido | Aplicada |
| #008   | Média      | ✅ Corrigido | Aplicada |
| #009   | Baixa      | ✅ Corrigido | Aplicada |
| #010   | Baixa      | ✅ Corrigido | Aplicada |
| #011   | Crítica    | ⚠️ Documentado | Requer refatoração |

**Total de bugs encontrados:** 11  
**Total de bugs corrigidos:** 10  
**Total de bugs documentados (não corrigidos):** 1  
**Total de bugs abertos:** 0

---

## Notas sobre Testes Automatizados

**Data:** 03/02/2026

### Implementação Cypress

**Testes de API:** ✅ 100% funcionando (33/33 testes passando)
- Todos os endpoints testados e validados
- Correções aplicadas para status codes corretos
- Arquivos: `cypress/e2e/api/home.cy.ts`, `user.cy.ts`, `company.cy.ts`

**Testes E2E:** ⚠️ 36% funcionando (5/14 testes passando)
- Problema técnico: Modal não sendo encontrado em alguns testes
- Validações funcionando quando modal é detectado corretamente
- Arquivo: `cypress/e2e/frontend/cadastro_usuario.cy.ts`

### Informações Técnicas

**Frontend:**
- URL: http://localhost:5400/
- Botão para abrir modal: `button#new-user` (contém "+ Novo Usuário")
- Modal: `.react-modal-content` (react-modal renderiza em portal)
- Overlay: `.react-modal-overlay` (verificado antes do conteúdo)
- Botão de salvar: `button[type="submit"]` dentro do modal

**Custom Commands Criados:**
- `cy.createUserViaAPI(userData)` - Cria usuário via API
- `cy.deleteUserViaAPI(userId)` - Deleta usuário via API
- `cy.getAllUsersViaAPI()` - Busca todos os usuários
- `cy.getUserViaAPI(userId)` - Busca usuário por ID
- `cy.createCompanyViaAPI(companyData)` - Cria empresa via API
- `cy.getAllCompaniesViaAPI()` - Busca todas as empresas
- `cy.openNewUserModal()` - Abre modal de cadastro
- `cy.fillUserForm(formData)` - Preenche formulário

**Correções Aplicadas:**
1. Seletor do modal corrigido de `[role="dialog"]` para `.react-modal-content`
2. Verificação do overlay `.react-modal-overlay` antes do conteúdo
3. Timeouts aumentados para 15 segundos em operações críticas
4. Remoção de verificações redundantes
5. Uso de `availableCompanies` do `before()` ao invés de requests dentro dos testes
6. Scroll automático para elementos do dropdown
7. Esperas adequadas entre ações (300ms após abrir modal, 200ms entre seleções)

**Estrutura de Arquivos:**
```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── home.cy.ts
│   │   │   ├── user.cy.ts
│   │   │   └── company.cy.ts
│   │   └── frontend/
│   │       └── cadastro_usuario.cy.ts
│   ├── support/
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── .gitignore
├── cypress.config.ts
└── package.json (scripts adicionados)
```

**Status (07/02/2026):**
- API: 100% passando (33/33)
- E2E: 5/14 na automação; 9 cenários executar manualmente
- Falha principal: `Expected to find content: 'Selecione as empresas'` – multiselect exibe "Carregando empresas..." enquanto carrega

---

## Instruções de Execução dos Testes Automatizados

**Pré-requisitos:** Docker rodando (`docker-compose up -d`), frontend em http://localhost:5400 e API em http://localhost:8400.

```bash
cd frontend
npm install
```

| Comando | Descrição |
|---------|-----------|
| `npm run cypress:run` | Executa todos os testes (API + E2E) |
| `npm run cypress:run:api` | Executa apenas testes de API |
| `npm run cypress:open` | Abre a interface gráfica do Cypress |

**Nota:** 8 cenários E2E devem ser validados manualmente conforme cenários descritos no PLANO_DE_TESTE.md.

---

## Correções Aplicadas (Resumo)

| Bug/Problema | Correção | Arquivo |
|--------------|----------|---------|
| Bug #001 - PATCH retorna 500 | Reordenar condição em `validateBody()` para verificar `$obligatoryParams === null` antes de `array_intersect()` | `backend/Classes/Util/ValidateArgs.php` |
| Bug #002 - Modal fecha em validação de empresa | Só fechar modal quando `createUser` retornar sucesso | `frontend/src/components/NewUserModal/index.tsx` |
| Bug #003 - Usuários deletados aparecem | Adicionar `WHERE user.show = 1` nas queries | `backend/Classes/Database/UserContr.php` |
| Bug #004 - Data futura permitida | Validação no frontend e API | NewUserModal, `UserContr.php` |
| Bug #005-010 | Diversas validações (formato, tamanhos, multiselect, etc.) | Documentados neste relatório |
| Bug #011 - SQL Injection | Documentado (não corrigido – risco identificado) | `UserContr.php`, `CompanyContr.php` |
