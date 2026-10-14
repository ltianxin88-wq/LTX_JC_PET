import { describe, expect, it } from 'vitest'
import { parseAttendanceReminderEvent } from './attendance-reminder.ts'

const now = Date.parse('2026-10-14T10:00:00+08:00')
const valid = {
  version: 1,
  id: 'attendance-1234567890ab',
  occurredAt: '2026-10-14T01:59:00.000Z',
  attendanceDate: '2026-10-14',
  type: 'missing-clock-in',
  priority: 'urgent',
  title: '打卡提醒',
  body: '今日尚未查询到上班打卡，请确认是否已完成打卡。',
  action: 'open-attendance',
  expiresAt: '2026-10-14T02:30:00.000Z',
}

describe('attendance reminder contract', () => {
  it('accepts the version 1 privacy-safe event', () => {
    expect(parseAttendanceReminderEvent(valid, now)).toEqual(valid)
  })

  it('rejects unknown versions, expired events and secret-shaped extras without exposing them', () => {
    expect(parseAttendanceReminderEvent({ ...valid, version: 2 }, now)).toBeUndefined()
    expect(parseAttendanceReminderEvent({ ...valid, expiresAt: '2026-10-14T01:00:00.000Z' }, now)).toBeUndefined()
    const parsed = parseAttendanceReminderEvent({ ...valid, password: 'forbidden', account: 'employee.001' }, now)
    expect(parsed).toBeDefined()
    expect(parsed).not.toHaveProperty('password')
    expect(parsed).not.toHaveProperty('account')
  })
})
