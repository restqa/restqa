module.exports = {
  cwd: process.cwd(),
  exit: (signal) => {
    process.exit(signal);
  }
};
