export type AlarmHistoryStatus = 'ring' | 'stop' | 'snooze' | 'missed';

export interface AlarmHistoryItem {
    id: string;
    alarmId: string;
    title: string;
    fireAt: number;
    status: AlarmHistoryStatus;
    snoozeMinutes?: number;
}