import storage from 'good-storage'
const TOKEN_KEY = '__token__'

export function saveToken (token) {
  storage.session.set(TOKEN_KEY, token)
  return token
}
export function deleteToken (token) {
  storage.session.set(TOKEN_KEY, '')
  return ''
}
export function loadToken () {
  return storage.session.get(TOKEN_KEY, '')
}
