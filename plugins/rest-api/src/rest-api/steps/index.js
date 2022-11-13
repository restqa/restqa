module.exports = function ({Given, When, Then}) {
  /*********************************************
   * GIVEN
   ********************************************/
  require("./1-given").forEach((step) => {
    Given.apply(this, step);
  });

  /*********************************************
   * WHEN
   ********************************************/
  require("./2-when").forEach((step) => When.apply(this, step));

  /*********************************************
   * THEN
   ********************************************/
  require("./3-then").forEach((step) => Then.apply(this, step));
};
