/**
 * Testes E2E - Cadastro de Usuário no Frontend
 * Baseado no PLANO_DE_TESTE.md - Feature: Cadastro de Usuário (Frontend)
 * 
 * Seguindo diretrizes: Custom Commands ao invés de Page Objects
 */

describe('E2E - Cadastro de Usuário', () => {
  let availableCompanies: string[] = [];

  before(() => {
    cy.request('GET', `${Cypress.env('apiUrl')}/api/company`).then((response) => {
      availableCompanies = response.body.map((c: any) => c.name);
    });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
  });

  describe('Cenário: Cadastrar usuário com todos os dados válidos', () => {
    it('Deve cadastrar usuário com sucesso e fechar o modal', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
      cy.openNewUserModal();

      cy.fillUserForm({
        name: 'João Silva E2E',
        email: `joao-e2e-${Date.now()}@empresa.com`,
        telephone: '11999999999',
        birth_date: '1990-01-01',
        birth_city: 'São Paulo',
        companies: [availableCompanies[0]],
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('button', 'Carregando...', { timeout: 10000 }).should('exist');

      cy.contains('h2', 'Cadastrar novo usuário').should('not.exist', { timeout: 15000 });
      cy.contains('td', 'João Silva E2E', { timeout: 10000 }).should('be.visible');
    });
  });

  describe('Cenário: Validações de campos obrigatórios', () => {
    beforeEach(() => {
      cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
      cy.openNewUserModal();
    });

    it('Deve impedir cadastro sem preencher o nome', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        email: 'teste@empresa.com',
        birth_date: '1990-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.get('input[placeholder="Nome"]:invalid').should('exist');
    });

    it('Deve impedir cadastro sem preencher o email', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        name: 'Teste QA',
        birth_date: '1990-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.get('input[type="email"]:invalid').should('exist');
    });

    it('Deve impedir cadastro sem selecionar empresa', () => {
      cy.fillUserForm({
        name: 'Teste QA',
        email: 'teste@empresa.com',
        birth_date: '1990-01-01',
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('Insira as empresas do usuário!', { timeout: 10000 }).should('be.visible');
      cy.get('.swal2-confirm').click();
      cy.contains('h2', 'Cadastrar novo usuário').should('be.visible');
    });

    it('Deve validar formato de email (deve conter @)', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        name: 'Teste QA',
        email: 'email-sem-arroba.com',
        birth_date: '1990-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('@', { timeout: 10000 }).should('be.visible');
      cy.get('.swal2-confirm').click();
    });

    it('Deve validar data de nascimento não futura', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        name: 'Teste QA',
        email: 'teste@empresa.com',
        birth_date: '2030-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('data de nascimento', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.get('.swal2-confirm').click();
      cy.contains('h2', 'Cadastrar novo usuário').should('be.visible');
    });
  });

  describe('Cenário: Validações de formato e tamanho', () => {
    beforeEach(() => {
      cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
      cy.openNewUserModal();
    });

    it('Deve validar tamanho mínimo do nome (2 caracteres)', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        name: 'A',
        email: 'teste@empresa.com',
        birth_date: '1990-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('input[placeholder="Email"]').click();
      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('mínimo 2 caracteres', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.get('.swal2-confirm').click();
    });

    it('Deve validar que telefone aceita apenas números', () => {
      cy.contains('h2', 'Cadastrar novo usuário', { timeout: 15000 }).should('be.visible');
      cy.get('input[placeholder="Telefone"]').type('abc123');
      cy.get('input[placeholder="Telefone"]').should('have.value', '123');
    });

    it('Deve validar tamanho mínimo do telefone (8 caracteres)', () => {
      if (availableCompanies.length === 0) {
        cy.log('Nenhuma empresa disponível, pulando teste');
        return;
      }

      cy.fillUserForm({
        name: 'Teste QA',
        email: 'teste@empresa.com',
        telephone: '1234567',
        birth_date: '1990-01-01',
        companies: [availableCompanies[0]],
      });

      cy.get('input[placeholder="Cidade de nascimento"]').click();
      cy.get('button[type="submit"]').contains('Salvar').click();
      cy.contains('mínimo 8 caracteres', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.get('.swal2-confirm').click();
    });
  });

  describe('Cenário: Feedback visual positivo', () => {
    beforeEach(() => {
      cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
      cy.openNewUserModal();
    });

    it('Deve exibir mensagem de sucesso quando nome está válido', () => {
      cy.contains('h2', 'Cadastrar novo usuário', { timeout: 10000 }).should('be.visible');
      cy.get('input[placeholder="Nome"]').type('João Silva');
      cy.get('input[placeholder="Email"]').click();
      cy.contains('✓ Nome válido', { timeout: 5000 }).should('be.visible');
      cy.contains('✓ Nome válido').should('have.css', 'color', 'rgb(51, 204, 149)');
    });

    it('Deve exibir mensagem de sucesso quando email está válido', () => {
      cy.contains('h2', 'Cadastrar novo usuário', { timeout: 10000 }).should('be.visible');
      cy.get('input[placeholder="Email"]').type('teste@empresa.com');
      cy.get('input[placeholder="Telefone"]').click();
      cy.contains('✓ Email válido', { timeout: 5000 }).should('be.visible');
    });

    it('Deve exibir mensagem de sucesso quando telefone está válido', () => {
      cy.contains('h2', 'Cadastrar novo usuário', { timeout: 10000 }).should('be.visible');
      cy.get('input[placeholder="Telefone"]').type('11999999999');
      cy.get('input[placeholder="Cidade de nascimento"]').click();
      cy.contains('✓ Telefone válido', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Cenário: Cadastrar usuário vinculado a múltiplas empresas', () => {
    it('Deve cadastrar usuário com múltiplas empresas selecionadas', () => {
      if (availableCompanies.length < 2) {
        cy.log('Menos de 2 empresas disponíveis, pulando teste');
        return;
      }

      cy.get('button#new-user', { timeout: 15000 }).should('be.visible');
      cy.openNewUserModal();

      cy.fillUserForm({
        name: 'Usuário Multi-Empresa',
        email: `multi-${Date.now()}@empresa.com`,
        birth_date: '1990-01-01',
      });

      cy.get('.multiSelectContainer').click();
      cy.get('.optionListContainer').should('exist');
      cy.wait(200);
      cy.contains('.option', availableCompanies[0]).click({ force: true });
      cy.wait(150);
      cy.contains('.option', availableCompanies[1]).click({ force: true });
      cy.get('body').type('{esc}');
      cy.wait(150);

      cy.get('button[type="submit"]').contains('Salvar').click();

      cy.contains('h2', 'Cadastrar novo usuário').should('not.exist', { timeout: 15000 });
      cy.contains('td', 'Usuário Multi-Empresa', { timeout: 10000 }).should('be.visible');
    });
  });
});
