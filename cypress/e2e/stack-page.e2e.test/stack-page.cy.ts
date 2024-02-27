import { getDataCy } from "../../support/custom-commands";
import { PATH } from "../../support/paths";
import { CIRCLE_PARTS, STATE_SELECTOR } from "../../support/selectors";


describe('stack page features works correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.stack);
  });

  it('add button must be disabled while the input is empty', () => {
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    cy.get('input').should('have.value', '');
    cy.get('@addButton').should('be.disabled');
  });

  it('add one element to stack', () => {
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    cy.get('input').type('7');
    cy.get('@addButton').should('not.be.disabled');
    cy.get('@addButton').click();
    cy.get('@addButton').should('be.disabled');
    cy.get('input').should('be.empty');
    getDataCy('circle').each((element, index) => {
      const circleChanging = cy.wrap(element).children(STATE_SELECTOR.changing);
      circleChanging.should('exist');
      circleChanging.should('contain', 7);
      cy.wrap(element).children(CIRCLE_PARTS.head).should('exist');
      cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
    });
    getDataCy('circle').each((element, index) => {
      const circleDefault = cy.wrap(element).children(STATE_SELECTOR.default);
      circleDefault.should('exist');
      circleDefault.should('contain', 7);
      cy.wrap(element).children(CIRCLE_PARTS.head).should('exist');
      cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
    });
  });

  it ('add several elements to stack', () => {
    const elements = [25, 2, 94, 19, 0];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number, index) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
      getDataCy('circle').each((element, circleIndex) => {
        if (index === circleIndex) {
          const circleChanging = cy.wrap(element).children(STATE_SELECTOR.changing);
          circleChanging.should('exist');
          circleChanging.should('contain', number);
          cy.wrap(element).children(CIRCLE_PARTS.head).should('contain', 'top');
          cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', index);
        } else {
          const circleDefault = cy.wrap(element).children(STATE_SELECTOR.default);
          circleDefault.should('exist');
          circleDefault.should('contain', elements[circleIndex]);
          cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
          cy.wrap(element).children(CIRCLE_PARTS.index).should('contain', circleIndex);
        };
      });
    });
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', 5);
  });

  it('element is removed from stack correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
    });
    getDataCy('circle').should('have.length', 5);
    getDataCy('removeButton').click();
    getDataCy('circle').each((element, index) => {
      if (index === elements.length - 1) {
        cy.wrap(element).children(STATE_SELECTOR.changing).should('contain', 0);
      };
    });
    cy.wait(500);
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', 4);
  });

  it('stack is cleared correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
    });
    getDataCy('circle').should('have.length', 5);
    getDataCy('clearButton').should('be.not.disabled');
    getDataCy('clearButton').click();
    getDataCy('clearButton').should('be.disabled');
    getDataCy('circle').children(STATE_SELECTOR.changing).should('have.length', 5);
    getDataCy('circle').should('not.exist');
  });
});