import storage from 'good-storage'
import { _USERINFO_ } from '@/utils/constants'

export function loadUserInfo () {
  return storage.get(_USERINFO_, null)
}

export function saveUserInfo (userInfo) {
  storage.set(_USERINFO_, userInfo)
  return userInfo
}

export function clearUserInfo () {
  storage.remove(_USERINFO_)
  return null
}
