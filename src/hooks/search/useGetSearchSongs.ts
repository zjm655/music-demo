import { getSearchSongs, abort } from '@/api/search'
import type { Payload } from '@/api/search'
import { useHandleRes, createResCfg } from '@/hooks/request'

export const useGetSearchSongs = () => {
  const getSearchSongsCfg = createResCfg({
    success: '搜索成功',
    clientFail: '搜索参数异常，请稍后再试',
    serverFail: '服务器繁忙，请稍后再试',
    error: '搜索失败，请稍后重试',
    handle: getSearchSongs,
  })
  const { execute, isLoading } = useHandleRes(getSearchSongsCfg)
  const searchSongs = async (payload: Payload) => {
    const res = await execute(payload)
    return { code: res?.code, message: res?.message, data: res?.data }
  }
  return { isLoading, searchSongs, abort }
}
