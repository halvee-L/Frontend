let LazyMan = (function () {
  let sleep = (time) => {
    return new Promise((resolve, reject) => setTimeout(resolve, time * 1000));
  };
  let nextTick = (fn) => Promise.resolve(null).then(fn);

  let runFactory = (list, running = false) => () => {
    if (running) return;
    running = true;
    nextTick(() => {
      (function execTask(task) {
        if (task) {
          let res = task();
          if (res) {
            res.then(() => execTask.call(this, list.shift()));
          } else {
            execTask.call(this, list.shift());
          }
        } else {
          running = false;
        }
      }.bind(this)(list.shift()));
    });
  };

  return function LazyMan(name) {
    let tasklist = [];
    let run = runFactory(tasklist);
    console.log('Hi I am ' + name);
    return {
      sleep: function (time) {
        tasklist.push(() => sleep(time));
        run();
      },
      sleepFirst: function (time) {
        tasklist.unshift(() => sleep(time));
        run();
      },
      eat: function (food) {
        tasklist.push(() => {
          console.log('I am eating' + food);
        });
        run();
      },
    };
  };
})();
