import { getDataCy } from "../../support/custom-commands";
import { LONG_DELAY } from "../../support/delays";
import { PATH } from "../../support/paths";
import { STATE_SELECTOR } from "../../support/selectors";

describe('string page features work correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.string);
  });

  it('button must be disabled while the input is empty' , () => {
    cy.get('form').children('button').as('submitButton');
    cy.get('input').clear().should('be.empty');
    cy.get('@submitButton').should('be.disabled');
  });

  it('string reverse with even number of characters working correctly', () => {
    const text = 'привет';
    cy.get('input').clear().type(text);
    cy.get('form').children('button').click();
    getDataCy('circle').should('have.length', text.length);
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('contain.text', text[index]);
    });
    for (let i=0; i < Math.floor((text.length - 1)/2); i++) {
      getDataCy('circle').children(STATE_SELECTOR.changing).should('have.length', 2);
      getDataCy('circle').each((element, index) => {
        if (index === i || index === text.length - 1 - i) {
          cy.wrap(element).children(STATE_SELECTOR.changing).should('contain', text[index]);
        } else if (index > i && index < text.length - 1 - i) {
          cy.wrap(element).children(STATE_SELECTOR.default).should('contain.text', text[index]);
        } else {
          cy.wrap(element).children(STATE_SELECTOR.modified).should('exist');
        };
      });
      cy.wait(LONG_DELAY);
      getDataCy('circle').eq(i).should('contain.text', text[text.length - 1 - i]);
      getDataCy('circle').eq(text.length - 1 - i).should('contain.text', text[i]);
      cy.wait(LONG_DELAY);
      getDataCy('circle').eq(i).children(STATE_SELECTOR.modified).should('exist');
      getDataCy('circle').eq(text.length - 1 - i).children(STATE_SELECTOR.modified).should('exist');
      cy.wait(LONG_DELAY);
    };
    getDataCy('circle').children(STATE_SELECTOR.modified).should('have.length', text.length);
  })

  it('string reverse with odd number of characters working correctly', () => {
    const text = 'приет';
    cy.get('input').clear().type(text);
    cy.get('form').children('button').click();
    getDataCy('circle').should('have.length', text.length);
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('contain.text', text[index]);
    });
    for (let i=0; i < Math.floor((text.length - 1)/2); i++) {
      getDataCy('circle').children(STATE_SELECTOR.changing).should('have.length', 2);
      getDataCy('circle').each((element, index) => {
        if (index === i || index === text.length - 1 - i) {
          cy.wrap(element).children(STATE_SELECTOR.changing).should('contain', text[index])
        } else if (index > i && index < text.length - 1 - i) {
          cy.wrap(element).children(STATE_SELECTOR.default).should('contain.text', text[index]);
        } else {
          cy.wrap(element).children(STATE_SELECTOR.modified).should('exist');
        };
      });
      cy.wait(LONG_DELAY);
      getDataCy('circle').eq(i).should('contain.text', text[text.length - 1 - i]);
      getDataCy('circle').eq(text.length - 1 - i).should('contain.text', text[i]);
      cy.wait(LONG_DELAY);
      getDataCy('circle').eq(i).children(STATE_SELECTOR.modified).should('exist');
      getDataCy('circle').eq(text.length - 1 - i).children(STATE_SELECTOR.modified).should('exist');
      cy.wait(LONG_DELAY);
    };
    getDataCy('circle').children(STATE_SELECTOR.modified).should('have.length', text.length);
  });
});