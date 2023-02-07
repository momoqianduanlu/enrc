export function debounce (func, delay) {
  let timer
  // 函数柯里化
  return function (...arg) {
    if (timer) {
      clearTimeout(timer)
    }
    setTimeout(() => {
      func.apply(this, arg)
    }, delay)
  }
}

/**
 * 解析URL查询字符串，转换成JSON格式
 * parseQueryString('?foo=bar');         // { foo: 'bar' }
 */
export function parseQueryString (query) {
  if (!query) {
    return {}
  }

  const _decode = (input) => {
    try {
      return decodeURIComponent(input.replace(/\+/g, ' '))
    } catch (e) {
      return null
    }
  }

  const parser = /([^=?#&]+)=?([^&]*)/g
  const result = {}
  let part

  // eslint-disable-next-line no-cond-assign
  while (part = parser.exec(query)) {
    const key = _decode(part[1])
    let value = _decode(part[2])

    if (key === null) {
      continue
    }

    if (value === null) {
      value = undefined
    }

    result[key] = value
  }

  return result
}

/**
 * url解析，在URL基础上扩展了查询字符串解析对象
 * @param urlString - url格式字符串
 * @returns IURL - 返回URL对象扩展了searchObject和hashSearchObject
 * @example
 * ```ts
 * const urlStr = 'https://www.baidu.com/path1/path2?foo=1&bar=a/#/hashpath1/hashpath2?hashfoo=1&hashbar=a'
 * const url = urlParse(urlStr)
 * {
 *  hash: "#/hashpath1/hashpath2?hashfoo=1&hashbar=a",
 *  hashSearchObject: {
 *    hashfoo: '1',
 *    hashbar: 'a'
 *  }
 *  host: "www.baidu.com"
 *  hostname: "www.baidu.com"
 *  href: "https://www.baidu.com/path1/path2?foo=1&bar=a/#/hashpath1/hashpath2?hashfoo=1&hashbar=a"
 *  origin: "https://www.baidu.com"
 *  password: ""
 *  pathname: "/path1/path2"
 *  port: ""
 *  protocol: "https:"
 *  search: "?foo=1&bar=a/"
 *  searchObject: {
 *    foo: '1',
 *    bar: 'a'
 *  }
 *  username: ""
 * }
 * ```
 *
 * @public
 */
export function urlParse () {
  const urlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

  try {
    const url = new URL(urlString)
    const parsed = {}

    for (const key in url) {
      if (key !== 'toString' && key !== 'toJSON' && key !== 'searchParams') {
        parsed[key] = url[key]
      }
    }

    parsed.searchObject = parseQueryString(url.search.replace(/\/$/, ''))
    parsed.hashSearchObject = parseQueryString(url.hash.replace(/^#.+\?/, ''))
    return parsed
  } catch (err) {
    return {}
  }
}

/**
 * 是否是钉钉浏览器
 * @param userAgent -（可选）指定用户代理字符串，默认使用`navigator.userAgent`
 * @returns true|false
 * @example
 * ```ts
 * const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) .. DingTalk(5.1.40-macOS-macOS-MAS-14354546)'
 * isDingTalk(ua) // true
 * ```
 * @public
 */
export function isDingTalk (userAgent) {
  if (!userAgent) {
    userAgent = navigator.userAgent
  }
  return /dingtalk/i.test(userAgent)
}

/**
 * 是否是企业微信浏览器, 判断 wxwork 关键字
 * @param userAgent -（可选）指定用户代理字符串，默认使用`navigator.userAgent`
 * @returns true|false
 * @example
 * ```ts
 * const ua = '... Mobile/15E148 wxwork/3.1.19 MicroMessenger/7.0.1 Language/zh ColorScheme/Light'
 * isWeChat(ua) // true
 * ```
 * @public
 */
export function isWeChat (userAgent) {
  if (!userAgent) {
    userAgent = navigator.userAgent
  }
  return /wxwork/i.test(userAgent)
}

export function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 图片blob转图片base64
 * @param blob
 */
export function blobToBase64 (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}
