import { getDataCy } from "../../support/custom-commands";
import { PATH } from '../../support/paths';

describe('fibonacci page features work correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.fibonacci);
  });

  it('button must be disabled while the input contains zero', () => {
    cy.get('form').children('button').as('submitButton');
    cy.get('input').clear()
    cy.get('input').should('have.value', '0');
    cy.get('@submitButton').should('be.disabled');
  });

  it('fibonacci numbers generates correctly', () => {
    const correctNumbers = [1, 1, 2, 3];
    cy.get('form').children('button').as('submitButton');
    for (let i=0; i<3; i++) {
      cy.get('input').type('{uparrow}').trigger('change');
    }
    cy.get('@submitButton').click();
    getDataCy('circle').as('circles');
    for (let i=1; i<5; i++) {
      cy.get('@circles').should('have.length', i).each(($el, index) => {
        cy.wrap($el).children('[class*=default]').should('contain', correctNumbers[index])
      });
    };
  });
});