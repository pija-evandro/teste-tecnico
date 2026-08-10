class UserDataFactory {
  static create() {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    return {
      name: `QA ${suffix}`,
      email: `qa.${suffix}@example.com`,
      password: "Qa123456!",
      title: "Mr",
      birth_date: "1",
      birth_month: "1",
      birth_year: "1990",
      firstname: "QA",
      lastname: "Test",
      company: "",
      address1: "Test Street",
      address2: "",
      country: "United States",
      zipcode: "10001",
      state: "New York",
      city: "New York",
      mobile_number: "11999999999",
    };
  }

  static createInvalidCredentials() {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    return {
      email: `invalid.${suffix}@example.com`,
      password: "Invalid123!",
    };
  }
}

module.exports = UserDataFactory;
