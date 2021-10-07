function infinite() {
  let count = 0

  const interval = setInterval(() => {
    if (count >= 300) {
      clearInterval(interval);
      return 
    }
    // eslint-disable-next-line
    process.stdout.write("Display a useless line pt " + count++);
  }, 1000)
}

infinite();
