const { parseApiBody } = require("../utils/ApiResponseUtils");

Cypress.Commands.add("createAutomationExerciseUser", (user) => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("automationExerciseApiUrl")}/createAccount`,
      form: true,
      body: user,
      failOnStatusCode: false,
    })
    .then((response) => {
      expect([200, 201]).to.include(response.status);

      const body = parseApiBody(response.body);

      expect(body.responseCode).to.eq(201);
      expect(body.message).to.eq("User created!");

      return user;
    });
});

Cypress.Commands.add("deleteAutomationExerciseUser", (user) => {
  return cy
    .request({
      method: "DELETE",
      url: `${Cypress.env("automationExerciseApiUrl")}/deleteAccount`,
      form: true,
      body: {
        email: user.email,
        password: user.password,
      },
      failOnStatusCode: false,
    })
    .then((response) => {
      expect([200, 204]).to.include(response.status);

      if (response.body) {
        const body = parseApiBody(response.body);
        expect(body.responseCode).to.eq(200);
      }
    });
});
