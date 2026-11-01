export interface Page<T> {
  items: T[]
  page: number
  pageCount: number
  total: number
  pageSize: number
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const size = pageSize > 0 ? Math.floor(pageSize) : 1
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / size))
  const safePage = Number.isFinite(page) ? Math.min(Math.max(Math.trunc(page), 1), pageCount) : 1
  const start = (safePage - 1) * size

  return {
    items: items.slice(start, start + size),
    page: safePage,
    pageCount,
    total,
    pageSize: size,
  }
}
