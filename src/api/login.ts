import { request } from '@/utils/request'
import { loginPath } from '@/config/api'
export let abort: null | AbortController = null

interface LoginPayload {
  username: string
  password: string
}

export function login<LoginPayload>(payload: LoginPayload) {
  const res = request.json.post(loginPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
