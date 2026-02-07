// ***********************************************************
// Este arquivo é processado e carregado automaticamente antes
// dos arquivos de teste. É um ótimo lugar para colocar configuração
// global e comportamento que modifica o Cypress.
//
// Você pode ler mais aqui:
// https://on.cypress.io/configuration
// ***********************************************************

// Importar comandos customizados
import './commands';

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previne que o Cypress falhe o teste em erros não capturados
  // Útil para ignorar erros de bibliotecas de terceiros
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
