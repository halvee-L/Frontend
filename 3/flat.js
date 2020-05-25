var arr = [1, 2, 3, [4, 5], [6, [7, [8]]]];

function flat(arr) {
  var res = [];
  if (Array.isArray(arr)) {
    for (let i = 0, len = arr.length; i < len; i++) {
      res.push.apply(res, flat(arr[i]));
    }
  } else {
    // todo
    res = [arr];
  }
  return res;
}

function flat1(arr) {
  if (Array.isArray(arr)) {
    return arr.reduce((prev, item) => {
      return prev.concat(flat1(item));
    }, []);
  }
  return [arr];
}
