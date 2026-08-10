class LoginPage {
  visit() {
    cy.visit("/login");
    cy.contains("h2", "Login to your account").should("be.visible");
  }

  login(email, password) {
    cy.get('input[data-qa="login-email"]').clear().type(email);
    cy.get('input[data-qa="login-password"]').clear().type(password, {
      log: false,
    });
    cy.get('button[data-qa="login-button"]').click();
  }

  assertLoggedIn(name) {
    cy.contains("a", "Logged in as").should("be.visible");
    cy.contains("a", name).should("be.visible");
  }

  assertInvalidLogin() {
    cy.contains("p", "Your email or password is incorrect!").should(
      "be.visible",
    );
  }
}

module.exports = new LoginPage();
