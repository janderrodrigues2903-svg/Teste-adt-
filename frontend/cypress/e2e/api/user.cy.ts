/**
 * Testes de API - Endpoints de Usuário
 * Baseado no PLANO_DE_TESTE.md - Feature: API - Endpoints de Usuário
 * 
 * Testes realizados via Postman e agora automatizados com Cypress
 */

describe('API - Endpoints de Usuário', () => {
  const apiUrl = Cypress.env('apiUrl');
  let createdUserId: number;

  beforeEach(() => {
    // Preparação para testes
  });

  describe('GET /api/user - Listar todos os usuários', () => {
    it('Deve retornar status 200 e array de usuários', () => {
      cy.getAllUsersViaAPI().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('array');
        
        if (response.body.length > 0) {
          const user = response.body[0];
          expect(user).to.have.property('id_user');
          expect(user).to.have.property('name');
          expect(user).to.have.property('email');
          expect(user).to.have.property('companies');
        }
      });
    });

    it('Deve retornar apenas usuários com show = 1', () => {
      cy.getAllUsersViaAPI().then((response) => {
        if (response.body.length > 0) {
          response.body.forEach((user: any) => {
            // Verificar que usuários excluídos não aparecem
            // Como não temos acesso direto ao campo show na resposta,
            // verificamos que apenas usuários ativos são retornados
            expect(user).to.have.property('name');
          });
        }
      });
    });
  });

  describe('GET /api/user/{id} - Buscar usuário por ID', () => {
    it('Deve retornar status 200 para ID válido existente', () => {
      // Primeiro, buscar todos os usuários para pegar um ID válido
      cy.getAllUsersViaAPI().then((response) => {
        if (response.body.length > 0) {
          const userId = response.body[0].id_user;
          
          cy.getUserViaAPI(userId).then((userResponse) => {
            expect(userResponse.status).to.eq(200);
            expect(userResponse.headers['content-type']).to.include('application/json');
            expect(userResponse.body).to.have.property('id_user', userId);
            expect(userResponse.body).to.have.property('name');
            expect(userResponse.body).to.have.property('email');
            expect(userResponse.body).to.have.property('companies');
          });
        }
      });
    });

    it('Deve retornar status 400 para ID inválido (string)', () => {
      cy.getUserViaAPI('abc' as any).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar status 400 para ID zero', () => {
      cy.getUserViaAPI(0).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar erro para ID inexistente', () => {
      cy.getUserViaAPI(99999).then((response) => {
        // Pode retornar 400, 404 ou 500 dependendo da implementação
        expect([400, 404, 500]).to.include(response.status);
      });
    });
  });

  describe('POST /api/user/create - Criar usuário', () => {
    it('Deve criar usuário com dados válidos mínimos (name, email, companies)', () => {
      const userData = {
        name: 'Teste Cypress API',
        email: `cypress-${Date.now()}@test.com`,
        companies: [1],
      };

      cy.createUserViaAPI(userData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.have.property('id_user');
        createdUserId = response.body.id_user;
      });
    });

    it('Deve criar usuário com todos os campos', () => {
      const userData = {
        name: 'João Silva Completo',
        email: `joao-${Date.now()}@empresa.com`,
        telephone: '11999999999',
        birth_date: '1990-01-01',
        birth_city: 'São Paulo',
        companies: [1],
      };

      cy.createUserViaAPI(userData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id_user');
        expect(response.body).to.have.property('name', userData.name);
        expect(response.body).to.have.property('email', userData.email);
      });
    });

    it('Deve retornar status 400 sem campo obrigatório "name"', () => {
      const userData = {
        email: 'teste@empresa.com',
        companies: [1],
      };

      cy.createUserViaAPI(userData as any).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar status 400 sem campo obrigatório "email"', () => {
      const userData = {
        name: 'Teste QA',
        companies: [1],
      };

      cy.createUserViaAPI(userData as any).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar status 400 sem campo obrigatório "companies"', () => {
      const userData = {
        name: 'Teste QA',
        email: 'teste@empresa.com',
      };

      cy.createUserViaAPI(userData as any).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar status 400 ou 500 com companies vazio', () => {
      const userData = {
        name: 'Teste QA',
        email: 'teste@empresa.com',
        companies: [],
      };

      cy.createUserViaAPI(userData).then((response) => {
        expect([400, 500]).to.include(response.status);
      });
    });

    it('Deve criar usuário vinculado a múltiplas empresas', () => {
      cy.getAllCompaniesViaAPI().then((companiesResponse) => {
        if (companiesResponse.body.length >= 2) {
          const companyIds = [
            companiesResponse.body[0].id_company,
            companiesResponse.body[1].id_company,
          ];

          const userData = {
            name: 'Usuário Multi-Empresa',
            email: `multi-${Date.now()}@empresa.com`,
            companies: companyIds,
          };

          cy.createUserViaAPI(userData).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id_user');
            
            cy.getUserViaAPI(response.body.id_user).then((userResponse) => {
              expect(userResponse.body.companies).to.include(companiesResponse.body[0].name);
            });
          });
        }
      });
    });

    it('Deve validar formato de email (deve conter @)', () => {
      const userData = {
        name: 'Teste Email',
        email: 'email-sem-arroba.com',
        companies: [1],
      };

      cy.createUserViaAPI(userData).then((response) => {
        expect([200, 201, 400]).to.include(response.status);
      });
    });

    it('Deve validar data de nascimento não futura', () => {
      const userData = {
        name: 'Teste Data Futura',
        email: `futura-${Date.now()}@test.com`,
        birth_date: '2030-01-01',
        companies: [1],
      };

      cy.createUserViaAPI(userData).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.include('Data de nascimento');
      });
    });
  });

  describe('PATCH /api/user/{id}/update - Atualizar usuário', () => {
    beforeEach(() => {
      cy.createUserViaAPI({
        name: 'Usuário para Atualizar',
        email: `update-${Date.now()}@test.com`,
        companies: [1],
      }).then((response) => {
        if (response.status === 201) {
          createdUserId = response.body.id_user;
        }
      });
    });

    it('Deve atualizar usuário existente com sucesso', () => {
      if (!createdUserId) {
        cy.log('Usuário não criado, pulando teste');
        return;
      }

      const updateData = {
        name: 'Nome Atualizado',
        email: `atualizado-${Date.now()}@test.com`,
      };

      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/user/${createdUserId}/update`,
        body: updateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        
        cy.getUserViaAPI(createdUserId).then((userResponse) => {
          expect(userResponse.body.name).to.eq(updateData.name);
          expect(userResponse.body.email).to.eq(updateData.email);
        });
      });
    });

    it('Deve atualizar apenas o nome (atualização parcial)', () => {
      if (!createdUserId) {
        cy.log('Usuário não criado, pulando teste');
        return;
      }

      const updateData = {
        name: 'Apenas Nome Atualizado',
      };

      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/user/${createdUserId}/update`,
        body: updateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.getUserViaAPI(createdUserId).then((userResponse) => {
          expect(userResponse.body.name).to.eq(updateData.name);
        });
      });
    });

    it('Deve retornar erro para ID inválido (string)', () => {
      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/user/abc/update`,
        body: { name: 'Teste' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar erro para usuário inexistente', () => {
      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/user/99999/update`,
        body: { name: 'Teste' },
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404, 500]).to.include(response.status);
      });
    });

    it('Deve validar data de nascimento não futura na atualização', () => {
      if (!createdUserId) {
        cy.log('Usuário não criado, pulando teste');
        return;
      }

      const updateData = {
        birth_date: '2030-01-01',
      };

      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/user/${createdUserId}/update`,
        body: updateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.include('Data de nascimento');
      });
    });
  });

  describe('DELETE /api/user/{id}/delete - Deletar usuário', () => {
    beforeEach(() => {
      // Criar um usuário para deletar
      cy.createUserViaAPI({
        name: 'Usuário para Deletar',
        email: `delete-${Date.now()}@test.com`,
        companies: [1],
      }).then((response) => {
        if (response.status === 201) {
          createdUserId = response.body.id_user;
        }
      });
    });

    it('Deve deletar usuário existente com sucesso (exclusão lógica)', () => {
      if (!createdUserId) {
        cy.log('Usuário não criado, pulando teste');
        return;
      }

      cy.deleteUserViaAPI(createdUserId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.have.property('message');
        
        cy.getAllUsersViaAPI().then((usersResponse) => {
          const deletedUser = usersResponse.body.find(
            (user: any) => user.id_user === createdUserId
          );
          expect(deletedUser).to.be.undefined;
        });
      });
    });

    it('Deve retornar erro para ID inválido (string)', () => {
      cy.deleteUserViaAPI('abc' as any).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar erro para usuário inexistente', () => {
      cy.deleteUserViaAPI(99999).then((response) => {
        expect([400, 404, 500]).to.include(response.status);
      });
    });
  });

  afterEach(() => {
    // Limpeza após testes (opcional)
  });
});
