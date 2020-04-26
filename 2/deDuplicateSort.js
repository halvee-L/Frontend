// 对输入数组数据进行去重及排序操作(升序)


let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10, 50];


function deDuplicateSort(arr) {

  let res = []
  let set = new Set();
  // 从小到大
  function insert(val) {
    if (val < res[0]) res.unshift(val)
    for (let i = 0, len = res.length; i < len; i++) {
      if (val < res[i]) {
        res.splice(i, 0, val)
        return
      }
    }
    res.push(val)
  }
  (function forEach(list) {
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i]
      if (Array.isArray(item)) {
        forEach(item)
      } else {
        if (set.has(item)) continue
        insert(item)
        set.add(item)
      }
    }
  })(arr)

  return res
}


var log1 = function (name, fn) {
  console.time(name)
  console.log(name, fn())
  console.timeEnd(name)
}

log1('deDuplicateSort', () => deDuplicateSort(arr))


//!!!!!!!
log1('set+flat+sort', () =>
  Array.from(new Set(arr.flat(Infinity))).sort((a, b) => { return a - b })
)
