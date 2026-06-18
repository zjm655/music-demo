// LRC 歌词解析工具：将 LRC 格式歌词文本解析为带时间戳的歌词行数组

// 单行歌词：time 为该行歌词的起始时间（秒），text 为歌词文本
export interface LrcLine {
  time: number
  text: string
}

/**
 * 解析 LRC 歌词文本
 * @param text LRC 歌词原文
 * @param options.interval 纯文本歌词（无时间戳）时每行递增的时间间隔（秒），默认 5
 * @returns 按时间升序排列的歌词行数组；空文本返回空数组
 */
export function parseLrc(text: string, options?: { interval?: number }): LrcLine[] {
  // 空文本直接返回空数组
  if (!text) return []

  const interval = options?.interval ?? 5
  // 匹配 [mm:ss.xx] 或 [mm:ss] 格式的时间戳
  // 分组1：分钟；分组2：秒；分组3：可选的毫秒部分（1~3 位）
  const tagRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g

  const rawLines = text.split(/\r?\n/)
  const result: LrcLine[] = []
  let hasTimestamp = false

  for (const rawLine of rawLines) {
    // 收集当前行内所有时间戳
    const matches: RegExpExecArray[] = []
    tagRegex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = tagRegex.exec(rawLine)) !== null) {
      matches.push(m)
      hasTimestamp = true
    }

    // 当前行无时间戳则跳过
    if (matches.length === 0) continue

    // 去除所有时间戳后的纯歌词文本
    const lyricText = rawLine.replace(tagRegex, '').trim()

    // 一行可能对应多个时间戳，每个时间戳生成一条歌词行
    for (const match of matches) {
      // 正则分组 1、2 为必填，匹配成功时一定存在
      const minutes = parseInt(match[1] ?? '0', 10)
      const seconds = parseInt(match[2] ?? '0', 10)
      const msPart = match[3] ?? ''
      // 毫秒部分补零至 3 位后除以 1000 转为秒，兼容 1/2/3 位写法
      const msPadded = msPart.padEnd(3, '0')
      const ms = parseInt(msPadded, 10) / 1000
      const time = minutes * 60 + seconds + ms
      result.push({ time, text: lyricText })
    }
  }

  // 整段文本不含任何时间戳：按纯文本歌词处理
  if (!hasTimestamp) {
    const plainLines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0)
    return plainLines.map((lineText, i) => ({
      time: i * interval,
      text: lineText,
    }))
  }

  // 按时间升序排序
  result.sort((a, b) => a.time - b.time)
  return result
}
