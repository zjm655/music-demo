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

export interface CommonReqCfg<Payload, Res = Record<string, unknown>> {
  tips: MsgTips
  cfg: null | Record<string, unknown>

  handle: (payload: Payload) => Promise<CommonResCfg<Res>>
}

export interface FlatResCfg<Payload, Res = Record<string, unknown>> {
  success: string
  clientFail: string
  serverFail: string
  error: string
  handle: (payload: Payload) => Promise<CommonResCfg<Res>>
}

export interface LogCfg {
  code: number
  message: string
  tips: MsgTips
}
