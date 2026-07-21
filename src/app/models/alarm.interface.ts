import { TimerColor } from "../constants/colors";
import { TimerSound } from "../services/sound-svc";

export interface AlarmGroup {
    id: string;
    title: string;
    color: TimerColor;
    order: number;
    expanded: boolean;
}

export interface AlarmGroupView {
    id: string | null;
    title: string;
    expanded: boolean;
    system: boolean;
    alarms: Alarm[];
}

export interface Alarm {
    id: string;
    groupId: string | null;
    title: string;
    hour: number;
    minute: number;
    repeat: AlarmRepeat[];
    sound: TimerSound;
    snoozeMinutes: number;
    createdAt: number;
    updatedAt: number;
    order: number;
    enabled: boolean;
}

export type AlarmRepeat = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';