const Given = {};

Given.defineVariable = function (fakerProperty, property) {
  const val = this.faker.get(fakerProperty);
  this.data.set(property, val);
  this.attach(`[FAKER] Generate a value (${fakerProperty}): ${val}`);
};

Given.locale = function (locale) {
  this.faker.setLocale(locale);
};

module.exports = Given;
