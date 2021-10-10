function infinite() {
  let count = 0;

  let interval = setInterval(() => {
    if (count >= 300) {
      clearInterval(interval);
      interval = null;
      return;
    }
    // eslint-disable-next-line
    process.stdout.write("Display a useless line pt " + count++);
  }, 1000);

  process.on("SIGTERM", () => {
    clearInterval(interval);
    interval = null;
  });
}

infinite();
