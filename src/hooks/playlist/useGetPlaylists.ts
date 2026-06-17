// import { getPlaylists, abort } from '@/api/getPlaylists'
// import { useHandleRes, createResCfg } from '@/hooks/request'

// export const useGetPlaylists = () => {
//   const getPlaylistsCfg = createResCfg<void>({
//     success: '获取歌单列表成功',
//     clientFail: '歌单列表状态异常，请稍后再试',
//     serverFail: '服务器繁忙，请稍后再试',
//     error: '获取失败，请稍后重试',
//     handle: getPlaylists,
//   })
//   const { execute, isLoading } = useHandleRes(getPlaylistsCfg)
//   const fetchPlaylists = async () => {
//     const res = await execute()
//     return { code: res?.code, message: res?.message, data: res?.data }
//   }
//   return { isLoading, fetchPlaylists, abort }
// }

// 传参ts报错，问题待排查
