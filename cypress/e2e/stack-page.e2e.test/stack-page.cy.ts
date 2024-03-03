import { getDataCy } from "../../support/custom-commands";
import { SHORT_DELAY } from "../../support/delays";
import { PATH } from "../../support/paths";
import { CIRCLE_PARTS, STATE_SELECTOR } from "../../support/selectors";


describe('stack page features works correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.stack);
  });

  it('add button must be disabled while the input is empty', () => {
    cy.get('input').clear().should('have.value', '');
    getDataCy('addButton').should('be.disabled');
  });

  it('add one element to stack', () => {
    const targetValue = 7;
    getDataCy('addButton').as('addButton');
    cy.get('input').clear().type(String(targetValue));
    cy.get('@addButton').should('not.be.disabled');
    cy.get('@addButton').click();
    cy.get('@addButton').should('be.disabled');
    cy.get('input').should('be.empty');
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(STATE_SELECTOR.changing).should('exist').and('contain', targetValue);
      cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'top');
      cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
    });
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist').and('contain', targetValue);
      cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'top');
      cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
    });
  });

  it ('add several elements to stack', () => {
    const elements = [25, 2, 94, 19, 0];
    cy.get('input').clear();
    elements.forEach((number, index) => {
      cy.get('input').type(String(number));
      getDataCy('addButton').click();
      getDataCy('circle').each((element, circleIndex) => {
        if (index === circleIndex) {
          cy.wrap(element).children(STATE_SELECTOR.changing).should('exist').and('contain', number);
          cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'top');
          cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
        } else {
          cy.wrap(element).children(STATE_SELECTOR.default).should('exist').and('contain', elements[circleIndex]);
          cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
          cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', circleIndex);
        };
      });
    });
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', elements.length);
  });

  it('element is removed from stack correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      getDataCy('addButton').click();
    });
    getDataCy('circle').should('have.length', elements.length);
    getDataCy('removeButton').click();
    getDataCy('circle').each((element, index) => {
      if (index === elements.length - 1) {
        cy.wrap(element).children(STATE_SELECTOR.changing).should('contain', elements[elements.length - 1]);
      };
    });
    cy.wait(SHORT_DELAY);
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', elements.length - 1);
  });

  it('stack is cleared correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      getDataCy('addButton').click();
    });
    getDataCy('circle').should('have.length', elements.length);
    getDataCy('clearButton').should('be.not.disabled');
    getDataCy('clearButton').click();
    getDataCy('clearButton').should('be.disabled');
    getDataCy('circle').children(STATE_SELECTOR.changing).should('have.length', elements.length);
    getDataCy('circle').should('not.exist');
  });
});