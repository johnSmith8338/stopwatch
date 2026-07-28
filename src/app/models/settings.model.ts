export type AppTheme = 'light' | 'dark';

export type HistoryRetentionDays = -1 | 1 | 7 | 30 | 90;

export interface AppSettings {
    theme: AppTheme;
    historyRetentionDays: HistoryRetentionDays;
}