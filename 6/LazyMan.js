function isPromise(promise) {
  return promise instanceof Promise;
}
function nextTick(fn) {
  Promise.resolve(null).then(fn);
}
function LazyMan(name) {
  if (!(this instanceof LazyMan)) return new LazyMan(name);
  this.name = name;
  this.taskList = [];
  this.init();
}

LazyMan.prototype.parseTask = function (task) {
  return function () {
    let res = task();
    return isPromise(res) ? res : { then: (fn) => fn() };
  };
};
LazyMan.prototype.preTask = function (task) {
  this.taskList.unshift(this.parseTask(task));
};
LazyMan.prototype.addTask = function (task) {
  this.taskList.push(this.parseTask(task));
};
LazyMan.prototype.run = function () {
  if (this.running) return;
  this.running = true;
  nextTick(() => {
    (function execTask(task) {
      if (task) {
        task().then(() => execTask.call(this, this.taskList.shift()));
      } else {
        this.running = false;
      }
    }.bind(this)(this.taskList.shift()));
  });
};
LazyMan.prototype.init = function () {
  console.log('Hi I am ' + this.name);
};

LazyMan.prototype.eat = function (food) {
  this.addTask(() => {
    console.log('I am eating' + food);
  });
  this.run();
  return this;
};

LazyMan.prototype.sleepFirst = function (time) {
  this.preTask(
    () => new Promise((resolve, reject) => setTimeout(resolve, time * 1000))
  );
  this.run();

  return this;
};

LazyMan.prototype.sleep = function (time) {
  this.addTask(
    () => new Promise((resolve, reject) => setTimeout(resolve, time * 1000))
  );
  this.run();
  return this;
};

LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(10)
  .eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
