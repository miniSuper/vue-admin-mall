export function isValidUsername (str) {
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{4,10}$/
  return reg.test(str)
}
export function isValidateEmail (email) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}
export function isValidateMobile (phone) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(phone)
}
