import { getPlayUrl, getPlayUrlAbort } from '@/api/thirdparty'
import type { GetPlayUrlPayload, GetPlayUrlResPayload } from '@/api/thirdparty'
import { useHandleRes, createResCfg } from '@/hooks/request'

export type { GetPlayUrlPayload, GetPlayUrlResPayload }

// 获取播放链接 hook
export const useGetPlayUrl = () => {
  const cfg = createResCfg<GetPlayUrlPayload, GetPlayUrlResPayload>({
    success: '获取播放链接成功',
    clientFail: '获取播放链接状态异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '获取失败，请稍后重试',
    handle: getPlayUrl,
  })
  const { execute, isLoading } = useHandleRes<GetPlayUrlPayload, GetPlayUrlResPayload>(cfg)
  const fetchPlayUrl = async (payload: GetPlayUrlPayload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, fetchPlayUrl, abort: getPlayUrlAbort }
}
