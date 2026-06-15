import { request } from '@/utils/request'
import { registerPath } from '@/config/api'

export let abort: null | AbortController = null

interface Payload {
  username: string
  password: string
  email: string
}

export function register(payload: Payload) {
  const res = request.json.post(registerPath, {
    data: payload,
  })
  abort = res.controller
  return res.promise
}
