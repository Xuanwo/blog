export function paginate<T>(items: T[], pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  return { totalPages }
}

export function slicePage<T>(items: T[], pageSize: number, page: number) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

