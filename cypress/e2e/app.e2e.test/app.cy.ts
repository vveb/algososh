import { PATH } from "../../support/paths";

describe('app is available', () => {
  it('should be available on localhost:3000', () => {
    cy.visit(PATH.main);
  });
});

describe('app works correctly with routes', () => {
  beforeEach(() => {
    cy.visit(PATH.main);
  });

  it('should open main page by default', () => {
    cy.get('h1').should('have.text', 'МБОУ АЛГОСОШ');
  });

  it('should open string reverse page after link click', () => {
    cy.get('a[href*="/recursion"]').click();
    cy.url().should('include', '/recursion');
    cy.get('h3').should('have.text', 'Строка');
  });

  it('should open fibonacci page after link click', () => {
    cy.get('a[href*="/fibonacci"]').click();
    cy.url().should('include', '/fibonacci');
    cy.get('h3').should('have.text', 'Последовательность Фибоначчи');
  });

  it('should open sorting page after link click', () => {
    cy.get('a[href*="/sorting"]').click();
    cy.url().should('include', '/sorting');
    cy.get('h3').should('have.text', 'Сортировка массива');
  });

  it('should open stack page after link click', () => {
    cy.get('a[href*="/stack"]').click();
    cy.url().should('include', '/stack');
    cy.get('h3').should('have.text', 'Стек');
  });

  it('should open queue page after link click', () => {
    cy.get('a[href*="/queue"]').click();
    cy.url().should('include', '/queue');
    cy.get('h3').should('have.text', 'Очередь');
  });

  it('should open linked list page after link click', () => {
    cy.get('a[href*="/list"]').click();
    cy.url().should('include', '/list');
    cy.get('h3').should('have.text', 'Связный список');
  });

});