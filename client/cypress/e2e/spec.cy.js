import { faker } from "@faker-js/faker";
import "cypress-file-upload";

describe("template spec", () => {
  it("home", function () {
    cy.visit("http://localhost:3000/");
    cy.get(".left-arrow").click();
    cy.get(".right-arrow").click();
    cy.get(":nth-child(1) > .action-content > .action-button").click();
    cy.get(".search-input").click();
    cy.get(".search-input").clear("t");
    cy.get(".search-input").type("testz");
    cy.get(".search-button").click();
    cy.get(".search-container").click();
    cy.get(".search-button").click();
    cy.get("#cityFilter").select("Irbid");
    cy.get("#periodFilter").select("yearly");
    cy.get("#spaceFilter").click();
    cy.get(".filter-button").click();
    cy.get(".clear-button").click();
    cy.get(".more-button").click();
    cy.get(".brand-name").click();
    cy.get('.nav-links > [href="/"]').click();
    cy.get('[href="/education"]').click();
    cy.get(
      ":nth-child(1) > .card-image-container > .card-overlay > .overlay-button"
    ).click();
    cy.get('.nav-links > [href="/about"]').click();
    cy.get('.nav-links > [href="/"]').click();
    cy.get('[href="/policy"]').click();
    cy.get('[href="/terms"]').click();
    cy.get('.footer-links > [href="/contact"]').click();
    login();

    cy.get(".notification-badge").click();
    cy.get(":nth-child(3) > .check-icon").click();
    cy.get(":nth-child(3) > .check-icon").click();
    cy.get(".header").click();
    cy.get(".User-Avatar-Header > svg").click();
    cy.get(".MuiBackdrop-root").click();
  });
  it('offer buttons and logout', function() {
    login();
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .action-content > .action-button').click();
    cy.get('.nav-links > [href="/"]').click();
    cy.get(':nth-child(3) > .offer-details > .offer-actions > .favorite-button').first().click();
    cy.get(':nth-child(3) > .offer-details > .offer-actions > .favorite-button').first().click();

    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.User-Avatar-Header > svg > path').click();
    cy.get('#Logout > .MuiListItemText-root > .MuiTypography-root').click();
    /* ==== End Cypress Studio ==== */
  })
  it("login", function () {
    cy.visit("http://localhost:3000/login");

    cy.get(":nth-child(1) > input").clear("o");
    cy.get(":nth-child(1) > input").type("ooo");
    cy.get(":nth-child(2) > input").clear("0");
    cy.get(":nth-child(2) > input").type("00");
    cy.get("button").click();
    cy.get(":nth-child(1) > input").clear("oo");
    cy.get(":nth-child(1) > input").type("test1@gmail.com");
    cy.get(":nth-child(2) > input").clear("0");
    cy.get(":nth-child(2) > input").type("Test#1111{enter}");
    cy.get("button").click();
  });

  it("Sign up", function () {
    const fakeEmail = faker.internet.email();
    const phone = "07" + faker.string.numeric(8);

    cy.visit("http://localhost:3000/signup");

    cy.get("#firstName").clear("z");
    cy.get("#firstName").type("z");
    cy.get(".signup-btn").click();
    cy.get("#lastName").clear("Zaid");
    cy.get("#lastName").type("Zaid");
    cy.get("#lastName").click();
    cy.get("#address").clear("irbid");
    cy.get("#address").type("Irbid");
    cy.get('[name="day"]').select("14");
    cy.get('[name="day"]').select("9");
    cy.get('[name="month"]').select("Mar");
    cy.get('[name="year"]').select("2013");
    cy.get(".gender-options > :nth-child(1)").click();
    cy.get(":nth-child(1) > input").check();
    cy.get(".gender-options > :nth-child(2)").click();
    cy.get(".gender-options > :nth-child(2) > input").check();
    cy.get("#mobileNumber").clear("09999");
    cy.get("#mobileNumber").type("09999");
    cy.get("#email").clear("Zaidrad@gmail.com");
    cy.get("#email").type("Zaidradgmail.com");
    cy.get("#password").clear("5");
    cy.get("#password").type("567");
    cy.get("#confirmPassword").clear("0");
    cy.get("#confirmPassword").type("000");
    cy.get(".signup-btn").click();
    cy.get("#email").clear();
    cy.get("#email").type(fakeEmail);
    cy.get(".signup-btn").click();
    cy.get("#firstName").clear("A");
    cy.get("#firstName").type("Ali");
    cy.get("#mobileNumber").clear("0999");
    cy.get("#mobileNumber").type(phone);
    cy.get("#password").clear("56");
    cy.get("#password").type("Test#1234");
    cy.get("#confirmPassword").clear("00");
    cy.get("#confirmPassword").type("Test#1234");
    cy.get(".signup-btn").click();
    cy.get("#confirmPassword").clear();
    cy.get("#confirmPassword").type("Test#1234");
    cy.get(".signup-btn").click();
    cy.get('[name="year"]').select("1998");
    cy.get(".signup-btn").click();
  });

 

  it("profile", function () {
    login();
    cy.get(".User-Avatar-Header > h3").click();
    cy.get(
      ":nth-child(3) > .MuiListItemText-root > .MuiTypography-root"
    ).click();
    cy.get(".profile-tabs > :nth-child(2)").click();
    cy.get(".profile-tabs > :nth-child(1)").click();
    cy.get(".profile-offer-img").first().click();
  });

 
  it("offer detail", function () {
    login();
    cy.wait(1000);
    cy.visit("http://localhost:3000/");
    cy.get(
      ":nth-child(1) > .offer-details > .offer-header > .offer-title"
    ).click();
    cy.get(".swiper-button-next").click();
    cy.get(".swiper-button-next").click();
    cy.get(".swiper-button-prev").click();
    cy.get(".swiper-button-prev").click();
    cy.get(".swiper-pagination > :nth-child(2)").click();
    cy.get(".swiper-pagination > :nth-child(3)").click();
    cy.get(":nth-child(4) > .thumb-wrapper > .thumb-image").click();
  });
 it("Dashboard ", function () {
    login();
    cy.get(".User-Avatar-Header > h3").click();
    cy.get("#LandownerDashboard").click();
    cy.get(
      '.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]'
    ).click();
    cy.get(
      ':nth-child(6) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]'
    ).click();
    cy.get(
      '.MuiPaper-root.Mui-expanded > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]'
    ).click();
    cy.get(
      ':nth-child(8) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-expandIconWrapper > [data-testid="ExpandMoreIcon"]'
    ).click();
    cy.get(
      ":nth-child(4) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-content"
    ).click();

    cy.get(".offer-actions > :nth-child(1)").first().click();
    cy.get(".User-Avatar-Header > h3").click();
    cy.get(
      "#LandownerDashboard > .MuiListItemText-root > .MuiTypography-root"
    ).click();

    cy.get(".User-Avatar-Header > h3").click();
    cy.get(
      "#FarmerDashboard > .MuiListItemText-root > .MuiTypography-root"
    ).click();
    cy.get(
      ":nth-child(6) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-content"
    ).click();
    cy.get(
      ":nth-child(8) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-content"
    ).click();
    cy.get(
      ":nth-child(6) > .MuiAccordion-heading > .MuiButtonBase-root > .MuiAccordionSummary-content"
    ).click();
    cy.get(".request-actions > .MuiButtonBase-root").click();
  });
  it("add/ update offer", function () {
    login();
    cy.get(".User-Avatar-Header > h3").click();
    cy.get(
      ":nth-child(5) > .MuiListItemText-root > .MuiTypography-root"
    ).click();
    cy.get(".add-offer-button > svg > path").click();
    cy.get(":nth-child(1) > .textInput").clear("i");
    cy.get(":nth-child(1) > .textInput").type("ii");
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Years"]').click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(5) > .textInput").click();
    cy.get(":nth-child(5) > .textInput").clear("o");
    cy.get(":nth-child(5) > .textInput").type("o");
    cy.get(":nth-child(6) > .textInput").click();
    cy.get(".submit").click();
    cy.get(":nth-child(1) > .textInput").clear("i");
    cy.get(":nth-child(1) > .textInput").type("land for rent");
    cy.get(".submit").click();
    cy.get(":nth-child(5) > .textInput").clear();
    cy.get(":nth-child(5) > .textInput").type("west jordan");
    cy.get(".submit").click();
    cy.get(":nth-child(6) > .textInput").click();
    cy.get(".submit").click();

    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();

    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get(":nth-child(4) > .unit-Input > .textInput").click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Months"]').click();
    cy.get('[message="Years"]').click();
    cy.get('[message="Years"]').click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(".submit").click();

    cy.get(":nth-child(2) > .unit-Input > .textInput").clear("8");
    cy.get(":nth-child(2) > .unit-Input > .textInput").type("8");
    cy.get('[message="Years"]').clear("9");
    cy.get('[message="Years"]').type("99");
    cy.get('[message="Months"]').clear("7");
    cy.get('[message="Months"]').type("7");
    cy.get('[message="Years"]').clear("9");
    cy.get('[message="Years"]').type("9");
    cy.get(":nth-child(4) > .unit-Input > .textInput").clear("6");
    cy.get(":nth-child(4) > .unit-Input > .textInput").type("6");
    cy.get(".submit").click();

    cy.get(":nth-child(6) > .textInput").click();
    cy.get(".submit").click();
    cy.get(":nth-child(2) > .unit-Input > .textInput").click();
    cy.get(".submit").click();

    cy.get(":nth-child(2) > .unit-Input > .textInput").clear("5");
    cy.get(":nth-child(2) > .unit-Input > .textInput").type("55");

    cy.get("textarea.textInput").type(
      "A very fertile and well-maintained piece of land available for rent. Ideal for farming, gardening, or other agricultural purposes. The soil is rich and the area is peaceful, with easy access to water. The price is negotiable based on your intended use and rental period."
    );
    cy.get('input[type="file"]').attachFile("1.jpg");
    cy.get('input[type="file"]').attachFile("2.jpg");
    cy.get('input[type="file"]').attachFile("3.jpg");
    cy.get('input[type="file"]').attachFile("4.jpg");
    cy.get('input[type="file"]').attachFile("5.jpg");

    cy.get(".submit").click();
    cy.get(".notification").click();
  });

 
  it("contact", function () {
    cy.visit("http://localhost:3000/");
    cy.get('.nav-links > [href="/contact"]').click();
    cy.get("#name").clear("Z");
    cy.get("#name").type("Zaid");
    cy.get("#email").clear("zaidAR@gmail.com");
    cy.get("#email").type("zaidAR@gmail.com");
    cy.get("#subject").clear("i");
    cy.get("#subject").type("i need help");
    cy.get("#message").click();
    cy.get(".submit-button").click();
  });
  it('chat', function() {
    login();
    cy.get('.User-Avatar-Header > h3').click();
    cy.get('#MyChats').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(1) > .css-qd139m > .MuiBox-root > .MuiTypography-body2').click();
    cy.get('[placeholder="Type a message..."]').clear(' h');
    cy.get('[placeholder="Type a message..."]').type(' hello');
    cy.get('button > svg').click();
    cy.get('.upload-label > svg > path').click();
    cy.get('input[type="file"]').attachFile("1.jpg");
    cy.get('button > svg > path').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(3) > .css-qd139m > .MuiBox-root > .MuiTypography-body2').click();
    cy.get('.chat-owner > h4').click();
    /* ==== End Cypress Studio ==== */
  })

  it("account info", function () {
    cy.visit("http://localhost:3000/login");
    cy.get(":nth-child(1) > input").clear("test1@gmail.com");
    cy.get(":nth-child(1) > input").type("test1@gmail.com");
    cy.get(":nth-child(2) > input").clear("Test#1111");
    cy.get(":nth-child(2) > input").type("Test#1111");
    cy.get("button").click();
    cy.get(".User-Avatar-Header > h3").click();
    cy.get(
      ":nth-child(1) > .MuiListItemText-root > .MuiTypography-root"
    ).click();
    cy.get(":nth-child(2) > .input-container > .edit-btn").click();
    cy.get(":nth-child(2) > .input-container > .full-width-input").clear(
      "Zaidone"
    );
    cy.get(":nth-child(2) > .input-container > .full-width-input").type("Za");
    cy.get(":nth-child(2) > .input-container > .edit-btn").click();
    cy.get(":nth-child(2) > .input-container > .edit-btn").click();
    cy.get(":nth-child(2) > .input-container > .full-width-input").clear("Z");
    cy.get(":nth-child(2) > .input-container > .full-width-input").type("Z");
    cy.get(":nth-child(2) > .input-container > .edit-btn").click();
    cy.get(":nth-child(2) > .input-container > .full-width-input").type('{moveToStart}{del}{del}');;
    cy.get(":nth-child(2) > .input-container > .full-width-input").type(
      "Zaidone"
    );
    cy.get(":nth-child(2) > .input-container > .edit-btn").click();
    cy.get(":nth-child(3) > .input-container > .edit-btn").click();
    cy.get(":nth-child(3) > .input-container > .full-width-input").clear(
  
    );
    cy.get(":nth-child(3) > .input-container > .full-width-input").type(
      "test1gmail.com"
    );
    cy.get(":nth-child(3) > .input-container > .edit-btn").click();
    cy.get(":nth-child(3) > .input-container > .full-width-input").clear(
    );
    cy.get(":nth-child(3) > .input-container > .full-width-input").type(
      "test1@gmail.com"
    );
    cy.get(":nth-child(4) > .input-container > .edit-btn").click();
    cy.get(":nth-child(4) > .input-container > .full-width-input").clear();
    cy.get(":nth-child(4) > .input-container > .full-width-input").type(
      "078717324"
    );
    cy.get(":nth-child(4) > .input-container > .edit-btn").click();
    cy.get(":nth-child(4) > .input-container > .full-width-input").clear(
      "0787173245"
    );
    cy.get(":nth-child(4) > .input-container > .full-width-input").type(
      "0787173245"
    );
    cy.get(":nth-child(6) > .input-container > .edit-btn").click();
    cy.get(":nth-child(6) > .input-container > .full-width-input").clear(
      "Irbi"
    );
    cy.get(":nth-child(6) > .input-container > .full-width-input").type("I");
    cy.get(":nth-child(6) > .input-container > .edit-btn").click();
    cy.get(":nth-child(6) > .input-container > .full-width-input").clear("Ir");
    cy.get(":nth-child(6) > .input-container > .full-width-input").type(
      "Irbid"
    );
    cy.get(":nth-child(6) > .input-container > .edit-btn").click();
    cy.get(":nth-child(5) > .input-container > .edit-btn").click();
    cy.get(":nth-child(5) > .input-container > .full-width-input").select(
      "female"
    );
    cy.get(":nth-child(5) > .input-container > .edit-btn").click();
    cy.get(":nth-child(7) > .input-container > .edit-btn").click();
    cy.get(":nth-child(7) > .input-container > .full-width-input").click();
    cy.get(":nth-child(7) > .input-container > .full-width-input").click();
    cy.get(":nth-child(7) > .input-container > .full-width-input").click();
    cy.get(":nth-child(7) > .input-container > .full-width-input").click();
    cy.get(":nth-child(7) > .input-container > .full-width-input").click();
    cy.get(":nth-child(7) > .input-container > .edit-btn").click();
    cy.get(":nth-child(8) > .input-container > .edit-btn").click();
    cy.get(":nth-child(8) > .input-container > .full-width-input").clear("4");
    cy.get(":nth-child(8) > .input-container > .full-width-input").type("44");
    cy.get(":nth-child(8) > .input-container > .edit-btn").click();
    cy.get(":nth-child(8) > .input-container > .full-width-input").clear("4");
    cy.get(":nth-child(8) > .input-container > .full-width-input").type(
      "Test#1111"
    );
    cy.get(".account-inf-card > :nth-child(9)").click();
    cy.get(":nth-child(9) > .input-container > .full-width-input").clear(
      "Test#1111"
    );
    cy.get(":nth-child(9) > .input-container > .full-width-input").type(
      "Test#1111"
    );
    cy.get(":nth-child(8) > .input-container > .edit-btn").click();
    cy.get(":nth-child(3) > .input-container > .edit-btn").click();
    cy.get(":nth-child(4) > .input-container > .edit-btn").click();
    cy.get('input[type="file"]').attachFile("user.jpg");
    cy.get(".delete-btn").click();
  });
});
 


function login() {
  cy.visit("http://localhost:3000/login");
  cy.get(":nth-child(1) > input").clear("test1@gmail.com");
  cy.get(":nth-child(1) > input").type("test1@gmail.com");
  cy.get(":nth-child(2) > input").clear("Test#1111");
  cy.get(":nth-child(2) > input").type("Test#1111");
  cy.get("button").click();
  cy.wait(3000);
}
