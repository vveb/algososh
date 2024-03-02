import { getDataCy } from "../../support/custom-commands";
import { SHORT_DELAY } from "../../support/delays";
import { PATH } from "../../support/paths";
import { CIRCLE_PARTS, SMALL_CIRCLE, STATE_SELECTOR } from "../../support/selectors";

describe('linked list page features work correctly', () => {

  beforeEach(() => {
    cy.visit(PATH.linkedList);
  });

  it('buttons must be disabled while the input is empty' , () => {
    // Проверяем, что инпут для значения пуст
    getDataCy('valueInput').should('be.empty');
    // Кнопки добавления в голову, хвост и по индексу не активны
    getDataCy('addToHeadButton').should('be.disabled');
    getDataCy('addToTailButton').should('be.disabled');
    getDataCy('addAtIndexButton').should('be.disabled');
    // Очищаем список
    getDataCy('circle').each(() => {
      getDataCy('removeAtIndexButton').click();
      cy.wait(2000);
    });
    // Проверяем, что кнопка удаления по индексу не активна
    getDataCy('removeAtIndexButton').should('be.disabled');
  });

  it('default list is displayed correctly', () => {
    // Проверяем, что список по умолчанию есть
    getDataCy('circle').children(STATE_SELECTOR.default).should('have.length', 4);
    // Проверяем, что у первого кружка есть маркер головы
    getDataCy('circle').first().children(CIRCLE_PARTS.head).should('contain.text', 'head');
    // Проверяем, что у последнего кружка есть маркер хвоста
    getDataCy('circle').last().children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
    // Проверяем, что у каждого кружка есть корректный индекс
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(CIRCLE_PARTS.index).should('contain.text', index);
    });
  });

  it('add to head works correctly', () => {
    // Начальный список содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    const targetValue = 5;
    getDataCy('valueInput').should('not.be.disabled');
    getDataCy('valueInput').clear().type(String(targetValue));
    getDataCy('addToHeadButton').should('not.be.disabled')
    getDataCy('addToHeadButton').click();
    cy.wait(SHORT_DELAY);
    // В начале анимации проверяем...
    getDataCy('circle')
      .first() // у первого кружка
      .children(CIRCLE_PARTS.head) // в голове
      .find(SMALL_CIRCLE) // появился маленький кружок
      .invoke('attr', 'class').should('contain', 'changing'); // в состоянии changing (класс включает слово changing)
      // а также в нём записано целевое значение
    getDataCy('circle').first().find(SMALL_CIRCLE).should('contain', targetValue);
    
    cy.wait(SHORT_DELAY); // На следующем шаге анимации
    getDataCy('circle').each((element, index) => {
      if (index === 0) {
        // первый кружок в состоянии modified и содержит целевое значение
        cy.wrap(element).children(STATE_SELECTOR.modified).should('contain', targetValue);
      } else {
        // остальные - default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });
    cy.wait(SHORT_DELAY);
    // После окончания анимации проверяем, что все кружки в состоянии default
    getDataCy('circle').each((element) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
    });
    // Длина списка увеличилась на один
    getDataCy('circle').should('have.length', 5);
    // и первый содержит добавленное значение
    getDataCy('circle').first().should('contain', targetValue);
  });

  it('add to tail works correctly', () => {
    // Начальный список содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    const targetValue = 5;
    getDataCy('valueInput').should('not.be.disabled');
    getDataCy('valueInput').clear().type(String(targetValue));
    getDataCy('addToTailButton').should('not.be.disabled').click();
    cy.wait(SHORT_DELAY);
    // В начале анимации проверяем...
    getDataCy('circle').each((element, index, list) => {
      // Если мы на последнем большом кружке
      if (index === list.length - 2) {
        // у него
        cy.wrap(element)
        .children(CIRCLE_PARTS.head) // в голове
        .find(SMALL_CIRCLE) // появился маленький кружок
        .invoke('attr', 'class').should('contain', 'changing'); // в состоянии изменения (класс включает слово changing)
        // и содержит добавляемое значение
        cy.wrap(element).find(SMALL_CIRCLE).should('contain', targetValue);
      };
    });

    cy.wait(SHORT_DELAY);
    // На следующем шаге анимации
    getDataCy('circle').each((element, index, list) => {
      if (index === list.length - 1) {
        // последний кружок в состоянии modified и содержит целевое значение
        cy.wrap(element).children(STATE_SELECTOR.modified).should('contain', targetValue);
      } else {
        // остальные - default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });

    cy.wait(SHORT_DELAY);
    // После окончания анимации проверяем, что все кружки в состоянии default
    getDataCy('circle').each((element) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
    });
    // Длина списка увеличилась на один
    getDataCy('circle').should('have.length', 5);
    // и последний содержит целевое значение
    getDataCy('circle').last().should('contain', targetValue);
  });

  it('add at index works correctly', () => {
    // Начальный список содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    const targetIndex = 2;
    const targetValue = 5;
    getDataCy('valueInput').clear().type(String(targetValue));
    for (let i=0; i<targetIndex; i++) {
      getDataCy('indexInput').type('{uparrow}').trigger('change');
    };
    getDataCy('addAtIndexButton').should('not.be.disabled').click();
    cy.wait(SHORT_DELAY);
    // На каждом шаге анимации
    for (let currentIndex = 0; currentIndex <= targetIndex; currentIndex ++) {
      getDataCy('circle').each((element, index) => {
        // Если мы находимся на текущем обрабатываемом кружочке
        if (index === currentIndex) {
          // он должен быть в состоянии default
          cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
          // и в его голове появился маленький кружок
          cy.wrap(element).children(CIRCLE_PARTS.head).find(SMALL_CIRCLE).should('exist');
          // Если мы на текущем обрабатываемом кружочке+1
        } else if (index == currentIndex + 1) {
          // то это должен быть маленький кружок, содержащий целевое значение
          cy.wrap(element).find(SMALL_CIRCLE).should('contain', targetValue);
          // в состоянии changing
          cy.wrap(element).find(STATE_SELECTOR.changing).should('exist');
          // Если мы на уже обработанном кружочке
        } else if (index < currentIndex) {
          // он должен быть в состоянии changing
          cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
          // В противном случае мы на необработанном кружочке
        } else {
          // он должен быть в состоянии default
          cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
        };
      }).then(() => cy.wait(SHORT_DELAY)); // После прохода переходим к следующему шагу анимации
    };
    // Обработка последнего шага анимации
    getDataCy('circle').each((element, index) => {
      // Если кружок стоит до целевого
      if (index < targetIndex) {
        // он должен быть в состоянии changing
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
      // Если это целевой кружок
      } else if (index === targetIndex) {
        // он должен быть в состоянии modified и содержать целевое значение
        cy.wrap(element).children(STATE_SELECTOR.modified).should('exist').and('contain', targetValue);
      // В противном случае это кружок правее целевого
      } else {
        // он должен быть в состоянии default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });
    cy.wait(SHORT_DELAY); // еще один шаг анимации
    // В конечном итоге все кружочки должны быть в состоянии default
    getDataCy('circle').each((element, index) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      if (index === targetIndex) {
        // а целевой кружок содержать целевое значение
        cy.wrap(element).should('contain', targetValue);
        // и в индексе должен соответствовать целевому индексу
        cy.wrap(element).children(CIRCLE_PARTS.index).should('have.text', targetIndex);
      };
    });
    // Длина списка увеличилась на один
    getDataCy('circle').should('have.length', 5);
  });

  it ('remove from head works correctly', () => {
    // Начальный список всегда содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    getDataCy('removeFromHeadButton').should('not.be.disabled');
    getDataCy('removeFromHeadButton').click();
    cy.wait(SHORT_DELAY);
    // Первый шаг анимации
    getDataCy('circle').each((element, index) => {
      // Первый элемент (head)
      if (index === 0) {
        // должен быть в состоянии changing
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
        // и иметь метку головы
        cy.wrap(element).children(CIRCLE_PARTS.head).should('contain.text', 'head');
      // Остальные элементы
      } else {
        // должны быть в состоянии default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });
    
    cy.wait(SHORT_DELAY); // Следующий шаг анимации
    // Обработаем первый кружок
    getDataCy('circle').first().as('firstCircle');
    // Он должен быть в состоянии default, пустой внутри
    cy.get('@firstCircle').children(STATE_SELECTOR.default).find(CIRCLE_PARTS.letter).should('be.empty');
    // в хвосте у него должен быть маленький кружок в состоянии changing
    cy.get('@firstCircle').children(CIRCLE_PARTS.tail).find(SMALL_CIRCLE).invoke('attr', 'class').should('contain', 'changing');
    // этот кружок не должен быть пуст внутри
    cy.get('@firstCircle').children(CIRCLE_PARTS.tail).find(CIRCLE_PARTS.letter).should('not.be.empty');
   
    cy.wait(SHORT_DELAY); // Завершение анимации
    // Список уменьшился на один элемент
    getDataCy('circle').should('have.length', 3);
    // Каждый кружок в состоянии default
    getDataCy('circle').each((element) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
    });
  });

  it ('remove from tail works correctly', () => {
    // Начальный список всегда содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    getDataCy('removeFromTailButton').should('not.be.disabled');
    getDataCy('removeFromTailButton').click();
    cy.wait(SHORT_DELAY);
    // Первый шаг анимации
    getDataCy('circle').each((element, index, list) => {
      // Последний кружок (tail)
      if (index === list.length - 1) {
        // должен быть в состоянии changing
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
        // и иметь метку хвоста
        cy.wrap(element).children(CIRCLE_PARTS.tail).should('contain.text', 'tail');
      // Остальные элементы
      } else {
        // должны быть в состоянии default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      }
    });
    cy.wait(SHORT_DELAY); // Следующий шаг анимации
    getDataCy('circle').each((element, index, list) => {
      // Последний элемент
      if (index === list.length - 2) {
        // Должен быть в состоянии default, пустой внутри
        cy.wrap(element).children(STATE_SELECTOR.default).find(CIRCLE_PARTS.letter).should('be.empty');
        // в хвосте у него должен быть маленький кружок в состоянии changing
        cy.wrap(element).children(CIRCLE_PARTS.tail).find(SMALL_CIRCLE).invoke('attr', 'class').should('contain', 'changing');
        // этот кружок не должен быть пуст внутри
        cy.wrap(element).children(CIRCLE_PARTS.tail).find(CIRCLE_PARTS.letter).should('not.be.empty');
      // Остальные больие кружки
      } else if (index !== list.length - 1) {
        // Должны быть в состоянии default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });
    cy.wait(SHORT_DELAY); // Завершение анимации
    // Список уменьшился на один элемент
    getDataCy('circle').should('have.length', 3);
    // Каждый кружок в состоянии default
    getDataCy('circle').each((element) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
    });
  });

  it('remove at index works correctly', () => {
    // Начальный список всегда содержит 4 элемента
    getDataCy('circle').should('have.length', 4);
    const targetIndex = 2;
    for (let i=0; i<targetIndex; i++) {
      getDataCy('indexInput').type('{uparrow}').trigger('change');
    };
    getDataCy('removeAtIndexButton').should('not.be.disabled').click();
    cy.wait(SHORT_DELAY);
    // На каждом шаге первого этапа анимации (поиск нужного элемента)
    for (let currentIndex = 0; currentIndex <= targetIndex; currentIndex++) {
      getDataCy('circle').each((element, index) => {
        // Если мы находимся на текущем обрабатываемом или уже обработанном кружочке
        if (index === currentIndex || index < currentIndex) {
          // он должен быть в состоянии changing
          cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
        // остальные
        } else {
          // должны быть в состоянии default
          cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
        }
      }).then(() => cy.wait(SHORT_DELAY)); // после чего переход к следующему шагу анимации поиска
    };
    // Проверка шага анимации удаления элемента
    getDataCy('circle').each((element, index) => {
      // Если мы на целевом кружочке
      if (index === targetIndex) {
        // он должен быть в состоянии changing и пуст внутри
        cy.wrap(element).children(STATE_SELECTOR.changing).find(CIRCLE_PARTS.letter).should('be.empty');
        // в его индексе должно лежать значение, совпадающее с целевым индексом
        cy.wrap(element).children(CIRCLE_PARTS.index).should('have.text', targetIndex);
        // в его хвосте должен быть маленький кружок в состоянии changing
        cy.wrap(element).children(CIRCLE_PARTS.tail).find(SMALL_CIRCLE).invoke('attr', 'class').should('contain', 'changing');
        // этот кружок должен быть не пуст внутри
        cy.wrap(element).children(CIRCLE_PARTS.tail).find(CIRCLE_PARTS.letter).should('not.be.empty');
      // Если мы на маленьком кружочке
      } else if (index === targetIndex + 1) {
        // он должен быть маленьким и в состоянии changing
        cy.wrap(element).find(SMALL_CIRCLE).invoke('attr', 'class').should('contain', 'changing');
        // и не пуст внутри
        cy.wrap(element).find(CIRCLE_PARTS.letter).should('be.not.empty');
      // Если мы на уже обработанном кружочке
      } else if (index < targetIndex) {
        // он должен быть в состоянии changing
        cy.wrap(element).children(STATE_SELECTOR.changing).should('exist');
      // В противном случае мы на кружочке, правее целевого
      } else {
        // он должен быть в состоянии default
        cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
      };
    });
    cy.wait(SHORT_DELAY); // Завершение анимации
    // Список уменьшился на один элемент
    getDataCy('circle').should('have.length', 3);
    // Каждый кружок в состоянии default
    getDataCy('circle').each((element) => {
      cy.wrap(element).children(STATE_SELECTOR.default).should('exist');
    });
  });

});