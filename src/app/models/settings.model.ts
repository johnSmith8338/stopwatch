export type AppTheme = 'light' | 'dark';

export type HistoryRetentionDays = -1 | 1 | 7 | 30 | 90;

export type AlarmSortMode = 'manual' | 'time';

export interface AppSettings {
    theme: AppTheme;
    historyRetentionDays: HistoryRetentionDays;
    keepScreenAwake: boolean;
    alarmSortMode: AlarmSortMode;
}