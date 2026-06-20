// 后端接口路径常量集合
// 基础路径 /api 由 axios 的 baseURL 统一处理，此处仅声明相对路径

// ============ 用户模块 ============
// 登录
export const loginPath = '/auth/login'
// 注册
export const registerPath = '/auth/register'
// 用户资料
export const userProfilePath = '/user/profile'
// 修改密码
export const userPasswordPath = '/user/password'

// ============ 歌曲模块 ============
// 歌曲列表
export const songsPath = '/songs'
// 歌曲搜索
export const songsSearchPath = '/songs/search'
// 歌曲详情（{id} 为占位符，调用时替换）
export const songDetailPath = '/songs/{id}'

// ============ 分类模块 ============
// 分类列表
export const categoriesPath = '/categories'
// ============ 歌单模块 ============
// 歌单列表
export const playlistsPath = '/playlists'
// 歌单详情（{id} 为占位符，调用时替换）
export const playlistDetailPath = '/playlists/{id}'
// 歌单内歌曲操作（{id} 为占位符，调用时替换）
export const playlistSongsPath = '/playlists/{id}/songs'
// 歌单外部歌曲操作（{id} 为占位符，调用时替换）
export const playlistExternalSongsPath = '/playlists/{id}/external-songs'

// ============ 第三方资源模块 ============
// 第三方搜索
export const thirdpartySearchPath = '/thirdparty/search'
// 第三方播放地址
export const thirdpartyPlayUrlPath = '/thirdparty/playurl'
// 第三方歌词
export const thirdpartyLyricPath = '/thirdparty/lyric'
// 第三方 MV 地址
export const thirdpartyMvUrlPath = '/thirdparty/mv/url'
