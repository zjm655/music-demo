// 带 TTL（存活时间）的内存缓存工具
// 通过 createCache 创建一个独立缓存实例，内部使用 Map 存储，过期自动失效

// 缓存项：value 为缓存值，expireAt 为过期时间戳（毫秒）
interface CacheEntry<T> {
  value: T
  expireAt: number
}

export function createCache<T>(ttl: number) {
  // ttl 单位为毫秒
  const store = new Map<string, CacheEntry<T>>()

  return {
    // 读取缓存：若不存在或已过期则返回 undefined，过期项会被自动删除
    get(key: string): T | undefined {
      const entry = store.get(key)
      if (!entry) return undefined
      if (Date.now() > entry.expireAt) {
        // 已过期，删除并返回 undefined
        store.delete(key)
        return undefined
      }
      return entry.value
    },
    // 写入缓存：记录值与过期时间
    set(key: string, value: T): void {
      store.set(key, { value, expireAt: Date.now() + ttl })
    },
  }
}
