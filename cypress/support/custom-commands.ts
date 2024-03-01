export const getDataCy = (name: string) => {
  return cy.get(`[data-cy="${name}"]`);
};

export const getAlias = (name: string) => {
  return cy.get(`${name}`);
};

export const clearLinkedList = () => {
  getDataCy('circle').each(() => {
    getDataCy('removeAtIndexButton').click();
    cy.wait(2000)
  });
}