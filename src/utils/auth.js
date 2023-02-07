import { Token } from './constants'

/**
 * 存取token
 * @param {String} data
 */
export const setToken = (data) => {
  return localStorage.setItem(Token, data)
}

/**
 * 获取token
 */
export const getToken = () => {
  return localStorage.getItem(Token) || ''
}

/**
 * 删除token
 */
export const removeToken = () => {
  return localStorage.removeItem(Token)
}
