import type { AxiosResponse } from 'axios'
interface MsgTips {
  success: string
  clientFail: string
  serverFail: string
  error: string
}

export interface CommonResCfg<T = Record<string, unknown>> {
  code: number
  message: string
  data: T
}

export interface CommonReqCfg {
  tips: MsgTips
  cfg: null | Record<string, unknown>

  handle: <Payload>(payload: Payload) => Promise<CommonResCfg>
}

export interface FlatResCfg {
  success: string
  clientFail: string
  serverFail: string
  error: string
  handle: <Payload>(payload: Payload) => Promise<CommonResCfg>
}

export interface LogCfg {
  code: number
  message: string
  tips: MsgTips
}
