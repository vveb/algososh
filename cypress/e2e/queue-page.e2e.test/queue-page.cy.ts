import { getDataCy } from "../../support/custom-commands";
import { SHORT_DELAY } from "../../support/delays";
import { PATH } from "../../support/paths";
import { CIRCLE_PARTS, STATE_SELECTOR } from "../../support/selectors";

describe('queue page features works correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.queue);
  });

  it('add button must be disabled while the input is empty', () => {
    getDataCy('addButton').as('addButton');
    cy.get('input').clear().should('have.value', '');
    cy.get('@addButton').should('be.disabled');
  });

  it('add one element to queue', () => {
    getDataCy('addButton').as('addButton');
    cy.get('input').clear().type('7');
    cy.get('@addButton').should('not.be.disabled');
    cy.get('@addButton').click();
    cy.get('@addButton').should('be.disabled');
    cy.get('input').should('be.empty');
    getDataCy('circle').each((element, index) => {
      if (index === 0) {
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist').and('contain', 7);
        cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
        cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
      } else {
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist').and('contain', '');
        cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
        cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
      }
    });
    getDataCy('circle').each((element, index) => {
      const currentCircle = cy.wrap(element).children(STATE_SELECTOR.default);
      currentCircle.should('exist');
      if (index === 0) {
        currentCircle.should('contain', 7);
        cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
        cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
      } else {
        currentCircle.should('contain', '');
        cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
        cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
      };
    });
  });

  it ('add several elements to queue until it is full', () => {
    const elements = [25, 2, 94, 19, 0, 41, 30];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number, numberIndex) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
      getDataCy('circle').each((element, circleIndex) => {
        // Если текущий круг - тот, в который мы добавляем элемент
        if (circleIndex === numberIndex) {
          // Он должен быть в состоянии изменения, существовать и содержать текущее добавляемое значение
          cy.wrap(element).children(STATE_SELECTOR.changing).should('exist').and('contain', number);
          // Если он самый первый, то он должен быть головой
          if (circleIndex === 0) {
            cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
          // Иначе нет (маркер головы пустой)
          } else {
            cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
          }
          // У изменяемого в текущий момент круга должен появиться маркер хвоста
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
        // Если же текущий круг - не тот, в который мы добавляем элемент
        } else {
          // Он должен быть в обычном состоянии
          const circleDefault = cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
          // и существовать
          circleDefault.should('exist');
          // Если он из тех, в которые мы уже что-то добавляли
          if (circleIndex <= numberIndex) {
            // Он должен содержать соответствующий элемент
            circleDefault.should('contain', elements[circleIndex]);
          } else {
            // В противном случае, быть пустым
            circleDefault.should('contain', '');
          }
          // Если он самый первый, то должен содержать маркер головы
          if (circleIndex === 0) {
            cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
          // В противном случае маркер головы должен быть пустым
          } else {
            cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
          }
          // А также маркер хвоста должен быть пустым
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
        };
      });
    });
    // По окончанию анимации все круги должны быть в обычном состоянии и их семь
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', elements.length);
  });

  it('element is removed from queue correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
    });
    getDataCy('removeButton').click();
    // Текущая голова - первый элемент
    let currentHead = 0;
    // Обрабатываем все круги
    getDataCy('circle').each((element, index) => {
      // Если текущий круг - голова
      if (index === currentHead) {
        // Он должен быть в состоянии изменения и существовать
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
        // Содержать в себе головной элемент
        cy.wrap(element).should('contain', elements[currentHead]);
        // Иметь маркер головы
        cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
      // Если текущий круг - не голова
      } else {
        // Он должен быть в обычном состоянии и существовать
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
        // Маркер головы должен отсутствовать
        cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
        // Если индекс текущего обрабатываемого круга входит в набор элементов
        if (index < elements.length) {
          // То этот круг должен содержать соответствующий элемент
          cy.wrap(element).should('contain', elements[index]);
        } else {
          // В противном случае должен быть пуст
          cy.wrap(element).should('not.have.text');
        };
        // Если индекс текущего обрабатываемого круга является последним элементом из списка
        if (index === elements.length-1) {
          // То у него должен быть маркер хвоста
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
        } else {
          // В противном случае маркер хвоста должен отсутствовать
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
        };
      };
      // Только после окончания анимации надо...
    }).then(() => {
      // Поменять индекс текущей головы на следующий элемент
      currentHead = (currentHead + 1) % elements.length;
      // Все круги должны быть в обычном состоянии и их семь
      getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', 7);
      // Проверить для каждого круга
      getDataCy('circle').each((element, index) => {
        // Если его индекс совпадает с текущим индексом головы
        if (index === currentHead) {
          // То должен быть маркер головы
          cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
        } else {
          // В противном случае маркер головы должен отсутствовать
          cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
        };
        // Если его индекс совпадает с индексом последнего элемента
        if (index === elements.length - 1) {
          // То должен быть маркер хвоста
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
        } else {
          // В противном случае маркер хвоста должен отсутствовать
          cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
        };
      });
    });
  });

  it('queue is cleared correctly', () => {
    const elements = [25, 2, 94, 19, 0];
    getDataCy('addButton').as('addButton');
    cy.get('input').clear();
    elements.forEach((number) => {
      cy.get('input').type(String(number));
      cy.get('@addButton').click();
    });
    getDataCy('clearButton').should('be.not.disabled');
    getDataCy('clearButton').click();
    getDataCy('clearButton').should('be.disabled');
    getDataCy('circle').children(STATE_SELECTOR.changing).should('have.length', 7);
    cy.wait(SHORT_DELAY);
    getDataCy('circle').each((element) => {
      cy.wrap(element).should('not.have.text');
      cy.wrap(element).children(CIRCLE_PARTS.head).should('be.empty');
      cy.wrap(element).children(CIRCLE_PARTS.tail).should('be.empty');
    });
  });
});