// import { getUserInfo, abort } from '@/api/getUserInfo'
// import { useHandleRes, createResCfg } from '@/hooks/request'

// export const useGetUserInfo = () => {
//   const getUserInfoCfg = createResCfg<void>({
//     success: '获取用户信息成功',
//     clientFail: '用户信息状态异常，请稍后再试',
//     serverFail: '服务器繁忙，请稍后再试',
//     error: '获取失败，请稍后重试',
//     handle: getUserInfo,
//   })
//   const { execute, isLoading } = useHandleRes(getUserInfoCfg)
//   const fetchUserInfo = async () => {
//     const res = await execute()
//     return { code: res?.code, message: res?.message, data: res?.data }
//   }
//   return { isLoading, fetchUserInfo, abort }
// }

// 传参ts报错，问题待排查
