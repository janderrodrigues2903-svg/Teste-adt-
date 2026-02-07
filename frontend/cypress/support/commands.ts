/// <reference types="cypress" />

/**
 * Custom Commands para testes de API e E2E
 * Seguindo a diretriz de usar Custom Commands ao invés de Page Objects
 */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Cria um usuário via API
       * @example cy.createUserViaAPI({ name: 'João', email: 'joao@test.com', companies: [1] })
       */
      createUserViaAPI(userData: {
        name: string;
        email: string;
        telephone?: string;
        birth_date?: string;
        birth_city?: string;
        companies: number[];
      }): Chainable<Cypress.Response<any>>;

      /**
       * Deleta um usuário via API
       * @example cy.deleteUserViaAPI(1)
       */
      deleteUserViaAPI(userId: number): Chainable<Cypress.Response<any>>;

      /**
       * Busca todos os usuários via API
       * @example cy.getAllUsersViaAPI()
       */
      getAllUsersViaAPI(): Chainable<Cypress.Response<any>>;

      /**
       * Busca um usuário por ID via API
       * @example cy.getUserViaAPI(1)
       */
      getUserViaAPI(userId: number): Chainable<Cypress.Response<any>>;

      /**
       * Cria uma empresa via API
       * @example cy.createCompanyViaAPI({ name: 'Empresa Test', cnpj: '12345678000190', adress: {...} })
       */
      createCompanyViaAPI(companyData: any): Chainable<Cypress.Response<any>>;

      /**
       * Busca todas as empresas via API
       * @example cy.getAllCompaniesViaAPI()
       */
      getAllCompaniesViaAPI(): Chainable<Cypress.Response<any>>;

      /**
       * Abre o modal de cadastro de usuário no frontend
       * @example cy.openNewUserModal()
       */
      openNewUserModal(): Chainable<void>;

      /**
       * Preenche o formulário de cadastro de usuário
       * @example cy.fillUserForm({ name: 'João', email: 'joao@test.com' })
       */
      fillUserForm(formData: {
        name?: string;
        email?: string;
        telephone?: string;
        birth_date?: string;
        birth_city?: string;
        companies?: string[];
      }): Chainable<void>;
    }
  }
}

// Comandos de API
Cypress.Commands.add('createUserViaAPI', (userData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/user/create`,
    body: userData,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('deleteUserViaAPI', (userId) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/api/user/${userId}/delete`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('getAllUsersViaAPI', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/user`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('getUserViaAPI', (userId) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/user/${userId}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('createCompanyViaAPI', (companyData) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/company/create`,
    body: companyData,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('getAllCompaniesViaAPI', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/api/company`,
    failOnStatusCode: false,
  });
});

// Comandos E2E
Cypress.Commands.add('openNewUserModal', () => {
  cy.get('button#new-user', { timeout: 15000 })
    .should('be.visible')
    .should('contain', 'Novo Usuário')
    .click();

  cy.contains('h2', 'Cadastrar novo usuário', { timeout: 15000 }).should('be.visible');
  cy.get('input[placeholder="Nome"]', { timeout: 10000 }).should('be.visible');
  cy.wait(300);
});

Cypress.Commands.add('fillUserForm', (formData) => {
  cy.contains('h2', 'Cadastrar novo usuário', { timeout: 15000 }).should('be.visible');

  if (formData.name) {
    cy.get('input[placeholder="Nome"]').clear().type(formData.name);
  }
  if (formData.email) {
    cy.get('input[placeholder="Email"]').clear().type(formData.email);
  }
  if (formData.telephone) {
    cy.get('input[placeholder="Telefone"]').clear().type(formData.telephone);
  }
  if (formData.birth_date) {
    cy.get('input[type="date"]').clear().type(formData.birth_date);
  }
  if (formData.birth_city) {
    cy.get('input[placeholder="Cidade de nascimento"]').clear().type(formData.birth_city);
  }

  if (formData.companies && formData.companies.length > 0) {
    cy.contains('Selecione as empresas', { timeout: 10000 }).should('be.visible');
    cy.get('.multiSelectContainer').click();
    cy.get('.optionListContainer', { timeout: 10000 }).should('exist');

    formData.companies.forEach((company) => {
      cy.contains('.option', company, { timeout: 5000 }).click({ force: true });
      cy.wait(150);
    });

    cy.get('body').type('{esc}');
    cy.wait(150);
  }
});

export {};
