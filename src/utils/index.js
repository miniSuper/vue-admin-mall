export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('参数必须是 对象 类型')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function getSelectionStr (arr, key) {
  let newArr = []
  arr.forEach(item => {
    newArr.push(item[key])
  })
  let str = newArr.join(',')
  return str
}
// 节流函数
export function throttle (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// 将含有空格的字符串转为 逗号 ','分隔
export function transSpaceToComma (str) {
  /* eslint-disable no-control-regex */
  var reg = new RegExp('\n', 'g')
  let newStr = str.replace(reg, ',')
  return newStr
}

// 商品类型模块 商品属性值 帮后端处理成 name | 类型 | 排序 | 是否使用 | value ;
export function transObjArrToStr (arr) {
  let str = ''
  arr.forEach(item => {
    str +=
      item.attr_name +
      '|' +
      item.type +
      '|' +
      item.sort +
      '|' +
      item.is_use +
      '|' +
      item.attr_value +
      ';'
  })
  return str
}
// 将sort数组转化成 element-ui 中的级联 选择器中的格式
export function cascaderFormatSort (cateArr, newArr) {
  cateArr.forEach((item, index) => {
    newArr.push({
      value: item.category_id,
      label: item.category_name
      // children: []
    })
    if (item._child && item._child.length !== 0) {
      newArr[index].children = []
      cascaderFormatSort(item._child, newArr[index].children)
    }
    // console.log(item, index)
  })
}
// 将 html &nbsp; 的空格转化为 输入框 \n 的空格
export function transHtmlSpaceToCommon (str) {
  const reg = /&nbsp;/g
  return str.replace(reg, '\t')
}
// 将带有空格的字符串 转为 数组
export function transSpaceStrToArray (str) {
  let arr = str.split(' ')
  return arr
}
export function timestampToTime (timestamp) {
  var date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
