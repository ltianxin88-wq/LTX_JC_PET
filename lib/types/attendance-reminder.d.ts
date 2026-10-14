export interface AttendanceReminderEventV1 {
    version: 1;
    id: string;
    occurredAt: string;
    attendanceDate: string;
    type: 'missing-clock-in' | 'missing-clock-out' | 'makeup-window' | 'night-safety' | 'sync-failed';
    priority: 'info' | 'warning' | 'urgent';
    title: string;
    body: string;
    action: 'open-attendance' | 'none';
    expiresAt: string;
}
export declare function parseAttendanceReminderEvent(input: unknown, now?: number): AttendanceReminderEventV1 | undefined;
