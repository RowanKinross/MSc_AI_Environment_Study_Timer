import test from 'node:test'
import assert from 'node:assert/strict'

import { getStartOfWeek, shiftWeek } from './week.js'

test('getStartOfWeek returns Monday for a midweek date', () => {
  const date = new Date('2026-09-24T12:00:00Z')
  const start = getStartOfWeek(date)

  assert.equal(start.getFullYear(), 2026)
  assert.equal(start.getMonth(), 8)
  assert.equal(start.getDate(), 21)
})

test('shiftWeek moves by a full seven days', () => {
  const base = new Date('2026-09-21T12:00:00Z')
  const nextWeek = shiftWeek(base, 1)
  const previousWeek = shiftWeek(base, -1)

  assert.equal(nextWeek.getDate(), 28)
  assert.equal(previousWeek.getDate(), 14)
})
