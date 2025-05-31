import { faker } from '@faker-js/faker';
import 'cypress-file-upload';

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

  /* ==== Test Created with Cypress Studio ==== */
  it('login', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > input').clear('o');
    cy.get(':nth-child(1) > input').type('ooo');
    cy.get(':nth-child(2) > input').clear('0');
    cy.get(':nth-child(2) > input').type('00');
    cy.get('button').click();
    cy.get(':nth-child(1) > input').clear('oo');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('0');
    cy.get(':nth-child(2) > input').type('Test#1111{enter}');
    cy.get('button').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('Sign up', function() {
     const fakeEmail = faker.internet.email();
   const phone = '07' + faker.string.numeric(8);
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/signup');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#firstName').clear('z');
    cy.get('#firstName').type('z');
    cy.get('.signup-btn').click();
    cy.get('#lastName').clear('Zaid');
    cy.get('#lastName').type('Zaid');
    cy.get('#lastName').click();
    cy.get('#address').clear('irbid');
    cy.get('#address').type("Irbid");
    cy.get('[name="day"]').select('14');
    cy.get('[name="day"]').select('9');
    cy.get('[name="month"]').select('Mar');
    cy.get('[name="year"]').select('2013');
    cy.get('.gender-options > :nth-child(1)').click();
    cy.get(':nth-child(1) > input').check();
    cy.get('.gender-options > :nth-child(2)').click();
    cy.get('.gender-options > :nth-child(2) > input').check();
    cy.get('#mobileNumber').clear('09999');
    cy.get('#mobileNumber').type('09999');
    cy.get('#email').clear('Zaidrad@gmail.com');
    cy.get('#email').type('Zaidradgmail.com');
    cy.get('#password').clear('5');
    cy.get('#password').type('567');
    cy.get('#confirmPassword').clear('0');
    cy.get('#confirmPassword').type('000');
    cy.get('.signup-btn').click();
    cy.get('#email').clear();
    cy.get('#email').type(fakeEmail);
    cy.get('.signup-btn').click();
    cy.get('#firstName').clear('A');
    cy.get('#firstName').type('Ali');
    cy.get('#mobileNumber').clear('0999');
    cy.get('#mobileNumber').type(phone);
    cy.get('#password').clear('56');
    cy.get('#password').type("Test#1234");
    cy.get('#confirmPassword').clear('00');
    cy.get('#confirmPassword').type('Test#1234');
    cy.get('.signup-btn').click();
    cy.get('#confirmPassword').clear();
    cy.get('#confirmPassword').type("Test#1234");
    cy.get('.signup-btn').click();
    cy.get('[name="year"]').select('1998');
    cy.get('.signup-btn').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('account info', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(1) > input').clear('test1@gmail.com');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('Test#1111');
    cy.get(':nth-child(2) > input').type('Test#1111');
    cy.get('button').click();
    cy.get('.User-Avatar-Header > h3').click();
    cy.get(':nth-child(1) > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get(':nth-child(2) > .input-container > .edit-btn').click();
    cy.get(':nth-child(2) > .input-container > .full-width-input').clear('Zaidone');
    cy.get(':nth-child(2) > .input-container > .full-width-input').type('Za');
    cy.get(':nth-child(2) > .input-container > .edit-btn').click();
    cy.get(':nth-child(2) > .input-container > .edit-btn').click();
    cy.get(':nth-child(2) > .input-container > .full-width-input').clear('Z');
    cy.get(':nth-child(2) > .input-container > .full-width-input').type('Z');
    cy.get(':nth-child(2) > .input-container > .edit-btn').click();
    cy.get(':nth-child(2) > .input-container > .full-width-input').clear('Za');
    cy.get(':nth-child(2) > .input-container > .full-width-input').type('Zaidone');
    cy.get(':nth-child(2) > .input-container > .edit-btn').click();
    cy.get(':nth-child(3) > .input-container > .edit-btn').click();
    cy.get(':nth-child(3) > .input-container > .full-width-input').clear('test1gmail.com');
    cy.get(':nth-child(3) > .input-container > .full-width-input').type('test1gmail.com');
    cy.get(':nth-child(3) > .input-container > .edit-btn').click();
    cy.get(':nth-child(3) > .input-container > .full-width-input').clear('test1@gmail.com');
    cy.get(':nth-child(3) > .input-container > .full-width-input').type('test1@gmail.com');
    cy.get(':nth-child(4) > .input-container > .edit-btn').click();
    cy.get(':nth-child(4) > .input-container > .full-width-input').clear('078717324');
    cy.get(':nth-child(4) > .input-container > .full-width-input').type('078717324');
    cy.get(':nth-child(4) > .input-container > .edit-btn').click();
    cy.get(':nth-child(4) > .input-container > .full-width-input').clear('0787173245');
    cy.get(':nth-child(4) > .input-container > .full-width-input').type('0787173245');
    cy.get(':nth-child(6) > .input-container > .edit-btn').click();
    cy.get(':nth-child(6) > .input-container > .full-width-input').clear('Irbi');
    cy.get(':nth-child(6) > .input-container > .full-width-input').type('I');
    cy.get(':nth-child(6) > .input-container > .edit-btn').click();
    cy.get(':nth-child(6) > .input-container > .full-width-input').clear('Ir');
    cy.get(':nth-child(6) > .input-container > .full-width-input').type('Irbid');
    cy.get(':nth-child(6) > .input-container > .edit-btn').click();
    cy.get(':nth-child(5) > .input-container > .edit-btn').click();
    cy.get(':nth-child(5) > .input-container > .full-width-input').select('female');
    cy.get(':nth-child(5) > .input-container > .edit-btn').click();
    cy.get(':nth-child(7) > .input-container > .edit-btn').click();
    cy.get(':nth-child(7) > .input-container > .full-width-input').click();
    cy.get(':nth-child(7) > .input-container > .full-width-input').click();
    cy.get(':nth-child(7) > .input-container > .full-width-input').click();
    cy.get(':nth-child(7) > .input-container > .full-width-input').click();
    cy.get(':nth-child(7) > .input-container > .full-width-input').click();
    cy.get(':nth-child(7) > .input-container > .edit-btn').click();
    cy.get(':nth-child(8) > .input-container > .edit-btn').click();
    cy.get(':nth-child(8) > .input-container > .full-width-input').clear('4');
    cy.get(':nth-child(8) > .input-container > .full-width-input').type('44');
    cy.get(':nth-child(8) > .input-container > .edit-btn').click();
    cy.get(':nth-child(8) > .input-container > .full-width-input').clear('4');
    cy.get(':nth-child(8) > .input-container > .full-width-input').type('Test#1111');
    cy.get('.account-inf-card > :nth-child(9)').click();
    cy.get(':nth-child(9) > .input-container > .full-width-input').clear('Test#1111');
    cy.get(':nth-child(9) > .input-container > .full-width-input').type('Test#1111');
    cy.get(':nth-child(8) > .input-container > .edit-btn').click();
    cy.get(':nth-child(3) > .input-container > .edit-btn').click();
    cy.get(':nth-child(4) > .input-container > .edit-btn').click();
    cy.get('input[type="file"]').attachFile("user.jpg");
    cy.get('.delete-btn').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('profile', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(1) > input').clear('test1@gmail.com');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('Test#1111');
    cy.get(':nth-child(2) > input').type('Test#1111');
    cy.get('button').click();
    cy.get('.User-Avatar-Header > h3').click();
    cy.get(':nth-child(3) > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('.profile-tabs > :nth-child(2)').click();
    cy.get('.profile-tabs > :nth-child(1)').click();
    cy.get('.profile-offer-img').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */

  /* ==== Test Created with Cypress Studio ==== */
  it('Detail offer', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(1) > input').clear('t');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('T');
    cy.get(':nth-child(2) > input').type('Test#1111');
    cy.get('button').click();
    cy.get(':nth-child(1) > .offer-details > .offer-subtitle').click();
    cy.get(':nth-child(3) > svg').click();
    cy.get(':nth-child(3) > svg > path').click();
    cy.get('.swiper-button-next').click();
    cy.get('.swiper-button-prev').click();
    cy.get(':nth-child(4) > .thumb-wrapper > .thumb-image').click();
    cy.get('.swiper-pagination > :nth-child(2)').click();
  
    cy.get(':nth-child(2) > .custom-button').click();
    cy.get('.MuiDialogActions-root > .MuiButton-textPrimary').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */

  /* ==== End Cypress Studio ==== */

  /* ==== Test Created with Cypress Studio ==== */
  it('Dashboard ', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(1) > input').clear('te');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('T');
    cy.get(':nth-child(2) > input').type('Test#1111');
    cy.get('button').click();
    cy.get('.User-Avatar-Header > h3').click();
    cy.get('.MuiList-root > :nth-child(5)').click();
    cy.get('.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get(':nth-child(6) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get('.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get(':nth-child(8) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get('.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get(':nth-child(10) > .MuiAccordion-heading > .MuiButtonBase-root').click();
    cy.get('.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.User-Avatar-Header > svg').click();
    cy.get(':nth-child(7) > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"] > path').click();
    cy.get(':nth-child(6) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get(':nth-child(8) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]').click();
    cy.get('.stats-grid > :nth-child(2)').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('add/ update offer', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(1) > input').clear('t');
    cy.get(':nth-child(1) > input').type('test1@gmail.com');
    cy.get(':nth-child(2) > input').clear('T');
    cy.get(':nth-child(2) > input').type('Test#1111');
    cy.get('button').click();
    cy.get('.User-Avatar-Header > h3').click();
    cy.get(':nth-child(5) > .MuiListItemText-root > .MuiTypography-root').click();

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.add-offer-button > svg > path').click();
    cy.get(':nth-child(1) > .textInput').clear('i');
    cy.get(':nth-child(1) > .textInput').type('ii');
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Years"]').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(5) > .textInput').click();
    cy.get(':nth-child(5) > .textInput').clear('o');
    cy.get(':nth-child(5) > .textInput').type('o');
    cy.get(':nth-child(6) > .textInput').click();
    cy.get('.submit').click();
    cy.get(':nth-child(1) > .textInput').clear('i');
    cy.get(':nth-child(1) > .textInput').type('land for rent');
    cy.get('.submit').click();
    cy.get(':nth-child(5) > .textInput').clear();
    cy.get(':nth-child(5) > .textInput').type('west jordan');
    cy.get('.submit').click();
    cy.get(':nth-child(6) > .textInput').click();
    cy.get('.submit').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get(':nth-child(4) > .unit-Input > .textInput').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get('.submit').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .unit-Input > .textInput').clear('8');
    cy.get(':nth-child(2) > .unit-Input > .textInput').type('8');
    cy.get('[message="Years"]').clear('9');
    cy.get('[message="Years"]').type('99');
    cy.get('[message="Months"]').clear('7');
    cy.get('[message="Months"]').type('7');
    cy.get('[message="Years"]').clear('9');
    cy.get('[message="Years"]').type('9');
    cy.get(':nth-child(4) > .unit-Input > .textInput').clear('6');
    cy.get(':nth-child(4) > .unit-Input > .textInput').type('6');
    cy.get('.submit').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(6) > .textInput').click();
    cy.get('.submit').click();
    cy.get(':nth-child(2) > .unit-Input > .textInput').click();
    cy.get('.submit').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .unit-Input > .textInput').clear('5');
    cy.get(':nth-child(2) > .unit-Input > .textInput').type('55');
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('textarea.textInput').type(
  'A very fertile and well-maintained piece of land available for rent. Ideal for farming, gardening, or other agricultural purposes. The soil is rich and the area is peaceful, with easy access to water. The price is negotiable based on your intended use and rental period.'
);
    cy.get('input[type="file"]').attachFile("1.jpg");
    cy.get('input[type="file"]').attachFile("2.jpg");
    cy.get('input[type="file"]').attachFile("3.jpg");
    cy.get('input[type="file"]').attachFile("4.jpg");
    cy.get('input[type="file"]').attachFile("5.jpg");

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
  
    cy.get('.submit').click();
    cy.get('.notification').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  // it.only('chat', function() {
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.visit('http://localhost:3000/login');
  //   cy.get(':nth-child(1) > input').clear('T');
  //   cy.get(':nth-child(1) > input').type('test1@gmail.com');
  //   cy.get(':nth-child(2) > input').clear('T');
  //   cy.get(':nth-child(2) > input').type('Test#1111{enter}');
  //   cy.get('button').click();
  //   cy.get('.MuiButtonBase-root').click();

  //   /* ==== End Cypress Studio ==== */
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('.User-Avatar-Header > h3').click();
  //   cy.get(':nth-child(9) > .MuiListItemText-root > .MuiTypography-root', { timeout: 10000 })
  // .should('be.visible')
  // .click();

    /* ==== End Cypress Studio ==== */
  //});
})