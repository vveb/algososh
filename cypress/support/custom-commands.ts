export const getDataCy = (name: string) => {
  return cy.get(`[data-cy="${name}"]`);
};

export const getAlias = (name: string) => {
  return cy.get(`${name}`);
};