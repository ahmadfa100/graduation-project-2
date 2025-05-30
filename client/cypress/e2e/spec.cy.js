describe('template spec', () => {
  
  /* ==== Test Created with Cypress Studio ==== */
  it('home', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/');
    cy.get('.nav-links > [href="/"]').click();
    cy.get('[href="/education"]').click();
    cy.get('[href="/about"]').click();
    cy.get('.nav-links > [href="/contact"]').click();
    cy.get('.nav-links > [href="/"]').click();
    cy.get('[href="/policy"]').click();
    cy.get('[href="/terms"]').click();
    cy.get('.footer-links > [href="/contact"]').click();
    cy.get('.brand-name').click();
    cy.get('.search-input').clear('p');
    cy.get('.search-input').type('per');
    cy.get('.search-button').click();
    cy.get('#cityFilter').select('Irbid');
    cy.get('.search-input').click();
    cy.get('.filter-button').click();
    cy.get('#spaceFilter').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.offer-subtitle').click();
    /* ==== End Cypress Studio ==== */
  });
  
})