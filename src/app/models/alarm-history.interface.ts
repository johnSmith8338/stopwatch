import { TimerSound } from "../services/sound-svc";
import { AlarmRepeat } from "./alarm.interface";

export type AlarmHistoryStatus = 'ring' | 'stop' | 'snooze' | 'missed';

export interface AlarmHistorySnapshot {
    title: string;
    hour: number;
    minute: number;
    sound: TimerSound;
    repeat: AlarmRepeat[];
}

export interface AlarmHistoryItem {
    id: string;
    sessionId: string;
    alarmId: string;
    fireAt: number;
    status: AlarmHistoryStatus;
    snoozeMinutes?: number;
    snapshot: AlarmHistorySnapshot;
}

export interface AlarmHistorySession {
    sessionId: string;
    title: string;
    snapshot: AlarmHistorySnapshot;
    startedAt: number;
    events: AlarmHistoryItem[];
}

export interface AlarmHistoryGroup {
    title: string;
    sessions: AlarmHistorySession[];
}
