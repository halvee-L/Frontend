// 分别用深度优先及广度优先方式实现深拷贝

function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1)
}

function isType(val, type) {
  return getType(val) === type
}

function typeFactory(type) {
  return function (val) {
    return getType(val) === type
  }
}

function getDefaultBySource(source) {
  switch (getType(source)) {
    case 'Object': return {}
    case 'Array': return []
    case 'Function': return eval('(' + source.toString() + ')')
    default: return {}
  }
}
var util = {
  isString: typeFactory('String'),
  isArray: typeFactory('Array'),
  isFunction: typeFactory('Function'),
  isObject: typeFactory('Object'),
  isNull: typeFactory('Null'),
  isUndefined: typeFactory('Undefined'),
  isNumber: typeFactory('Number')
}

// 深度优先
function DFSClone(source, cacheArray) {
  var target = {}
  cacheArray = cacheArray || []
  if (util.isObject(source) || util.isArray(source) || util.isFunction(source)) {
    var index = cacheArray.indexOf(source)
    if (index > -1) {
      // todo
      target = source
    } else {
      target = getDefaultBySource(source)
      cacheArray.push(source)
      for (var attr in source) {
        target[attr] = DFSClone(source[attr], cacheArray)
      }
    }
  }
  else {
    target = source
  }
  return target
}


// 广度优先

// todo function ??

function BFSClone(source) {
  var copyTarget = getDefaultBySource(source)
  var map = new Map()
  if (util.isObject(source) || util.isArray(source) || util.isFunction(source)) {
    var origin = [source]
    var copy = [copyTarget]
    while (origin.length) {
      source = origin.shift()
      var target = copy.shift()
      map.set(source, target)
      for (var attr in source) {
        if (util.isObject(source[attr]) || util.isArray(source[attr]) || util.isFunction(source[attr])) {
          if (map.has(source[attr])) {
            target[attr] = map.get(source[attr])
          } else {
            target[attr] = getDefaultBySource(source[attr])
            origin.push(source[attr])
            copy.push(target[attr])
          }
        } else {
          target[attr] = source[attr]
        }
      }
    }
  } else {
    copyTarget = source
  }
  return copyTarget
}



var a = {

  a: 'a',
  b: 'c',
  c: {
    d: {
      e: 'e'
    }
  }
}
var log1 = function (name, fn) {
  console.time(name)
  console.log(name, fn())
  console.timeEnd(name)
}
log1('DFS', () => DFSClone(a))
log1('BFS', () => BFSClone(a))

a.t = a

log1('DFS闭环', () => DFSClone(a))
log1('BFS闭环', () => BFSClone(a))
