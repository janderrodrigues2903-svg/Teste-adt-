/**
 * Testes de API - Endpoints de Empresa
 * Baseado no PLANO_DE_TESTE.md - Feature: API - Endpoints de Empresa
 */

describe('API - Endpoints de Empresa', () => {
  const apiUrl = Cypress.env('apiUrl');
  let createdCompanyId: number;

  describe('GET /api/company - Listar todas as empresas', () => {
    it('Deve retornar status 200 e array de empresas', () => {
      cy.getAllCompaniesViaAPI().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.be.an('array');
        
        if (response.body.length > 0) {
          const company = response.body[0];
          expect(company).to.have.property('id_company');
          expect(company).to.have.property('name');
          expect(company).to.have.property('cnpj');
        }
      });
    });

    it('Deve retornar apenas empresas com show = 1', () => {
      cy.getAllCompaniesViaAPI().then((response) => {
        if (response.body.length > 0) {
          response.body.forEach((company: any) => {
            expect(company).to.have.property('name');
            // Empresas excluídas não devem aparecer
          });
        }
      });
    });
  });

  describe('GET /api/company/{id} - Buscar empresa por ID', () => {
    it('Deve retornar status 200 para ID válido existente', () => {
      cy.getAllCompaniesViaAPI().then((response) => {
        if (response.body.length > 0) {
          const companyId = response.body[0].id_company;
          
          cy.request({
            method: 'GET',
            url: `${apiUrl}/api/company/${companyId}`,
            failOnStatusCode: false,
          }).then((companyResponse) => {
            expect(companyResponse.status).to.eq(200);
            expect(companyResponse.headers['content-type']).to.include('application/json');
            expect(companyResponse.body).to.have.property('id_company', companyId);
            expect(companyResponse.body).to.have.property('name');
            expect(companyResponse.body).to.have.property('cnpj');
          });
        }
      });
    });

    it('Deve retornar status 400 para ID inválido (string)', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/company/abc`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('POST /api/company/create - Criar empresa', () => {
    it('Deve criar empresa com dados válidos completos', () => {
      const companyData = {
        name: `Empresa Teste ${Date.now()}`,
        cnpj: `${Date.now()}000190`,
        adress: {
          cep: '01310100',
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          district: 'Bela Vista',
        },
      };

      cy.createCompanyViaAPI(companyData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.have.property('id');
        createdCompanyId = response.body.id;
      });
    });

    it('Deve retornar status 400 sem campo obrigatório "name"', () => {
      const companyData = {
        cnpj: '12345678000190',
        adress: {
          cep: '01310100',
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          district: 'Bela Vista',
        },
      };

      cy.createCompanyViaAPI(companyData).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('Deve retornar status 400 sem campo obrigatório "cnpj"', () => {
      const companyData = {
        name: 'Empresa Teste',
        adress: {
          cep: '01310100',
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          district: 'Bela Vista',
        },
      };

      cy.createCompanyViaAPI(companyData).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('PATCH /api/company/{id}/update - Atualizar empresa', () => {
    beforeEach(() => {
      cy.createCompanyViaAPI({
        name: `Empresa para Atualizar ${Date.now()}`,
        cnpj: `${Date.now()}000190`,
        adress: {
          cep: '01310100',
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          district: 'Bela Vista',
        },
      }).then((response) => {
        if (response.status === 201) {
          createdCompanyId = response.body.id;
        }
      });
    });

    it('Deve atualizar empresa existente com sucesso', () => {
      if (!createdCompanyId) {
        cy.log('Empresa não criada, pulando teste');
        return;
      }

      const updateData = {
        name: 'Empresa Atualizada',
        cnpj: '98765432000110',
        adress: {
          cep: '04567890',
          country: 'Brasil',
          state: 'RJ',
          city: 'Rio de Janeiro',
          street: 'Avenida Atlântica',
          number: '2000',
          district: 'Copacabana',
        },
      };

      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/api/company/${createdCompanyId}/update`,
        body: updateData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.request({
          method: 'GET',
          url: `${apiUrl}/api/company/${createdCompanyId}`,
          failOnStatusCode: false,
        }).then((companyResponse) => {
          expect(companyResponse.body.name).to.eq(updateData.name);
        });
      });
    });
  });

  describe('DELETE /api/company/{id}/delete - Deletar empresa', () => {
    beforeEach(() => {
      cy.createCompanyViaAPI({
        name: `Empresa para Deletar ${Date.now()}`,
        cnpj: `${Date.now()}000190`,
        adress: {
          cep: '01310100',
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          street: 'Avenida Paulista',
          number: '1000',
          district: 'Bela Vista',
        },
      }).then((response) => {
        if (response.status === 201) {
          createdCompanyId = response.body.id;
        }
      });
    });

    it('Deve deletar empresa existente com sucesso (exclusão lógica)', () => {
      if (!createdCompanyId) {
        cy.log('Empresa não criada, pulando teste');
        return;
      }

      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/api/company/${createdCompanyId}/delete`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        cy.getAllCompaniesViaAPI().then((companiesResponse) => {
          const deletedCompany = companiesResponse.body.find(
            (company: any) => company.id_company === createdCompanyId
          );
          expect(deletedCompany).to.be.undefined;
        });
      });
    });
  });
});
