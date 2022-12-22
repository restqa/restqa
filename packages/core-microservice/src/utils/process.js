// Simple passthrough allowing a to get mock during the test
module.exports = {
  on: (evt, fn) => {
    process.on(evt, fn);
  },
  exit: (signal) => {
    process.exit(signal);
  }
};
