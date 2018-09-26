const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let isEmptyObject = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}

// 页面重新加载情形：
// 1.当前页面数据为空（可能是第一次进入该页面，或前 N 次进入该页面但是没有刷出来数据，这时候有必要重新加载）;
let pageReload = (dataList) => {
  let dataEmpty = (list) => {
    let empty = false
    let item = null
    for (let i = 0, len = list.length; i < len; i++) {
      item = list[i]
      if (isEmptyObject(item)) {
        empty = true
        break
      }
    }
    return empty
  }
  if (dataEmpty(dataList)) {
    return true
  }
}

module.exports = {
  formatTime: formatTime,
  isEmptyObject,
  pageReload
}
