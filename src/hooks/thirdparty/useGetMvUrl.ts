import { getMvUrl, getMvUrlAbort } from '@/api/thirdparty'
import type { GetMvUrlPayload, GetMvUrlResPayload } from '@/api/thirdparty'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetMvUrlPayload, GetMvUrlResPayload }

// 获取MV地址 hook
export const useGetMvUrl = () => {
  const cfg = createResCfg<GetMvUrlPayload, GetMvUrlResPayload>({
    success: '获取MV地址成功',
    clientFail: '获取MV地址状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getMvUrl,
  })
  const { execute, isLoading } = useHandleRes<GetMvUrlPayload, GetMvUrlResPayload>(cfg)
  const fetchMvUrl = async (payload: GetMvUrlPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchMvUrl, abort: getMvUrlAbort }
}
