// 本地静态资源 URL 加 /api 前缀（后端 context-path=/api，相对路径需拼接才能走 Vite 代理）
export function prefixLocalUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url
  if (url.startsWith('/audio/') || url.startsWith('/cover/')) {
    return '/api' + url
  }
  return url
}

// 批量处理对象中的 URL 字段
export function prefixLocalUrls<T>(obj: T, fields: (keyof T)[]): T {
  for (const field of fields) {
    const val = obj[field]
    if (typeof val === 'string') {
      (obj as Record<string, unknown>)[field as string] = prefixLocalUrl(val)
    }
  }
  return obj
}
