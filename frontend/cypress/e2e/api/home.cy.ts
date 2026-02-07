/**
 * Testes de API - Home Route
 * Baseado no PLANO_DE_TESTE.md - Feature: Home Route
 */

describe('API - Home Route', () => {
  const apiUrl = Cypress.env('apiUrl');

  it('GET / - Deve retornar status 200 e mensagem "home"', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.have.property('msg', 'home');
    });
  });
});
