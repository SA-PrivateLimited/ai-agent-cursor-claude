export function withSearchParams(
  current: URLSearchParams,
  patch: Record<string, string | null>,
  resetPage = false,
): URLSearchParams {
  const next = new URLSearchParams(current)
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
  }
  if (resetPage) next.delete('page')
  return next
}
