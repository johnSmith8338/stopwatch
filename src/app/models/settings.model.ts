export type HistoryRetentionDays = -1 | 7 | 30 | 90;

export interface AppSettings {
    historyRetentionDays: HistoryRetentionDays;
}