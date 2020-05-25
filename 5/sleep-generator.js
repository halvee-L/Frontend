function* sleep(time) {
  setTimeout(() => {
    yield 1;
  }, time);
}
