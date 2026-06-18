export { useGetPlaylists } from './useGetPlaylists'
export type { GetPlaylistsResPayload } from './useGetPlaylists'

export { useGetPlaylist } from './useGetPlaylist'
export type { GetPlaylistPayload, GetPlaylistResPayload } from './useGetPlaylist'

export { useCreatePlaylist } from './useCreatePlaylist'
export type { CreatePlaylistPayload, CreatePlaylistResPayload } from './useCreatePlaylist'

export { useOperatePlaylistSong } from './useOperatePlaylistSong'
export type { OperatePlaylistSongPayload, OperatePlaylistSongResPayload } from './useOperatePlaylistSong'

export { useAddExternalSong } from './useAddExternalSong'
export type { AddExternalSongPayload, AddExternalSongResPayload } from './useAddExternalSong'

export { useDeletePlaylist } from './useDeletePlaylist'
export type { DeletePlaylistPayload, DeletePlaylistResPayload } from './useDeletePlaylist'

// 透传 api 模块的领域模型类型
export type { PlaylistItem, PlaylistSongVO } from '@/api/playlist'
