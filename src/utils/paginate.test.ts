import { describe, expect, it } from 'vitest'
import { formatDate } from './format'
import { paginate } from './paginate'

describe('paginate', () => {
  const items = Array.from({ length: 18 }, (_, index) => index + 1)

  it('returns a stable page window', () => {
    expect(paginate(items, 2, 8)).toMatchObject({
      items: [9, 10, 11, 12, 13, 14, 15, 16],
      page: 2,
      pageCount: 3,
      total: 18,
    })
    expect(paginate(items, 99, 8).page).toBe(3)
    expect(paginate(items, 0, 8).page).toBe(1)
  })
})

describe('formatDate', () => {
  it('formats calendar dates in UTC', () => {
    expect(formatDate('2026-10-20')).toBe('Oct 20, 2026')
  })
})
