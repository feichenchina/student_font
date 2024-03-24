import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data,
  })
}

export function logout(type = 'student') {
  return request({
    url: `/api/${type}/login-out`,
    method: 'post',
    data: { type: type }
  })
}
