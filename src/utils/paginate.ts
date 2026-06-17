export function paginate<T>(list: T[], pageSize: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < list.length; i += pageSize) {
    result.push(list.slice(i, i + pageSize))
  }
  return result
}
