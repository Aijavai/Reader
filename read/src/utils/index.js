// import mitt from 'mitt'

// // 事件总线
// export const emitter = mitt()

// 防抖函数 - 优化搜索性能
export function debounce(func, delay) {
  return function (args) {
    let that = this
    let _args = args
    clearTimeout(func.id)
    func.id = setTimeout(function () {
      func.call(that, _args)
    }, delay)
  }
}

// 节流函数 - 优化滚动等高频事件
export function throttle(func, delay) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

// 格式化数字 - 显示阅读量等
export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 本地存储工具
export const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}


// export function Toast(content, duration = 2000) {
//     emitter.emit('toast', {
//       content,
//       duration
//     })
// }