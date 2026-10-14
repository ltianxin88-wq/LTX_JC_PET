/** Versioned, privacy-safe attendance reminder accepted from the attendance plugin. */
export interface AttendanceReminderEventV1 {
  version: 1
  id: string
  occurredAt: string
  attendanceDate: string
  type: 'missing-clock-in' | 'missing-clock-out' | 'makeup-window' | 'night-safety' | 'sync-failed'
  priority: 'info' | 'warning' | 'urgent'
  title: string
  body: string
  action: 'open-attendance' | 'none'
  expiresAt: string
}

const TYPES = new Set(['missing-clock-in', 'missing-clock-out', 'makeup-window', 'night-safety', 'sync-failed'])

export function parseAttendanceReminderEvent(input: unknown, now = Date.now()): AttendanceReminderEventV1 | undefined {
  if (input === null || typeof input !== 'object') return undefined
  const value = input as Record<string, unknown>
  if (value.version !== 1 || typeof value.id !== 'string' || !/^[A-Za-z0-9-]{12,100}$/u.test(value.id)) return undefined
  if (typeof value.type !== 'string' || !TYPES.has(value.type)) return undefined
  if (!['info', 'warning', 'urgent'].includes(String(value.priority))) return undefined
  if (!['open-attendance', 'none'].includes(String(value.action))) return undefined
  if (typeof value.attendanceDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value.attendanceDate)) return undefined
  if (typeof value.title !== 'string' || value.title.trim() === '' || value.title.length > 80) return undefined
  if (typeof value.body !== 'string' || value.body.trim() === '' || value.body.length > 160) return undefined
  if (typeof value.occurredAt !== 'string' || typeof value.expiresAt !== 'string') return undefined
  const occurredAt = Date.parse(value.occurredAt)
  const expiresAt = Date.parse(value.expiresAt)
  if (!Number.isFinite(occurredAt) || !Number.isFinite(expiresAt) || expiresAt <= now || expiresAt <= occurredAt) return undefined
  return {
    version: 1,
    id: value.id,
    occurredAt: value.occurredAt,
    attendanceDate: value.attendanceDate,
    type: value.type as AttendanceReminderEventV1['type'],
    priority: value.priority as AttendanceReminderEventV1['priority'],
    title: value.title.trim(),
    body: value.body.trim(),
    action: value.action as AttendanceReminderEventV1['action'],
    expiresAt: value.expiresAt,
  }
}
