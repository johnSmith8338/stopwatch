import { LapSession } from "../core/repositories/stopwatch.repository";
import { AlarmHistoryItem } from "./alarm-history.interface";
import { Alarm, AlarmGroup } from "./alarm.interface";
import { AppSettings } from "./settings.model";
import { TimerHistoryItem } from "./timer-history.model";

export interface AppBackup {
    version: 1;
    app: 'alarm-clock';
    exportedAt: number;
    alarms: Alarm[];
    groups: AlarmGroup[];
    history: AlarmHistoryItem[];
    timerHistory?: TimerHistoryItem[];
    stopWatchHistory?: LapSession[];
    settings: AppSettings;
}