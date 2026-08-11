import { formatOrderDate } from './orderDate'

describe('order history dates', () => {
  const original = Date.prototype.toLocaleDateString

  afterEach(() => {
    Date.prototype.toLocaleDateString = original
  })

  it('formats a persisted date without crossing a timezone boundary', () => {
    Date.prototype.toLocaleDateString = function () {
      return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`
    }

    expect(formatOrderDate('2026-08-11')).toBe('2026-8-11')
  })

  it('handles absent or invalid dates', () => {
    expect(formatOrderDate()).toBe('Date unavailable')
    expect(formatOrderDate('not-a-date')).toBe('Date unavailable')
  })
})
